
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-kaziflow-beigeDark shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-kaziflow-accent mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-kaziflow-blue">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend === 'up' ? '↑' : '↓'}</span>
            {change} <span className="text-gray-400">vs last month</span>
          </p>
        )}
      </div>
      <div className="p-3 bg-kaziflow-beige rounded-2xl text-kaziflow-blue">
        {icon}
      </div>
    </div>
  </div>
);

export const ActionButton: React.FC<{ label: string; icon: React.ReactNode; primary?: boolean; onClick?: () => void }> = ({ label, icon, primary, onClick }) => (
  <button 
    onClick={onClick}
    className={`
    flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all w-full md:w-auto
    ${primary 
      ? 'bg-kaziflow-blue text-kaziflow-beige hover:bg-kaziflow-blueLight shadow-lg shadow-kaziflow-blue/20' 
      : 'bg-white text-kaziflow-blue border border-kaziflow-beigeDark hover:bg-kaziflow-beige'}
  `}>
    {icon}
    {label}
  </button>
);
