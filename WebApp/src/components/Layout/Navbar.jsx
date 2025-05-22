import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Educare
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Logged in as {user?.role}</span>
            <button
              onClick={logout}
              className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}