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

const LostItemsScreen = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateFound: "",
    image: null,
  });
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    fetchLostItems();
  }, [currentPage, filters]); // Fetch when page or filters change

  // ... (API calls and handlers will go here)
  const fetchLostItems = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://tallal.info:5500/api/lost-items?page=${currentPage}&per_page=10`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.dateFrom) url += `&dateFrom=${filters.dateFrom}`;
      if (filters.dateTo) url += `&dateTo=${filters.dateTo}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch lost items");
      const data = await response.json();

      setLostItems(data.items);
      setTotalPages(Math.ceil(data.total / 10)); // Assuming 10 items per page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataWithImage = new FormData();
      for (const key in formData) {
        formDataWithImage.append(key, formData[key]);
      }

      const response = await fetch("http://tallal.info:5500/api/lost-items", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataWithImage,
      });
      if (!response.ok) throw new Error("Failed to create item");
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        dateFound: "",
        image: null,
      });
      fetchLostItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      // Store the item ID locally to ensure it doesn't get lost
      // if selectedItem state changes during the async operation
      // Check for both _id and id properties since the API might use either
      if (!selectedItem) {
        throw new Error("No item selected for update");
      }

      // Get the ID from either _id or id property
      const itemId = selectedItem._id || selectedItem.id;

      if (!itemId) {
        throw new Error("Item ID is missing");
      }

      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("dateFound", formData.dateFound);

      // Add image if selected
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `http://tallal.info:5500/api/lost-items/${itemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type when using FormData
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item");
      }

      // Close modal and reset form only after successful update
      setIsCreateModalOpen(false);
      setSelectedItem(null);
      setFormData({
        title: "",
        description: "",
        dateFound: "",
        image: null,
      });
      fetchLostItems();
    } catch (err) {
      setError(err.message);
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (!itemId) {
        throw new Error("No item ID provided for deletion");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/lost-items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to delete item");
      fetchLostItems();
    } catch (err) {
      setError(err.message);
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white">
      {/* Title and Add New Item button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lost Items</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Filters section */}
      <div className="mb-4 flex space-x-4">
        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status:
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All</option>
            <option value="unclaimed">Unclaimed</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>
        {/* Date range filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date:
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
            className="px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date:
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchLostItems}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Lost items table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          {/* Table header */}
          <thead>
            <tr>
              <th className="px-6 py-3 text-left ...">Title</th>
              <th className="px-6 py-3 text-left ...">Ima</th>
              <th className="px-6 py-3 text-left ...">Description</th>
              <th className="px-6 py-3 text-left ...">Date Found</th>
              <th className="px-6 py-3 text-left ...">Status</th>
              <th className="px-6 py-3 text-right ...">Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {lostItems.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={`http://tallal.info:5500` + item.imageUrl} // Construct image URL
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded" // Adjust size and styling as needed
                    onError={(e) => (e.target.src = "placeholder_image.jpg")} // Placeholder if image fails to load
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.dateFound}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {/* Edit and Delete buttons */}
                  <button
                    onClick={() => {
                      // Create a copy of the item to ensure we have all properties
                      const itemCopy = { ...item };

                      // Make sure we have a consistent ID property
                      // If the API returns 'id' instead of '_id', add '_id' for compatibility
                      if (itemCopy.id && !itemCopy._id) {
                        itemCopy._id = itemCopy.id;
                      }
                      // If the API returns '_id' instead of 'id', add 'id' for compatibility
                      else if (itemCopy._id && !itemCopy.id) {
                        itemCopy.id = itemCopy._id;
                      }

                      setSelectedItem(itemCopy);
                      setFormData({
                        title: item.title,
                        description: item.description,
                        dateFound: item.dateFound,
                        image: null,
                      });
                      setIsCreateModalOpen(true);
                    }}
                    className="..."
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      // Use either _id or id property, whichever is available
                      const itemId = item._id || item.id;
                      handleDeleteItem(itemId);
                    }}
                    className="..."
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="..."
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            className="..."
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Create/Update Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedItem(null);
          setFormData({
            title: "",
            description: "",
            dateFound: "",
            image: null,
          });
        }}
        title={selectedItem ? "Update Lost Item" : "Create Lost Item"}
      >
        <form
          onSubmit={(e) => {
            if (selectedItem) {
              handleUpdateItem(e);
            } else {
              handleCreateItem(e);
            }
          }}
        >
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
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dateFound"
              className="block text-gray-700 font-medium mb-2"
            >
              Date Found:
            </label>
            <input
              type="date"
              id="dateFound"
              value={formData.dateFound}
              onChange={(e) =>
                setFormData({ ...formData, dateFound: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {formData.image && (
              <p className="mt-2 text-sm text-gray-500">
                {formData.image.name}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setSelectedItem(null);
                setFormData({
                  title: "",
                  description: "",
                  dateFound: "",
                  image: null,
                });
              }}
              className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedItem ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LostItemsScreen;
