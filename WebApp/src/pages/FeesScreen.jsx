import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  X,
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

const FeesScreen = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    deadline: "",
    student_id: "", // Important: Add student_id to form data
    status: "Unpaid", // Default status
  });
  const [students, setStudents] = useState([]); // For dropdown in modal
  const [studentId, setStudentId] = useState(""); // For filtering fees

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://tallal.info:5500/api/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudents();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://tallal.info:5500/api/fees/${studentId}`; // Use studentId for fetching
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch fees");
      const data = await response.json();
      setFees(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://tallal.info:5500/api/fees", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Important: Set Content-Type
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create fee");
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        amount: "",
        deadline: "",
        student_id: "",
        status: "Unpaid",
      }); // Reset form
      fetchFees(); // Refresh fees list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateFeeStatus = async (feeId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/fees/${feeId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) throw new Error("Failed to update fee status");
      fetchFees();
    } catch (err) {
      setError(err.message);
    }
  };

  // Add function to handle fee deletion
  const handleDeleteFee = async (feeId) => {
    if (!window.confirm("Are you sure you want to delete this fee?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/fees/${feeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete fee");
      fetchFees();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchFees();
    } else {
      setFees([]); // Clear fees if no student is selected
      setLoading(false);
    }
  }, [studentId]);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSelectedFee(null);
    setFormData({
      title: "",
      amount: "",
      deadline: "",
      student_id: "",
      status: "Unpaid",
    });
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fees</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Fee
        </button>
      </div>

      {/* Student selection dropdown */}
      <div className="mb-4">
        <label
          htmlFor="student"
          className="block text-gray-700 font-medium mb-2"
        >
          Select Student:
        </label>
        <select
          id="student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.fullName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left ...">Title</th>
                <th className="px-6 py-3 text-left ...">Amount</th>
                <th className="px-6 py-3 text-left ...">Deadline</th>
                <th className="px-6 py-3 text-left ...">Status</th>
                <th className="px-6 py-3 text-right ...">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{fee.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fee.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {fee.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{fee.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateFeeStatus(
                            fee.id,
                            fee.status === "Paid" ? "Unpaid" : "Paid"
                          )
                        }
                        className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
                      >
                        {fee.status === "Paid"
                          ? "Mark as Unpaid"
                          : "Mark as Paid"}
                      </button>
                      <button
                        onClick={() => handleDeleteFee(fee.id)}
                        className="rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700 flex items-center"
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title={selectedFee ? "Update Fee" : "Create Fee"}
      >
        <form onSubmit={selectedFee ? () => {} : handleCreateFee}>
          {" "}
          {/* Update form submission */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-gray-700 font-medium mb-2"
            >
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="deadline"
              className="block text-gray-700 font-medium mb-2"
            >
              Deadline:
            </label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="student_id"
              className="block text-gray-700 font-medium mb-2"
            >
              Student:
            </label>
            <select
              id="student_id"
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {selectedFee ? "Update Fee" : "Create Fee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeesScreen;
