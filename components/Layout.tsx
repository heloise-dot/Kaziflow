
import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Users,
  Bell,
  CheckCircle2,
  Clock
} from 'lucide-react';
import client from '../src/api/client';

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  role: UserRole[];
}

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activePage: string;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, activePage, onRoleChange, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await client.get('/notifications/');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  React.useEffect(() => {
    if (role !== UserRole.PUBLIC) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [role]);

  const markAsRead = async (id: string) => {
    try {
      await client.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', role: [UserRole.VENDOR, UserRole.RETAILER, UserRole.BANK, UserRole.ADMIN] },
    { id: 'invoices', icon: <FileText size={20} />, label: 'Invoices', role: [UserRole.VENDOR, UserRole.RETAILER] },
    { id: 'financing', icon: <Wallet size={20} />, label: 'Financing', role: [UserRole.VENDOR, UserRole.BANK] },
    { id: 'risk', icon: <ShieldCheck size={20} />, label: 'Risk Analysis', role: [UserRole.BANK, UserRole.ADMIN] },
    { id: 'partners', icon: <Building2 size={20} />, label: 'Partners', role: [UserRole.ADMIN, UserRole.BANK] },
    { id: 'users', icon: <Users size={20} />, label: 'Management', role: [UserRole.ADMIN] },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', role: [UserRole.VENDOR, UserRole.RETAILER, UserRole.BANK, UserRole.ADMIN] },
  ];

  const filteredItems = sidebarItems.filter(item => item.role.includes(role));

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-kaziflow-beige flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-kaziflow-blue text-white rounded-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-kaziflow-blue text-kaziflow-beige transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-kaziflow-gold rounded-lg flex items-center justify-center text-kaziflow-blue">K</div>
            KaziFlow
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-kaziflow-accent mt-1 opacity-70">Supply Chain Finance</p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activePage === item.id ? 'bg-kaziflow-blueLight text-kaziflow-beige font-medium' : 'text-kaziflow-beige opacity-60 hover:opacity-100 hover:bg-kaziflow-blueLight/50'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-kaziflow-blueLight">
          <div className="flex items-center gap-3 p-3 bg-kaziflow-blueLight/30 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-kaziflow-gold/20 flex items-center justify-center text-kaziflow-gold">
              {role.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">User {role.toLowerCase()}</p>
              <p className="text-xs opacity-50 capitalize">{role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={() => onRoleChange(UserRole.PUBLIC)}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-kaziflow-beigeDark bg-white/50 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-kaziflow-accent capitalize">{activePage} View</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-kaziflow-blue hover:bg-kaziflow-beige rounded-full transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-kaziflow-beigeDark overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-kaziflow-beigeDark flex items-center justify-between bg-kaziflow-beige/30">
                    <h4 className="font-heading font-bold text-sm">Notifications</h4>
                    {unreadCount > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-kaziflow-accent text-xs">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-kaziflow-beigeDark hover:bg-kaziflow-beige/20 transition-colors cursor-pointer ${!n.is_read ? 'bg-kaziflow-blue/5' : ''}`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 p-1 rounded-full ${!n.is_read ? 'bg-kaziflow-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {n.is_read ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!n.is_read ? 'font-bold text-kaziflow-blue' : 'text-kaziflow-accent'}`}>
                                {n.title}
                              </p>
                              <p className="text-[10px] text-kaziflow-accent/70 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <p className="text-[8px] text-kaziflow-accent/50 mt-1 uppercase tracking-tighter">
                                {new Date(n.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-kaziflow-beige/10 border-t border-kaziflow-beigeDark text-center">
                    <button className="text-[10px] font-bold text-kaziflow-blue hover:underline">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-kaziflow-beigeDark"></div>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="text-sm bg-kaziflow-beigeDark px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-kaziflow-blue font-medium"
            >
              <option value={UserRole.VENDOR}>Vendor View</option>
              <option value={UserRole.RETAILER}>Retailer View</option>
              <option value={UserRole.BANK}>Bank View</option>
              <option value={UserRole.ADMIN}>Admin View</option>
            </select>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
