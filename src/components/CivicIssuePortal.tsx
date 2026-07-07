import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ThumbsUp, PlusCircle, AlertCircle, Sparkles, Search, FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { CivicComplaint, ComplaintCategory, ComplaintSeverity } from '../types';

const INDIAN_STATES_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Puducherry'
];

export default function CivicIssuePortal() {
  const [complaints, setComplaints] = useState<CivicComplaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');
  
  // Submission Form State
  const [showReportForm, setShowReportForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('Delhi');
  const [citizenName, setCitizenName] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [expandedLetterId, setExpandedLetterId] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        if (data.complaints) {
          setComplaints(data.complaints);
        }
      })
      .catch(err => console.error('Error fetching complaints:', err));
  };

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          state,
          citizenName: citizenName.trim() || 'Anonymous'
        })
      });

      if (!res.ok) {
        throw new Error('Grievance submission failed');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setCitizenName('');
      setShowReportForm(false);
      
      // Re-fetch
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint. Verify server state and connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/complaints/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints(prev =>
          prev.map(c => (c.id === id ? { ...c, upvotes: data.upvotes } : c))
        );
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const handleDownloadLetter = (complaint: CivicComplaint, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!complaint.aiGeneratedLetter) return;

    const element = document.createElement('a');
    const file = new Blob([complaint.aiGeneratedLetter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${complaint.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_grievance_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categories = ['All', 'Roads & Potholes', 'Waste Management', 'Streetlights', 'Water Supply', 'Public Health', 'Others'];

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory === 'All' || c.category === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityStyle = (sev: ComplaintSeverity) => {
    switch (sev) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'In Review': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div id="civic-issue-portal-section" className="space-y-6">
      {/* Search Bar + Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl shadow-xs">
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search public reports, states, areas..."
            className="w-full text-sm outline-none bg-transparent text-slate-700"
          />
        </div>
        <button
          onClick={() => setShowReportForm(true)}
          className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-sans font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow transition-all"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Report Public Issue
        </button>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilterCategory(cat)}
            className={`text-xs px-3.5 py-2 rounded-xl border font-sans font-medium transition-all flex-shrink-0 ${
              selectedFilterCategory === cat
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Grievance Feeds */}
        <div className="lg:col-span-2 space-y-5 h-[650px] overflow-y-auto pr-2">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-semibold text-slate-700 text-sm">No Grievances Found</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                There are no complaints matching your search parameters. Try adjusting filters or file a new report!
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all space-y-4"
              >
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                      {complaint.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border rounded-md ${getSeverityStyle(complaint.severity)}`}>
                      {complaint.severity} Priority
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border rounded-md ${getStatusStyle(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Complaint Title and Details */}
                <div className="space-y-1.5">
                  <h4 className="font-sans font-bold text-slate-800 text-base">
                    {complaint.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {complaint.description}
                  </p>
                </div>

                {/* Location Map Pin Block */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{complaint.location}, {complaint.state}</span>
                </div>

                {/* Tag Cloud */}
                {complaint.aiGrievanceTags && complaint.aiGrievanceTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {complaint.aiGrievanceTags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Collapsible Action Letter Area */}
                {complaint.aiGeneratedLetter && (
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedLetterId(expandedLetterId === complaint.id ? null : complaint.id)}
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 transition-all text-xs font-sans font-semibold text-slate-700 flex justify-between items-center"
                    >
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        AI-Drafted Grievance Letter
                      </span>
                      <span className="text-emerald-700 font-mono text-[10px]">
                        {expandedLetterId === complaint.id ? 'Hide Draft' : 'Review Draft'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {expandedLetterId === complaint.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-50/50 p-4 border-t border-slate-100 text-xs font-sans text-slate-700 space-y-3"
                        >
                          <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-xs font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {complaint.aiGeneratedLetter}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => handleDownloadLetter(complaint, e)}
                              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 shadow transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download Letter (.txt)
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Resolution / Response block */}
                {complaint.officialResponse && (
                  <div className="bg-emerald-50/40 border border-emerald-100/40 p-4 rounded-xl flex gap-3 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">Official Update</span>
                      <p className="text-xs text-slate-700 font-sans leading-relaxed">{complaint.officialResponse}</p>
                    </div>
                  </div>
                )}

                {/* Actions & Upvote */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-sans">
                    By <strong>{complaint.citizenName}</strong>
                  </span>
                  <button
                    onClick={(e) => handleUpvote(complaint.id, e)}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-sans font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upvote Issue ({complaint.upvotes})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Informative Side-card explaining legal backing */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-xs space-y-4">
            <h4 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
              Grievance Advocacy Drafts
            </h4>
            <div className="space-y-3 font-sans text-xs leading-relaxed text-slate-500">
              <p>
                Every reported issue gets parsed by Citizen Sevak’s municipal policy model.
              </p>
              <div className="bg-white border border-slate-200/50 p-3 rounded-xl flex gap-3 items-start">
                <FileText className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-600">
                  <strong>Right to motorable roads:</strong> Under Art 21 of the Constitution, municipal corporations have statutory duties to maintain secure public corridors.
                </p>
              </div>
              <div className="bg-white border border-slate-200/50 p-3 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-600">
                  <strong>Civic Accountability:</strong> Upvoted grievances generate stronger prioritization tags, indicating collective neighbourhood urgency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Form Popup/Backdrop Dialog */}
      <AnimatePresence>
        {showReportForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-xl relative"
            >
              <button
                onClick={() => setShowReportForm(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center absolute top-5 right-5 transition-all text-xs font-bold"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="text-emerald-600 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Analyzed Complaint
                </span>
                <h3 className="font-sans font-extrabold text-slate-800 text-base md:text-lg">
                  Report a Civic Issue
                </h3>
                <p className="text-xs text-slate-400">
                  Our GenAI companion automatically categorizes, prioritizes, and drafts a formal legal-redress letters to your ward officer.
                </p>
              </div>

              <form onSubmit={handleSubmitGrievance} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Grievance Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Streetlight Failure on Lane 3"
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Description</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail. E.g. 'Three streetlights are broken for 5 days. It is dark and unsafe for children...'"
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pin Location / Area</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Karol Bagh Gate"
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">State / UT</label>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Reporting Citizen Name (Optional)</label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar (or leave blank to report anonymously)"
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-sans font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Analyzing and Drafting Letter with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      File Grievance with AI Letter
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
