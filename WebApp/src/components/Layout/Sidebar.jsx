import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  
  const parentLinks = [
    { name: 'Dashboard', to: '/' },
    { name: 'Students', to: '/students' },
    { name: 'Menu', to: '/menu' },
    { name: 'Reports', to: '/reports' },
  ];

  const adminLinks = [
    ...parentLinks,
    { name: 'Users', to: '/users' },
    { name: 'Settings', to: '/settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : parentLinks;

  return (
    <div className="bg-white w-64 shadow-sm p-4">
      <div className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `block px-4 py-2 rounded-md ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}