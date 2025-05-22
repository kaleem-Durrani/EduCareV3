import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Home,
    School,
    BookOpen,
    Users,
    User,
    Bell,
    Utensils,
    FileText,
    AlertTriangle,
    CircleUser,
    LogOut,
    CircleDollarSign
} from 'lucide-react';

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActivePath = (path) => {
        return location.pathname.startsWith(path);
    };

    const navigation = [
        { name: 'Home', icon: Home, path: '/Admin/dashboard' },
        { name: 'Classes', icon: School, path: '/Admin/classes' },
        { name: 'Monthly Plans', icon: BookOpen, path: '/Admin/plans' },
        { name: 'Teachers', icon: Users, path: '/Admin/teachers' },
        { name: 'Parents', icon: Users, path: '/Admin/parents' },
        { name: 'Students', icon: User, path: '/Admin/students' },
        { name: 'Fees', icon: CircleDollarSign, path: '/Admin/fees' },
        { name: 'Food', icon: Utensils, path: '/Admin/food' },
        { name: 'Reports', icon: FileText, path: '/Admin/reports' },
        { name: 'Lost Items', icon: AlertTriangle, path: '/Admin/lostitems' },
    ];

    const userNavigation = [
        // {name: 'Profile', icon: CircleUser, path: '/Admin/profile'},
        { name: 'Logout', icon: LogOut, path: '/login' },
    ];

    const handleLogout = () => {
        // Clear the access token from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        // Navigate to the login screen
        navigate('/login');
    };

    const NavItem = ({ item }) => {
        const isActive = isActivePath(item.path);
        const isLogout = item.name === 'Logout'; // Check if it's the logout item

        const handleClick = () => {
            if (isLogout) {
                handleLogout();
            }
        };

        return (
            <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-600 ${
                    isActive ? 'text-purple-600 bg-purple-50' : ''
                }`}
                onClick={isLogout ? handleClick : null} // Add onClick only for logout
            >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                <span className="ml-4">{item.name}</span>
            </Link>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>

                <div className="p-4">
                    <div className="pt-4 border-t border-gray-200">
                        <div className="px-2 space-y-1">
                            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                User
                            </p>
                            {userNavigation.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;