import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import apiService from '../services/api';
import { User, UserRole } from '../types';
import toast from 'react-hot-toast';

const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('User');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, string>>({});
  const [loadingPasswords, setLoadingPasswords] = useState<Record<string, boolean>>({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch users'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await apiService.deleteUser(userId);
      toast.success('User deleted successfully');
      // Remove user from list
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete user'
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleEditRole = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    try {
      setUpdatingUserId(editingUser._id);
      await apiService.updateUser(editingUser._id, { role: editRole });
      toast.success('User role updated successfully');
      
      // Update user in list
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id ? { ...u, role: editRole } : u
        )
      );
      setEditingUser(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update user role'
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleAddUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    try {
      const newUser = await apiService.createUser(userData);
      toast.success('User added successfully');
      // Add new user to list
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      throw err; // Re-throw to be handled by the modal
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (updateData: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    if (!userToEdit) return;

    try {
      const updatedUser = await apiService.updateUser(userToEdit._id, updateData);
      toast.success('User updated successfully');
      
      // Update user in list
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userToEdit._id ? updatedUser : u
        )
      );
      setIsEditUserModalOpen(false);
      setUserToEdit(null);
    } catch (err) {
      throw err; // Re-throw to be handled by the modal
    }
  };

  // Helper function to check if current user can edit a specific user
  const canEditUser = (user: User): boolean => {
    if (!currentUser) return false;
    
    // Users cannot edit themselves through the Edit button (they can edit their profile elsewhere)
    if (user._id === currentUser._id) return false;
    
    // SuperAdmin can edit anyone
    if (currentUser.role === 'SuperAdmin') return true;
    
    // Admin can only edit User role
    if (currentUser.role === 'Admin' && user.role === 'User') return true;
    
    return false;
  };

  // ⚠️ INSECURE - Helper function to check if current user can view password
  const canViewPassword = (user: User): boolean => {
    if (!currentUser) return false;
    
    // SuperAdmin can view all passwords
    if (currentUser.role === 'SuperAdmin') return true;
    
    // Admin can view User passwords
    if (currentUser.role === 'Admin' && user.role === 'User') return true;
    
    return false;
  };

  // ⚠️ INSECURE - Toggle password visibility for a user
  const handleTogglePassword = async (userId: string) => {
    if (visiblePasswords[userId]) {
      // Hide password
      setVisiblePasswords(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      return;
    }

    // Show password
    try {
      setLoadingPasswords(prev => ({ ...prev, [userId]: true }));
      const password = await apiService.getUserPassword(userId);
      setVisiblePasswords(prev => ({ ...prev, [userId]: password }));
    } catch (error) {
      toast.error('Failed to retrieve password');
    } finally {
      setLoadingPasswords(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="mt-2 text-primary-100">
              Manage all users in the system
            </p>
          </div>

          <div className="px-6 py-8">
            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} onClose={() => setError('')} />
              </div>
            )}

            <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Total Users: {users.length}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add User
                </button>
                <button
                  onClick={fetchUsers}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Password
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user._id === currentUser?._id && (
                            <span className="ml-2 text-xs text-primary-600">
                              (You)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-900">
                            {loadingPasswords[user._id] ? (
                              <Loader size="sm" />
                            ) : visiblePasswords[user._id] ? (
                              visiblePasswords[user._id]
                            ) : (
                              '••••••••'
                            )}
                          </span>
                          {canViewPassword(user) && (
                            <button
                              onClick={() => handleTogglePassword(user._id)}
                              disabled={loadingPasswords[user._id]}
                              className="text-gray-500 hover:text-gray-700 disabled:text-gray-400"
                              title={visiblePasswords[user._id] ? 'Hide password' : 'Show password'}
                            >
                              {visiblePasswords[user._id] ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'SuperAdmin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'Admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2 flex-wrap">
                          {/* Edit User Button - SuperAdmin can edit Admin/User, Admin can only edit User */}
                          {canEditUser(user) && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Edit
                            </button>
                          )}
                          
                          {/* Edit Role Button - Admin cannot edit SuperAdmin users */}
                          {!(currentUser?.role === 'Admin' && user.role === 'SuperAdmin') && (
                            <button
                              onClick={() => handleEditRole(user)}
                              disabled={user._id === currentUser?._id}
                              className="text-primary-600 hover:text-primary-900 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                            >
                              Edit Role
                            </button>
                          )}
                          
                          {/* Delete Button - SuperAdmin only */}
                          {currentUser?.role === 'SuperAdmin' && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={
                                user._id === currentUser?._id ||
                                deletingUserId === user._id
                              }
                              className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                            >
                              {deletingUserId === user._id ? (
                                <Loader size="sm" />
                              ) : (
                                'Delete'
                              )}
                            </button>
                          )}
                          
                          {/* Show disabled state for Admin viewing SuperAdmin or other Admins */}
                          {currentUser?.role === 'Admin' && 
                           (user.role === 'SuperAdmin' || user.role === 'Admin') && 
                           user._id !== currentUser._id && (
                            <span className="text-gray-400 text-sm italic">
                              No permissions
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Edit User Role
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Update role for: <strong>{editingUser.name}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as UserRole)}
                disabled={updatingUserId !== null}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                {/* Only SuperAdmin can assign SuperAdmin role */}
                {currentUser?.role === 'SuperAdmin' && (
                  <option value="SuperAdmin">SuperAdmin</option>
                )}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleUpdateRole}
                disabled={updatingUserId !== null}
                className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  updatingUserId !== null
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                } transition-colors`}
              >
                {updatingUserId !== null ? <Loader size="sm" /> : 'Update'}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                disabled={updatingUserId !== null}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
        currentUserRole={currentUser?.role || 'User'}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSubmit={handleUpdateUser}
        user={userToEdit}
      />
    </div>
  );
};

export default UserList;

