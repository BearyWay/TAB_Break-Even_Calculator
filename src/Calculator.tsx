import { useState, useEffect } from 'react';
import { ChevronDown, Info, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

function Calculator() {
  const { user, calculatorData, signOut, updateCalculatorData } = useAuth();

  const [facilitiesLocation, setFacilitiesLocation] = useState<number>(0);
  const [salariesBenefits, setSalariesBenefits] = useState<number>(0);
  const [salesMarketing, setSalesMarketing] = useState<number>(0);
  const [generalAdmin, setGeneralAdmin] = useState<number>(0);
  const [desiredProfit, setDesiredProfit] = useState<number>(50000);
  const [cogsPercent, setCogsPercent] = useState<number>(57);
  const [variableOpCostsPercent, setVariableOpCostsPercent] = useState<number>(11);

  const [showCMInfo, setShowCMInfo] = useState<boolean>(false);
  const [showStep3Explanation, setShowStep3Explanation] = useState<boolean>(false);
  const [showCogsInfo, setShowCogsInfo] = useState<boolean>(false);
  const [showVariableOpCostsInfo, setShowVariableOpCostsInfo] = useState<boolean>(false);
  const [showFacilitiesInfo, setShowFacilitiesInfo] = useState<boolean>(false);
  const [showSalariesInfo, setShowSalariesInfo] = useState<boolean>(false);
  const [showSalesMarketingInfo, setShowSalesMarketingInfo] = useState<boolean>(false);
  const [showGeneralAdminInfo, setShowGeneralAdminInfo] = useState<boolean>(false);
  const [showDesiredProfitInfo, setShowDesiredProfitInfo] = useState<boolean>(false);

  useEffect(() => {
    if (calculatorData) {
      setFacilitiesLocation(Number(calculatorData.facilities_location));
      setSalariesBenefits(Number(calculatorData.salaries_benefits));
      setSalesMarketing(Number(calculatorData.sales_marketing));
      setGeneralAdmin(Number(calculatorData.general_admin));
      setDesiredProfit(Number(calculatorData.desired_profit));
      setCogsPercent(Number(calculatorData.cogs_percent));
      setVariableOpCostsPercent(Number(calculatorData.variable_op_costs_percent));
    }
  }, [calculatorData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (calculatorData) {
        updateCalculatorData({
          facilities_location: facilitiesLocation,
          salaries_benefits: salariesBenefits,
          sales_marketing: salesMarketing,
          general_admin: generalAdmin,
          desired_profit: desiredProfit,
          cogs_percent: cogsPercent,
          variable_op_costs_percent: variableOpCostsPercent,
        });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [facilitiesLocation, salariesBenefits, salesMarketing, generalAdmin, desiredProfit, cogsPercent, variableOpCostsPercent]);

  const fixedCosts = facilitiesLocation + salariesBenefits + salesMarketing + generalAdmin;
  const fixedExpenses = fixedCosts;
  const laborCosts = salariesBenefits;
  const totalDollars = fixedCosts + desiredProfit;
  const totalDollarsBreakEven = fixedCosts;
  const gpMarginPercent = 100 - cogsPercent;
  const contributionMarginPercent = gpMarginPercent - variableOpCostsPercent;
  const revenueGoal = contributionMarginPercent > 0 ? totalDollars / (contributionMarginPercent / 100) : 0;
  const breakEvenRevenueGoal = contributionMarginPercent > 0 ? totalDollarsBreakEven / (contributionMarginPercent / 100) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const handleNumberInput = (value: string, setter: (val: number) => void) => {
    const numericValue = value.replace(/,/g, '');
    const parsed = Number(numericValue);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <img
              src="/tab_logo_-_2_color_-_small.jpg"
              alt="TAB - The Alternative Board"
              className="h-16 md:h-20 w-auto"
            />
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-white"
              title="Sign Out"
            >
              <span className="text-sm font-medium hidden sm:inline">{user?.email}</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Break-Even Calculator
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Figure out how much revenue you need to cover your costs and hit your profit goals.
            </p>
          </div>
        </div>

        <div className="max-w-[90rem] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-6 items-start">
            {/* LEFT COLUMN - Step 1 */}
            <div className="space-y-8 flex flex-col">
              {/* Step 1 - Dollars to Pay */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-[#1e5ba8]">
                    <span className="text-xl font-bold">Step 1</span>
                    <span className="text-lg font-semibold"> - fixed dollars that your business will pay</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-3">Enter your Fixed Expenses:</h4>

                <div className="space-y-3 mb-4">
                  {/* Facilities & Location */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-5">
                          Location expenses (Fixed)
                        </label>
                        <button
                          onClick={() => setShowFacilitiesInfo(!showFacilitiesInfo)}
                          className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                          title="Information about Facilities & Location"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative w-40">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="text"
                          value={formatNumber(facilitiesLocation)}
                          onChange={(e) => handleNumberInput(e.target.value, setFacilitiesLocation)}
                          onFocus={(e) => e.target.select()}
                          className="w-full pl-7 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-sm font-medium text-right"
                        />
                      </div>
                    </div>
                    {showFacilitiesInfo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2 text-xs text-slate-700">
                        <p className="leading-relaxed">
                          Costs related to 'where' you operate your business, such as rent, utilities, property taxes, insurance, and maintenance.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Salaries & Benefits (Fixed) */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-5">
                          Salaries & Benefits (Fixed)
                        </label>
                        <button
                          onClick={() => setShowSalariesInfo(!showSalariesInfo)}
                          className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                          title="Information about Salaries & Benefits"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative w-40">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="text"
                          value={formatNumber(salariesBenefits)}
                          onChange={(e) => handleNumberInput(e.target.value, setSalariesBenefits)}
                          onFocus={(e) => e.target.select()}
                          className="w-full pl-7 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-sm font-medium text-right"
                        />
                      </div>
                    </div>
                    {showSalariesInfo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2 text-xs text-slate-700">
                        <p className="leading-relaxed">
                          Employee costs that stay the same regardless of sales, such as salaries, benefits, payroll taxes, and insurance.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sales & Marketing (Fixed) */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-5">
                          Sales & Marketing (Fixed)
                        </label>
                        <button
                          onClick={() => setShowSalesMarketingInfo(!showSalesMarketingInfo)}
                          className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                          title="Information about Sales & Marketing"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative w-40">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="text"
                          value={formatNumber(salesMarketing)}
                          onChange={(e) => handleNumberInput(e.target.value, setSalesMarketing)}
                          onFocus={(e) => e.target.select()}
                          className="w-full pl-7 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-sm font-medium text-right"
                        />
                      </div>
                    </div>
                    {showSalesMarketingInfo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2 text-xs text-slate-700">
                        <p className="leading-relaxed">
                          Ongoing sales and marketing costs that stay consistent, such as software subscriptions, retainers, fixed advertising, and sales support expenses.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* General & Administrative */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-5">
                          General & Administrative
                        </label>
                        <button
                          onClick={() => setShowGeneralAdminInfo(!showGeneralAdminInfo)}
                          className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                          title="Information about General & Administrative"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative w-40">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="text"
                          value={formatNumber(generalAdmin)}
                          onChange={(e) => handleNumberInput(e.target.value, setGeneralAdmin)}
                          onFocus={(e) => e.target.select()}
                          className="w-full pl-7 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-sm font-medium text-right"
                        />
                      </div>
                    </div>
                    {showGeneralAdminInfo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2 text-xs text-slate-700">
                        <p className="leading-relaxed">
                          Day‑to‑day business overhead, such as office supplies, software, legal, accounting, and other administrative costs.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtotal: Fixed Expenses */}
                <div className="border-t-2 border-slate-300 pt-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-600">Subtotal: Fixed Expenses</div>
                    <div className="text-lg font-bold text-slate-900">
                      {formatCurrency(fixedCosts)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Desired Profit */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-[#1e5ba8]">
                    <span className="text-xl font-bold">Step 2</span>
                    <span className="text-lg font-semibold"> - Desired Profit</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Enter your Desired Profit: <span className="font-normal">(optional)</span>
                    </h4>
                    <button
                      onClick={() => setShowDesiredProfitInfo(!showDesiredProfitInfo)}
                      className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                      title="Information about Desired Profit"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative w-40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                    <input
                      type="text"
                      value={formatNumber(desiredProfit)}
                      onChange={(e) => handleNumberInput(e.target.value, setDesiredProfit)}
                      onFocus={(e) => e.target.select()}
                      className="w-full pl-7 pr-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-medium text-right"
                    />
                  </div>
                </div>
                {showDesiredProfitInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 text-xs text-slate-700">
                    <p className="leading-relaxed">
                      The amount of profit you want the business to generate after covering all expenses.
                    </p>
                  </div>
                )}

                {/* Total Required Dollars */}
                <div className="border-t-2 border-blue-400 pt-3 mt-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-300 flex items-center justify-between">
                    <div className="text-sm font-bold text-blue-900">Total Required Dollars (Fixed + Profit)</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(totalDollars)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Step 3 & Step 4 */}
            <div className="space-y-6 flex flex-col">
              {/* Step 3 - Contribution Margin */}
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="text-center mb-3">
                  <div className="flex items-center gap-2 justify-center text-[#1e5ba8]">
                    <span className="text-xl font-bold">Step 3</span>
                    <span className="text-lg font-semibold"> - calculate your Contribution Margin</span>
                    <button
                      onClick={() => setShowCMInfo(!showCMInfo)}
                      className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors flex-shrink-0"
                      title="Information about Contribution Margin"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {showCMInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-slate-700">
                    <p className="leading-relaxed">
                      Know how much of each Revenue dollar remains, after paying the COGS and variable operating costs.
                      Your contribution margin of <strong>{contributionMarginPercent}%</strong> means that for every dollar of Revenue, {contributionMarginPercent} cents remains and can go toward covering Fixed costs and generating Profit (Step 1).
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <div className="space-y-4 w-[200px]">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Cost Of Goods Sold %
                        </label>
                        <button
                          onClick={() => setShowCogsInfo(!showCogsInfo)}
                          className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                          title="Information about COGS"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      {showCogsInfo && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2 text-xs text-slate-700">
                          <p className="leading-relaxed">
                            COGS (Cost of Goods Sold) is the total direct costs of producing or purchasing the goods a company sells during a specific period, including materials and labor. It excludes indirect expenses like marketing or overhead.
                          </p>
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="number"
                          value={cogsPercent}
                          onChange={(e) => setCogsPercent(Number(e.target.value) || 0)}
                          onFocus={(e) => e.target.select()}
                          className="w-full pr-7 pl-2 py-1.5 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-sm font-medium"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Variable Operating Costs %
                        </label>
                        <button
                          onClick={() => setShowVariableOpCostsInfo(!showVariableOpCostsInfo)}
                          className="text-[#1e5ba8] hover:text-[#174a8c] transition-colors"
                          title="Information about Variable Operating Costs"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      {showVariableOpCostsInfo && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2 text-xs text-slate-700">
                          <p className="leading-relaxed">
                            Variable Operating Costs are expenses that change with revenue volume, such as shipping or commissions. They differ from COGS because COGS covers the direct cost of producing goods, while variable operating costs relate to selling and delivering those goods.
                          </p>
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="number"
                          value={variableOpCostsPercent}
                          onChange={(e) => setVariableOpCostsPercent(Number(e.target.value) || 0)}
                          onFocus={(e) => e.target.select()}
                          className="w-full pr-7 pl-2 py-1.5 border-2 border-slate-200 rounded-lg focus:border-[#1e5ba8] focus:outline-none text-sm font-medium"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 w-64">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Breakdown:</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-xs pb-1.5 border-b border-slate-300">
                        <span className="text-slate-600 pb-0.5">Total Revenue</span>
                        <div className="flex gap-3">
                          <div className="w-12 text-right">
                            <div className="text-[10px] font-semibold text-slate-500">$</div>
                            <span className="font-semibold text-slate-900">$100</span>
                          </div>
                          <div className="w-10 text-right">
                            <div className="text-[10px] font-semibold text-slate-500">%</div>
                            <span className="font-semibold text-slate-900">100%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">COGS</span>
                        <div className="flex gap-3">
                          <div className="w-12 text-right">
                            <span className="font-semibold text-red-600">-${cogsPercent}</span>
                          </div>
                          <div className="w-10 text-right">
                            <span className="font-semibold text-red-600">-{cogsPercent}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-300">
                        <span className="font-semibold text-slate-700">GP Margin</span>
                        <div className="flex gap-3">
                          <div className="w-12 text-right">
                            <span className="font-bold text-slate-900">${gpMarginPercent}</span>
                          </div>
                          <div className="w-10 text-right">
                            <span className="font-bold text-slate-900">{gpMarginPercent}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">Variable Op Costs</span>
                        <div className="flex gap-3">
                          <div className="w-12 text-right">
                            <span className="font-semibold text-red-600">-${variableOpCostsPercent}</span>
                          </div>
                          <div className="w-10 text-right">
                            <span className="font-semibold text-red-600">-{variableOpCostsPercent}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t-2 border-blue-400 bg-blue-100 -mx-3 px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-bold text-blue-900">Contribution Margin</span>
                        <div className="flex gap-3">
                          <div className="w-12 text-right">
                            <span className="font-bold text-base text-blue-600">${contributionMarginPercent}</span>
                          </div>
                          <div className="w-10 text-right">
                            <span className="font-bold text-base text-blue-600">{contributionMarginPercent}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Required Revenue Goals */}
              <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col">
                <div className="text-center mb-3">
                  <div className="text-[#1e5ba8]">
                    <span className="text-xl font-bold">Step 4</span>
                    <span className="text-lg font-semibold"> - Required Revenue Goals</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600 mb-3">Break-Even Revenue Goal: (before any Profit)</div>
                    <div className="grid grid-cols-5 gap-2 text-center mb-2">
                      <div className="text-xs text-slate-600">(Total Dollars)</div>
                      <div></div>
                      <div className="text-xs text-slate-600">(CM%)</div>
                      <div></div>
                      <div className="text-xs text-slate-600">(Revenue required)</div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center items-center">
                      <span className="text-base font-bold text-slate-900">{formatCurrency(totalDollarsBreakEven)}</span>
                      <span className="text-sm text-slate-700">/</span>
                      <span className="text-base font-bold text-slate-900">{contributionMarginPercent}%</span>
                      <span className="text-sm text-slate-700">=</span>
                      <span className="text-base font-bold text-slate-900">{formatCurrency(breakEvenRevenueGoal)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 mb-3">Revenue Goal with Desired Profit:</div>
                    <div className="grid grid-cols-5 gap-2 text-center mb-2">
                      <div className="text-xs text-blue-600">(Total Dollars)</div>
                      <div></div>
                      <div className="text-xs text-blue-600">(CM%)</div>
                      <div></div>
                      <div className="text-xs text-blue-600">(Revenue required)</div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center items-center">
                      <span className="text-base font-bold text-blue-900">{formatCurrency(totalDollars)}</span>
                      <span className="text-sm text-blue-700">/</span>
                      <span className="text-base font-bold text-blue-900">{contributionMarginPercent}%</span>
                      <span className="text-sm text-blue-700">=</span>
                      <span className="text-base font-bold text-blue-900">{formatCurrency(revenueGoal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 Explanation Button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => setShowStep3Explanation(!showStep3Explanation)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Explanation and <span className="text-green-200">Proof</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStep3Explanation ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Combined Proof and Explanation Section */}
          {showStep3Explanation && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Proof */}
                <div>
                  <h3 className="text-xl font-bold text-center text-green-800 mb-4">
                    Break-Even Proof
                  </h3>
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-400">
                          <th className="py-2 text-left"></th>
                          <th className="py-2 text-right text-xs font-bold text-slate-700">No Profit</th>
                          <th className="py-2 text-right text-xs font-bold text-slate-700">With Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 font-semibold">Revenue</td>
                          <td className="text-right font-semibold py-2">
                            <span className="inline-block">${formatNumber(Math.round(breakEvenRevenueGoal))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">100%</span>
                          </td>
                          <td className="text-right font-semibold py-2">
                            <span className="inline-block">${formatNumber(Math.round(revenueGoal))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">100%</span>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-2">COGS</td>
                          <td className="text-right py-2">
                            <span className="inline-block">${formatNumber(Math.round(breakEvenRevenueGoal * (cogsPercent / 100)))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{cogsPercent}%</span>
                          </td>
                          <td className="text-right py-2">
                            <span className="inline-block">${formatNumber(Math.round(revenueGoal * (cogsPercent / 100)))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{cogsPercent}%</span>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-2 font-semibold">Gross Profit</td>
                          <td className="text-right font-semibold py-2">
                            <span className="inline-block">${formatNumber(Math.round(breakEvenRevenueGoal * (gpMarginPercent / 100)))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{gpMarginPercent}%</span>
                          </td>
                          <td className="text-right font-semibold py-2">
                            <span className="inline-block">${formatNumber(Math.round(revenueGoal * (gpMarginPercent / 100)))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{gpMarginPercent}%</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Variable Costs</td>
                          <td className="text-right py-2">
                            <span className="inline-block">${formatNumber(Math.round(breakEvenRevenueGoal * (variableOpCostsPercent / 100)))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{variableOpCostsPercent}%</span>
                          </td>
                          <td className="text-right py-2">
                            <span className="inline-block">${formatNumber(Math.round(revenueGoal * (variableOpCostsPercent / 100)))}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{variableOpCostsPercent}%</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold">Contribution Margin</td>
                          <td className="text-right font-semibold py-2">
                            <span className="inline-block">${formatNumber(Math.round(totalDollarsBreakEven))}</span> <span className="text-xs text-slate-500 font-semibold inline-block w-12 text-right">{contributionMarginPercent}%</span>
                          </td>
                          <td className="text-right font-semibold py-2">
                            <span className="inline-block">${formatNumber(Math.round(totalDollars))}</span> <span className="text-xs text-slate-500 font-semibold inline-block w-12 text-right">{contributionMarginPercent}%</span>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-2">Fixed Expenses</td>
                          <td className="text-right py-2">
                            <span className="inline-block">${formatNumber(fixedExpenses)}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{((fixedExpenses / breakEvenRevenueGoal) * 100).toFixed(1)}%</span>
                          </td>
                          <td className="text-right py-2">
                            <span className="inline-block">${formatNumber(fixedExpenses)}</span> <span className="text-xs text-slate-500 inline-block w-12 text-right">{((fixedExpenses / revenueGoal) * 100).toFixed(1)}%</span>
                          </td>
                        </tr>
                        <tr className="border-b-2 border-slate-400">
                          <td className="py-2 font-bold">Desired Profit</td>
                          <td className="text-right font-bold py-2">
                            <span className="inline-block">${formatNumber(0)}</span> <span className="text-xs text-slate-500 font-normal inline-block w-12 text-right">0%</span>
                          </td>
                          <td className="text-right font-bold py-2">
                            <span className="inline-block">${formatNumber(desiredProfit)}</span> <span className="text-xs text-slate-500 font-normal inline-block w-12 text-right">{((desiredProfit / revenueGoal) * 100).toFixed(1)}%</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Explanation */}
                <div>
                  <h3 className="text-xl font-bold text-center text-green-800 mb-4">
                    Explanation
                  </h3>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-300">
                    <p className="text-sm text-slate-800 leading-relaxed">
                      Nice work — your Revenue Goal comes out to <strong>{formatCurrency(revenueGoal)}</strong>.<br /><br />
                      That's the amount your business needs to bring in to generate <strong>{formatCurrency(totalDollars)}</strong> in Contribution Dollars.<br /><br />
                      That <strong>{formatCurrency(totalDollars)}</strong> covers <strong>{formatCurrency(fixedCosts)}</strong> in fixed expenses plus your <strong>{formatCurrency(desiredProfit)}</strong> profit goal.<br /><br />
                      This calculation assumes your business makes a <strong>{contributionMarginPercent}%</strong> Contribution Margin, which basically means you keep <strong>{contributionMarginPercent}</strong> cents of every dollar after covering COGS and your other variable costs. Those are the dollars that pay your fixed bills and create profit.<br /><br />
                      Take a look at the Break‑Even Proof on the left to see the numbers side‑by‑side.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
