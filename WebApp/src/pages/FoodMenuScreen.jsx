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

const FoodMenuScreen = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    menuData: [
      { day: "Monday", items: [] },
      { day: "Tuesday", items: [] },
      { day: "Wednesday", items: [] },
      { day: "Thursday", items: [] },
      { day: "Friday", items: [] },
      // Saturday and Sunday removed as per requirements
    ],
  });

  // Add state for handling item editing to fix selection jumping
  const [currentEditingDay, setCurrentEditingDay] = useState(null);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [currentItemValue, setCurrentItemValue] = useState("");

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://tallal.info:5500/api/menu/weekly", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setMenu(null); // Set menu to null if not found
          return;
        }
        throw new Error("Failed to fetch menu");
      }

      const data = await response.json();
      setMenu(data);
      // Filter out Saturday and Sunday from the menu data
      const filteredMenuData = data.menuData.filter(
        (item) => item.day !== "Saturday" && item.day !== "Sunday"
      );

      setFormData({
        startDate: data.startDate,
        endDate: data.endDate,
        menuData: filteredMenuData,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://tallal.info:5500/api/menu/weekly", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create menu");
      setIsCreateModalOpen(false);
      fetchMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/menu/weekly/${menu.menuId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update menu");
      setIsEditModalOpen(false);
      fetchMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMenu = async () => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://tallal.info:5500/api/menu/weekly/${menu.menuId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete menu");
      setMenu(null);
      fetchMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddItem = (day) => {
    setFormData((prevFormData) => {
      const updatedMenuData = prevFormData.menuData.map((item) => {
        if (item.day === day) {
          return { ...item, items: [...item.items, ""] }; // Add a new empty item
        }
        return item;
      });
      return { ...prevFormData, menuData: updatedMenuData };
    });
  };

  // Modified to fix selection jumping
  const handleItemChange = (day, index, value) => {
    setCurrentEditingDay(day);
    setCurrentEditingIndex(index);
    setCurrentItemValue(value);
  };

  // Apply changes when focus is lost
  const handleItemBlur = () => {
    if (currentEditingDay && currentEditingIndex !== null) {
      setFormData((prevFormData) => {
        const updatedMenuData = prevFormData.menuData.map((menuDay) => {
          if (menuDay.day === currentEditingDay) {
            const updatedItems = [...menuDay.items];
            updatedItems[currentEditingIndex] = currentItemValue;
            return { ...menuDay, items: updatedItems };
          }
          return menuDay;
        });
        return { ...prevFormData, menuData: updatedMenuData };
      });
    }
  };

  const handleDeleteItem = (day, index) => {
    setFormData((prevFormData) => {
      const updatedMenuData = prevFormData.menuData.map((menuDay) => {
        if (menuDay.day === day) {
          const updatedItems = menuDay.items.filter((_, i) => i !== index);
          return { ...menuDay, items: updatedItems };
        }
        return menuDay;
      });
      return { ...prevFormData, menuData: updatedMenuData };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Food Menu</h1>
        {!menu ? (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Menu
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Edit Menu
            </button>
            <button
              onClick={handleDeleteMenu}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash className="w-5 h-5 mr-2" />
              Delete Menu
            </button>
          </div>
        )}
      </div>

      {menu && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menu.menuData.map((dayMenu) => (
                <tr key={dayMenu.day} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {dayMenu.day}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {dayMenu.items.map((item, index) => (
                      <div key={index} className="mb-2">
                        {item}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Weekly Menu"
      >
        <form onSubmit={handleCreateMenu}>
          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-gray-700 font-medium mb-2"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="endDate"
              className="block text-gray-700 font-medium mb-2"
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          {formData.menuData.map((dayMenu) => (
            <div key={dayMenu.day} className="mb-4">
              <h3 className="text-lg font-medium mb-2">{dayMenu.day}</h3>
              {dayMenu.items.map((item, index) => (
                <div key={index} className="mb-2 flex items-center">
                  <input
                    type="text"
                    value={
                      currentEditingDay === dayMenu.day &&
                      currentEditingIndex === index
                        ? currentItemValue
                        : item
                    }
                    onChange={(e) =>
                      handleItemChange(dayMenu.day, index, e.target.value)
                    }
                    onBlur={handleItemBlur}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
                  />
                  <button
                    onClick={() => handleDeleteItem(dayMenu.day, index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddItem(dayMenu.day)}
                className="text-purple-600 hover:text-purple-900"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </button>
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
        title="Edit Weekly Menu"
      >
        {menu && (
          <form onSubmit={handleUpdateMenu}>
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-gray-700 font-medium mb-2"
              >
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-gray-700 font-medium mb-2"
              >
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            {formData.menuData.map((dayMenu) => (
              <div key={dayMenu.day} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{dayMenu.day}</h3>
                {dayMenu.items.map((item, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <input
                      type="text"
                      value={
                        currentEditingDay === dayMenu.day &&
                        currentEditingIndex === index
                          ? currentItemValue
                          : item
                      }
                      onChange={(e) =>
                        handleItemChange(dayMenu.day, index, e.target.value)
                      }
                      onBlur={handleItemBlur}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
                    />
                    <button
                      onClick={() => handleDeleteItem(dayMenu.day, index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddItem(dayMenu.day)}
                  className="text-purple-600 hover:text-purple-900"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Item
                </button>
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

export default FoodMenuScreen;
