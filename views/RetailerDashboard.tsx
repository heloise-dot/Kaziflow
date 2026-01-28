
import React, { useState } from 'react';
import { StatCard, ActionButton } from '../components/DashboardCards';
import { 
  Scan, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowUpRight,
  ShieldCheck,
  Camera,
  X
} from 'lucide-react';

interface RetailerDashboardProps {
  onNavigate: (page: string) => void;
}

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ onNavigate }) => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Retailer Dashboard</h1>
          <p className="text-kaziflow-accent">Approve shipments and manage supplier payments.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton 
            primary 
            label="Scan Delivery QR" 
            icon={<Scan size={20} />} 
            onClick={() => setShowScanner(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Outstanding Payable" value="RWF 4.2M" icon={<Clock />} />
        <StatCard label="Pending Approval" value="8 Invoices" icon={<Package />} change="2 new" trend="up" />
        <StatCard label="Confirmed Today" value="RWF 890K" icon={<CheckCircle2 />} />
        <StatCard label="Reliability Index" value="98%" icon={<ShieldCheck />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approval List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm">
          <h3 className="font-heading font-semibold mb-6">Invoices Awaiting Confirmation</h3>
          <div className="space-y-4">
            {[
              { vendor: "Nyabugogo Grain Millers", amount: "RWF 1,200,000", id: "INV-9901", date: "Today" },
              { vendor: "Gisenyi Agri Hub", amount: "RWF 450,000", id: "INV-9904", date: "Yesterday" },
              { vendor: "Kigali Logistics", amount: "RWF 88,000", id: "INV-9912", date: "2 days ago" }
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-kaziflow-beige/30 rounded-2xl">
                <div>
                  <p className="font-bold text-sm">{inv.vendor}</p>
                  <p className="text-xs text-kaziflow-accent">{inv.id} • {inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm">{inv.amount}</span>
                  <button className="bg-kaziflow-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-kaziflow-blueLight transition-all">
                    Confirm Delivery
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('invoices')}
            className="w-full mt-6 py-3 text-sm font-semibold text-kaziflow-accent hover:text-kaziflow-blue"
          >
            View Full List →
          </button>
        </div>

        {/* Analytics Card */}
        <div className="bg-kaziflow-blue text-kaziflow-beige p-6 rounded-3xl">
          <h3 className="font-heading font-semibold mb-6 flex items-center gap-2">
            <ArrowUpRight size={20} className="text-kaziflow-gold" />
            Spend Analysis
          </h3>
          <div className="space-y-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Top Supplier</p>
                <p className="font-bold">Musanze Logistics</p>
                <p className="text-xs text-kaziflow-gold">34% of total volume</p>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Cost Savings (Early Pay)</p>
                <p className="font-bold">RWF 145,000</p>
                <p className="text-xs text-green-400">Negotiated discounts</p>
             </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal Simulation */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] p-8 max-w-md w-full relative overflow-hidden">
            <button 
              onClick={() => setShowScanner(false)}
              className="absolute top-6 right-6 p-2 hover:bg-kaziflow-beige rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading font-bold">Scan Delivery QR</h3>
              <p className="text-kaziflow-accent text-sm">Point your camera at the vendor's invoice QR code.</p>
            </div>
            
            <div className="aspect-square bg-kaziflow-blue rounded-3xl flex flex-col items-center justify-center relative mb-8">
              <Camera size={48} className="text-kaziflow-beige/20 mb-4" />
              <div className="absolute inset-8 border-2 border-dashed border-kaziflow-gold/50 rounded-2xl animate-pulse"></div>
              <p className="text-kaziflow-beige/40 text-xs font-medium uppercase tracking-widest">Searching for QR...</p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-center text-kaziflow-accent uppercase font-bold tracking-widest">Or enter code manually</p>
              <input 
                type="text" 
                placeholder="Enter Invoice ID"
                className="w-full px-6 py-4 bg-kaziflow-beige border-none rounded-2xl text-center font-mono"
              />
              <button className="w-full bg-kaziflow-blue text-kaziflow-beige py-4 rounded-2xl font-bold hover:bg-kaziflow-blueLight">
                Confirm Manual ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;
