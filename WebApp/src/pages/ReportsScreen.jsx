import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  CalendarDays,
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

const ReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    weekStart: "",
    weekEnd: "",
    dailyReports: [
      { day: "Monday", pee: "", poop: "", food: "", mood: "" },
      { day: "Tuesday", pee: "", poop: "", food: "", mood: "" },
      { day: "Wednesday", pee: "", poop: "", food: "", mood: "" },
      { day: "Thursday", pee: "", poop: "", food: "", mood: "" },
      { day: "Friday", pee: "", poop: "", food: "", mood: "" },
      { day: "Saturday", pee: "", poop: "", food: "", mood: "" },
      { day: "Sunday", pee: "", poop: "", food: "", mood: "" },
    ],
  });

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://tallal.info:5500/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.students);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchReports = async (studentId, startDate, endDate) => {
    setLoading(true);
    try {
      if (!studentId) return; // Don't fetch if no student selected
      const token = localStorage.getItem("token");
      let url = `http://tallal.info:5500/api/reports/weekly/${studentId}`;
      if (startDate && endDate) {
        url += `?start_date=<span class="math-inline">\{startDate\}&end\_date\=</span>{endDate}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "You are not authorized to view this student's reports."
          );
        }
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data.reports);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  useEffect(() => {
    if (selectedStudent?._id) {
      fetchReports(selectedStudent._id);
    }
  }, [selectedStudent]);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://tallal.info:5500/api/reports/weekly",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to create report");
      setIsCreateModalOpen(false);
      fetchReports(formData.student_id);
      setFormData({
        student_id: "",
        weekStart: "",
        weekEnd: "",
        dailyReports: [
          { day: "Monday", pee: "", poop: "", food: "", mood: "" },
          { day: "Tuesday", pee: "", poop: "", food: "", mood: "" },
          { day: "Wednesday", pee: "", poop: "", food: "", mood: "" },
          { day: "Thursday", pee: "", poop: "", food: "", mood: "" },
          { day: "Friday", pee: "", poop: "", food: "", mood: "" },
          { day: "Saturday", pee: "", poop: "", food: "", mood: "" },
          { day: "Sunday", pee: "", poop: "", food: "", mood: "" },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/reports/weekly/${formData.reportId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update report");
      setIsEditModalOpen(false);
      fetchReports(formData.student_id);
      setFormData({
        student_id: "",
        weekStart: "",
        weekEnd: "",
        dailyReports: [
          { day: "Monday", pee: "", poop: "", food: "", mood: "" },
          { day: "Tuesday", pee: "", poop: "", food: "", mood: "" },
          { day: "Wednesday", pee: "", poop: "", food: "", mood: "" },
          { day: "Thursday", pee: "", poop: "", food: "", mood: "" },
          { day: "Friday", pee: "", poop: "", food: "", mood: "" },
          { day: "Saturday", pee: "", poop: "", food: "", mood: "" },
          { day: "Sunday", pee: "", poop: "", food: "", mood: "" },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (day, field, value) => {
    setFormData((prevFormData) => {
      const updatedDailyReports = prevFormData.dailyReports.map((report) => {
        if (report.day === day) {
          return { ...report, [field]: value };
        }
        return report;
      });
      return { ...prevFormData, dailyReports: updatedDailyReports };
    });
  };

  const handleEditReport = (report) => {
    setFormData({
      reportId: report.reportId,
      student_id: report.student_id,
      weekStart: report.weekStart,
      weekEnd: report.weekEnd,
      dailyReports: report.dailyReports,
    });
    setIsEditModalOpen(true);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setReports([]); // Clear existing reports when student changes
  };

  // Loading spinner component
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error: {error}
          <button
            onClick={() => {
              setError(null);
              fetchStudents();
            }}
            className="ml-4 text-sm text-purple-600 hover:text-purple-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Reports</h1>
        {userRole === "teacher" && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Report
          </button>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="student"
          className="block text-gray-700 font-medium mb-2"
        >
          Select Student
        </label>
        <select
          id="student"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedStudent ? selectedStudent.fullName : ""} // Set selected value
          onChange={(e) => {
            const selected = students.find((s) => s._id === e.target.value);
            handleStudentSelect(selected);
          }}
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.fullName}
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <div className="mb-4">
          <label
            htmlFor="student"
            className="block text-gray-700 font-medium mb-2"
          >
            Student: {selectedStudent.fullName}
          </label>
        </div>
      )}

      <div className="mb-4 flex space-x-4">
        <div>
          <label
            htmlFor="start_date"
            className="block text-gray-700 font-medium mb-2"
          >
            Start Date:
          </label>
          <input
            type="date"
            id="start_date"
            className="border border-gray-300 rounded px-3 py-2"
            onChange={(e) =>
              fetchReports(
                selectedStudent._id,
                e.target.value,
                document.getElementById("end_date").value
              )
            }
          />
        </div>
        <div>
          <label
            htmlFor="end_date"
            className="block text-gray-700 font-medium mb-2"
          >
            End Date:
          </label>
          <input
            type="date"
            id="end_date"
            className="border border-gray-300 rounded px-3 py-2"
            onChange={(e) =>
              fetchReports(
                selectedStudent._id,
                document.getElementById("start_date").value,
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Week Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Week End
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.reportId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {report.weekStart}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {report.weekEnd}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    {userRole === "teacher" && (
                      <button
                        onClick={() => handleEditReport(report)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Weekly Report"
      >
        <form onSubmit={handleCreateReport}>
          <div className="mb-4">
            <label
              htmlFor="student_id"
              className="block text-gray-700 font-medium mb-2"
            >
              Student
            </label>
            <select
              id="student_id"
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="weekStart"
              className="block text-gray-700 font-medium mb-2"
            >
              Week Start
            </label>
            <input
              type="date"
              id="weekStart"
              value={formData.weekStart}
              onChange={(e) =>
                setFormData({ ...formData, weekStart: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="weekEnd"
              className="block text-gray-700 font-medium mb-2"
            >
              Week End
            </label>
            <input
              type="date"
              id="weekEnd"
              value={formData.weekEnd}
              onChange={(e) =>
                setFormData({ ...formData, weekEnd: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          {formData.dailyReports.map((report) => (
            <div key={report.day} className="mb-4">
              <h3 className="text-lg font-medium mb-2">{report.day}</h3>
              <div className="grid grid-cols-4 gap-4">
                {["pee", "poop", "food", "mood"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={`<span class="math-inline">\{report\.day\}\-</span>{field}`}
                      className="block text-gray-700 text-sm font-medium"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={`<span class="math-inline">\{report\.day\}\-</span>{field}`}
                      value={report[field]}
                      onChange={(e) =>
                        handleInputChange(report.day, field, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Weekly Report"
      >
        {selectedStudent && (
          <form onSubmit={handleUpdateReport}>
            <div className="mb-4">
              <label
                htmlFor="student_id"
                className="block text-gray-700 font-medium mb-2"
              >
                Student
              </label>
              <select
                id="student_id"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="weekStart"
                className="block text-gray-700 font-medium mb-2"
              >
                Week Start
              </label>
              <input
                type="date"
                id="weekStart"
                value={formData.weekStart}
                onChange={(e) =>
                  setFormData({ ...formData, weekStart: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="weekEnd"
                className="block text-gray-700 font-medium mb-2"
              >
                Week End
              </label>
              <input
                type="date"
                id="weekEnd"
                value={formData.weekEnd}
                onChange={(e) =>
                  setFormData({ ...formData, weekEnd: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            {formData.dailyReports.map((report) => (
              <div key={report.day} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{report.day}</h3>
                <div className="grid grid-cols-4 gap-4">
                  {["pee", "poop", "food", "mood"].map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={`${report.day}-${field}`}
                        className="block text-gray-700 text-sm font-medium"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        id={`${report.day}-${field}`}
                        value={report[field]}
                        onChange={(e) =>
                          handleInputChange(report.day, field, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Update
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ReportsScreen;
