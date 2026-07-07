import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Sparkles, Check, X, ArrowRight, ClipboardList, RefreshCw, FileText } from 'lucide-react';
import { GovScheme, EligibilityProfile, SchemeMatchResult } from '../types';

const INDIAN_STATES_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 
  'Lakshadweep', 'Puducherry'
];

const OCCUPATIONS = [
  'Farmer', 'Street Vendor', 'Small/Micro Business Owner', 'Unemployed', 
  'Daily Wage Labourer', 'Student', 'Private Salaried', 'Government Salaried', 
  'Retired', 'Others'
];

export default function SchemeDiscoveryHub() {
  const [schemes, setSchemes] = useState<GovScheme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState<GovScheme | null>(null);

  // Matcher state
  const [showMatcher, setShowMatcher] = useState(false);
  const [age, setAge] = useState<number | ''>('');
  const [state, setState] = useState('Delhi');
  const [income, setIncome] = useState<number | ''>('');
  const [occupation, setOccupation] = useState('Farmer');
  const [socialCategory, setSocialCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Any'>('Any');

  const [matcherLoading, setMatcherLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<SchemeMatchResult[]>([]);
  const [matcherError, setMatcherError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => {
        if (data.schemes) {
          setSchemes(data.schemes);
        }
      })
      .catch(err => console.error('Error fetching schemes:', err));
  }, []);

  const categories = ['All', ...Array.from(new Set(schemes.map(s => s.category)))];

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRunMatcher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (age === '' || income === '') return;

    setMatcherLoading(true);
    setMatcherError(null);
    setMatchResults([]);

    const profile: EligibilityProfile = {
      age: Number(age),
      state,
      annualIncome: Number(income),
      occupation,
      category: socialCategory,
      gender
    };

    try {
      const res = await fetch('/api/schemes/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!res.ok) {
        throw new Error('AI matcher failed to respond. Please make sure server is running and API keys are set.');
      }

      const data = await res.json();
      setMatchResults(data.results || []);
    } catch (err: any) {
      console.error(err);
      setMatcherError(err.message || 'Failed to analyze schemes. Verify your API secrets and try again.');
    } finally {
      setMatcherLoading(false);
    }
  };

  const handleResetMatcher = () => {
    setAge('');
    setIncome('');
    setOccupation('Farmer');
    setSocialCategory('General');
    setGender('Any');
    setMatchResults([]);
    setMatcherError(null);
  };

  return (
    <div id="schemes-discovery-hub" className="space-y-6">
      {/* Top Banner with Matcher Toggle */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="space-y-2 max-w-xl relative">
          <span className="text-emerald-400 text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED RECOMMENDATIONS
          </span>
          <h2 className="text-xl md:text-2xl font-sans font-bold tracking-tight">
            Discover Government Schemes Instantly
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Fill out your profile and let our GenAI matching engine compare criteria to recommend standard benefits, guidelines, and document structures.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMatcher(!showMatcher)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-semibold rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4.5 h-4.5" />
            {showMatcher ? 'View All Schemes' : 'Find My Eligible Schemes'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showMatcher ? (
          <motion.div
            key="matcher-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Matcher Form */}
            <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  Your Profile Details
                </h3>
                {matchResults.length > 0 && (
                  <button
                    onClick={handleResetMatcher}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                  >
                    Clear Form
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500">
                These credentials will be evaluated securely by our GenAI models against central scheme parameters.
              </p>

              <form onSubmit={handleRunMatcher} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Age (Years)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 28"
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Any">Any / Other</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">State or UT of Residence</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {INDIAN_STATES_UTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Annual Household Income (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={income}
                    onChange={(e) => setIncome(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 180000"
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Occupation</label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {OCCUPATIONS.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Social Category</label>
                    <select
                      value={socialCategory}
                      onChange={(e) => setSocialCategory(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={matcherLoading}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-sans font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {matcherLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Comparing parameters...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Evaluate My Eligibility
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-2 space-y-4 h-[550px] overflow-y-auto pr-2">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-slate-800 text-base">
                  Recommended Schemes For You
                </h3>
                {matchResults.length > 0 && (
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    {matchResults.length} Schemes Matched
                  </span>
                )}
              </div>

              {matcherLoading && (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-emerald-500 absolute animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-sans font-bold text-slate-800 text-sm">Evaluating Criteria...</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Our GenAI checks limits, categories, and documents to draft custom checklists.
                    </p>
                  </div>
                </div>
              )}

              {matcherError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-6 text-center space-y-2">
                  <X className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="text-sm font-sans font-medium">{matcherError}</p>
                </div>
              )}

              {!matcherLoading && matchResults.length === 0 && !matcherError && (
                <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center space-y-3 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h4 className="font-sans font-semibold text-slate-700 text-sm">No Active Evaluation</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Fill out the form on the left and trigger the evaluator to find central assistance packages matching your profile.
                  </p>
                </div>
              )}

              <AnimatePresence>
                {!matcherLoading && matchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {matchResults.map((result, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        key={result.schemeId}
                        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                      >
                        {/* Header info */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h4 className="font-sans font-bold text-slate-800 text-sm">{result.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">AI Match Confidence</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 self-start ${
                            result.matchPercentage >= 80 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            {result.matchPercentage}% Eligible
                          </div>
                        </div>

                        {/* Explanation Reason */}
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          <strong>AI Assessment:</strong> {result.reason}
                        </p>

                        {/* Checklist & Action items split */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* Checklist */}
                          <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-100">
                            <h5 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Condition Checklist
                            </h5>
                            <div className="space-y-1.5">
                              {result.eligibilityChecklist.map((chk, idx) => (
                                <div key={idx} className="flex gap-2 items-start text-xs text-slate-700">
                                  {chk.met ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                                  )}
                                  <span>{chk.condition}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Steps to apply */}
                          <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-100">
                            <h5 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Action Items / Next Steps
                            </h5>
                            <div className="space-y-2">
                              {result.actionSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-2 items-start text-xs text-slate-700">
                                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-mono text-[9px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="schemes-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search schemes by key terms, department, benefits..."
                  className="w-full text-sm outline-none bg-transparent"
                />
              </div>

              {/* Category Filter chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none self-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3.5 py-2 rounded-xl border font-sans font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme)}
                  className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-300 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {scheme.category}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        {scheme.state}
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-slate-800 text-sm leading-snug">
                      {scheme.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                      {scheme.objective}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-sans font-medium text-emerald-600 hover:text-emerald-700">
                    <span>View eligibility & documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheme Detail Dialog/Drawer Backdrop */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center absolute top-5 right-5 transition-all text-sm font-bold"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                    {selectedScheme.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedScheme.department}</span>
                </div>
                <h3 className="font-sans font-extrabold text-slate-800 text-base md:text-lg leading-tight">
                  {selectedScheme.name}
                </h3>
              </div>

              <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-600">
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm mb-1">Objective</h5>
                  <p>{selectedScheme.objective}</p>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-800 text-sm mb-1">Benefits Details</h5>
                  <p className="bg-emerald-50/50 border border-emerald-100/30 p-3 rounded-xl text-slate-700">
                    {selectedScheme.benefitDetails}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Eligibility Criteria
                    </h5>
                    <ul className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {selectedScheme.eligibilityRules.map((rule, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-600">
                          <span className="text-emerald-600 flex-shrink-0">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Required Documents
                    </h5>
                    <ul className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {selectedScheme.documentsRequired.map((doc, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-600">
                          <span className="text-emerald-600 flex-shrink-0">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                {selectedScheme.applicationLink && (
                  <a
                    href={selectedScheme.applicationLink}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-sans font-medium rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    Visit Application Portal
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
