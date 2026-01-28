
import React from 'react';
import { UserRole } from '../types';
import { StatCard } from '../components/DashboardCards';
import {
   TrendingUp,
   Wallet,
   ArrowRightCircle,
   Clock,
   CheckCircle2,
   ExternalLink,
   Loader2
} from 'lucide-react';
import client from '../src/api/client';

interface FinancingViewProps {
   role: UserRole;
}

const FinancingView: React.FC<FinancingViewProps> = ({ role }) => {
   const [loading, setLoading] = React.useState(false);

   return (
      <div className="space-y-8">
         <div>
            <h1 className="text-2xl font-heading font-bold">Financing & Payouts</h1>
            <p className="text-kaziflow-accent">
               {role === UserRole.VENDOR ? 'Access early payments and manage your wallet.' : 'Review and approve financing requests.'}
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Financing Used" value="RWF 14.2M" icon={<TrendingUp />} />
            <StatCard label="Available Limit" value="RWF 5.0M" icon={<Wallet className="text-kaziflow-gold" />} />
            <StatCard label="Avg. Rate" value="1.8%" icon={<Clock />} />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payout History */}
            <div className="bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm">
               <h3 className="font-heading font-semibold mb-6">Recent Settlements</h3>
               <div className="space-y-4">
                  {[
                     { bank: "BK Group", method: "MTN MoMo", amount: "RWF 450,000", date: "Today, 10:24 AM", status: "Success" },
                     { bank: "I&M Bank", method: "Bank Transfer", amount: "RWF 1,120,000", date: "Yesterday", status: "Success" },
                     { bank: "BK Group", method: "Airtel Money", amount: "RWF 32,000", date: "Oct 22", status: "Success" }
                  ].map((p, i) => (
                     <div key={i} className="flex items-center justify-between p-4 border border-kaziflow-beigeDark rounded-2xl">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-kaziflow-beige rounded-xl"><CheckCircle2 size={20} className="text-green-600" /></div>
                           <div>
                              <p className="text-sm font-bold">{p.amount}</p>
                              <p className="text-[10px] text-kaziflow-accent uppercase tracking-widest">{p.method} • {p.bank}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-kaziflow-accent font-medium mb-1">{p.date}</p>
                           <button className="text-[10px] font-bold text-kaziflow-blue flex items-center gap-1">Receipt <ExternalLink size={10} /></button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Wallet Connection */}
            <div className="bg-kaziflow-blue text-kaziflow-beige p-8 rounded-3xl flex flex-col justify-between">
               <div>
                  <h3 className="font-heading font-semibold text-xl mb-4">Payout Destinations</h3>
                  <p className="text-sm opacity-60 mb-8 leading-relaxed">Your funds are automatically settled to your primary wallet or bank account within 15 minutes of approval.</p>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black text-[10px]">MTN</div>
                           <div>
                              <p className="text-sm font-bold">MTN MoMo (Primary)</p>
                              <p className="text-[10px] opacity-40">078****902</p>
                           </div>
                        </div>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">ACTIVE</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-[10px]">AIR</div>
                           <div>
                              <p className="text-sm font-bold">Airtel Money</p>
                              <p className="text-[10px] opacity-40">073****112</p>
                           </div>
                        </div>
                        <button className="text-[10px] font-bold opacity-60 hover:opacity-100">SET PRIMARY</button>
                     </div>
                  </div>
               </div>

               <button className="mt-8 flex items-center justify-center gap-2 bg-kaziflow-gold text-kaziflow-blue py-4 rounded-2xl font-bold hover:bg-white transition-all">
                  Withdraw Funds to Wallet <ArrowRightCircle size={20} />
               </button>
            </div>
         </div>
      </div>
   );
};

export default FinancingView;
