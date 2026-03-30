import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, Play, Pause, RotateCcw, AlertTriangle, Star, Clock, Flame, Heart, Trophy, X } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';

// ── Yoga data for all 9 months ──────────────────────────────────────────────
const YOGA_DATA = {
  1: {
    trimester: 1, title: 'Month 1', titleTa: '1வது மாதம்',
    theme: 'from-rose-400 to-pink-500',
    tip: 'கர்ப்பத்தின் ஆரம்பம் — மென்மையான மூச்சு பயிற்சி மட்டுமே',
    poses: [
      {
        id: 'm1p1', name: 'Deep Breathing', nameTa: 'ஆழ்ந்த மூச்சு பயிற்சி',
        emoji: '🧘‍♀️', duration: 300, reps: '10 மூச்சு × 3', image: '/yoga/breathing.png',
        color: 'from-rose-50 to-pink-50', border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-700',
        benefit: 'ஆக்சிஜன் அதிகரிக்கும், குழந்தைக்கு நல்லது',
        steps: ['நேராக அமரவும்', 'மூக்கு வழியாக 4 விநாடி உள்ளிழுக்கவும்', '4 விநாடி நிறுத்தவும்', '4 விநாடி வாய் வழியா வெளியிடவும்', '10 முறை செய்யவும்'],
        caution: 'தலை சுற்றல் வந்தால் உடனே நிறுத்தவும்'
      },
      {
        id: 'm1p2', name: 'Neck Rolls', nameTa: 'கழுத்து சுழற்சி',
        emoji: '🌀', duration: 120, reps: '5 × இரு திசை',
        color: 'from-pink-50 to-rose-50', border: 'border-pink-200',
        badge: 'bg-pink-100 text-pink-700',
        benefit: 'கழுத்து வலி குறையும், மன அழுத்தம் போகும்',
        steps: ['நேராக உட்காரவும்', 'தலையை மெதுவாக வலமாக சுழற்றவும்', '5 முறை ஒவ்வொரு திசையிலும்', 'வேகமாக சுழற்றாதீர்கள்'],
        caution: 'வலி வந்தால் உடனே நிறுத்தவும்'
      }
    ]
  },
  2: {
    trimester: 1, title: 'Month 2', titleTa: '2வது மாதம்',
    theme: 'from-orange-400 to-amber-500',
    tip: 'குமட்டல் குறைய — மூச்சு + மெல்லிய நீட்சி',
    poses: [
      {
        id: 'm2p1', name: 'Cat-Cow Stretch', nameTa: 'பூனை-மாடு நீட்சி',
        emoji: '🐱', duration: 180, reps: '10 முறை', image: '/yoga/catcow.png',
        color: 'from-amber-50 to-orange-50', border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-700',
        benefit: 'முதுகு வலி குறையும், நெகிழ்வுத்தன்மை அதிகரிக்கும்',
        steps: ['நான்கு கைகால்களில் நிற்கவும்', 'மூச்சு உள்ளிழுக்கும்போது முதுகை உயர்த்தவும்', 'மூச்சு வெளியிடும்போது முதுகை கீழே வளைக்கவும்', 'மெதுவாக 10 முறை செய்யவும்'],
        caution: 'வயிறு தரையில் படாமல் கவனிக்கவும்'
      },
      {
        id: 'm2p2', name: 'Ankle Rotations', nameTa: 'கணுக்கால் சுழற்சி',
        emoji: '🦶', duration: 120, reps: '10 × இரு பக்கம்',
        color: 'from-orange-50 to-amber-50', border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-700',
        benefit: 'கால் வீக்கம் குறையும், ரத்த ஓட்டம் சீராகும்',
        steps: ['நாற்காலியில் அமரவும்', 'ஒரு காலை உயர்த்தவும்', 'கணுக்காலை வட்டமாக சுழற்றவும்', 'இரு திசையிலும் 10 முறை'],
        caution: 'வீக்கம் அதிகமாக இருந்தால் மருத்துவரிடம் சென்று பாருங்கள்'
      }
    ]
  },
  3: {
    trimester: 1, title: 'Month 3', titleTa: '3வது மாதம்',
    theme: 'from-yellow-400 to-lime-500',
    tip: 'முதல் மூன்று மாத இறுதி — மேலும் சற்று லேசான நீட்சி',
    poses: [
      {
        id: 'm3p1', name: 'Butterfly Pose', nameTa: 'பட்டாம்பூச்சி ஆசனம்',
        emoji: '🦋', duration: 240, reps: '30 விநாடி × 3', image: '/yoga/butterfly.png',
        color: 'from-lime-50 to-green-50', border: 'border-lime-200',
        badge: 'bg-lime-100 text-lime-700',
        benefit: 'இடுப்பு நெகிழ்கிறது, சுகப்பிரசவத்திற்கு உதவும்',
        steps: ['தரையில் உட்காரவும்', 'இரு பாதங்களையும் சேர்க்கவும்', 'முழங்கால்களை தரையை நோக்கி அழுத்தவும்', 'முதுகை நேராக வைக்கவும்', 'வலி இல்லாமல் 30 விநாடி இருக்கவும்'],
        caution: 'முழங்காலை தரையில் வலுக்கட்டாயமாக அழுத்தாதீர்கள்'
      },
      {
        id: 'm3p2', name: 'Seated Forward Bend', nameTa: 'முன்னோக்கி வளைதல்',
        emoji: '🙇‍♀️', duration: 180, reps: '3 × 30 விநாடி',
        color: 'from-green-50 to-teal-50', border: 'border-green-200',
        badge: 'bg-green-100 text-green-700',
        benefit: 'முதுகு தசைகள் நீளும், அமைதி கிடைக்கும்',
        steps: ['கால்களை நேராக நீட்டி உட்காரவும்', 'மூச்சை உள்ளிழுக்கவும்', 'முன்னோக்கி மெதுவாக வளைக்கவும்', 'கை கால்விரல்களை தொட முயற்சிக்கவும்', 'வயிற்றை அழுத்தாமல் கவனிக்கவும்'],
        caution: 'வயிற்றை அழுத்தினால் உடனே நிறுத்தவும்'
      }
    ]
  },
  4: {
    trimester: 2, title: 'Month 4', titleTa: '4வது மாதம்',
    theme: 'from-teal-400 to-cyan-500',
    tip: 'இரண்டாம் மூன்று மாதம் — குழந்தை வளர ஆரம்பிக்கிறது!',
    poses: [
      {
        id: 'm4p1', name: 'Standing Side Stretch', nameTa: 'நின்று பக்க நீட்சி',
        emoji: '🧍‍♀️', duration: 180, reps: '5 × இரு பக்கம்',
        color: 'from-cyan-50 to-teal-50', border: 'border-cyan-200',
        badge: 'bg-cyan-100 text-cyan-700',
        benefit: 'விலா எலும்பு விரியும், சுவாசம் சீராகும்',
        steps: ['நேராக நிற்கவும்', 'ஒரு கை தலை மேல் உயர்த்தவும்', 'மெதுவாக பக்கவாட்டில் வளைக்கவும்', '5 விநாடி இருக்கவும்', 'இரு பக்கமும் செய்யவும்'],
        caution: 'சமநிலை தவறினால் சுவரை ஆதாரமாக பயன்படுத்தவும்'
      },
      {
        id: 'm4p2', name: 'Pelvic Tilts', nameTa: 'இடுப்பு சுழற்சி',
        emoji: '🔄', duration: 240, reps: '10 முறை',
        color: 'from-teal-50 to-emerald-50', border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-700',
        benefit: 'பிரசவ வலி குறையும், இடுப்பு வலுவாகும்',
        steps: ['நேராக நிற்கவும் அல்லது அமரவும்', 'வயிற்றை உள்ளே இழுக்கவும்', 'இடுப்பை முன்னோக்கி தள்ளவும்', '5 விநாடி நிறுத்தவும்', 'மெதுவாக திரும்பவும்'],
        caution: 'முதுகை வளைக்காமல் கவனிக்கவும்'
      }
    ]
  },
  5: {
    trimester: 2, title: 'Month 5', titleTa: '5வது மாதம்',
    theme: 'from-indigo-400 to-violet-500',
    tip: 'குழந்தையின் அசைவு உணர்கிறீர்கள் — மகிழ்ந்து பயிற்சி செய்யுங்கள்',
    poses: [
      {
        id: 'm5p1', name: 'Modified Warrior', nameTa: 'திருத்திய வீர ஆசனம்',
        emoji: '⚔️', duration: 240, reps: '5 × இரு பக்கம் × 30 விநாடி', image: '/yoga/warrior.png',
        color: 'from-violet-50 to-indigo-50', border: 'border-violet-200',
        badge: 'bg-violet-100 text-violet-700',
        benefit: 'கால் வலிமை அதிகரிக்கும், சமநிலை மேம்படும்',
        steps: ['கால்களை அகலமாக வைக்கவும்', 'ஒரு காலை சற்று முன்னே வைக்கவும்', 'முழங்காலை 90° வளைக்கவும்', 'கைகளை பக்கவாட்டில் நீட்டவும்', '30 விநாடி இருக்கவும்', 'சுவர் அருகே நிற்கவும்'],
        caution: 'வயிறு பெரியதாக இருந்தால் சுவர் ஆதாரம் பயன்படுத்தவும்'
      },
      {
        id: 'm5p2', name: 'Child\'s Pose', nameTa: 'குழந்தை ஆசனம்',
        emoji: '🛐', duration: 300, reps: '2 × 60 விநாடி', image: '/yoga/childpose.png',
        color: 'from-indigo-50 to-blue-50', border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-700',
        benefit: 'முதுகு வலி குறையும், உள்ளம் அமைதியடையும்',
        steps: ['முழங்காலில் நிற்கவும்', 'கால்களை அகலமாக வைக்கவும்', 'முன்னோக்கி கை நீட்டி குனிக்கவும்', 'நெற்றி தரையில் படுமாறு வைக்கவும்', '60 விநாடி ஓய்வெடுக்கவும்'],
        caution: 'வயிற்றுக்கு அழுத்தம் வராமல் கால்களை அகலமாக வைக்கவும்'
      }
    ]
  },
  6: {
    trimester: 2, title: 'Month 6', titleTa: '6வது மாதம்',
    theme: 'from-purple-400 to-fuchsia-500',
    tip: 'வீக்கம், முதுகு வலி குறைய — இந்த பயிற்சிகள் மிக முக்கியம்',
    poses: [
      {
        id: 'm6p1', name: 'Wall Squats', nameTa: 'சுவர் ஸ்குவாட்',
        emoji: '🏋️‍♀️', duration: 240, reps: '10 முறை', image: '/yoga/wallsquat.png',
        color: 'from-fuchsia-50 to-purple-50', border: 'border-fuchsia-200',
        badge: 'bg-fuchsia-100 text-fuchsia-700',
        benefit: 'பிரசவத்திற்கு தசைகள் தயாராகும், வலி குறையும்',
        steps: ['சுவரில் முதுகு வைக்கவும்', 'கால்களை கொஞ்சம் முன்னே வைக்கவும்', 'மெதுவாக கீழே இறங்கவும்', '90°-க்கு குனிக்கவும்', '5 விநாடி நிறுத்தி மெதுவாக எழுங்கள்'],
        caution: 'முழங்காலை கால்விரல்களுக்கு முன்னே வர விடாதீர்கள்'
      },
      {
        id: 'm6p2', name: 'Leg Raises', nameTa: 'கால் உயர்த்தல்',
        emoji: '🦵', duration: 180, reps: '10 × இரு பக்கம்',
        color: 'from-purple-50 to-violet-50', border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-700',
        benefit: 'கால் வீக்கம் குறையும், ரத்த ஓட்டம் சீராகும்',
        steps: ['பக்கவாட்டில் படுக்கவும்', 'மேல் காலை மெதுவாக உயர்த்தவும்', '45°-க்கு உயர்த்தி 5 விநாடி நிறுத்தவும்', 'மெதுவாக கீழே கொண்டுவரவும்', 'இரு பக்கமும் 10 முறை'],
        caution: '3 மாதத்திற்கு மேல் தரையில் படுக்காமல் பக்கவாட்டில் படுக்கவும்'
      }
    ]
  },
  7: {
    trimester: 3, title: 'Month 7', titleTa: '7வது மாதம்',
    theme: 'from-emerald-400 to-teal-500',
    tip: 'மூன்றாம் மூன்று மாதம் — பிரசவ தயாரிப்பு ஆரம்பம்',
    poses: [
      {
        id: 'm7p1', name: 'Kegel Exercises', nameTa: 'கேகல் பயிற்சி',
        emoji: '💪', duration: 300, reps: '3 தொகுதி × 10',
        color: 'from-emerald-50 to-green-50', border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700',
        benefit: 'யோனி தசைகள் வலுவாகும், பிரசவம் சீக்கிரம் ஆகும்',
        steps: ['படுக்கவும் அல்லது உட்காரவும்', 'சிறுநீர் அடக்குவது போல் தசைகளை இறுக்கவும்', '5 விநாடி இறுக்கமாக வைக்கவும்', 'மெதுவாக விடுவிக்கவும்', '10 முறை செய்யவும்'],
        caution: 'சிறுநீர் கழிக்கும்போது செய்யாதீர்கள்'
      },
      {
        id: 'm7p2', name: 'Supported Squat', nameTa: 'ஆதாரத்துடன் ஸ்குவாட்',
        emoji: '🪑', duration: 240, reps: '5 × 30 விநாடி',
        color: 'from-teal-50 to-cyan-50', border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-700',
        benefit: 'பிரசவ தசைகள் திறக்கும், குழந்தை கீழே இறங்கும்',
        steps: ['நாற்காலி அல்லது சுவர் ஆதாரம் பயன்படுத்தவும்', 'கால்களை அகலமாக வைக்கவும்', 'மெதுவாக கீழே குந்து நிலைக்கு செல்லவும்', '30 விநாடி இருக்கவும்', 'மெதுவாக எழுங்கள்'],
        caution: 'தனியாக செய்யாதீர்கள், ஆதாரமில்லாமல் வேண்டாம்'
      }
    ]
  },
  8: {
    trimester: 3, title: 'Month 8', titleTa: '8வது மாதம்',
    theme: 'from-blue-400 to-indigo-500',
    tip: 'பிரசவம் நெருங்குகிறது — இப்போது மூச்சு பயிற்சி மிக முக்கியம்',
    poses: [
      {
        id: 'm8p1', name: 'Labor Breathing', nameTa: 'பிரசவ மூச்சு பயிற்சி',
        emoji: '🌬️', duration: 600, reps: 'தினமும் 10 நிமிடம்',
        color: 'from-blue-50 to-indigo-50', border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        benefit: 'பிரசவ வலியை சமாளிக்க உதவும்',
        steps: ['படுக்கவும் அல்லது உட்காரவும்', 'கண்களை மூடவும்', '4 விநாடி மூக்கு வழியா உள்ளிழுக்கவும்', '6 விநாடி வாய் வழியா "ஹூ" என வெளியிடவும்', 'பிரசவ வலி வரும்போது இப்படி செய்யுங்கள்'],
        caution: 'கணவர் அல்லது குடும்பத்தினர் அருகே இருக்கட்டும்'
      },
      {
        id: 'm8p2', name: 'Hip Circles', nameTa: 'இடுப்பு வட்ட சுழற்சி',
        emoji: '🔵', duration: 180, reps: '10 × இரு திசை',
        color: 'from-indigo-50 to-violet-50', border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-700',
        benefit: 'இடுப்பு நெகிழும், குழந்தை சரியான நிலைக்கு வரும்',
        steps: ['நேராக நிற்கவும் (சுவர் அருகே)', 'கைகள் இடுப்பில் வைக்கவும்', 'இடுப்பை வட்டமாக மெதுவாக சுழற்றவும்', 'வலமும் இடமும் 10 முறை'],
        caution: 'தலைச்சுற்றல் வந்தால் உடனே நிறுத்தவும்'
      }
    ]
  },
  9: {
    trimester: 3, title: 'Month 9', titleTa: '9வது மாதம்',
    theme: 'from-rose-500 to-red-500',
    tip: '⚠️ மருத்துவர் அனுமதி பெற்று மட்டுமே செய்யுங்கள்',
    poses: [
      {
        id: 'm9p1', name: 'Walking Meditation', nameTa: 'நடை தியானம்',
        emoji: '🚶‍♀️', duration: 600, reps: '10-15 நிமிடம் தினமும்',
        color: 'from-rose-50 to-red-50', border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-700',
        benefit: 'குழந்தை கீழே இறங்கும், பிரசவம் விரைவாக ஆகும்',
        steps: ['வீட்டுக்குள் அல்லது தோட்டத்தில் மெதுவாக நடக்கவும்', 'ஒவ்வொரு அடியையும் உணர்ந்து நடக்கவும்', 'மூச்சை சீராக வைக்கவும்', 'ஓய்வு தேவைப்பட்டால் உடனே உட்காரவும்', 'தனியாக வெளியே போகாதீர்கள்'],
        caution: 'வளியில் தனியாக போகாதீர்கள், யாரோடு சேர்ந்து நடக்கவும்'
      },
      {
        id: 'm9p2', name: 'Relaxation Pose', nameTa: 'ஓய்வு ஆசனம் (Savasana)',
        emoji: '🌙', duration: 600, reps: '10-20 நிமிடம்',
        color: 'from-red-50 to-rose-50', border: 'border-red-200',
        badge: 'bg-red-100 text-red-700',
        benefit: 'மன அமைதி கிடைக்கும், நல்ல தூக்கம் வரும்',
        steps: ['இடது பக்கமாக படுக்கவும் (இடது பக்கம் சிறந்தது)', 'முழங்கால்களிடையே தலையணை வைக்கவும்', 'கண்களை மூடவும்', 'தேவையான மட்டும் ஓய்வெடுக்கவும்', 'இனிமையான இசை அல்லது குழந்தைக்கு பாட்டு பாடலாம்'],
        caution: 'வலது பக்கம் அல்லது முதுகில் படுக்க வேண்டாம்'
      }
    ]
  }
};

// ── Animated Pose Card ──────────────────────────────────────────────────────
function PoseCard({ pose, isCompleted, onComplete }) {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pose.duration);
  const [showSteps, setShowSteps] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const progress = ((pose.duration - timeLeft) / pose.duration) * 100;

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      onComplete(pose.id);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, timeLeft]);

  const toggleTimer = () => setTimerActive(p => !p);
  const resetTimer = () => { setTimerActive(false); setTimeLeft(pose.duration); };

  return (
    <div className={`bg-gradient-to-br ${pose.color} rounded-3xl p-5 border ${pose.border} shadow-sm mb-4 transition-all overflow-hidden ${isCompleted ? 'opacity-75 ring-2 ring-emerald-400 ring-offset-1' : ''}`}>
      
      {/* 3D Visual */}
      {pose.image && (
        <div className="w-full h-48 bg-white/40 rounded-2xl mb-4 overflow-hidden shadow-sm flex items-center justify-center relative">
          <img src={pose.image} alt={pose.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white ${timerActive ? 'animate-bounce' : ''}`}>
            {pose.emoji}
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-sm leading-tight">{pose.nameTa}</h4>
            <p className="text-[10px] text-slate-500 font-medium">{pose.name}</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${pose.badge} mt-1 inline-block`}>{pose.reps}</span>
          </div>
        </div>
        {isCompleted && (
          <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
        )}
      </div>

      {/* Benefit */}
      <p className="text-[11px] text-slate-600 bg-white/60 rounded-xl px-3 py-2 mb-3 font-medium">
        💚 {pose.benefit}
      </p>

      {/* Timer Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timer</span>
          <span className={`text-sm font-black ${timeLeft < 30 && timerActive ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="h-2 bg-white/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-2">
        <button
          onClick={toggleTimer}
          className="flex-1 py-2.5 rounded-2xl bg-white text-slate-700 font-black text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-transform border border-white"
        >
          {timerActive ? <Pause size={14} /> : <Play size={14} />}
          <span>{timerActive ? 'Pause' : 'Start'}</span>
        </button>
        <button onClick={resetTimer} className="py-2.5 px-3 rounded-2xl bg-white/60 text-slate-500 flex items-center justify-center active:scale-95 transition-transform">
          <RotateCcw size={14} />
        </button>
        {!isCompleted && (
          <button
            onClick={() => onComplete(pose.id)}
            className="py-2.5 px-4 rounded-2xl bg-emerald-500 text-white font-black text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-transform"
          >
            <CheckCircle2 size={13} />
            <span>Done</span>
          </button>
        )}
      </div>

      {/* Steps toggle */}
      <button
        onClick={() => setShowSteps(p => !p)}
        className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center space-x-1 hover:bg-white/40 rounded-xl transition-colors"
      >
        <span>{showSteps ? 'Hide Steps' : 'Show Tamil Steps'}</span>
        <ChevronRight size={12} className={`transition-transform ${showSteps ? 'rotate-90' : ''}`} />
      </button>

      {showSteps && (
        <div className="mt-2 bg-white/70 rounded-2xl p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">படிப்படியான வழிமுறை</p>
          {pose.steps.map((step, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{step}</p>
            </div>
          ))}
          {pose.caution && (
            <div className="mt-2 flex items-start space-x-2 bg-amber-50 rounded-xl p-2 border border-amber-100">
              <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 font-bold">{pose.caution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Exercises Page ─────────────────────────────────────────────────────
export default function Exercises({ navigateTo, t }) {
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `mhc_yoga_${todayKey}`;
  const progressKey = 'mhc_yoga_progress';

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [completedPoses, setCompletedPoses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey) || '{}'); } catch { return {}; }
  });
  const [showDisclaimer, setShowDisclaimer] = useState(() => !localStorage.getItem('mhc_yoga_disclaimer_ok'));
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const monthData = YOGA_DATA[selectedMonth];
  const totalPoses = monthData.poses.length;
  const completedCount = monthData.poses.filter(p => completedPoses.includes(p.id)).length;
  const allDone = completedCount === totalPoses;

  // Streak calc
  const streakDays = Object.keys(progress).filter(d => progress[d]?.completed).length;

  const handleComplete = (poseId) => {
    const updated = completedPoses.includes(poseId) ? completedPoses : [...completedPoses, poseId];
    setCompletedPoses(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Check if all poses for today done
    const monthPoseIds = monthData.poses.map(p => p.id);
    const monthDone = monthPoseIds.every(id => updated.includes(id));
    if (monthDone) {
      const newProg = { ...progress, [todayKey]: { completed: true, month: selectedMonth } };
      setProgress(newProg);
      localStorage.setItem(progressKey, JSON.stringify(newProg));
    }
  };

  const acceptDisclaimer = () => {
    if (disclaimerAccepted) {
      localStorage.setItem('mhc_yoga_disclaimer_ok', 'true');
      setShowDisclaimer(false);
    }
  };

  // Disclaimer gate
  if (showDisclaimer) {
    return (
      <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going Home...')} title="Prenatal Yoga" bgColor="bg-white">
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-2 border-amber-200">
              <AlertTriangle size={40} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2">மருத்துவர் அறிவிக்கை</h2>
              <p className="text-sm font-bold text-slate-500">Medical Disclaimer</p>
            </div>
            <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100 text-left space-y-3">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                🩺 இந்த யோகா பயிற்சிகளை <strong>உங்கள் மருத்துவரிடம் கலந்தாலோசித்த பிறகு</strong> மட்டுமே செய்யவும்.
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                ⚠️ வலி, தலைச்சுற்றல், குமட்டல், அல்லது குழந்தையின் அசைவு குறைந்தால் <strong>உடனே நிறுத்திவிடுங்கள்</strong>.
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                🏥 இந்த App மருத்துவ ஆலோசனையாக கருதப்படாது. தகுந்த மருத்துவரிடம் செல்லுங்கள்.
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                These exercises are for general prenatal wellness. Always consult your OB-GYN or midwife before starting any exercise program during pregnancy.
              </p>
            </div>
            <label className="flex items-start space-x-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded accent-indigo-600"
                checked={disclaimerAccepted}
                onChange={e => setDisclaimerAccepted(e.target.checked)}
              />
              <span className="text-sm text-slate-700 font-bold">
                மருத்துவரிடம் அனுமதி பெற்றேன். விளைவுகளுக்கு நான் பொறுப்பு என்று ஒப்புக்கொள்கிறேன்.
              </span>
            </label>
          </div>
          <button
            disabled={!disclaimerAccepted}
            onClick={acceptDisclaimer}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all mt-4 flex items-center justify-center space-x-2 disabled:opacity-40 bg-indigo-600 text-white shadow-xl shadow-indigo-200 active:scale-[0.98]"
          >
            <CheckCircle2 size={18} />
            <span>தொடரவும் — Continue</span>
          </button>
        </div>
      </FullScreenOverlay>
    );
  }

  return (
    <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going Home...')} title="யோகா பயிற்சி" bgColor="bg-slate-50">
      <div className="pb-24">

        {/* Stats Header */}
        <div className={`bg-gradient-to-r ${monthData.theme} px-5 pt-2 pb-5`}>
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-white">{streakDays}</p>
              <p className="text-[9px] text-white/80 font-black uppercase tracking-widest">Day Streak 🔥</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-white">{completedCount}/{totalPoses}</p>
              <p className="text-[9px] text-white/80 font-black uppercase tracking-widest">Today Done ✅</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-white">M{selectedMonth}</p>
              <p className="text-[9px] text-white/80 font-black uppercase tracking-widest">Month 🌸</p>
            </div>
          </div>
          <p className="text-[11px] text-white/80 font-bold text-center">{monthData.tip}</p>
        </div>

        {/* Month Selector */}
        <div className="px-5 pt-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">மாதம் தேர்வு செய்யவும்</p>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            {Object.keys(YOGA_DATA).map(m => {
              const mNum = parseInt(m);
              const mData = YOGA_DATA[mNum];
              const trimLabel = mNum <= 3 ? '1T' : mNum <= 6 ? '2T' : '3T';
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(mNum)}
                  className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-2xl text-[10px] font-black transition-all min-w-[52px] ${
                    selectedMonth === mNum
                      ? `bg-gradient-to-br ${mData.theme} text-white shadow-lg`
                      : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{mNum}</span>
                  <span className="opacity-70">{trimLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* All Done Banner */}
        {allDone && (
          <div className="mx-5 mb-4 bg-emerald-500 rounded-3xl p-4 text-white text-center animate-in zoom-in-95 duration-300">
            <Trophy size={28} className="mx-auto mb-1" />
            <p className="font-black text-sm">🎉 இன்றைய பயிற்சி முடிந்தது!</p>
            <p className="text-[10px] text-emerald-100 mt-0.5">Today's session complete! Great work! ⭐</p>
          </div>
        )}

        {/* Poses */}
        <div className="px-5 space-y-0">
          {monthData.poses.map(pose => (
            <PoseCard
              key={pose.id}
              pose={pose}
              isCompleted={completedPoses.includes(pose.id)}
              onComplete={handleComplete}
            />
          ))}
        </div>

        {/* Progress History */}
        <div className="mx-5 mt-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-3 flex items-center">
            <Flame size={14} className="mr-1.5 text-orange-500" /> Weekly Progress
          </h4>
          <div className="flex space-x-2">
            {Array.from({length: 7}, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const key = d.toISOString().split('T')[0];
              const done = progress[key]?.completed;
              const isToday = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                  <div className={`w-full h-8 rounded-xl flex items-center justify-center ${done ? 'bg-emerald-500' : isToday ? 'bg-indigo-100 border-2 border-indigo-300 border-dashed' : 'bg-slate-100'}`}>
                    {done && <CheckCircle2 size={14} className="text-white" />}
                    {isToday && !done && <span className="text-indigo-400 text-[8px] font-black">NOW</span>}
                  </div>
                  <span className="text-[8px] text-slate-400 font-black">
                    {['S','M','T','W','T','F','S'][d.getDay()]}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2 font-bold">
            {streakDays} நாட்கள் தொடர்ச்சியாக செய்தீர்கள்! 🌟
          </p>
        </div>

        {/* Doctor Note */}
        <div className="mx-5 mt-4 bg-amber-50 rounded-3xl p-4 border border-amber-100">
          <div className="flex items-start space-x-2">
            <Heart size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-slate-700">மருத்துவர் ஆலோசனை அவசியம்</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Always consult your doctor before starting prenatal yoga. Stop immediately if you feel pain, dizziness, or reduced baby movement.</p>
            </div>
          </div>
        </div>

      </div>
    </FullScreenOverlay>
  );
}
