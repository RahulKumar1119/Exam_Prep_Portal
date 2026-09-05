import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, is_loading, error, clearError } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [examPref, setExamPref] = useState(user?.exam_preference || (localStorage.getItem('jaiib_selected_exam') || ''));
  const [msg, setMsg] = useState('');
  const [localError, setLocalError] = useState('');

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-600">Please <Link to="/login" className="text-indigo-600 underline">login</Link> to view profile.</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setLocalError('');
    clearError();
    if (fullName.trim().length < 2) {
      setLocalError('Full name must be at least 2 characters');
      return;
    }
    try {
      await updateProfile({ full_name: fullName.trim(), exam_preference: examPref || undefined });
      setMsg('Profile updated successfully');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      {(error || localError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error || localError}</div>
      )}
      {msg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{msg}</div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')} • {user.email_verified ? 'Verified' : 'Unverified'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium text-gray-900 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-gray-500">Member since</p>
            <p className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900">{user.status}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-gray-900">Edit Profile</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Preference</label>
            <Select value={examPref} onValueChange={setExamPref}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JAIIB">JAIIB</SelectItem>
                <SelectItem value="CAIIB">CAIIB</SelectItem>
                <SelectItem value="AI-300">AI-300</SelectItem>
                <SelectItem value="ALL">ALL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={is_loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {is_loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="border-t pt-6 space-y-2">
          <h3 className="font-semibold text-gray-900">Account</h3>
          <Link to="/password-reset" className="text-sm text-indigo-600 hover:underline block">
            Change password
          </Link>
          <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline block">
            View dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
