import React, { useState, useEffect } from 'react';
import { User } from '../types';
import FormInput from './FormInput';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name?: string;
    email?: string;
    password?: string;
  }) => Promise<void>;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't populate password for security
      });
    }
  }, [user]);

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

    // Validate name if it's been changed
    if (formData.name.trim() && formData.name !== user?.name) {
      const nameError = validateName(formData.name);
      if (nameError) {
        newErrors.name = nameError.message;
      }
    }

    // Validate email if it's been changed
    if (formData.email.trim() && formData.email !== user?.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError.message;
      }
    }

    // Validate password only if it's provided (optional for updates)
    if (formData.password.trim()) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError.message;
      }
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
      // Only send changed fields
      const updateData: {
        name?: string;
        email?: string;
        password?: string;
      } = {};

      if (formData.name.trim() && formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      if (formData.email.trim() && formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      // Check if at least one field is being updated
      if (Object.keys(updateData).length === 0) {
        setApiError('No changes detected. Please modify at least one field.');
        setLoading(false);
        return;
      }

      await onSubmit(updateData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to update user'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setErrors({});
    setApiError('');
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Edit User</h3>
        <p className="text-sm text-gray-600 mb-6">
          Update information for: <strong>{user.name}</strong>
        </p>

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
            disabled={loading}
            placeholder="Enter email address"
          />

          <FormInput
            label="New Password (optional)"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            placeholder="Leave blank to keep current password"
            showPasswordToggle={true}
          />

          <p className="text-xs text-gray-500 italic">
            Only fill in the password field if you want to change the user's password.
          </p>

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
              {loading ? <Loader size="sm" /> : 'Update User'}
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

export default EditUserModal;

