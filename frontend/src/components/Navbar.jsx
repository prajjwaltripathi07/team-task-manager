import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, FolderGit2, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-dark-800 border-b border-dark-700 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-brand-500 p-1.5 rounded-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-100 hidden sm:block">TeamTask</span>
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-700 transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/tasks" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-700 transition-colors">
                <CheckSquare className="h-4 w-4" />
                Tasks
              </Link>
              {user.role === 'Admin' && (
                <Link to="/projects" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-700 transition-colors">
                  <FolderGit2 className="h-4 w-4" />
                  Projects
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="bg-dark-700 p-1.5 rounded-full">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:block">{user.name} ({user.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
