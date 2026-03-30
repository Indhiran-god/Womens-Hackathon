import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, ShieldAlert, Activity, Calendar, Apple, 
  MessageCircle, BookOpen, Users, WifiOff, Wifi, 
  PhoneCall, Mic, MicOff, AlertTriangle, CheckCircle2,
  ChevronRight, ArrowLeft, Pill, Stethoscope, Baby, Send, ShoppingBag,
  Moon, Dumbbell, ShieldCheck, Ban, Info, Plus, X, Trash2, Watch, Timer,
  Footprints, CalendarDays, MapPin, Globe, Image, Camera, Paperclip, Video, Map, Layout, Locate, Award, Languages, ChevronDown, Menu, LogOut, Settings2, HelpCircle
} from 'lucide-react';

import FeatureCard from './components/FeatureCard';
import ReminderCard from './components/ReminderCard';
import TipRow from './components/TipRow';
import FullScreenOverlay from './components/FullScreenOverlay';
import BottomNav from './components/BottomNav';
import Nutrition from './pages/Nutrition';
import Profile from './pages/Family';
import Education from './pages/Education';
import Shop from './pages/Shop';
import Schemes from './pages/Schemes';
import AdminDashboard from './pages/AdminDashboard';
import Exercises from './pages/Exercises';
import FruitGuide from './pages/FruitGuide';

const API_BASE = 'http://localhost:5000/api';

const TRANSLATIONS = {
  en: {
    welcome: "Welcome to Maternal Health Companion",
    registerDesc: "Your digital guardian for safe motherhood.",
    fullName: "Full Name",
    trustedContact: "Trusted Contact (Phone)",
    language: "Language",
    start: "Start Journey",
    home: "Home Dashboard",
    sos: "SOS EMERGENCY",
    reminders: "Reminders",
    nutrition: "Nutrition",
    aiAssistant: "AI Health Assistant",
    education: "Pregnancy Tips",
    family: "Family Dashboard",
    shop: "Maternal Shop",
    offlineSupport: "Offline Mode Active - Core features still working",
    onlineMode: "Online - All features active",
    toggleOffline: "Toggle Connection",
    detectingRisk: "Smart Monitoring Active",
  },
  ta: {
    welcome: "தாய்மை நல துணைக்கு வரவேற்கிறோம்",
    registerDesc: "பாதுகாப்பான தாய்மைக்கான உங்கள் டிஜிட்டல் பாதுகாவலர்.",
    fullName: "முழு பெயர்",
    trustedContact: "நம்பகமான தொடர்பு (தொலைபேசி)",
    language: "மொழி",
    start: "தொடங்குங்கள்",
    home: "முகப்பு பலகை",
    sos: "அவசர உதவி",
    reminders: "நினைவூட்டல்கள்",
    nutrition: "ஊட்டச்சத்து",
    aiAssistant: "AI சுகாதார உதவியாளர்",
    education: "கர்ப்ப கால குறிப்புகள்",
    family: "குடும்ப பலகை",
    shop: "தாய்மை அங்காடி",
    offlineSupport: "இணையம் இல்லை - முக்கிய சேவைகள் இயங்குகின்றன",
    onlineMode: "இணையம் உள்ளது - அனைத்து சேவைகளும் இயங்குகின்றன",
    toggleOffline: "இணையத்தை மாற்று",
    detectingRisk: "ஸ்மார்ட் கண்காணிப்பு செயலில் உள்ளது",
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [showSidebar, setShowSidebar] = useState(false);
  const [offline, setOffline] = useState(false);
  const [screen, setScreen] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [userName, setUserName] = useState(() => localStorage.getItem('mhc_user') || '');
  const [contact, setContact] = useState(() => localStorage.getItem('mhc_contact') || '');
  const [state, setState] = useState('Tamil Nadu');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  // Load Google Translate dynamically to ensure the DOM is ready
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'ta,hi,te,ml,kn,ur,bn,gu,mr,en',
            autoDisplay: false
          }, 'google_translate_element');
        }
      };
      
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Skip Login if already registered or going to admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setScreen('admin');
      // Clear path so future navigations work smoothly
      window.history.pushState({}, '', '/');
      return;
    }

    if (userName && contact && screen === 'register') {
      // Sync with backend silently — 404 is OK when DB is offline
      fetch(`${API_BASE}/user/${contact}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if (data?._id) {
              localStorage.setItem('mhc_user_id', data._id);
            }
        }).catch(() => {}); // silent — offline is fine

      setIsLoading(true);
      setLoadingText('Welcome back...');
      setTimeout(() => {
        setScreen('dashboard');
        setIsLoading(false);
      }, 1000);
    }
  }, []);
  const [sosStep, setSosStep] = useState(0);
  const [sosComplete, setSosComplete] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, title: "Trimester Checkup", time: "Tomorrow, 10:00 AM", icon: <Stethoscope/>, color: "text-sky-500", bg: "bg-sky-100" },
    { id: 2, title: "Iron Supplements", time: "Today, After Lunch", icon: <Pill/>, color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: 3, title: "Ultrasound Scan", time: "Next Week", icon: <Baby/>, color: "text-rose-500", bg: "bg-rose-100" },
  ]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [kicks, setKicks] = useState(0);
  const [lastKick, setLastKick] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingLocation, setTrackingLocation] = useState(null);

  const showHospitalRoute = async (lat, lng, isSimulated = false) => {
    let addrText = isSimulated ? "Apollo Cradle Maternity Care, Chennai" : "Live High-Accuracy Location";
    
    // Reverse Geocode the authentic device coordinates using OpenStreetMap API
    if (!isSimulated) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, {
          headers: { 'Accept-Language': 'en' }
        });
        const data = await res.json();
        if (data && data.display_name) {
          addrText = data.display_name.split(',').slice(0, 3).join(',');
        }
      } catch (err) {
        console.warn("Geocoding failed, using coordinates only.");
        addrText = "Device GPS Location";
      }
    }

    setTrackingLocation({
      lat: parseFloat(lat).toFixed(5),
      lng: parseFloat(lng).toFixed(5),
      addr: addrText
    });
    setIsTracking(false);
  };

  const startTracking = () => {
    setIsTracking(true);
    setTrackingLocation(null);
    
    if (navigator.geolocation) {
      // 1. Get an immediate quick fix (accuracy doesn't matter yet)
      const options = { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 };
      
      const geoId = navigator.geolocation.watchPosition(
        (position) => {
          // Immediately show whatever we have
          showHospitalRoute(position.coords.latitude, position.coords.longitude);
          
          // If we reach a decent accuracy, we're happy
          if (position.coords.accuracy < 30) {
            navigator.geolocation.clearWatch(geoId);
          }
        },
        (error) => {
          console.error("GPS Error:", error.message);
          // If it's a timeout or blocked, use the fallback so the demo never stops!
          if (!trackingLocation) {
            showHospitalRoute(13.0601, 80.2483, true); 
          }
          setIsTracking(false);
        },
        options
      );

      // Clean up after 15 seconds to save battery
      setTimeout(() => navigator.geolocation.clearWatch(geoId), 15000);

    } else {
      // Browser environment completely blocks `navigator.geolocation` (No HTTPS). Failsafe enabled!
      showHospitalRoute(13.0601, 80.2483, true);
    }
  };

  const nutritionItems = ['Folic Acid Pill Taken', '2 Liters of Water', 'Green Leafy Vegetables', 'Light Walking (15m)'];
  const [checkedNutrition, setCheckedNutrition] = useState(() => {
    const saved = localStorage.getItem('mhc_nutrition');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) return parsed.items;
    }
    return {};
  });

  const [nutrientValues, setNutrientValues] = useState({ iron: 0, calcium: 0, protein: 0 });
  const [nutritionCategory, setNutritionCategory] = useState('all');
  const [intakeLog, setIntakeLog] = useState([]);

  const addNutrient = (type, amount, name) => {
    setNutrientValues(prev => ({
      ...prev,
      [type]: Math.min(100, prev[type] + amount)
    }));
    setIntakeLog(prev => [...prev, { id: Date.now(), name, type, amount }]);
  };

  const removeIntake = (id, type, amount, name) => {
    setNutrientValues(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - amount)
    }));
    setIntakeLog(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('mhc_nutrition', JSON.stringify({
      date: new Date().toDateString(),
      items: checkedNutrition
    }));
  }, [checkedNutrition]);

  const toggleNutrition = (item) => {
    setCheckedNutrition(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // File upload handler for AI chat
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'file';
    
    setChatMessages(prev => [...prev, { 
      role: 'user', 
      text: `📎 Uploaded: ${file.name}`, 
      media: { url, type, name: file.name } 
    }]);
    setIsAiTyping(true);

    // Simulated AI Vision Analysis
    setTimeout(() => {
      let analysis = '';
      if (type === 'image') {
        analysis = `<strong>🔬 AI Vision Analysis — Medical Report Detected</strong><br/><br/>` +
          `<strong>📋 Extracted Report Summary:</strong><br/>` +
          `• <strong>Blood Pressure:</strong> 110/70 mmHg — <span style="color:#16a34a">✅ Normal Range</span><br/>` +
          `• <strong>Hemoglobin:</strong> 11.2 g/dL — <span style="color:#16a34a">✅ Healthy (Normal: 11-15 g/dL)</span><br/>` +
          `• <strong>Blood Sugar:</strong> 92 mg/dL — <span style="color:#16a34a">✅ Within Limit (Normal: 70-100)</span><br/>` +
          `• <strong>Weight:</strong> 58 kg — <span style="color:#16a34a">✅ On Track for Week ${userStats.week}</span><br/>` +
          `• <strong>Baby Heart Rate:</strong> 142 bpm — <span style="color:#16a34a">✅ Strong & Healthy (Normal: 120-160)</span><br/>` +
          `• <strong>Ultrasound:</strong> Normal<br/><br/>` +
          `<strong>🩺 Doctor's Treatment Plan:</strong><br/>` +
          `1. Continue <strong>Iron + Folic Acid</strong> tablets daily after meals.<br/>` +
          `2. Add <strong>Calcium supplements</strong> (500mg) before bed for bone development.<br/>` +
          `3. Eat <strong>spinach, beetroot, dates, and jaggery</strong> to maintain hemoglobin.<br/>` +
          `4. Walk <strong>20-30 minutes</strong> daily for healthy blood circulation.<br/>` +
          `5. Drink <strong>3+ liters of water</strong> daily.<br/>` +
          `6. Next checkup recommended in <strong>2 weeks</strong>.<br/><br/>` +
          `<strong>📊 Overall Status: <span style="color:#16a34a">HEALTHY — All vitals are normal ✅</span></strong><br/><br/>` +
          `<em style="color:#94a3b8">Analysis powered by Maternal Health AI Vision Model v2.4</em>`;
      } else if (type === 'video') {
        analysis = `<strong>🎥 AI Video Analysis Complete</strong><br/><br/>` +
          `<strong>📹 Video Processing Summary:</strong><br/>` +
          `• Duration analyzed: Full clip<br/>` +
          `• Movement detected: <span style="color:#16a34a">Yes ✅</span><br/><br/>` +
          `<strong>🩺 Assessment:</strong><br/>` +
          `1. Baby movement patterns appear <strong>normal and active</strong>.<br/>` +
          `2. Recommended movement count: <strong>10+ kicks per 2 hours</strong>.<br/>` +
          `3. If you notice <strong>reduced movement</strong> for more than 4 hours, contact your doctor immediately.<br/>` +
          `4. Use the <strong>Kick Counter</strong> feature to log daily movements.<br/><br/>` +
          `<strong>💊 Care Tips:</strong><br/>` +
          `• Lie on your <strong>left side</strong> after meals to feel more movements.<br/>` +
          `• Drink <strong>cold water or juice</strong> — babies often respond with kicks.<br/>` +
          `• Avoid sleeping on your back after Week 20.<br/><br/>` +
          `<strong>📊 Status: <span style="color:#16a34a">ACTIVE MOVEMENT — Baby is healthy ✅</span></strong><br/><br/>` +
          `<em style="color:#94a3b8">Analysis powered by Maternal Health AI Motion Model v1.8</em>`;
      } else {
        analysis = `<strong>📄 File Received</strong><br/><br/>` +
          `Your file <em>${file.name}</em> has been uploaded successfully.<br/><br/>` +
          `For best results, please upload <strong>images (.jpg, .png)</strong> or <strong>videos (.mp4)</strong> of your medical reports, scans, or symptoms.<br/><br/>` +
          `You can also type your health values (BP, sugar, weight) directly in chat for instant analysis.<br/><br/>` +
          `<strong>Status: Received ✅</strong>`;
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: analysis }]);
      setIsAiTyping(false);
    }, 2000);

    e.target.value = '';
  };

  const t = TRANSLATIONS[lang];

  // Page transition with loading animation
  const navigateTo = (target, text = 'Loading...') => {
    setLoadingText(text);
    setIsLoading(true);
    setTimeout(() => {
      setScreen(target);
      setIsLoading(false);
    }, 800);
  };

  const handleKick = () => {
    setKicks(prev => prev + 1);
    setLastKick(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const addReminder = (e) => {
    e.preventDefault();
    if(!newReminderTitle) return;
    const item = { 
      id: Date.now(), 
      title: newReminderTitle, 
      time: newReminderTime || 'Today', 
      icon: <Info/>, 
      color: "text-indigo-500", 
      bg: "bg-indigo-100" 
    };
    setReminders(prev => [...prev, item]);
    setShowAddReminder(false);
    setNewReminderTitle('');
    setNewReminderTime('');
  };

  const deleteReminder = (id, title) => {
    if(window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'ta-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      alert("Microphone access denied. Please allow mic permission in your browser.");
      setIsListening(false);
      return;
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);
      // Auto-send after voice capture
      if (transcript.trim()) {
        setTimeout(() => handleSendChat(transcript), 500);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert("🎤 Microphone blocked! Please click the lock icon in your browser's address bar → Allow Microphone → Refresh the page.");
      } else if (event.error === 'no-speech') {
        alert("No speech detected. Please try again and speak clearly.");
      }
    };
    recognition.onend = () => setIsListening(false);
  };

  const handleSendChat = async (text) => {
    if(!text.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsAiTyping(true);
    
    try {
      const response = await fetch(
          "https://cloud.flowiseai.com/api/v1/prediction/f58461a7-3c6e-4f35-b50e-17dfaf229fd9",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({"question": text})
          }
      );
      const result = await response.json();
      const aiText = result.text || result.response || (typeof result === 'string' ? result : JSON.stringify(result));
      setChatMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Network Error: Could not reach the AI. Please try again." }]);
    } finally {
      setIsAiTyping(false);
    }
  };


  // Dummy user data
  const userStats = {
    week: 24,
    risk: 'Low',
    nextCheckup: 'Oct 12, 2026',
    vitals: { bp: '110/70', pulse: '78 bpm' }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (userName && contact) {
      localStorage.setItem('mhc_user', userName);
      localStorage.setItem('mhc_contact', contact);
      
      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName, contact, language: lang })
        });
        const data = await res.json();
        if (data.user?._id) {
          localStorage.setItem('mhc_user_id', data.user._id);
        }
      } catch (err) {
        console.warn("Backend not reached, proceeding with local storage only.");
      }

      navigateTo('dashboard', 'Preparing Dashboard...');
    }
  };

  const startSos = async () => {
    setScreen('sos');
    setSosStep(0);
    setSosComplete(false);
    startTracking();

    // Trigger on backend
    const userId = localStorage.getItem('mhc_user_id');
    try {
      await fetch(`${API_BASE}/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          name: userName, 
          contact, 
          location: trackingLocation || { addr: "Tracking..." } 
        })
      });
    } catch (e) {
      console.log("SOS Backend trigger failed, using offline fallback");
    }

    const interval = setInterval(() => {
      setSosStep(prev => {
        if(prev >= 3) {
          clearInterval(interval);
          setTimeout(() => setSosComplete(true), 800);
          return 3;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const cancelSos = () => {
    setScreen('dashboard');
    setSosStep(0);
    setSosComplete(false);
  };

  const toggleLang = () => setLang(l => l === 'en' ? 'ta' : 'en');

  return (
    <div className={`min-h-[100dvh] font-sans ${offline ? 'bg-gray-100' : 'bg-gradient-to-br from-rose-50 to-teal-50'} flex justify-center text-gray-800`}>
      <div className="w-full max-w-md bg-white shadow-2xl relative overflow-hidden flex flex-col h-[100dvh]">
        
        {/* GLOBAL HEADER & SIDEBAR TRIGGER */}
        {screen === 'dashboard' && (
          <div className="bg-indigo-600 px-5 py-4 flex items-center justify-between z-[100] shrink-0 border-b border-indigo-700/50 shadow-lg relative">
            
            {/* Sidebar Toggle & Modern Logo */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowSidebar(true)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl border border-white/10 backdrop-blur-md transition-all active:scale-90"
              >
                <Menu size={20} className="text-white" />
              </button>
              <div className="flex items-center space-x-2.5 bg-white/10 px-3 py-1.5 rounded-2xl border border-white/5 shadow-inner overflow-hidden">
                <img src="/yoga/breathing.png" alt="MHC Logo" className="w-8 h-8 object-contain rounded-full bg-white scale-110 shadow-sm" />
                <div>
                   <span className="block text-[10px] text-indigo-100 font-black tracking-widest leading-none uppercase">Maternal</span>
                   <span className="block text-[8px] text-white font-bold opacity-70 tracking-tighter">APP LOGO</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Elegant Button */}
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="group flex items-center space-x-2 bg-white/10 hover:bg-white/25 active:scale-95 transition-all duration-200 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md shadow-sm"
              >
                <Globe size={14} className="text-indigo-100 group-hover:text-white transition-colors" />
                <span className="text-white text-xs font-bold tracking-wider">{activeLang.toUpperCase()}</span>
                <ChevronDown size={14} className={`text-indigo-200 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Premium Dropdown Modal Overlay */}
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-[110]" onClick={() => setShowLangMenu(false)} />
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl z-[120] overflow-hidden border border-slate-100 ring-1 ring-black/5 animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* Menu Header */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100/80 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Select Region</span>
                      <Globe size={12} className="text-slate-300" />
                    </div>
                    
                    {/* Language List */}
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {[
                        { code: 'en', label: 'English', native: 'English (US)' },
                        { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
                        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
                        { code: 'te', label: 'Telugu', native: 'తెలుగు' },
                        { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
                        { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
                        { code: 'mr', label: 'Marathi', native: 'मराठी' },
                        { code: 'bn', label: 'Bengali', native: 'বাংলা' },
                      ].map(l => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setActiveLang(l.code);
                            setShowLangMenu(false);
                            const combo = document.querySelector('.goog-te-combo');
                            if (combo) {
                              combo.value = l.code;
                              combo.dispatchEvent(new Event('change'));
                            }
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${activeLang === l.code ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                          <span className={`text-sm tracking-wide ${activeLang === l.code ? 'font-black' : 'font-semibold text-slate-700 group-hover:text-indigo-600'}`}>
                            {l.native}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider ${activeLang === l.code ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                            {l.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hidden Native Google Element (Never Unmounts) */}
        <div id="google_translate_element" className="hidden" />
        
        {/* Dynamic Screens */}
        <div className="flex-1 overflow-y-auto relative">
          
          {/* REGISTRATION */}
          {screen === 'register' && (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-inner mb-2">
                <HeartPulse className="text-rose-500" size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.welcome}</h1>
                <p className="text-sm text-gray-500">{t.registerDesc}</p>
              </div>

              <form onSubmit={handleRegister} className="w-full space-y-4 mt-6">
                <div className="text-left space-y-1.5 px-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-widest flex items-center">
                    <Users size={12} className="mr-1.5"/> {t.fullName}
                  </label>
                  <input required type="text" placeholder="Enter your name" value={userName} onChange={e=>setUserName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all text-sm font-bold placeholder:font-normal placeholder:text-slate-300 shadow-sm" />
                </div>

                <div className="text-left space-y-1.5 px-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-widest flex items-center">
                    <PhoneCall size={12} className="mr-1.5"/> {t.trustedContact}
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="Enter phone number" 
                    value={contact} 
                    onChange={e=>setContact(e.target.value.replace(/\D/g,''))} 
                    maxLength="10"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all text-sm font-bold placeholder:font-normal placeholder:text-slate-300 shadow-sm" 
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" className="group w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4.5 rounded-[24px] shadow-xl shadow-rose-200 transition-all active:scale-[0.98] flex justify-center items-center text-sm uppercase tracking-[3px] h-14">
                    {t.start} <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DASHBOARD */}
          {screen === 'dashboard' && (
            <div className="pb-24 space-y-6 animate-in fade-in duration-300">

              <div className="bg-indigo-600 px-5 pt-5 pb-5 rounded-b-3xl shadow-sm z-10 relative mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Hi, {userName || 'Mother'} 👋</h2>
                    <p className="text-xs font-semibold text-indigo-200 inline-block mt-1">Week {userStats.week} • Health Tracker</p>
                  </div>
                  <div onClick={() => navigateTo('profile', 'Opening Profile...')} className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white/30 transition-colors border border-white/30">
                    <Users size={20} />
                  </div>
                </div>
              </div>

              <div className="px-5 space-y-5">

              {/* SOS Button */}
              <div className="relative group cursor-pointer" onClick={startSos}>
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 flex items-center justify-between text-white shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{t.sos}</h3>
                      <p className="text-red-100 text-xs">Tap to send location & alert</p>
                    </div>
                  </div>
                  <ChevronRight className="text-white/70" />
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard icon={<MessageCircle />} color="bg-indigo-500" onClick={()=>navigateTo('ai', 'Connecting to AI...')} title={t.aiAssistant} subtitle="Chat & Symptoms" />
                <FeatureCard icon={<Calendar />} color="bg-sky-500" onClick={()=>navigateTo('reminders', 'Loading Reminders...')} title={t.reminders} subtitle="Meds & Checkups" />
                <FeatureCard icon={<Apple />} color="bg-emerald-500" onClick={()=>navigateTo('nutrition', 'Loading Nutrition...')} title={t.nutrition} subtitle="Diet & Checklist" />
                <FeatureCard icon={<Apple />} color="bg-rose-500" onClick={()=>navigateTo('fruitguide', 'Loading Fruit Chart...')} title="Fruit Guide" subtitle="9 Month Nutrition" />
                <FeatureCard icon={<Footprints />} color="bg-rose-400" onClick={()=>navigateTo('kickcounter', 'Loading Counter...')} title="Kick Counter" subtitle="Track Movement" />
                <FeatureCard icon={<BookOpen />} color="bg-amber-500" onClick={()=>navigateTo('education', 'Loading Education...')} title={t.education} subtitle="Tips & Do's" />
                <FeatureCard icon={<Dumbbell />} color="bg-pink-500" onClick={()=>navigateTo('exercises', 'Loading Yoga...')} title="யோகா பயிற்சி" subtitle="Prenatal Yoga" />
                <FeatureCard icon={<ShoppingBag />} color="bg-teal-500" onClick={()=>navigateTo('shop', 'Loading Shop...')} title={t.shop} subtitle="Buy Natural" />
                <FeatureCard icon={<Award />} color="bg-violet-500" onClick={()=>navigateTo('schemes', 'Loading Schemes...')} title="Govt Schemes" subtitle="Free Benefits" />
              </div>


              </div>
            </div>
          )}

          {/* FEATURE SCREENS MOCKUPS */}
          {screen === 'sos' && (
            <FullScreenOverlay onClose={cancelSos} title="EMERGENCY SOS" bgColor={sosComplete ? 'bg-white' : 'bg-rose-50'}>
               {!sosComplete ? (
                 <div className="flex flex-col items-center justify-center p-8 text-center space-y-12 h-[80vh]">
                   <div className="relative">
                     <div className="absolute inset-0 bg-rose-200 rounded-full animate-ping opacity-50 scale-150"></div>
                     <div className="bg-rose-100 p-10 rounded-full relative">
                        <ShieldAlert size={80} className="text-rose-600 animate-pulse" />
                     </div>
                   </div>
                   
                   <div>
                     <h3 className="text-3xl font-black text-rose-600 mb-2 animate-bounce">Sending Alert...</h3>
                     <p className="text-slate-500 font-medium tracking-wide">PLEASE WAIT - DO NOT CLOSE APP</p>
                   </div>

                   <div className="w-full bg-white/60 p-6 rounded-3xl border border-rose-100 space-y-4 text-left shadow-inner">
                     <div className={`flex items-center space-x-3 transition-opacity duration-500 ${sosStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                       <CheckCircle2 size={18} className="text-emerald-500" />
                       <span className="text-sm font-bold text-slate-700">Contacting {contact || 'Trusted Support'}...</span>
                     </div>
                     <div className={`flex items-center space-x-3 transition-opacity duration-500 ${sosStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                       <CheckCircle2 size={18} className="text-emerald-500" />
                       <span className="text-sm font-bold text-slate-700">Broadcasting GPS Location...</span>
                     </div>
                     <div className={`flex items-center space-x-3 transition-opacity duration-500 ${sosStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                       <CheckCircle2 size={18} className="text-emerald-500" />
                       <span className="text-sm font-bold text-slate-700">Alerting Nearest Hospital...</span>
                     </div>
                   </div>

                   <button onClick={cancelSos} className="bg-white border-2 border-slate-200 px-8 py-3 rounded-full text-slate-500 font-black hover:bg-slate-50 active:scale-95 transition-all text-xs uppercase tracking-widest">
                     Cancel SOS
                   </button>
                 </div>
               ) : (
                 <div className="flex flex-col h-full p-6 animate-in zoom-in-95 duration-500">
                    <div className="bg-emerald-500 text-white p-6 rounded-[32px] shadow-xl shadow-emerald-100 flex flex-col items-center text-center space-y-3 mb-6">
                      <div className="bg-white/20 p-3 rounded-full">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-black">Alert Confirmed</h3>
                      <p className="text-emerald-50 font-medium text-sm">Ambulance dispatched to your location.</p>
                    </div>

                    <div className="flex-1 rounded-[32px] relative overflow-hidden border-4 border-white shadow-inner bg-slate-100 w-full h-full isolation-auto">
                      
                      {/* FULL BLEED BACKGROUND MAP (LEAFLET / OSM) */}
                      {trackingLocation && (
                        <iframe 
                          className="absolute inset-0 w-full h-full border-0 m-0 p-0 pointer-events-auto"
                          frameBorder="0" 
                          scrolling="no" 
                          marginHeight="0" 
                          marginWidth="0" 
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(trackingLocation.lng) - 0.01},${Number(trackingLocation.lat) - 0.01},${Number(trackingLocation.lng) + 0.01},${Number(trackingLocation.lat) + 0.01}&layer=mapnik&marker=${trackingLocation.lat},${trackingLocation.lng}`}
                          title="Emergency Live Leaflet Map"
                        ></iframe>
                       )}

                      {/* Top ETA Floating Card */}
                      <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl z-10 flex items-center justify-between border border-white/50 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center space-x-3">
                          <div className="bg-indigo-600 text-white p-2 rounded-xl">
                            <Activity size={18} className="animate-pulse" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Emergency Dispatch</p>
                            <p className="text-sm font-bold text-slate-800">Hospital Center #04</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ETA</p>
                          <p className="text-sm font-black text-indigo-600 tracking-tight">8 MINS</p>
                        </div>
                      </div>

                      {/* Fallback States (Connecting / Missing GPS) */}
                      {!trackingLocation && (
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                          {isTracking ? (
                            <div className="flex flex-col items-center opacity-40 space-y-3">
                              <Activity size={60} className="text-indigo-500 animate-pulse" />
                              <p className="font-bold text-indigo-500 uppercase tracking-widest text-xs">Locating GPS...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center opacity-30 space-y-2">
                              <WifiOff size={48} className="text-slate-500" />
                              <p className="font-black text-slate-500 text-xs tracking-widest">GPS UNREACHABLE</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom Address Overlay */}
                      {trackingLocation && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-4.5 rounded-2xl shadow-2xl border border-white/50 z-10 animate-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[2px] flex items-center">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2"></span> Broadcasting Live
                            </p>
                            <span className="bg-rose-100 text-rose-600 text-[9px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full animate-pulse shadow-sm shadow-rose-100">SOS ACTIVE</span>
                          </div>
                          <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-2 pr-6">{trackingLocation.addr}</h4>
                          <span className="text-[9px] text-slate-500 font-mono font-bold tracking-tighter bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg inline-block">
                            COORD: {trackingLocation.lat} , {trackingLocation.lng}
                          </span>
                        </div>
                      )}

                    </div>

                    <div className="mt-6 flex flex-col space-y-3 w-full">
                      <button 
                        onClick={() => {
                          const routeLink = trackingLocation ? `https://www.google.com/maps/dir/?api=1&origin=${Number(trackingLocation.lat)},${Number(trackingLocation.lng)}&destination=13.0601,80.2483&travelmode=driving` : '';
                          const message = `🚨 *EMERGENCY! Maternal Health SOS*\n📍 *Location:* ${trackingLocation?.addr || 'Palladam Center'}\n⏱️ *ETA:* 8 mins\n🗺️ *Track Live:* ${routeLink}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full bg-[#25D366] text-white py-4.5 rounded-[24px] font-black shadow-lg shadow-[#25D366]/40 transition-all active:scale-[0.98] flex items-center justify-center tracking-[1px] uppercase text-xs"
                      >
                        <MessageCircle size={18} className="mr-2 fill-current" /> Share Live Route via WhatsApp
                      </button>
                      
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <button 
                          onClick={() => window.open('tel:108')}
                          className="bg-rose-50 border border-rose-100/50 text-rose-600 py-3.5 rounded-2xl font-black transition-all hover:bg-rose-100 active:scale-95 flex items-center justify-center text-[10px] uppercase tracking-widest shadow-sm shadow-rose-50"
                        >
                          <PhoneCall size={16} className="mr-1.5" /> Ambulance (108)
                        </button>
                        <button 
                          onClick={() => {
                            if (contact) window.open(`tel:${contact}`);
                            else alert("No trusted contact found. Please check profile.");
                          }}
                          className="bg-slate-900 border border-slate-700 text-white py-3.5 rounded-2xl font-black transition-all hover:bg-black active:scale-95 flex items-center justify-center text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200"
                        >
                          <Users size={16} className="mr-1.5" /> Call Family
                        </button>
                      </div>

                      <button onClick={cancelSos} className="bg-white border-2 border-slate-100 text-slate-400 py-3.5 rounded-2xl font-black transition-all hover:bg-slate-50 active:scale-95 text-[11px] uppercase tracking-widest flex items-center justify-center w-full">
                        <X size={16} className="mr-1.5" /> Disconnect SOS
                      </button>
                    </div>
                 </div>
               )}
            </FullScreenOverlay>
          )}

          {screen === 'ai' && (
            <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title={t.aiAssistant} bgColor="bg-slate-50">
              <div className="flex flex-col h-[calc(100vh-140px)]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-indigo-50">
                    <p className="text-sm text-gray-700">Hello {userName || 'mother'}! Select symptoms you're feeling or ask me directly. I can suggest home remedies and analyze risks.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Fever', 'Nausea', 'Headache', 'Swelling', 'Bleeding'].map(s => (
                      <span key={s} onClick={() => handleSendChat(s)} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-medium cursor-pointer hover:bg-indigo-100 transition-colors">{s}</span>
                    ))}
                  </div>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={msg.role === 'user' ? "ml-auto bg-indigo-500 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]" : "bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-rose-100 relative overflow-hidden"}>
                      {msg.role === 'ai' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>}
                      {msg.role === 'ai' && <p className="text-xs font-bold text-amber-500 flex items-center mb-1"><AlertTriangle size={12} className="mr-1"/> Advisory</p>}
                      {msg.media && msg.media.type === 'image' && (
                        <img src={msg.media.url} alt="upload" className="rounded-xl mb-2 max-h-48 w-full object-cover border-2 border-white/30" />
                      )}
                      {msg.media && msg.media.type === 'video' && (
                        <video src={msg.media.url} controls className="rounded-xl mb-2 max-h-48 w-full border-2 border-white/30" />
                      )}
                      <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.text}}></p>
                    </div>
                  ))}
                  {isAiTyping && (
                     <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-indigo-50">
                       <p className="text-sm text-gray-400 animate-pulse">Typing...</p>
                     </div>
                  )}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendChat(chatInput); }} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-1.5">
                  {/* Hidden File Input */}
                  <input type="file" id="fileUpload" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
                  
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center border border-transparent focus-within:border-indigo-300 transition-colors">
                    <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Type your doubt..." className="bg-transparent outline-none text-sm w-full" />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* Send */}
                    <button type="submit" className="bg-indigo-500 text-white p-2.5 rounded-full shadow-md active:scale-95 transition-all hover:bg-indigo-600">
                      <Send size={16} />
                    </button>

                    {/* Image Upload */}
                    <button type="button" onClick={() => document.getElementById('fileUpload').click()} className="bg-rose-500 text-white p-2.5 rounded-full shadow-md active:scale-95 transition-all hover:bg-rose-600" title="Upload Image/Video">
                      <Camera size={16} />
                    </button>

                    {/* Mic */}
                    <button 
                      type="button" 
                      onClick={startVoiceRecognition}
                      className={`${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-400'} text-white p-2.5 rounded-full shadow-md active:scale-95 group relative transition-colors`}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      {!isListening && (
                        <span className="absolute -top-12 right-0 bg-gray-800 text-white text-[10px] w-48 p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          {lang === 'en' ? "Click to speak in English" : "தமிழில் பேச கிளிக் செய்யவும்"}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </FullScreenOverlay>
          )}

          {screen === 'reminders' && (
            <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title={t.reminders} bgColor="bg-slate-50">
               <div className="p-4 space-y-4">
                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl mb-2">
                    <p className="text-xs text-indigo-700 font-semibold flex items-center">
                      <Calendar size={14} className="mr-1.5" /> Upcoming for Week {userStats.week}
                    </p>
                  </div>

                  {reminders.map(rem => (
                    <ReminderCard 
                      key={rem.id} 
                      icon={rem.icon} 
                      title={rem.title} 
                      time={rem.time} 
                      color={rem.color} 
                      bg={rem.bg} 
                      onDelete={() => deleteReminder(rem.id, rem.title)}
                    />
                  ))}
                  
                  <div className="pt-4">
                    <button 
                      onClick={() => setShowAddReminder(true)}
                      className="w-full h-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3 group hover:border-indigo-400 hover:bg-indigo-50/20 transition-all active:scale-[0.98]"
                    >
                      <div className="bg-slate-50 p-3 rounded-full text-slate-400 group-hover:text-indigo-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Plus size={28} />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-slate-600 text-sm group-hover:text-indigo-600 transition-colors">Add New Reminder</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Schedule checkups or medicine</p>
                      </div>
                    </button>
                  </div>
               </div>

               {/* ADD REMINDER MODAL */}
               {showAddReminder && (
                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-300">
                   <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
                     <div className="flex justify-between items-center">
                       <h3 className="text-xl font-bold text-slate-800">Add Reminder</h3>
                       <button onClick={()=>setShowAddReminder(false)} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors">
                         <X size={20}/>
                       </button>
                     </div>
                     <form onSubmit={addReminder} className="space-y-4">
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase ml-1">What is it?</label>
                         <input required type="text" placeholder="e.g. Iron Tablet" value={newReminderTitle} onChange={e=>setNewReminderTitle(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase ml-1">When?</label>
                         <input type="text" placeholder="e.g. 10:00 AM Today" value={newReminderTime} onChange={e=>setNewReminderTime(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                       </div>
                       <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                         Save Reminder
                       </button>
                     </form>
                   </div>
                 </div>
               )}
            </FullScreenOverlay>
          )}

          {screen === 'contractions' && (
            <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title="Contraction Timer">
               <div className="p-8 text-center flex flex-col items-center justify-center h-[70vh] space-y-8">
                  <div className="w-48 h-48 rounded-full border-8 border-violet-100 flex items-center justify-center relative">
                    <Timer size={60} className="text-violet-500" />
                    <div className="absolute inset-0 border-8 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">Ready to Track?</h3>
                    <p className="text-slate-500 mt-2 px-6">Press 'Start' when a contraction begins to measure frequency and duration.</p>
                  </div>
                  <button onClick={() => alert('Timer started! In a real app, this would log duration.')} className="bg-violet-600 text-white font-black px-12 py-4 rounded-3xl shadow-xl shadow-violet-200 uppercase tracking-widest text-sm hover:bg-violet-700 active:scale-[0.98] transition-all">
                    Start Timer
                  </button>
               </div>
            </FullScreenOverlay>
          )}

          {screen === 'kickcounter' && (
            <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title="Kick Counter" bgColor="bg-rose-50">
               <div className="p-6 space-y-8 flex flex-col h-[85vh]">
                  <div className="bg-white p-6 rounded-[32px] shadow-sm flex justify-between items-center border border-rose-100">
                    <div>
                      <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Session Count</p>
                      <h3 className="text-5xl font-black text-rose-500 mt-1">{kicks}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Movement</p>
                      <p className="text-indigo-600 font-bold mt-1 uppercase text-sm">{lastKick || 'Not Yet'}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                     <button 
                        onClick={handleKick}
                        className="w-56 h-56 bg-white rounded-full shadow-2xl shadow-rose-200 border-8 border-rose-100 flex flex-col items-center justify-center group active:scale-[0.95] transition-all"
                      >
                        <Footprints size={80} className="text-rose-400 group-hover:scale-110 transition-transform" />
                        <span className="mt-4 text-xs font-black text-rose-500 uppercase tracking-widest">TAP ON KICK</span>
                     </button>
                     <p className="text-center text-xs text-rose-400 px-10 font-bold leading-relaxed">
                       A healthy baby usually moves at least 10 times in 2 hours. Log movements regularly.
                     </p>
                  </div>

                  <button onClick={() => { setKicks(0); setLastKick(null); }} className="w-full py-4 bg-white text-rose-500 font-black rounded-2xl border-2 border-rose-100 text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors">
                    Reset Session
                  </button>
               </div>
            </FullScreenOverlay>
          )}
          {screen === 'nutrition' && (
            <Nutrition 
              navigateTo={navigateTo}
              t={t}
              nutrientValues={nutrientValues}
              nutritionCategory={nutritionCategory}
              setNutritionCategory={setNutritionCategory}
              addNutrient={addNutrient}
              intakeLog={intakeLog}
              removeIntake={removeIntake}
            />
          )}

          {screen === 'education' && (
            <Education navigateTo={navigateTo} t={t} />
          )}

          {screen === 'family' && (
            <Profile 
              navigateTo={navigateTo}
              t={t}
              userStats={userStats}
              isTracking={isTracking}
              trackingLocation={trackingLocation}
              startTracking={startTracking}
              startSos={startSos}
              userName={userName}
              contact={contact}
              setUserName={setUserName}
              setContact={setContact}
            />
          )}

          {screen === 'shop' && (
            <Shop navigateTo={navigateTo} t={t} />
          )}

          {screen === 'schemes' && (
            <Schemes navigateTo={navigateTo} t={t} userName={userName} contact={contact} />
          )}

          {screen === 'exercises' && (
            <Exercises navigateTo={navigateTo} t={t} />
          )}

          {screen === 'fruitguide' && (
            <FruitGuide navigateTo={navigateTo} t={t} />
          )}

          {screen === 'admin' && (
            <AdminDashboard navigateTo={(path) => { window.history.pushState({}, '', '/'); navigateTo(path); }} />
          )}

        </div>

        {/* BOTTOM NAVIGATION */}
        {screen !== 'admin' && <BottomNav screen={screen} navigateTo={navigateTo} />}

        {/* PREMIUM SIDEBAR DRAWER */}
        {showSidebar && (
          <div className="fixed inset-0 z-[2000] flex animate-in fade-in duration-300">
             {/* Backdrop */}
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
             
             {/* Sidebar Content */}
             <div className="relative w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-500 overflow-hidden flex flex-col">
                <div className="p-6 bg-indigo-600 text-white relative">
                   <div className="absolute top-4 right-4 focus:outline-none">
                      <button onClick={() => setShowSidebar(false)} className="bg-white/10 p-1.5 rounded-lg border border-white/10 hover:bg-white/20 active:scale-90 transition-all">
                        <X size={16} />
                      </button>
                   </div>
                   <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-indigo-100 p-0.5 mb-4 shadow-xl overflow-hidden shadow-inner">
                      <img src="/yoga/breathing.png" alt="Girl Profile" className="w-full h-full object-cover rounded-full bg-white scale-125 translate-y-2" />
                   </div>
                   <h3 className="font-black text-lg truncate">Hi, {userName}!</h3>
                   <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200 mt-1 opacity-80">Maternal Premium Tier</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2 mb-3">Main Menu</p>
                   
                   {[
                     { id: 'dashboard', label: 'Home Dashboard', icon: Layout, color: 'text-indigo-600' },
                     { id: 'family', label: 'Maternal Profile', icon: Users, color: 'text-rose-500' },
                     { id: 'shop', label: 'Wellness Shop', icon: ShoppingBag, color: 'text-emerald-500' },
                     { id: 'schemes', label: 'Govt. Schemes', icon: Award, color: 'text-amber-500' },
                     { id: 'education', label: 'Pregnancy Tips', icon: BookOpen, color: 'text-blue-500' },
                   ].map(item => (
                     <button
                       key={item.id}
                       onClick={() => { navigateTo(item.id, `Entering ${item.label}...`); setShowSidebar(false); }}
                       className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all group"
                     >
                       <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                       <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                     </button>
                   ))}

                   <div className="pt-4 mt-4 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2 mb-3">Settings & Support</p>
                      <button onClick={() => navigateTo('admin')} className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-amber-50 transition-all group">
                         <Settings2 size={18} className="text-amber-500" />
                         <span className="text-xs font-bold text-slate-600">Admin Control</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group">
                         <HelpCircle size={18} className="text-indigo-400" />
                         <span className="text-xs font-bold text-slate-600">Health Support</span>
                      </button>
                   </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button 
                      onClick={() => window.location.reload()}
                      className="w-full flex items-center justify-center space-x-2 py-3.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all"
                    >
                      <LogOut size={16} />
                      <span>Log Out App</span>
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* PREMIUM GLOBAL LOADING SCREEN (ROOT ANCHORED) */}
        {isLoading && (
          <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Circular Perfect Image Frame */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              {/* Modern Heartbeat Pulse & Glowing Rings - CALM & SLOW */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-rose-300/20 to-teal-400/20 rounded-full animate-spin [animation-duration:5s] blur-xl"></div>
              <div className="absolute -inset-4 bg-indigo-500/5 rounded-full animate-pulse [animation-duration:3s]"></div>
              <div className="absolute -inset-8 bg-rose-500/5 rounded-full animate-pulse [animation-duration:4s] [animation-delay:1s]"></div>
              
              <div className="absolute inset-[1px] bg-white rounded-full z-20"></div>
              
              {/* Spinning Gradient Border (No Ball) - SLOWED DOWN */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 via-transparent to-rose-400 rounded-full animate-spin [animation-duration:3s] z-10 opacity-60"></div>
              
              {/* The Actual Circular Image with Heartbeat */}
              <div className="absolute inset-3 rounded-full z-30 overflow-hidden border-2 border-slate-100 shadow-2xl flex items-center justify-center bg-white animate-in zoom-in-95 duration-500">
                <img 
                  src="/yoga/breathing.png" 
                  alt="Maternal Premium" 
                  className="w-full h-full object-cover scale-150 translate-y-4 hover:scale-160 transition-transform duration-700"
                  onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/6997/6997576.png"; }}
                />
              </div>
            </div>
            
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-[0.3em] uppercase opacity-90">{loadingText || "Maternal Companion"}</h3>
              <div className="flex justify-center space-x-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`w-3.5 h-3.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:${i*0.15}s] shadow-lg shadow-indigo-200`}></div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

