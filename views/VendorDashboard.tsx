
import React, { useState, useEffect } from 'react';
import { StatCard, ActionButton } from '../components/DashboardCards';
import InvoiceUploadModal from './InvoiceUploadModal';
import {
  Plus,
  ArrowUpRight,
  Smartphone,
  History,
  ShieldCheck,
  Loader2,
  QrCode
} from 'lucide-react';
import { getRiskScoreForVendor } from '../services/geminiService';
import { RiskScore } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
];

const VendorDashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskScore | null>(null);
  const [loadingRisk, setLoadingRisk] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchRisk = async () => {
      const score = await getRiskScoreForVendor({
        vendorName: "Musanze Logistics",
        lastYearRevenue: 45000,
        defaults: 0,
        sector: "Agriculture"
      });
      setRiskData(score);
      setLoadingRisk(false);
    };
    fetchRisk();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Vendor Dashboard</h1>
          <p className="text-kaziflow-accent">Manage your invoices and instant payouts.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton
            primary
            label="Upload Invoice"
            icon={<Plus size={20} />}
            onClick={() => setIsUploadModalOpen(true)}
          />
          <ActionButton label="Generate QR" icon={<QrCode size={20} />} />
        </div>
      </div>

      {isUploadModalOpen && (
        <InvoiceUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            // refresh data if needed
            setIsUploadModalOpen(false);
          }}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Wallet Balance" value="RWF 1,240,000" icon={<Smartphone />} />
        <StatCard label="Pending Finance" value="RWF 450,000" icon={<History />} change="12%" trend="up" />
        <StatCard label="Active Invoices" value="14" icon={<ArrowUpRight />} />
        <StatCard
          label="Trust Score"
          value={loadingRisk ? "..." : `${riskData?.score}/100`}
          icon={<ShieldCheck className={riskData?.score && riskData.score > 80 ? 'text-green-500' : 'text-kaziflow-gold'} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-semibold text-kaziflow-blue">Cash Flow Analytics</h3>
            <select className="text-xs bg-kaziflow-beige px-2 py-1 rounded">
              <option>Last 6 months</option>
              <option>Year to date</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D1B2A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0D1B2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#415A77' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#0D1B2A" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-kaziflow-blue text-kaziflow-beige p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck size={20} className="text-kaziflow-gold" />
              </div>
              <h3 className="font-heading font-semibold">AI Risk Intelligence</h3>
            </div>
            {loadingRisk ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin text-kaziflow-gold mb-2" size={32} />
                <p className="text-sm opacity-60">Analyzing your performance...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Credit Limit Increase</span>
                  <span className="text-kaziflow-gold font-bold">+15% Possible</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-kaziflow-gold h-full" style={{ width: `${riskData?.score}%` }}></div>
                </div>
                <p className="text-xs leading-relaxed opacity-80">
                  {riskData?.reasoning}
                </p>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2">Key Strength</p>
                  <div className="flex flex-wrap gap-2">
                    {riskData?.factors.map((f, i) => (
                      <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-full">{f.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-3 bg-white text-kaziflow-blue rounded-xl font-bold text-sm hover:bg-kaziflow-gold transition-colors">
            Optimize My Score
          </button>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-3xl border border-kaziflow-beigeDark overflow-hidden shadow-sm">
        <div className="p-6 border-b border-kaziflow-beigeDark flex items-center justify-between">
          <h3 className="font-heading font-semibold">Active Invoices</h3>
          <button className="text-sm text-kaziflow-accent font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-kaziflow-beige/50 text-[10px] uppercase tracking-wider text-kaziflow-accent">
                <th className="px-6 py-4">Retailer</th>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kaziflow-beigeDark">
              {[
                { name: 'Simba Supermarket', id: '#INV-8821', date: 'Oct 12, 2024', amount: 'RWF 450,000', status: 'Pending' },
                { name: 'Sawa City Ltd', id: '#INV-8819', date: 'Oct 10, 2024', amount: 'RWF 220,000', status: 'Confirmed' },
                { name: 'Kigali Bulk Wholesalers', id: '#INV-8815', date: 'Oct 08, 2024', amount: 'RWF 1,150,000', status: 'Paid' }
              ].map((inv, i) => (
                <tr key={i} className="hover:bg-kaziflow-beige/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm">{inv.name}</td>
                  <td className="px-6 py-4 text-xs text-kaziflow-accent">{inv.id}</td>
                  <td className="px-6 py-4 text-xs text-kaziflow-accent">{inv.date}</td>
                  <td className="px-6 py-4 font-semibold text-sm">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`
                      text-[10px] px-2 py-1 rounded-full font-bold uppercase
                      ${inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : inv.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                    `}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status === 'Confirmed' ? (
                      <button className="text-xs font-bold text-kaziflow-blue hover:text-kaziflow-accent">Request Financing</button>
                    ) : (
                      <button className="text-xs text-kaziflow-accent">View Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
