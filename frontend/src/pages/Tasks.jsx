import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckSquare, Clock, Calendar, Folder } from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', project: '', assignedTo: '', dueDate: '', priority: 'Medium' });
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user.role === 'Admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', project: '', assignedTo: '', dueDate: '', priority: 'Medium' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-slate-400 mt-1">Manage and track your work</p>
        </div>
        {user.role === 'Admin' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="card p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{task.title}</h3>
              <div className="flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority || 'Medium'}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4 flex-grow">{task.description || 'No description'}</p>
            
            <div className="space-y-3 mt-auto pt-4 border-t border-dark-700">
              <div className="flex items-center text-sm text-slate-300 gap-2">
                <Folder className="h-4 w-4 text-slate-500" />
                <span className="truncate">{task.project?.name || 'Unassigned'}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-slate-300 gap-2">
                  <div className="h-6 w-6 rounded-full bg-dark-700 flex items-center justify-center text-xs font-bold">
                    {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="truncate">{task.assignedTo?.name || 'Unassigned'}</span>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center text-slate-400 gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="input-field text-sm py-1.5"
                  disabled={user.role !== 'Admin' && task.assignedTo?._id !== user.id}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full card p-12 text-center text-slate-400">
            No tasks found.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-md w-full border border-dark-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Create New Task</h2>
              {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project *</label>
                  <select
                    required
                    className="input-field"
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Assign To</label>
                  <select
                    className="input-field"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    className="input-field"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
