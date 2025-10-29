import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState<string>('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (formData.name !== user?.name) {
      const nameError = validateName(formData.name);
      if (nameError) {
        newErrors.name = nameError.message;
      }
    }

    if (formData.email !== user?.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError.message;
      }
    }

    if (formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const updateData: {
        name?: string;
        email?: string;
        password?: string;
      } = {};

      if (formData.name !== user?.name) updateData.name = formData.name;
      if (formData.email !== user?.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      if (Object.keys(updateData).length === 0) {
        toast.error('No changes to update');
        setLoading(false);
        return;
      }

      await apiService.updateUser(user!._id, updateData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setFormData({ ...formData, password: '' });
      
      // Refresh page to update user data
      window.location.reload();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Update failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setErrors({});
    setApiError('');
  };

  // ⚠️ INSECURE - For DEMO only
  const handleTogglePassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      setUserPassword('');
      return;
    }

    if (!user?._id) return;

    try {
      setLoadingPassword(true);
      const password = await apiService.getUserPassword(user._id);
      setUserPassword(password);
      setShowPassword(true);
    } catch (error) {
      toast.error('Failed to retrieve password');
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading user data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user.name}!
            </h1>
            <p className="mt-2 text-primary-100">Manage your profile below</p>
          </div>

          <div className="px-6 py-8">
            {apiError && (
              <div className="mb-6">
                <ErrorMessage message={apiError} onClose={() => setApiError('')} />
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Password
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 px-4 py-2 rounded-lg border border-gray-300">
                      <p className="text-lg text-gray-900 font-mono">
                        {loadingPassword ? (
                          'Loading...'
                        ) : showPassword ? (
                          userPassword || '••••••••'
                        ) : (
                          '••••••••'
                        )}
                      </p>
                    </div>
                    <button
                      onClick={handleTogglePassword}
                      disabled={loadingPassword}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
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
                          className="w-6 h-6"
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
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {user.role}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Member Since
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6">
                <FormInput
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  disabled={loading}
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  disabled={loading}
                />

                <FormInput
                  label="New Password (leave blank to keep current)"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                  disabled={loading}
                  showPasswordToggle={true}
                />

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                      loading
                        ? 'bg-primary-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    } transition-colors`}
                  >
                    {loading ? <Loader size="sm" /> : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

