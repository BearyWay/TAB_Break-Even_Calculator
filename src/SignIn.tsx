import { useState } from 'react';
import { Calculator, Clock, Tag, PieChart } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string) => void;
}

function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    await onSignIn(email.toLowerCase().trim());
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e5ba8] to-[#174a8c] text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <Calculator className="w-8 h-8" />
            <h1 className="text-2xl font-bold">TAB Break-Even Calculator</h1>
          </div>

          <h2 className="text-4xl font-bold mb-16 leading-tight">
            Know How Your Business Makes Money
          </h2>

          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#174a8c] bg-opacity-50 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Enter Your Fixed Costs</h3>
                <p className="text-blue-100 leading-relaxed">
                  Add the fixed ongoing expenses your business must pay. Your "operating nut".
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#174a8c] bg-opacity-50 rounded-xl flex items-center justify-center">
                <Tag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Enter Your Profit Goal</h3>
                <p className="text-blue-100 leading-relaxed">
                  Tell us how much profit you want your business to generate.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#174a8c] bg-opacity-50 rounded-xl flex items-center justify-center">
                <Tag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Understand Your Margins. This is critical to know!</h3>
                <p className="text-blue-100 leading-relaxed">
                  Enter your COGS % and variable costs % so we can calculate your Contribution Margin 'CM%'.<br />
                  CM% is how much of every revenue dollar is able to pay for your "operating nut"
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#174a8c] bg-opacity-50 rounded-xl flex items-center justify-center">
                <PieChart className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4. See Your Required Revenue</h3>
                <p className="text-blue-100 leading-relaxed">
                  Find out exactly how much revenue you need to break even and hit your profit goal.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#174a8c] bg-opacity-40 rounded-xl p-6">
          <p className="text-blue-50 leading-relaxed">
            Your data is private and saved automatically. Access your calculator from any device.
          </p>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="/tab_logo_-_2_color_-_small.jpg"
              alt="TAB - The Alternative Board"
              className="h-20 w-auto mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Get Started</h2>
            <p className="text-slate-600">
              Enter your email to access your calculator
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-slate-900 placeholder-slate-400"
              />
            </div>

            <p className="text-sm text-slate-500 text-center">
              No password or verification needed - instant access
            </p>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#1e5ba8] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#174a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </form>

          {/* Mobile TAB Calculator Title */}
          <div className="lg:hidden mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-[#1e5ba8] mb-4">
              <Calculator className="w-6 h-6" />
              <span className="font-semibold">TAB Break-Even Calculator</span>
            </div>
            <p className="text-sm text-slate-600">
              Calculate your business success with real-time financial insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
