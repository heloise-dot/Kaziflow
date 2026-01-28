
import React, { useState, useEffect } from 'react';
import { UserRole, Invoice } from '../types';
import client from '../src/api/client';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  QrCode,
  X
} from 'lucide-react';

interface InvoicesViewProps {
  role: UserRole;
}

const InvoicesView: React.FC<InvoicesViewProps> = ({ role }) => {
  const [filter, setFilter] = useState('all');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await client.get('/invoices/');
        setInvoices(response.data);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Invoices</h1>
          <p className="text-kaziflow-accent">Manage and track your full transaction history.</p>
        </div>
        {role === UserRole.VENDOR && (
          <button className="bg-kaziflow-blue text-kaziflow-beige px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
            <Plus size={20} /> Create Invoice
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-kaziflow-beigeDark shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-kaziflow-beigeDark flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-kaziflow-accent" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Partner"
              className="w-full pl-12 pr-4 py-3 bg-kaziflow-beige border-none rounded-2xl text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 bg-kaziflow-beige rounded-2xl text-xs font-bold">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-kaziflow-beige rounded-2xl text-xs font-bold">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-kaziflow-beige/50">
              <tr className="text-[10px] uppercase tracking-wider text-kaziflow-accent">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">{role === UserRole.VENDOR ? 'Retailer' : 'Vendor'}</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kaziflow-beigeDark">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">No invoices found.</td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-kaziflow-beige/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'financed' ? 'bg-kaziflow-blue text-white' :
                        inv.status === 'approved' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{inv.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-medium">{role === UserRole.VENDOR ? (inv as any).retailer?.company_name || 'Retailer Partner' : (inv as any).vendor?.company_name || 'Vendor Partner'}</td>
                  <td className="px-6 py-4 font-bold text-sm">RWF {inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-kaziflow-accent">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {inv.qr_code && (
                      <button
                        onClick={() => setSelectedQr(inv.qr_code)}
                        className="p-2 hover:bg-kaziflow-beige rounded-lg text-kaziflow-blue"
                        title="View QR Code"
                      >
                        <QrCode size={16} />
                      </button>
                    )}
                    <button className="p-2 hover:bg-kaziflow-beige rounded-lg"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-kaziflow-beigeDark flex items-center justify-between">
          <p className="text-xs text-kaziflow-accent">Showing 1 to 4 of 142 results</p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-kaziflow-beige rounded-lg"><ChevronLeft size={16} /></button>
            <div className="flex gap-1">
              <button className="w-8 h-8 bg-kaziflow-blue text-white rounded-lg text-xs font-bold">1</button>
              <button className="w-8 h-8 hover:bg-kaziflow-beige rounded-lg text-xs font-bold">2</button>
              <button className="w-8 h-8 hover:bg-kaziflow-beige rounded-lg text-xs font-bold">3</button>
            </div>
            <button className="p-2 bg-kaziflow-beige rounded-lg"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* QR Code Preview Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kaziflow-blue/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedQr(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-heading font-bold mb-6 text-kaziflow-blue">Invoice QR Code</h3>
            <div className="bg-kaziflow-beige p-4 rounded-2xl inline-block mb-6">
              <img src={selectedQr} alt="Invoice QR Code" className="w-48 h-48 mx-auto" />
            </div>
            <p className="text-sm text-kaziflow-accent">This code can be scanned by the retailer to confirm delivery and trigger financing.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesView;
