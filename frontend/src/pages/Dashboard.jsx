import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // According to assignment we should use /dashboard/admin or /dashboard/member
        const endpoint = user.role === 'Admin' ? '/dashboard/admin' : '/dashboard/member';
        const response = await api.get(endpoint);
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div>;
  }

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Done', value: stats?.completedTasks || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'To Do', value: stats?.pendingTasks || 0, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back, {user.name}. Here is an overview of {user.role === 'Admin' ? 'all tasks' : 'your assigned tasks'}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {user.role === 'Admin' && stats?.tasksPerUser && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Tasks per User</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-dark-900 text-xs uppercase text-slate-400 border-b border-dark-700">
                <tr>
                  <th className="px-6 py-4 font-medium">User Name</th>
                  <th className="px-6 py-4 font-medium">Tasks Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {stats.tasksPerUser.map((userStat, index) => (
                  <tr key={index} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{userStat.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {userStat.count} tasks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.tasksPerUser.length === 0 && (
              <div className="p-8 text-center text-slate-500">No tasks assigned yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
