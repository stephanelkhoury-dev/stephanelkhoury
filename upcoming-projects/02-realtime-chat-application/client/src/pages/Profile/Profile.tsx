import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { RootState } from '../../store/store';
import { setUser } from '../../store/slices/authSlice';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    status: user?.status || 'online',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/user/profile', formData);
      dispatch(setUser(response.data.user));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      status: user?.status || 'online',
    });
    setIsEditing(false);
  };

  const statusOptions = [
    { value: 'online', label: 'Online', color: 'bg-green-400' },
    { value: 'away', label: 'Away', color: 'bg-yellow-400' },
    { value: 'busy', label: 'Busy', color: 'bg-red-400' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-400' },
  ];

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-400';
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(formData.status)} border-3 border-white rounded-full`}></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      !isEditing ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      !isEditing ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
                      !isEditing ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      !isEditing ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4 mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {user?.chatsCount || 0}
              </div>
              <div className="text-sm text-gray-600">Chats</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {user?.messagesCount || 0}
              </div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Online Status</h4>
                <p className="text-sm text-gray-500">Show when you're online to other users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Read Receipts</h4>
                <p className="text-sm text-gray-500">Let others know when you've read their messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
