
import React from 'react';
import { StatCard, ActionButton } from '../components/DashboardCards';
import { 
  Users, 
  ShieldAlert, 
  Database, 
  Settings,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">System Administration</h1>
          <p className="text-kaziflow-accent">Platform oversight, KYC processing, and system health.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton primary label="Create New Bank Node" icon={<UserPlus size={20} />} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="24,501" icon={<Users />} change="45" trend="up" />
        <StatCard label="Fraud Alerts" value="2" icon={<ShieldAlert className="text-red-500" />} />
        <StatCard label="Platform Volume" value="RWF 2.4B" icon={<TrendingUp />} />
        <StatCard label="API Latency" value="24ms" icon={<Activity className="text-green-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Onboarding Queue */}
        <div className="bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-heading font-semibold">KYC Verification Queue</h3>
             <span className="text-xs font-bold text-kaziflow-gold bg-kaziflow-gold/10 px-3 py-1 rounded-full">18 Pending</span>
          </div>
          <div className="space-y-4">
            {[
              { name: "Kigali Logistics Ltd", type: "Vendor", status: "Reviewing NIDA" },
              { name: "Sawa Supermarkets", type: "Retailer", status: "Awaiting Bank Link" },
              { name: "Rubavu Farmers Coop", type: "Vendor", status: "Manual Review Needed" }
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-kaziflow-beige/30 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-kaziflow-blue text-white flex items-center justify-center font-bold">{user.name[0]}</div>
                  <div>
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-kaziflow-accent">{user.type} • {user.status}</p>
                  </div>
                </div>
                <button className="p-2 text-kaziflow-blue hover:bg-kaziflow-blueLight hover:text-white rounded-lg transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Settings / Logs */}
        <div className="bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm flex flex-col">
          <h3 className="font-heading font-semibold mb-6">Operational Logs</h3>
          <div className="flex-1 space-y-4 font-mono text-[10px] bg-kaziflow-blue text-kaziflow-beige p-4 rounded-2xl overflow-y-auto max-h-64">
             <p><span className="text-green-400">[OK]</span> 14:02:11 Settlement Batch processed: 14 invoices</p>
             <p><span className="text-kaziflow-gold">[WARN]</span> 14:01:45 MTN MoMo API latency spike: 2.4s</p>
             <p><span className="text-green-400">[OK]</span> 13:58:22 Backup completed: s3://kaziflow-prod-db-1</p>
             <p><span className="text-red-400">[ERR]</span> 13:55:01 Connection timeout from IP 192.168.1.1</p>
             <p><span className="text-green-400">[OK]</span> 13:50:11 New Vendor "Gisenyi Agri" onboarding started</p>
             <p><span className="text-green-400">[OK]</span> 13:45:00 Auth token rotation successful</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-2 p-3 bg-kaziflow-beige rounded-xl text-xs font-bold hover:bg-kaziflow-beigeDark">
                <Database size={16} /> Export DB
             </button>
             <button className="flex items-center justify-center gap-2 p-3 bg-kaziflow-beige rounded-xl text-xs font-bold hover:bg-kaziflow-beigeDark">
                <Settings size={16} /> Config
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
