import React, { useState, useRef, useEffect } from 'react';
import { Activity, CheckCircle2, Map, Locate, MapPin, ShieldAlert, Phone, UserCheck, CalendarDays, Camera, Edit3 } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';

export default function Profile({ 
  navigateTo, 
  t, 
  userStats, 
  isTracking, 
  trackingLocation, 
  startTracking, 
  startSos,
  userName,
  contact,
  setUserName,
  setContact
}) {
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('mhc_profile_pic') || "/loading-girl.png");
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile State
  const [age, setAge] = useState(() => localStorage.getItem('mhc_age') || '');
  const [lmpDate, setLmpDate] = useState(() => localStorage.getItem('mhc_lmp') || '');
  
  // Local temporary edit state
  const [editName, setEditName] = useState(userName || '');
  const [editContact, setEditContact] = useState(contact || '');
  const [editAge, setEditAge] = useState(age);
  const [editLmp, setEditLmp] = useState(lmpDate);

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('mhc_profile_pic', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    if (contact) {
      fetch(`${API_BASE}/user/${contact}`)
        .then(res => res.json())
        .then(data => {
            if (data._id) {
               setAge(data.age || '');
               setLmpDate(data.lmpDate ? data.lmpDate.split('T')[0] : '');
               setEditAge(data.age || '');
               setEditLmp(data.lmpDate ? data.lmpDate.split('T')[0] : '');
            }
        }).catch(e => console.log("Offline mode profile"));
    }
  }, [contact]);

  const handleSaveProfile = async () => {
    localStorage.setItem('mhc_user', editName);
    localStorage.setItem('mhc_contact', editContact);
    localStorage.setItem('mhc_age', editAge);
    localStorage.setItem('mhc_lmp', editLmp);
    
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          contact: editContact,
          age: editAge,
          lmpDate: editLmp,
          profilePic
        })
      });
      const data = await res.json();
      if (data.user?._id) {
        localStorage.setItem('mhc_user_id', data.user._id);
      }
    } catch (e) {
      console.log("Profile update backend failed, saved locally.");
    }

    if (setUserName) setUserName(editName);
    if (setContact) setContact(editContact);
    setAge(editAge);
    setLmpDate(editLmp);
    
    setIsEditing(false);
  };

  // Dynamic Pregnancy Calculation based on LMP
  let calcDays = 0, calcWeeks = userStats.week, calcMonths = Math.floor(userStats.week / 4.3);
  let hasValidLMP = false;
  
  if (lmpDate) {
    const lmp = new Date(lmpDate);
    const today = new Date();
    const diffTime = Math.abs(today - lmp);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Validate that LMP isn't more than 42 weeks ago
    if (diffDays >= 0 && diffDays <= 294) {
       calcDays = diffDays;
       calcWeeks = Math.floor(calcDays / 7);
       calcMonths = Math.floor(calcDays / 30.4368); // Average month length
       hasValidLMP = true;
    }
  }

  return (
    <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title="My Profile" bgColor="bg-slate-50">
      <div className="p-5 animate-in slide-in-from-right-4 duration-300">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-4">
          <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-rose-400 to-indigo-500 shadow-md">
                <img 
                    src={profilePic} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover rounded-full border-2 border-white"
                />
            </div>
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white mb-1" />
              <span className="text-[8px] text-white font-black uppercase tracking-widest">Change</span>
            </div>

            <div className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 size={12} className="text-white" />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="flex items-center justify-between w-full mt-4">
            <div>
              <h2 className="text-xl font-black text-slate-800">{userName || 'Registered User'}</h2>
              <p className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full mt-2 uppercase tracking-widest inline-block">Active Member</p>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-xs font-black bg-slate-100 text-slate-500 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors active:scale-95">Edit</button>
            )}
          </div>
        </div>

        {isEditing ? (
          /* EDIT PROFILE FORM */
          <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Edit Profile Details</h3>
             
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Full Name</label>
                  <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="e.g. Meena" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Emergency Phone</label>
                  <input type="tel" value={editContact} onChange={e=>setEditContact(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="e.g. 9876543210" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Age</label>
                    <input type="number" value={editAge} onChange={e=>setEditAge(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="e.g. 26" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">LMP Date</label>
                    <input type="date" value={editLmp} onChange={e=>setEditLmp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
                  </div>
                </div>
             </div>
             
             <div className="flex space-x-3 mt-6">
               <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl active:scale-95 transition-transform text-xs">Cancel</button>
               <button onClick={handleSaveProfile} className="flex-1 bg-indigo-600 text-white shadow-xl shadow-indigo-200 font-black py-4 rounded-2xl active:scale-95 transition-transform text-xs flex items-center justify-center">
                  <CheckCircle2 size={16} className="mr-2"/> Save Profile
               </button>
             </div>
          </div>
        ) : (
          /* USER DETAILS DISPLAY */
          <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Details</h3>
                  <button onClick={() => setIsEditing(true)} className="flex items-center text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg active:scale-95 transition-colors">
                      <Edit3 size={12} className="mr-1" /> Edit
                  </button>
              </div>
              <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                          <Phone size={18} />
                      </div>
                      <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Emergency Phone</p>
                          <p className="font-bold text-slate-800 text-sm">{contact ? `+91 ${contact}` : 'Not Set'}</p>
                      </div>
                  </div>

                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                          <CalendarDays size={18} />
                      </div>
                      <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Mother's Age</p>
                          <p className="font-bold text-slate-800 text-sm">{age ? `${age} Years` : 'Not Set'}</p>
                      </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-rose-50 p-3 rounded-2xl border border-rose-100">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                          <Activity size={18} />
                      </div>
                      <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] uppercase font-bold text-rose-400">Pregnancy Stage</p>
                            {hasValidLMP && <span className="bg-white text-rose-500 text-[9px] px-2 py-0.5 rounded-full font-black shadow-sm">Auto-Calculated</span>}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-white p-2 rounded-xl text-center shadow-sm">
                              <p className="text-xl font-black text-rose-600">{calcDays}</p>
                              <p className="text-[9px] uppercase font-bold text-rose-400">Days</p>
                            </div>
                            <div className="bg-white p-2 rounded-xl text-center shadow-sm border border-rose-200">
                              <p className="text-xl font-black text-rose-600">{calcWeeks}</p>
                              <p className="text-[9px] uppercase font-bold text-rose-400">Weeks</p>
                            </div>
                            <div className="bg-white p-2 rounded-xl text-center shadow-sm">
                              <p className="text-xl font-black text-rose-600">{calcMonths}</p>
                              <p className="text-[9px] uppercase font-bold text-rose-400">Months</p>
                            </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                          <UserCheck size={18} />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                          <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400">Current Risk Level</p>
                              <p className="font-bold text-slate-800 text-sm">{userStats.risk}</p>
                          </div>
                          <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">Safe</span>
                      </div>
                  </div>
              </div>
          </div>
        )}

        {/* Location Tracking Box */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 mb-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <Map size={100} />
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <h3 className="text-sm font-black text-slate-800 self-start w-full">Live Location Access</h3>
            {!trackingLocation && (
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center relative shadow-sm border border-indigo-100/30">
                <div className={`absolute inset-0 bg-indigo-400/20 rounded-3xl ${isTracking ? 'animate-ping' : ''} scale-75`}></div>
                {isTracking ? <Locate size={32} className="text-indigo-500 animate-pulse" /> : <MapPin size={32} className="text-indigo-500" />}
              </div>
            )}
            
            <div className="text-center min-h-[60px]">
              {isTracking ? (
                <p className="text-indigo-500 font-black animate-pulse uppercase tracking-[3px] text-xs mt-2">Connecting to GPS...</p>
              ) : trackingLocation ? (
                <div className="space-y-3 w-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm w-full relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest text-left flex items-center mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-2"></span> Live Secured
                        </p>
                        <p className="text-slate-800 font-bold text-xs leading-tight text-left pr-4">{trackingLocation.addr}</p>
                      </div>
                      <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    
                    {/* Embedded Secure Map (LEAFLET) */}
                    <div className="w-full h-40 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative mb-3">
                      <div className="absolute inset-0 bg-slate-100 animate-pulse -z-10"></div>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0" 
                        className="border-0 m-0 p-0 shadow-sm pointer-events-auto"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(trackingLocation.lng) - 0.01},${Number(trackingLocation.lat) - 0.01},${Number(trackingLocation.lng) + 0.01},${Number(trackingLocation.lat) + 0.01}&layer=mapnik&marker=${trackingLocation.lat},${trackingLocation.lng}`}
                        title="Live Leaflet Map"
                      ></iframe>
                    </div>

                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${trackingLocation.lat},${trackingLocation.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl flex items-center justify-center hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100/50"
                    >
                      <MapPin size={12} className="mr-1.5" /> Navigate to Location
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-800 font-bold mb-1 text-sm">Location Services Active</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black max-w-[200px] leading-relaxed mx-auto">Press 'Track Location' to ping your current coordinates securely.</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={startTracking} className={`${isTracking ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md'} font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs border border-indigo-100/50`}>
              <Locate size={16} />
              <span>{isTracking ? 'Tracking...' : 'Track Location'}</span>
            </button>
            <button onClick={startSos} className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:shadow-md border border-rose-100/50 font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs">
              <ShieldAlert size={16} />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

      </div>
    </FullScreenOverlay>
  );
}
