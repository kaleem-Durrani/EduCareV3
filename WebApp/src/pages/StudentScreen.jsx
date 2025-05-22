import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  UserPlus,
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
} from "lucide-react";

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

const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    class: "",
    rollNum: "", // Will be auto-generated on the backend
    birthdate: "",
    schedule: {
      time: "08:00 - 12:30",
      days: "Monday to Friday",
    },
    allergies: [],
    likes: [], // Will be handled as an array, not comma-separated
    additionalInfo: "",
    authorizedPhotos: false,
    image: null,
  });

  const fileInputRef = useRef(null);

  const [enrollmentData, setEnrollmentData] = useState({
    class_id: "",
    academic_year: new Date().getFullYear().toString(),
  });

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/students?page=${currentPage}&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.students);
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
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [currentPage]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("firstName", formData.firstName);
      formDataObj.append("lastName", formData.lastName);
      formDataObj.append(
        "fullName",
        formData.fullName || `${formData.firstName} ${formData.lastName}`
      );
      formDataObj.append("class", formData.class);
      // Don't append rollNum as it will be auto-generated
      formDataObj.append("birthdate", formData.birthdate);
      formDataObj.append("schedule[time]", formData.schedule.time);
      formDataObj.append("schedule[days]", formData.schedule.days);

      // Handle allergies as array
      formData.allergies.forEach((allergy, index) => {
        formDataObj.append(`allergies[${index}]`, allergy);
      });

      // Handle likes as array
      formData.likes.forEach((like, index) => {
        formDataObj.append(`likes[${index}]`, like);
      });

      formDataObj.append("additionalInfo", formData.additionalInfo);
      formDataObj.append("authorizedPhotos", formData.authorizedPhotos);

      // Append image if exists
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }

      const response = await fetch("http://tallal.info:5500/api/student", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type when sending FormData
        },
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Failed to create student");
      setIsCreateModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        fullName: "",
        class: "",
        rollNum: "", // Will be auto-generated
        birthdate: "",
        schedule: {
          time: "08:00 - 12:30",
          days: "Monday to Friday",
        },
        allergies: [],
        likes: [],
        additionalInfo: "",
        authorizedPhotos: false,
        image: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("firstName", formData.firstName);
      formDataObj.append("lastName", formData.lastName);
      formDataObj.append(
        "fullName",
        formData.fullName || `${formData.firstName} ${formData.lastName}`
      );
      formDataObj.append("class", formData.class);
      formDataObj.append("rollNum", formData.rollNum);
      formDataObj.append("birthdate", formData.birthdate);
      formDataObj.append("schedule[time]", formData.schedule.time);
      formDataObj.append("schedule[days]", formData.schedule.days);

      // Handle allergies as array
      formData.allergies.forEach((allergy, index) => {
        formDataObj.append(`allergies[${index}]`, allergy);
      });

      // Handle likes as array
      formData.likes.forEach((like, index) => {
        formDataObj.append(`likes[${index}]`, like);
      });

      formDataObj.append("additionalInfo", formData.additionalInfo);
      formDataObj.append("authorizedPhotos", formData.authorizedPhotos);

      // Append image if exists
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }

      const response = await fetch(
        `http://tallal.info:5500/api/student/${selectedStudent.rollNum}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type when sending FormData
          },
          body: formDataObj,
        }
      );

      if (!response.ok) throw new Error("Failed to update student");
      setSelectedStudent(null);
      setFormData({
        firstName: "",
        lastName: "",
        fullName: "",
        class: "",
        rollNum: "",
        birthdate: "",
        schedule: {
          time: "08:00 - 12:30",
          days: "Monday to Friday",
        },
        allergies: [],
        likes: [],
        additionalInfo: "",
        authorizedPhotos: false,
        image: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/students/${selectedStudent._id}/enroll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enrollmentData),
        }
      );

      if (!response.ok) throw new Error("Failed to enroll student");
      setIsEnrollModalOpen(false);
      setSelectedStudent(null);
      setEnrollmentData({
        class_id: "",
        academic_year: new Date().getFullYear().toString(),
      });
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWithdrawStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to withdraw this student?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/students/${studentId}/withdraw`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: "Withdrawal requested by admin" }),
        }
      );

      if (!response.ok) throw new Error("Failed to withdraw student");
      fetchStudents();
    } catch (err) {
      setError(err.message);
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
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Student
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
                  Enrollment #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {student.rollNum}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.current_academic_year || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          console.log(student);
                          setSelectedStudent(student);
                          setIsEnrollModalOpen(true);
                        }}
                        className="p-1 text-green-600 hover:text-green-900 rounded-full hover:bg-green-50"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setFormData({
                            firstName: student.firstName || "",
                            lastName: student.lastName || "",
                            fullName: student.fullName || "",
                            class: student.class || "",
                            rollNum: student.rollNum || "",
                            birthdate: student.birthdate || "",
                            schedule: student.schedule || {
                              time: "08:00 - 12:30",
                              days: "Monday to Friday",
                            },
                            allergies: student.allergies || [],
                            likes: student.likes || [],
                            additionalInfo: student.additionalInfo || "",
                            authorizedPhotos: student.authorizedPhotos || false,
                            image: null,
                          });
                        }}
                        className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-blue-50"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleWithdrawStudent(student.id)}
                        className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || selectedStudent !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedStudent(null);
          setFormData({
            firstName: "",
            lastName: "",
            fullName: "",
            class: "",
            rollNum: "",
            birthdate: "",
            schedule: {
              time: "08:00 - 12:30",
              days: "Monday to Friday",
            },
            allergies: [],
            likes: [],
            additionalInfo: "",
            authorizedPhotos: false,
            image: null,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        title={selectedStudent ? "Edit Student" : "Create New Student"}
      >
        <form
          onSubmit={selectedStudent ? handleUpdateStudent : handleCreateStudent}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name:
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name:
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name:
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Will be auto-generated if left empty"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {selectedStudent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment #:
                </label>
                <input
                  type="text"
                  value={formData.rollNum}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class:
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthdate:
              </label>
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) =>
                  setFormData({ ...formData, birthdate: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Time:
              </label>
              <input
                type="text"
                value={formData.schedule.time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, time: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Days:
              </label>
              <input
                type="text"
                value={formData.schedule.days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, days: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies (comma-separated):
              </label>
              <input
                type="text"
                value={formData.allergies.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allergies: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Likes:
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.likes.map((like, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-purple-100 px-3 py-1 rounded-full"
                  >
                    <span>{like}</span>
                    <button
                      type="button"
                      className="ml-2 text-purple-700"
                      onClick={() => {
                        const newLikes = [...formData.likes];
                        newLikes.splice(index, 1);
                        setFormData({ ...formData, likes: newLikes });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="newLike"
                  placeholder="Add a like"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value) {
                        setFormData({
                          ...formData,
                          likes: [...formData.likes, value],
                        });
                        e.target.value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
                  onClick={() => {
                    const input = document.getElementById("newLike");
                    const value = input.value.trim();
                    if (value) {
                      setFormData({
                        ...formData,
                        likes: [...formData.likes, value],
                      });
                      input.value = "";
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information:
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Photo:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({
                        ...formData,
                        image: e.target.files[0],
                      });
                    }
                  }}
                  className="hidden"
                  id="student-image"
                />
                <label
                  htmlFor="student-image"
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {formData.image ? "Change Photo" : "Upload Photo"}
                </label>
                {formData.image && (
                  <span className="text-sm text-gray-600">
                    {formData.image.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.authorizedPhotos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authorizedPhotos: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                id="authorized-photos"
              />
              <label
                className="ml-2 block text-sm text-gray-900"
                htmlFor="authorized-photos"
              >
                Authorized for Photos
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {selectedStudent ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Enroll Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => {
          setIsEnrollModalOpen(false);
          setSelectedStudent(null);
          setEnrollmentData({
            class_id: "",
            academic_year: new Date().getFullYear().toString(),
          });
        }}
        title="Enroll Student"
      >
        <form onSubmit={handleEnrollStudent}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class:
              </label>
              <select
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
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year:
              </label>
              <input
                type="text"
                value={enrollmentData.academic_year}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    academic_year: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEnrollModalOpen(false);
                  setSelectedStudent(null);
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
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsScreen;
