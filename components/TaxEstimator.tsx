import React, { useState } from 'react';
import { Card } from './ui/Card';
import { TaxEstimate } from '../types';
import { getTaxEstimate } from '../services/geminiService';
import { Calculator, Info } from 'lucide-react';

interface TaxEstimatorProps {
  addPoints: (amount: number) => void;
}

export const TaxEstimator: React.FC<TaxEstimatorProps> = ({ addPoints }) => {
  const [income, setIncome] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [filingStatus, setFilingStatus] = useState<string>('Single');
  const [estimate, setEstimate] = useState<TaxEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!income || !location) return;

    setLoading(true);
    try {
      const result = await getTaxEstimate(parseFloat(income), location, filingStatus);
      setEstimate(result);
      addPoints(25);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Smart Tax Estimator" className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-slate-600 text-sm">
            Enter your details to get an AI-powered estimate of your tax liability.
            <br/><span className="text-xs italic text-slate-500">*Estimates are for planning purposes only and not official tax advice.</span>
          </p>

          <form onSubmit={handleEstimate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Gross Income ($)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location (State/Country)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. California, USA"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Filing Status</label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Married Filing Jointly">Married Filing Jointly</option>
                <option value="Head of Household">Head of Household</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Calculating...</>
              ) : (
                <>
                  <Calculator size={18} /> Calculate Estimate
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center">
          {!estimate ? (
            <div className="text-center text-slate-400">
              <Calculator size={48} className="mx-auto mb-4 opacity-20" />
              <p>Results will appear here</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center pb-6 border-b border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Estimated Annual Tax</p>
                <p className="text-3xl font-bold text-slate-900">${estimate.estimatedTax.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">Effective Rate</p>
                  <p className="text-xl font-semibold text-indigo-600">{(estimate.effectiveRate * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">Est. Bracket</p>
                  <p className="text-xl font-semibold text-indigo-600">{estimate.bracket}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                 <p className="text-xs text-green-700 uppercase mb-1">Est. Take Home Pay</p>
                 <p className="text-2xl font-bold text-green-800">${estimate.takeHomePay.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Info size={16} /> Quick Tips
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {estimate.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
