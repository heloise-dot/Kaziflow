
import React, { useState, useEffect } from 'react';
import { User, Building, Mail, Shield, Bell, Save, Loader2 } from 'lucide-react';
import client from '../src/api/client';

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
                  className="w-full p-3 bg-kaziflow-beige/30 rounded-xl border-none outline-none"
                  readOnly
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
                  className="w-full p-3 bg-kaziflow-beige/30 rounded-xl border-none outline-none"
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
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
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
          onClick={() => setIsSaving(true)}
          className="bg-kaziflow-blue text-kaziflow-beige px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-kaziflow-blueLight transition-all"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Profile Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
