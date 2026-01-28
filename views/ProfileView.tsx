
import React, { useState, useEffect } from 'react';
import { User, Building, Mail, Shield, Bell, Save, Loader2, X } from 'lucide-react';
import client from '../src/api/client';

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change state
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await client.get('/auth/me');
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await client.patch('/auth/me', {
        full_name: profile.full_name,
        company_name: profile.company_name
      });
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }
    setIsChangingPwd(true);
    setPwdError('');
    try {
      await client.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setSuccess('Password changed successfully!');
      setShowPwdModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setIsChangingPwd(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-kaziflow-blue" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Account Profile</h1>
        <p className="text-kaziflow-accent">Manage your business and security settings.</p>

        {success && <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-2xl text-sm font-bold animate-pulse">{success}</div>}
        {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-2xl text-sm font-bold">{error}</div>}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-kaziflow-beigeDark shadow-sm space-y-6">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <User size={20} className="text-kaziflow-blue" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-kaziflow-accent uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profile?.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full p-3 bg-kaziflow-beige rounded-xl border border-kaziflow-beigeDark outline-none focus:ring-2 focus:ring-kaziflow-blue transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-kaziflow-accent uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-2 w-full p-3 bg-kaziflow-beige/30 rounded-xl">
                  <Mail size={16} className="text-kaziflow-accent/50" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-kaziflow-beigeDark shadow-sm space-y-6">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <Building size={20} className="text-kaziflow-blue" /> Business Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-kaziflow-accent uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={profile?.company_name || ''}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  className="w-full p-3 bg-kaziflow-beige rounded-xl border border-kaziflow-beigeDark outline-none focus:ring-2 focus:ring-kaziflow-blue transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-kaziflow-accent uppercase tracking-wider">Entity Type</label>
                <div className="capitalize w-full p-3 bg-kaziflow-beige/30 rounded-xl">
                  {profile?.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-kaziflow-blue text-kaziflow-beige p-6 rounded-[2rem] shadow-xl">
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-kaziflow-gold" /> Security Status
            </h3>
            <p className="text-xs opacity-70 mb-4">Your account is currently active and verified for supply chain financing.</p>
            <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between mb-4">
              <span className="text-xs">Two-Factor Auth</span>
              <div className="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end px-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <button
              onClick={() => setShowPwdModal(true)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
            >
              Change Password
            </button>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-kaziflow-beigeDark shadow-sm">
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Bell size={18} className="text-kaziflow-blue" /> Notifications
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Financing Requests', active: true },
                { label: 'Payment Alerts', active: true },
                { label: 'Risk Score Updates', active: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{item.label}</span>
                  <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${item.active ? 'bg-kaziflow-blue' : 'bg-gray-200'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full ${item.active ? 'translate-x-4' : ''} transition-all`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          className="bg-kaziflow-blue text-kaziflow-beige px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-kaziflow-blueLight transition-all"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Profile Changes
        </button>
      </div>

      {/* Password Change Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kaziflow-blue/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowPwdModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-heading font-bold mb-6 text-kaziflow-blue">Change Password</h3>

            {pwdError && <div className="mb-4 p-3 bg-red-100 text-red-700 text-xs rounded-lg">{pwdError}</div>}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-kaziflow-accent uppercase mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-kaziflow-beige rounded-xl border border-kaziflow-beigeDark outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-kaziflow-accent uppercase mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-kaziflow-beige rounded-xl border border-kaziflow-beigeDark outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-kaziflow-accent uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-kaziflow-beige rounded-xl border border-kaziflow-beigeDark outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isChangingPwd}
                className="w-full bg-kaziflow-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {isChangingPwd ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
