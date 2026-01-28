
import React, { useState } from 'react';
import { UserRole } from './types';
import { useAuth } from './src/context/AuthContext';
import Layout from './components/Layout';
import LandingView from './views/LandingView';
import VendorDashboard from './views/VendorDashboard';
import BankDashboard from './views/BankDashboard';
import RetailerDashboard from './views/RetailerDashboard';
import AdminDashboard from './views/AdminDashboard';
import InvoicesView from './views/InvoicesView';
import FinancingView from './views/FinancingView';
import OnboardingView from './views/OnboardingView';
import ProfileView from './views/ProfileView';

const App: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Derive role from auth context, default to PUBLIC (although if user is null we show landing)
  const currentRole = user?.role as UserRole || UserRole.PUBLIC;

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!user) {
    return <LandingView />;
  }

  if (showOnboarding) {
    return <OnboardingView onComplete={() => setShowOnboarding(false)} role={currentRole} />;
  }

  const renderContent = () => {
    if (currentPage === 'invoices') return <InvoicesView role={currentRole} />;
    if (currentPage === 'financing') return <FinancingView role={currentRole} />;
    if (currentPage === 'settings') return <ProfileView />;

    switch (currentRole) {
      case UserRole.VENDOR:
        return <VendorDashboard onNavigate={handleNavigate} />;
      case UserRole.BANK:
        return <BankDashboard onNavigate={handleNavigate} />;
      case UserRole.RETAILER:
        return <RetailerDashboard onNavigate={handleNavigate} />;
      case UserRole.ADMIN:
        return <AdminDashboard onNavigate={handleNavigate} />;
      default:
        return <VendorDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      role={currentRole}
      onRoleChange={(role) => {
        if (role === UserRole.PUBLIC) logout();
      }}
      activePage={currentPage}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
