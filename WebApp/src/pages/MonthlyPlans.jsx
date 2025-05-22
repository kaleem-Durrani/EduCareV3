import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  BookOpen,
  Users,
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

const MonthlyPlansScreen = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    class_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    description: "",
    image: null,
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async (classId, month, year) => {
    if (!classId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = `http://tallal.info:5500/api/plans/monthly/${classId}?month=${month}&year=${year}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setPlans([]);
          return;
        }
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans([data]);
    } catch (err) {
      setError(err.message);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchPlans(selectedClass.id, formData.month, formData.year);
    }
  }, [selectedClass, formData.month, formData.year]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("class_id", selectedClass.id);
      formDataToSend.append("month", formData.month);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("description", formData.description);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        "http://tallal.info:5500/api/plans/monthly",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type when using FormData
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to create plan");
      setIsCreateModalOpen(false);
      await fetchPlans(selectedClass.id, formData.month, formData.year);
      setFormData({
        class_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        description: "",
        image: null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("class_id", formData.class_id);
      formDataToSend.append("month", formData.month);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("description", formData.description);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `http://tallal.info:5500/api/plans/monthly/${formData.planId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type when using FormData
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to update plan");
      setIsEditModalOpen(false);
      fetchPlans(formData.class_id, formData.month, formData.year);
      setFormData({
        class_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        description: "",
        image: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Activity-related functions removed as they are no longer needed

  const handleDeletePlan = async (planId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/plans/monthly/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete plan");
      fetchPlans(selectedClass.id, formData.month, formData.year);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan) => {
    setFormData({
      planId: plan.planId,
      class_id: plan.class_id,
      month: plan.month,
      year: plan.year,
      description: plan.description || "",
      image: null,
    });
    setIsEditModalOpen(true);
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setPlans([]); // Clear existing plans when class changes
  };

  // Function to convert month number to text
  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  };

  if (loading && !classes.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
        <button
          onClick={() => {
            setError(null);
            fetchClasses();
          }}
          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monthly Plans</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedClass}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Plan
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="class" className="block text-gray-700 font-medium mb-2">
          Select Class:
        </label>
        <select
          id="class"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedClass ? selectedClass.id : ""}
          onChange={(e) => {
            const selected = classes.find((c) => c.id === e.target.value);
            setSelectedClass(selected || null);
          }}
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} - {cls.grade} {cls.section}
            </option>
          ))}
        </select>
      </div>

      {loading && selectedClass && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2">Loading plans...</span>
        </div>
      )}

      {!loading && selectedClass && plans.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No plans found for this class.
        </div>
      )}

      {/* {!loading && selectedClass && plans.length > 0 && (
                <div className="mt-6">
                    {plans.map((plan, index) => (
                        <div key={index} className="border rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Plan for {plan.month}/{plan.year}
                            </h3>
                            {plan.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="border-t pt-2 mt-2">
                                    <p className="font-medium">{activity.title}</p>
                                    <p className="text-gray-600">{activity.description}</p>
                                    <p className="text-sm text-gray-500">Date: {activity.date}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )} */}

      {selectedClass && ( // Conditionally render plans section
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Monthly Plan"
        >
          <form onSubmit={handleCreatePlan}>
            <div className="mb-4">
              <label
                htmlFor="month"
                className="block text-gray-700 font-medium mb-2"
              >
                Month:
              </label>
              <select
                id="month"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="year"
                className="block text-gray-700 font-medium mb-2"
              >
                Year:
              </label>
              <input
                type="number"
                id="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="2000"
                max="2100"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-gray-700 font-medium mb-2"
              >
                Image:
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description:
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                required
              />
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
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Monthly Plan"
      >
        <form onSubmit={handleUpdatePlan}>
          <div className="mb-4">
            <label
              htmlFor="class_id"
              className="block text-gray-700 font-medium mb-2"
            >
              Class:
            </label>
            <select
              id="class_id"
              value={formData.class_id}
              onChange={(e) =>
                setFormData({ ...formData, class_id: e.target.value })
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
          <div className="mb-4">
            <label
              htmlFor="month"
              className="block text-gray-700 font-medium mb-2"
            >
              Month:
            </label>
            <select
              id="month"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-gray-700 font-medium mb-2"
            >
              Year:
            </label>
            <input
              type="number"
              id="year"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="2000"
              max="2100"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-2"
            >
              Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {formData.imageUrl && (
              <p className="text-sm text-gray-500 mt-1">
                Current image will be kept if no new image is selected
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              required
            />
          </div>
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
      </Modal>

      {/* Display Plans */}

      {/* Display Plans */}
      {selectedClass && plans.length > 0 && (
        <div className="mt-6">
          {plans.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                {" "}
                {/* Title and buttons container */}
                <h3 className="text-lg font-semibold">
                  Plan for {getMonthName(plan.month)} {plan.year}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.planId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>{" "}
              {/* End of Title and buttons container */}
              {/* Render description */}
              <div className="mt-2">
                {plan.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={plan.imageUrl}
                      alt={`Plan for ${getMonthName(plan.month)}`}
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-gray-700">{plan.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* {selectedClass && plans.length === 0 && (
                <div className="text-center text-gray-500 mt-6">
                    No plans found for this class.
                </div>
            )} */}
    </div>
  );
};

export default MonthlyPlansScreen;
