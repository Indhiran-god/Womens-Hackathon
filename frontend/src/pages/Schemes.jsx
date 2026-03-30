import React, { useState } from 'react';
import { Award, BadgeIndianRupee, Baby, Heart, FileText, CheckCircle2, ChevronDown, ChevronUp, Send, X } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';

const SCHEMES = [
  {
    id: 1,
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    nameTA: 'பிரதான் மந்திரி மாத்ரு வந்தனா யோஜனா',
    amount: '₹5,000',
    icon: <BadgeIndianRupee size={20} />,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    who: 'First-time pregnant women (19+ years)',
    docs: ['Aadhaar Card', 'Bank Passbook', 'MCP Card', 'LMP Certificate'],
    installments: [
      { stage: 'After Registration (LMP)', amount: '₹1,000' },
      { stage: 'After 6 months of pregnancy', amount: '₹2,000' },
      { stage: 'After child birth + vaccination', amount: '₹2,000' },
    ],
    details: 'Cash incentive to pregnant and lactating mothers for first living child. Amount directly transferred to bank account (DBT).'
  },
  {
    id: 2,
    name: 'Dr. Muthulakshmi Maternity Benefit Scheme',
    nameTA: 'டாக்டர் முத்துலட்சுமி மகப்பேறு நிதி உதவி',
    amount: '₹18,000',
    icon: <Heart size={20} />,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    who: 'Poor pregnant women in Tamil Nadu (2 deliveries)',
    docs: ['Aadhaar Card', 'Ration Card', 'Bank Passbook', 'MCP Card', 'Income Certificate'],
    installments: [
      { stage: '1st Installment (7th month)', amount: '₹6,000' },
      { stage: '2nd Installment (after delivery)', amount: '₹6,000' },
      { stage: '3rd Installment (child 6 months)', amount: '₹6,000' },
    ],
    details: 'Tamil Nadu government scheme for economically weaker pregnant women. Provides ₹18,000 in 3 installments along with nutritious food kit.'
  },
  {
    id: 3,
    name: 'Janani Suraksha Yojana (JSY)',
    nameTA: 'ஜனனி சுரக்ஷா யோஜனா',
    amount: '₹1,400',
    icon: <Baby size={20} />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    who: 'All pregnant women delivering in government hospitals',
    docs: ['Aadhaar Card', 'BPL Card', 'JSY Card', 'Delivery Certificate'],
    installments: [
      { stage: 'Rural Area (after delivery)', amount: '₹1,400' },
      { stage: 'Urban Area (after delivery)', amount: '₹1,000' },
    ],
    details: 'Central government scheme to promote institutional delivery. Cash assistance given to mothers delivering in government or accredited private hospitals.'
  },
  {
    id: 4,
    name: 'Tamil Nadu Chief Minister Comprehensive Health Insurance (CMCHIS)',
    nameTA: 'முதலமைச்சர் விரிவான மருத்துவ காப்பீட்டு திட்டம்',
    amount: '₹5,00,000',
    icon: <Award size={20} />,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    who: 'All families with annual income below ₹72,000',
    docs: ['Aadhaar Card', 'Ration Card', 'Family Card', 'Income Certificate'],
    installments: [
      { stage: 'Cashless treatment at network hospitals', amount: 'Up to ₹5,00,000' },
    ],
    details: 'Covers maternity-related surgeries including C-section, high-risk pregnancies, NICU for newborns. Cashless treatment available at empanelled hospitals across Tamil Nadu.'
  },
  {
    id: 5,
    name: 'Cradle Baby Scheme (தொட்டில் குழந்தை திட்டம்)',
    nameTA: 'தொட்டில் குழந்தை திட்டம்',
    amount: 'Free Care',
    icon: <Baby size={20} />,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    who: 'Unwanted / abandoned newborn babies',
    docs: ['No documents needed'],
    installments: [
      { stage: 'Government takes full responsibility', amount: 'Free' },
    ],
    details: 'Tamil Nadu pioneered this scheme. Cradles placed in hospitals for mothers who cannot raise their child. Government provides free education, food, and shelter till the child becomes self-sufficient.'
  },
  {
    id: 6,
    name: 'Integrated Child Development Services (ICDS)',
    nameTA: 'ஒருங்கிணைந்த குழந்தை வளர்ச்சி திட்டம்',
    amount: 'Free Nutrition',
    icon: <Heart size={20} />,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    who: 'All pregnant & lactating women, children (0–6 years)',
    docs: ['Aadhaar Card', 'MCP Card'],
    installments: [
      { stage: 'Monthly nutritious food supply', amount: 'Free' },
      { stage: 'Health checkups & immunization', amount: 'Free' },
      { stage: 'Nutrition & health education', amount: 'Free' },
    ],
    details: 'Through Anganwadi centres, pregnant women receive free supplementary nutrition, health checkups, immunization, and nutrition education for mother and child.'
  }
];

export default function Schemes({ navigateTo, t, userName, contact }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(null);
  const [formData, setFormData] = useState({ name: userName || '', phone: contact || '', aadhaar: '', address: '', bank: '', ifsc: '' });
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchemes = SCHEMES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.nameTA && s.nameTA.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.amount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApply = (scheme) => {
    setShowApplyForm(scheme);
    setFormData(prev => ({ ...prev, name: userName || '', phone: contact || '' }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowApplyForm(null);
    }, 3000);
  };

  return (
    <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title="Govt Schemes" bgColor="bg-white">
      <div className="p-4 space-y-4">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-1">Government Schemes</h2>
          <p className="text-xs text-slate-400 font-bold">Free benefits for pregnant mothers & babies</p>
          <div className="flex items-center space-x-2 mt-3">
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">Tamil Nadu</span>
            <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">Central Govt</span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Heart size={16} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search Scheme or Amount (e.g. 18,000)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400/20 focus:bg-white transition-all placeholder:font-normal placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* SCHEMES LIST */}
        <div className="space-y-3 pb-20">
          {filteredSchemes.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-center space-y-3 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
               <Award size={40} className="text-slate-200" />
               <p className="text-sm font-bold text-slate-400">No schemes found matching your search.</p>
               <button onClick={() => setSearchTerm('')} className="text-xs font-black text-indigo-500 uppercase tracking-widest">Clear Search</button>
            </div>
          ) : (
            filteredSchemes.map(scheme => (
              <div key={scheme.id} className={`bg-white rounded-2xl border ${scheme.border} shadow-sm overflow-hidden transition-all`}>
              
              {/* Scheme Header */}
              <div className="p-4 cursor-pointer" onClick={() => toggleExpand(scheme.id)}>
                <div className="flex items-start space-x-3">
                  <div className={`${scheme.bg} ${scheme.color} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
                    {scheme.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-slate-800 leading-tight">{scheme.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{scheme.nameTA}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`${scheme.bg} ${scheme.color} text-xs font-black px-2.5 py-1 rounded-lg`}>{scheme.amount}</span>
                      {expandedId === scheme.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === scheme.id && (
                <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">About</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{scheme.details}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Who Can Apply</p>
                    <p className="text-xs text-slate-700 font-bold">{scheme.who}</p>
                  </div>

                  {/* Installments */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Benefit Breakdown</p>
                    <div className="space-y-2">
                      {scheme.installments.map((inst, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100">
                          <span className="text-[11px] text-slate-600 flex-1">{inst.stage}</span>
                          <span className={`text-xs font-black ${scheme.color} ml-2`}>{inst.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Required */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Documents Required</p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.docs.map((doc, idx) => (
                        <span key={idx} className="bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center">
                          <FileText size={10} className="mr-1 text-slate-400" /> {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => handleApply(scheme)} className={`w-full py-3.5 rounded-2xl ${scheme.bg} ${scheme.color} font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border ${scheme.border}`}>
                    <Send size={14} />
                    <span>Apply for this Scheme</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      </div>

      {/* APPLICATION FORM MODAL */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-6 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 max-h-[90vh] overflow-y-auto">
            
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-slate-800">Application Sent! ✅</h3>
                <p className="text-sm text-slate-500">Your application for <span className="font-bold text-slate-700">{showApplyForm.name}</span> has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Apply Now</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{showApplyForm.name}</p>
                  </div>
                  <button onClick={() => setShowApplyForm(null)} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="e.g. Meena" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Phone Number</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="e.g. 9876543210" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Aadhaar Number</label>
                    <input required type="text" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value.replace(/\D/g, '')})} maxLength={12} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="12-digit Aadhaar number" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Address</label>
                    <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors resize-none" placeholder="Full address with pincode" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Bank A/C No</label>
                      <input required type="text" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="A/C Number" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">IFSC Code</label>
                      <input required type="text" value={formData.ifsc} onChange={e => setFormData({...formData, ifsc: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="e.g. SBIN0001234" />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-2">
                    <p className="text-[10px] font-bold text-amber-600">⚠️ Note: Please carry original documents when visiting the nearest PHC / Anganwadi centre for verification.</p>
                  </div>

                  <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-2">
                    <Send size={16} />
                    <span>Submit Application</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </FullScreenOverlay>
  );
}
