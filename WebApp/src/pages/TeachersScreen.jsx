import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  UserPlus,
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import PasswordInput from "../components/PasswordInput";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const TeachersScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [enrollmentData, setEnrollmentData] = useState({
    class_id: "",
    academic_year: new Date().getFullYear().toString(),
  });

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/teachers/all?page=${currentPage}&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data.teachers);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://tallal.info:5500/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data.classes);
      console.log(data.classes);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, [currentPage]);

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Password validation (at least 6 characters)
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // Validate passwords match
      if (formData.password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setError(null); // Clear any previous errors
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://tallal.info:5500/api/teacher/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Check for specific error responses
      if (response.status === 409) {
        setError("Email already registered");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create teacher");
      }

      setIsCreateModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setConfirmPassword("");
      fetchTeachers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnrollTeacher = async (e) => {
    e.preventDefault();
    try {
      // Validate enrollment data
      if (!enrollmentData.class_id || !selectedTeacher) {
        setError("Please select a class");
        return;
      }

      setError(null); // Clear any previous errors
      const token = localStorage.getItem("token");

      // Show loading state
      setLoading(true);

      const response = await fetch(
        `http://tallal.info:5500/api/classes/${enrollmentData.class_id}/teachers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacher_ids: [selectedTeacher._id] }),
        }
      );

      // Check for specific error responses
      if (response.status === 404) {
        setError("Class not found");
        setLoading(false);
        return;
      }

      if (response.status === 409) {
        setError("Teacher is already enrolled in this class");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enroll teacher");
      }

      setIsEnrollModalOpen(false);
      setSelectedTeacher(null);
      setEnrollmentData({
        class_id: "",
        academic_year: new Date().getFullYear().toString(),
      });
      await fetchTeachers(); // Use await to ensure data is refreshed
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawTeacher = async (teacherId) => {
    if (!window.confirm("Are you sure you want to withdraw this teacher?"))
      return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      // Since we don't have a specific class to withdraw from, we'll need to
      // use a different endpoint that removes the teacher from all classes
      const response = await fetch(
        `http://tallal.info:5500/api/teachers/${teacherId}/withdraw`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: "Withdrawal requested by admin" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to withdraw teacher");
      }

      await fetchTeachers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Teacher
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {teacher.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setIsEnrollModalOpen(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 mr-2"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleWithdrawTeacher(teacher._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 mx-1 bg-gray-100 text-gray-700 rounded-md">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          setConfirmPassword("");
          setError(null);
        }}
        title="Add New Teacher"
      >
        <form onSubmit={handleCreateTeacher}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password:
            </label>
            <PasswordInput
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password:
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
            {formData.password !== confirmPassword && confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll Teacher in Class"
      >
        {selectedTeacher && (
          <form onSubmit={handleEnrollTeacher}>
            <div className="mb-4">
              <label
                htmlFor="class_id"
                className="block text-gray-700 font-medium mb-2"
              >
                Class:
              </label>
              <select
                id="class_id"
                value={enrollmentData.class_id}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    class_id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.grade} {cls.section}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEnrollModalOpen(false);
                  setSelectedTeacher(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Enroll
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TeachersScreen;
