
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Building2, 
  FileCheck, 
  MapPin, 
  User, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface OnboardingViewProps {
  role: UserRole;
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ role, onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-kaziflow-beige rounded-2xl flex items-center gap-4">
              <User size={24} className="text-kaziflow-blue" />
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-kaziflow-accent mb-1">Company Representative</label>
                <input type="text" placeholder="Full Name" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium" />
              </div>
            </div>
            <div className="p-4 bg-kaziflow-beige rounded-2xl flex items-center gap-4">
              <Building2 size={24} className="text-kaziflow-blue" />
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-kaziflow-accent mb-1">Business Name</label>
                <input type="text" placeholder="Legal Entity Name" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-sm text-kaziflow-accent mb-4">We'll verify your business through Rwanda's NIDA and RDB records.</p>
            <div className="p-4 bg-kaziflow-beige rounded-2xl flex items-center gap-4">
              <FileCheck size={24} className="text-kaziflow-blue" />
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-kaziflow-accent mb-1">TIN Number</label>
                <input type="text" placeholder="9-digit TIN" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium" />
              </div>
            </div>
            <div className="p-4 bg-kaziflow-beige rounded-2xl flex items-center gap-4">
              <MapPin size={24} className="text-kaziflow-blue" />
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-kaziflow-accent mb-1">HQ Location</label>
                <input type="text" placeholder="District, Sector" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h4 className="font-bold text-sm mb-4">Select Primary Payout Partner</h4>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-white border-2 border-kaziflow-blue rounded-3xl text-center">
                 <div className="w-12 h-12 bg-yellow-400 rounded-xl mx-auto mb-3"></div>
                 <p className="font-bold text-sm">MTN MoMo</p>
              </button>
              <button className="p-6 bg-kaziflow-beige border-2 border-transparent rounded-3xl text-center">
                 <div className="w-12 h-12 bg-red-600 rounded-xl mx-auto mb-3"></div>
                 <p className="font-bold text-sm">Airtel Money</p>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-2">Verification Started</h3>
            <p className="text-kaziflow-accent text-sm mb-8 leading-relaxed">
              Our AI is currently verifying your records against NIDA database. This usually takes less than 2 minutes.
            </p>
            <div className="bg-kaziflow-blue text-kaziflow-beige p-4 rounded-2xl flex items-center gap-4 text-left">
               <ShieldCheck size={24} className="text-kaziflow-gold" />
               <div>
                  <p className="text-xs font-bold">Secure Verification</p>
                  <p className="text-[10px] opacity-60">AES-256 encrypted session</p>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-kaziflow-blue flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-kaziflow-beige">
           <div 
            className="h-full bg-kaziflow-gold transition-all duration-500" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="mb-10">
          <p className="text-[10px] font-bold text-kaziflow-gold uppercase tracking-widest mb-2">Step {step} of {totalSteps}</p>
          <h2 className="text-3xl font-heading font-bold text-kaziflow-blue">
            {step === 1 && "The Basics"}
            {step === 2 && "Business Identity"}
            {step === 3 && "Payout Method"}
            {step === 4 && "All Set!"}
          </h2>
        </div>

        {renderStep()}

        <button 
          onClick={handleNext}
          className="w-full mt-10 bg-kaziflow-blue text-kaziflow-beige py-5 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-kaziflow-blueLight transition-all"
        >
          {step === totalSteps ? "Enter Dashboard" : "Continue"} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;
