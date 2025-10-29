import React, { useState } from 'react';
import { UserRole } from '../types';
import FormInput from './FormInput';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  currentUserRole: UserRole;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserRole,
}) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User' as UserRole,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError.message;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError.message;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'User',
      });
      setErrors({});
      onClose();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to add user'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'User',
    });
    setErrors({});
    setApiError('');
    onClose();
  };

  if (!isOpen) return null;

  // Determine which roles the current user can assign
  const availableRoles: UserRole[] =
    currentUserRole === 'SuperAdmin'
      ? ['User', 'Admin', 'SuperAdmin']
      : ['User', 'Admin'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h3>

        {apiError && (
          <div className="mb-4">
            <ErrorMessage message={apiError} onClose={() => setApiError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={loading}
            placeholder="Enter full name"
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
            placeholder="Enter email address"
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            disabled={loading}
            placeholder="Enter password"
            showPasswordToggle={true}
          />

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              } transition-colors`}
            >
              {loading ? <Loader size="sm" /> : 'Add User'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

