
import React, { useState } from 'react';
import { ArrowRight, Shield, Zap, TrendingUp, ChevronRight, Check, X, Loader2 } from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../src/context/AuthContext';
import client from '../src/api/client';

interface LandingViewProps {
  onLogin?: (role: UserRole) => void; // Optional now as we use context
}

const LandingView: React.FC<LandingViewProps> = () => {
  const { login } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('vendor@example.com');
  const [password, setPassword] = useState('password');
  const [fullName, setFullName] = useState('John Doe');
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [role, setRole] = useState(UserRole.VENDOR);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegister) {
        await client.post('/auth/register', {
          email,
          full_name: fullName,
          company_name: companyName,
          role: role,
          password
        });
        // Auto-login after register or switch to login view
        setIsRegister(false);
        setError('Registration successful! Please log in.');
        setIsLoading(false);
        return;
      }

      // Login Flow
      // Create URLSearchParams for OAuth2PasswordRequestForm
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await client.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // Decode or just assume role for prototype if not returned in token response directly
      // In real app, decode JWT. Here we will mock role based on email or fetch /me
      // For this demo, let's assume the backend *could* return it, or we hack it:
      let targetRole = UserRole.VENDOR;
      if (email.includes('bank')) targetRole = UserRole.BANK;
      if (email.includes('admin')) targetRole = UserRole.ADMIN;
      if (email.includes('retailer')) targetRole = UserRole.RETAILER;

      login(response.data.access_token, targetRole);
    } catch (err: any) {
      console.error(err);
      console.error(err);
      let errorMessage = 'Registration failed. Email may remain/exist.';
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = `Registration failed: ${err.response.data.detail}`;
      } else if (err.message) {
        errorMessage = `Registration failed: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openLogin = () => { setIsRegister(false); setIsLoginOpen(true); };
  const openRegister = () => { setIsRegister(true); setIsLoginOpen(true); };
  return (
    <div className="bg-kaziflow-beige min-h-screen">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-kaziflow-blue rounded-xl flex items-center justify-center text-kaziflow-beige font-bold text-xl">K</div>
          <span className="text-2xl font-heading font-bold text-kaziflow-blue">KaziFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-kaziflow-blue/70">
          <a href="#" className="hover:text-kaziflow-blue transition-colors">Solutions</a>
          <a href="#" className="hover:text-kaziflow-blue transition-colors">How it Works</a>
          <a href="#" className="hover:text-kaziflow-blue transition-colors">Banking Partners</a>
          <a href="#" className="hover:text-kaziflow-blue transition-colors">Security</a>
        </div>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-kaziflow-blue text-kaziflow-beige px-6 py-2.5 rounded-full text-sm font-bold hover:bg-kaziflow-blueLight transition-all"
        >
          Portal Login
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-kaziflow-gold/10 border border-kaziflow-gold/20 px-4 py-2 rounded-full text-kaziflow-gold font-bold text-xs uppercase tracking-widest">
            <Zap size={14} /> Empowering East African SMEs
          </div>
          <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight text-kaziflow-blue">
            Unlock Your <span className="text-kaziflow-accent">Supply Chain</span> Cash Flow.
          </h1>
          <p className="text-xl text-kaziflow-accent max-w-lg leading-relaxed">
            Instant invoice financing and mobile wallet settlements for local vendors and farmers in Rwanda and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={openRegister}
              className="bg-kaziflow-blue text-kaziflow-beige px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:translate-x-1 transition-all"
            >
              Get Early Payment <ArrowRight size={20} />
            </button>
            <button className="bg-white border border-kaziflow-beigeDark text-kaziflow-blue px-8 py-4 rounded-2xl text-lg font-bold hover:bg-kaziflow-beigeDark/30 transition-all">
              Become a Partner
            </button>
          </div>
          <div className="flex items-center gap-6 pt-4 grayscale opacity-50">
            <span className="font-bold text-kaziflow-blue">Partners:</span>
            <div className="text-sm font-bold tracking-tighter">MTN MoMo</div>
            <div className="text-sm font-bold tracking-tighter">Airtel Money</div>
            <div className="text-sm font-bold tracking-tighter">BK GROUP</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-kaziflow-gold/20 rounded-[4rem] blur-3xl"></div>
          <div className="relative bg-kaziflow-blue rounded-[3rem] p-8 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl"></div>
                <div>
                  <div className="h-3 w-24 bg-white/20 rounded mb-1"></div>
                  <div className="h-2 w-16 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="text-kaziflow-gold font-bold">RWF 1,250,000</div>
            </div>
            <div className="space-y-4">
              <div className="h-32 w-full bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-white/10">
                <div className="text-kaziflow-beige/40 text-xs mb-2 uppercase tracking-widest">AI Risk Score</div>
                <div className="text-4xl font-heading font-bold text-kaziflow-beige">89<span className="text-kaziflow-gold">/100</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-white/5 rounded-2xl p-4">
                  <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                  <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                </div>
                <div className="h-20 bg-white/5 rounded-2xl p-4">
                  <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                  <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-kaziflow-blue py-24 text-kaziflow-beige">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-heading font-bold">Built for the African Market</h2>
            <p className="text-kaziflow-beige/60">Solving the liquidity gap for millions of SMEs with deep technology and local insights.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap size={32} className="text-kaziflow-gold" />,
                title: "Instant Settlement",
                desc: "Get paid via MTN MoMo or Airtel Money the moment an invoice is confirmed by the retailer."
              },
              {
                icon: <Shield size={32} className="text-kaziflow-gold" />,
                title: "AI Risk Scoring",
                desc: "We use machine learning to analyze your supply chain history, building a trust score that unlocks better rates."
              },
              {
                icon: <TrendingUp size={32} className="text-kaziflow-gold" />,
                title: "Scalable Financing",
                desc: "From small farmers to large wholesalers, our platform scales with your business needs across East Africa."
              }
            ].map((f, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl">{f.icon}</div>
                <h3 className="text-xl font-heading font-bold mb-4">{f.title}</h3>
                <p className="text-kaziflow-beige/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Security */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[4rem] p-12 lg:p-20 border border-kaziflow-beigeDark grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-heading font-bold text-kaziflow-blue mb-8">Bank-Grade Security. Rwanda Local Presence.</h2>
            <div className="space-y-6">
              {[
                "ISO 27001 Certified Infrastructure",
                "Direct Integration with Rwanda NIDA for KYC",
                "MTN & Airtel Payment Gateways",
                "Real-time AML & Fraud Monitoring"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={14} />
                  </div>
                  <span className="font-medium text-kaziflow-blue/80">{text}</span>
                </div>
              ))}
            </div>
            <button className="mt-12 flex items-center gap-2 text-kaziflow-blue font-bold hover:gap-4 transition-all">
              Read our Compliance Statement <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-kaziflow-beige p-6 rounded-3xl text-center space-y-2">
              <div className="text-3xl font-bold text-kaziflow-blue">99.9%</div>
              <div className="text-xs font-bold text-kaziflow-accent uppercase tracking-widest">Uptime</div>
            </div>
            <div className="bg-kaziflow-beige p-6 rounded-3xl text-center space-y-2">
              <div className="text-3xl font-bold text-kaziflow-blue">15m</div>
              <div className="text-xs font-bold text-kaziflow-accent uppercase tracking-widest">Avg Settlement</div>
            </div>
            <div className="bg-kaziflow-beige p-6 rounded-3xl text-center space-y-2">
              <div className="text-3xl font-bold text-kaziflow-blue">1200+</div>
              <div className="text-xs font-bold text-kaziflow-accent uppercase tracking-widest">Active SMEs</div>
            </div>
            <div className="bg-kaziflow-beige p-6 rounded-3xl text-center space-y-2">
              <div className="text-3xl font-bold text-kaziflow-blue">RWF 2B+</div>
              <div className="text-xs font-bold text-kaziflow-accent uppercase tracking-widest">Disbursed</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-heading font-bold text-kaziflow-blue mb-4">How It Works</h2>
          <p className="text-kaziflow-accent text-lg">Four simple steps to unlock your working capital.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Upload Invoice", desc: "Submit your verified invoice from a partner retailer." },
            { step: "02", title: "Risk Analysis", desc: "Our AI analyzes data points to approve funding in minutes." },
            { step: "03", title: "Get Funded", desc: "Receive up to 90% of the invoice value instantly via Mobile Money." },
            { step: "04", title: "Repayment", desc: "Retailer pays us directly on the due date. You get the balance." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-6xl font-bold text-kaziflow-beigeDark/50 group-hover:text-kaziflow-gold/20 transition-colors mb-4">{item.step}</div>
              <h3 className="text-xl font-bold text-kaziflow-blue mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI / Impact */}
      <section className="bg-kaziflow-blueLight py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-kaziflow-blue skew-x-12 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-heading font-bold mb-6">Stop Waiting 90 Days to Get Paid.</h2>
            <p className="text-lg opacity-80 mb-8 leading-relaxed">
              Cash flow gaps kill small businesses. KaziFlow bridges the gap between delivery and payment, allowing you to reinvest in your business immediately.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold text-kaziflow-gold mb-1">3x</div>
                <div className="text-sm opacity-60">Faster Reinvesting</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-kaziflow-gold mb-1">0%</div>
                <div className="text-sm opacity-60">Collateral Required</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">Representative Example</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Invoice Value</span>
                <span className="font-mono">RWF 1,000,000</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Advance Rate (90%)</span>
                <span className="font-mono text-kaziflow-gold">RWF 900,000</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Fee (2.5%)</span>
                <span className="font-mono text-red-300">- RWF 25,000</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>You Receive Today</span>
                <span>RWF 875,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kaziflow-beige border-t border-kaziflow-beigeDark py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-kaziflow-blue rounded-lg flex items-center justify-center text-kaziflow-beige font-bold">K</div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold text-kaziflow-blue">KaziFlow</span>
              <span className="text-[10px] text-kaziflow-accent tracking-widest uppercase">Supply Chain Finance</span>
            </div>
          </div>
          <div className="text-sm text-kaziflow-accent">
            © 2024 KaziFlow Ltd. Regulated by BNR (Rwanda).
          </div>
          <div className="flex gap-6 text-sm font-medium text-kaziflow-blue/60">
            <a href="#" className="hover:text-kaziflow-blue">Privacy</a>
            <a href="#" className="hover:text-kaziflow-blue">Terms</a>
            <a href="#" className="hover:text-kaziflow-blue">Support</a>
          </div>
        </div>
      </footer>
      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kaziflow-blue/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-heading font-bold text-kaziflow-blue mb-2">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-gray-500 text-sm">
                {isRegister ? 'Join thousands of SMEs growing with KaziFlow.' : 'Enter your credentials to access your dashboard.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <Shield size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-kaziflow-blue focus:ring-1 focus:ring-kaziflow-blue outline-none transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-kaziflow-blue focus:ring-1 focus:ring-kaziflow-blue outline-none transition-all"
                      placeholder="Acme Trading Ltd"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-kaziflow-blue focus:ring-1 focus:ring-kaziflow-blue outline-none transition-all"
                      required
                    >
                      <option value={UserRole.VENDOR}>Vendor / Seller</option>
                      <option value={UserRole.RETAILER}>Retailer / Buyer</option>
                      <option value={UserRole.BANK}>Banking Partner</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-kaziflow-blue focus:ring-1 focus:ring-kaziflow-blue outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-kaziflow-blue focus:ring-1 focus:ring-kaziflow-blue outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-kaziflow-blue text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-kaziflow-blueLight transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isRegister ? 'Create Account' : 'Sign In')}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {isRegister ? (
                <>Already have an account? <button onClick={() => setIsRegister(false)} className="text-kaziflow-blue font-bold hover:underline">Sign In</button></>
              ) : (
                <>Don't have an account? <button onClick={() => setIsRegister(true)} className="text-kaziflow-blue font-bold hover:underline">Get started</button></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingView;
