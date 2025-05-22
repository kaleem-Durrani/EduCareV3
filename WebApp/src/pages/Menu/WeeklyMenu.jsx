import { useEffect, useState } from 'react';
import axios from 'axios';

export default function WeeklyMenu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu/weekly');
        setMenu(response.data);
      } catch (err) {
        setError('Failed to fetch weekly menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Menu</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Generate New Menu
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      ) : menu ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-4">
            <span>Start Date: {new Date(menu.startDate).toLocaleDateString()}</span>
            <span>End Date: {new Date(menu.endDate).toLocaleDateString()}</span>
          </div>

          <div className="space-y-4">
            {menu.menuData.map((dayMenu) => (
              <div key={dayMenu.day} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{dayMenu.day}</h3>
                <ul className="list-disc pl-6">
                  {dayMenu.items.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No menu available for this week
        </div>
      )}
    </div>
  );
}