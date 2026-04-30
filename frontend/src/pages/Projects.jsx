import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, Users, Trash2 } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    fetchProjects();
    if (user && user.role === 'Admin') {
      fetchUsers();
    }
  }, [user]);

  const handleAddMember = async () => {
    if (!selectedUserToAdd || !currentProject) return;
    try {
      const response = await api.post(`/projects/${currentProject._id}/members`, { userId: selectedUserToAdd });
      setProjects(projects.map(p => p._id === currentProject._id ? response.data : p));
      setCurrentProject(response.data);
      setSelectedUserToAdd('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!currentProject) return;
    try {
      const response = await api.delete(`/projects/${currentProject._id}/members/${userId}`);
      setProjects(projects.map(p => p._id === currentProject._id ? response.data : p));
      setCurrentProject(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/projects', newProject);
      setProjects([...projects, response.data]);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage team projects and workspaces</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="card p-6 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-brand-500/10 p-2 rounded-lg">
                <Folder className="h-6 w-6 text-brand-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-white">{project.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Created by {project.createdBy?.name}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm flex-grow">{project.description || 'No description provided.'}</p>
            <div className="mt-4 pt-4 border-t border-dark-700 flex justify-between items-center">
              <div className="flex items-center text-xs text-slate-400">
                <Users className="h-4 w-4 mr-1" />
                {project.members?.length || 0} Members
              </div>
              {user.role === 'Admin' && (
                <button 
                  onClick={() => { setCurrentProject(project); setManageMembersOpen(true); }}
                  className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
                >
                  Manage Members
                </button>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full card p-12 text-center text-slate-400">
            No projects found. Create one to get started!
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-md w-full border border-dark-700 shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
              {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    className="input-field min-h-[100px]"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {manageMembersOpen && currentProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-md w-full border border-dark-700 shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Manage Members - {currentProject.name}</h2>
              
              <div className="flex gap-2 mb-6">
                <select 
                  className="input-field flex-grow"
                  value={selectedUserToAdd}
                  onChange={(e) => setSelectedUserToAdd(e.target.value)}
                >
                  <option value="">Select user to add</option>
                  {users.filter(u => !currentProject.members?.find(m => m._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <button onClick={handleAddMember} className="btn-primary whitespace-nowrap">Add</button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                <h3 className="text-sm font-medium text-slate-300">Current Members ({currentProject.members?.length || 0})</h3>
                {currentProject.members?.map(member => (
                  <div key={member._id} className="flex justify-between items-center p-3 bg-dark-900 rounded-lg border border-dark-700">
                    <div>
                      <p className="text-sm font-medium text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                    {member._id !== currentProject.createdBy._id && (
                      <button 
                        onClick={() => handleRemoveMember(member._id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={() => { setManageMembersOpen(false); setCurrentProject(null); }} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
