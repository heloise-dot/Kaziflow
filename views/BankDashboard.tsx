
import React from 'react';
import { StatCard } from '../components/DashboardCards';
import { 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const BankDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Lending Dashboard</h1>
        <p className="text-kaziflow-accent">Portfolio management and risk assessment.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Portfolio" value="RWF 840M" icon={<Briefcase />} />
        <StatCard label="Net Interest" value="RWF 42.5M" icon={<TrendingUp />} trend="up" change="5.2%" />
        <StatCard label="NPL Ratio" value="1.2%" icon={<AlertTriangle />} trend="down" change="0.3%" />
        <StatCard label="Onboarded SMEs" value="1,420" icon={<Users />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financing Queue */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-semibold">Financing Queue</h3>
            <div className="flex gap-2">
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">3 Urgent</span>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold">12 New</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { vendor: "Gisenyi Agri Hub", amount: "RWF 5.2M", score: 92, status: "High Trust" },
              { vendor: "Kigali Tech Supplies", amount: "RWF 12.8M", score: 85, status: "Medium Trust" },
              { vendor: "Bugesera Poultry", amount: "RWF 2.1M", score: 68, status: "Review Required" }
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-kaziflow-beige/30 rounded-2xl hover:bg-kaziflow-beige/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${req.score > 80 ? 'bg-green-100 text-green-700' : 'bg-kaziflow-gold/20 text-kaziflow-gold'}`}>
                    {req.score}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{req.vendor}</p>
                    <p className="text-xs text-kaziflow-accent">{req.amount} requested</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle2 size={20} /></button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={20} /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-kaziflow-beigeDark rounded-xl text-sm font-semibold hover:bg-kaziflow-beige transition-colors">
            View All Requests
          </button>
        </div>

        {/* Market Insights */}
        <div className="bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm">
          <h3 className="font-heading font-semibold mb-6">Regional Risk Heatmap</h3>
          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div><span className="text-xs font-semibold inline-block text-kaziflow-blue">Kigali (Retail)</span></div>
                <div className="text-right"><span className="text-xs font-semibold inline-block text-kaziflow-blue">Very Low Risk</span></div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                <div style={{ width: "15%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div><span className="text-xs font-semibold inline-block text-kaziflow-blue">Musanze (Agri)</span></div>
                <div className="text-right"><span className="text-xs font-semibold inline-block text-kaziflow-blue">Stable</span></div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div style={{ width: "35%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div><span className="text-xs font-semibold inline-block text-kaziflow-blue">Rubavu (Logistics)</span></div>
                <div className="text-right"><span className="text-xs font-semibold inline-block text-kaziflow-blue">Moderate</span></div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-100">
                <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-kaziflow-blue text-kaziflow-beige rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Portfolio Prediction</p>
            <p className="text-sm font-medium">Potential 12% growth in SME financing for Q4 based on holiday season projections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDashboard;
