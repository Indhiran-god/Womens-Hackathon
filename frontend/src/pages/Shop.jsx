import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShoppingCart, Truck, CreditCard, Trash2, Plus, Minus, CheckCircle2, Receipt, MapPin, Package, Loader2 } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';

const API_BASE = 'http://localhost:5000/api';

const DEFAULT_PRODUCTS = [
    { id: 1, name: "Peanut flour (Perukala)", emoji: "🌾", price: 150, benefit: "Anemia control", category: "Supplements" },
    { id: 2, name: "Ulundhu Kali", emoji: "🫘", price: 200, benefit: "Delivery strength", category: "Traditional" },
    { id: 3, name: "Kalarchikai", emoji: "🌿", price: 120, benefit: "Uterus tone", category: "Herbal" },
    { id: 4, name: "Moringa powder (Murungai)", emoji: "🍃", price: 180, benefit: "Blood boost", category: "Herbal" },
    { id: 5, name: "Ashoka Powder", emoji: "🌸", price: 250, benefit: "Hormonal balance", category: "Herbal" },
    { id: 6, name: "Jeera powder", emoji: "🫙", price: 100, benefit: "Digestion", category: "Food" },
    { id: 7, name: "Fenugreek (Vendayam)", emoji: "🌱", price: 140, benefit: "Breast milk", category: "Supplements" },
    { id: 8, name: "Dates", emoji: "🌴", price: 300, benefit: "Energy", category: "Food" },
    { id: 9, name: "Ragi flour", emoji: "🌾", price: 160, benefit: "Calcium", category: "Supplements" },
    { id: 10, name: "Garlic Paste", emoji: "🧄", price: 80, benefit: "Immunity", category: "Food" },
    { id: 11, name: "Cumin powder (Seeragam)", emoji: "🫖", price: 110, benefit: "Nausea relief", category: "Food" },
    { id: 12, name: "Poonaikali", emoji: "🌺", price: 220, benefit: "Fertility aid", category: "Herbal" },
    { id: 13, name: "Thuthuvalai", emoji: "🍵", price: 190, benefit: "Cough relief", category: "Herbal" },
    { id: 14, name: "Neem powder", emoji: "🍀", price: 170, benefit: "Skin health", category: "Herbal" },
    { id: 15, name: "Kukku Podi", emoji: "🥛", price: 130, benefit: "Lactation", category: "Traditional" },
    { id: 16, name: "Arugan Pul", emoji: "🌿", price: 160, benefit: "Morning sickness", category: "Herbal" },
    { id: 17, name: "Gooseberry (Amla)", emoji: "🫒", price: 140, benefit: "Vitamin C", category: "Food" },
    { id: 18, name: "Manathakkali", emoji: "🫐", price: 150, benefit: "Eyesight", category: "Supplements" },
    { id: 19, name: "Kovakkai", emoji: "🥒", price: 120, benefit: "Diabetes control", category: "Supplements" },
    { id: 20, name: "Pippali", emoji: "🫚", price: 280, benefit: "Respiratory health", category: "Herbal" },
    // New 15 items
    { id: 21, name: "Shatavari Powder", emoji: "🌸", price: 240, benefit: "Breast milk boost", category: "Herbal" },
    { id: 22, name: "Barley Flour", emoji: "🌾", price: 120, benefit: "Swelling reduction", category: "Supplements" },
    { id: 23, name: "Palm Jaggery (Karupatti)", emoji: "🌴", price: 200, benefit: "Natural Iron", category: "Food" },
    { id: 24, name: "Adhimadhuram Powder", emoji: "🌿", price: 150, benefit: "Cold Relief", category: "Herbal" },
    { id: 25, name: "Rose Petal Gulkand", emoji: "🌹", price: 180, benefit: "Cooling effect", category: "Traditional" },
    { id: 26, name: "Turmeric Root", emoji: "🫚", price: 100, benefit: "Antiseptic Shield", category: "Food" },
    { id: 27, name: "Vallarai Powder", emoji: "🍃", price: 140, benefit: "Memory & Brain", category: "Herbal" },
    { id: 28, name: "Tulsi Leaves", emoji: "🌿", price: 90, benefit: "Respiratory Guard", category: "Herbal" },
    { id: 29, name: "Black Sesame (Ellu)", emoji: "🌱", price: 160, benefit: "Bone Health", category: "Food" },
    { id: 30, name: "Horse Gram", emoji: "🌾", price: 110, benefit: "Body Strength", category: "Supplements" },
    { id: 31, name: "Ponnanganni Powder", emoji: "🥬", price: 130, benefit: "Eye Care", category: "Herbal" },
    { id: 32, name: "Karunjiragam", emoji: "🌱", price: 210, benefit: "Infection Shield", category: "Herbal" },
    { id: 33, name: "Chitarathai Powder", emoji: "🌿", price: 140, benefit: "Throat Relief", category: "Herbal" },
    { id: 34, name: "Hibiscus Powder", emoji: "🌺", price: 180, benefit: "Scalp Health", category: "Traditional" },
    { id: 35, name: "Murungai Keerai", emoji: "🍃", price: 120, benefit: "Calcium Iron", category: "Supplements" },
    { id: 36, name: "Kumkuma Poo (Saffron)", emoji: "🪷", price: 450, benefit: "Brain & Skin glow", category: "Herbal" }
];

export default function Shop({ navigateTo, t }) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState({});
  const [showBill, setShowBill] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingProducts, setLoadingProducts] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.benefit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setProducts(data);
      }
    } catch (err) {
      console.warn("Backend products not reachable, using defaults.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  const cartEntries = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => (p._id || p.id).toString() === id);
    return { ...product, qty };
  }).filter(item => item.id || item._id);

  const itemCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartEntries.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryCharge = subtotal >= 500 ? 0 : 50;
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryCharge + gst;

  const handleCheckout = () => {
    setShowBill(true);
  };

  const [lastOrder, setLastOrder] = useState(() => {
    const saved = localStorage.getItem('mhc_last_order');
    return saved ? JSON.parse(saved) : null;
  });

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const ordTime = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      const delDate = new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      const orderInfo = { time: ordTime, delivery: delDate, items: itemCount, amount: grandTotal };
      
      // Simulating backend call logic...
      setTimeout(() => {
        setOrderPlaced(true);
        setLastOrder(orderInfo);
        localStorage.setItem('mhc_last_order', JSON.stringify(orderInfo));
        
        setTimeout(() => {
          setOrderPlaced(false);
          setShowBill(false);
          setCart({});
        }, 3000);
      }, 500);
    } catch (err) {
      // Offline fallback
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title={t.shop || "Maternal Shop"} bgColor="bg-white">
      <div className="p-4 space-y-5">
        
        {/* SHOP HEADER */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-black text-slate-800 mb-1">Traditional Wellness</h2>
            <p className="text-xs font-bold text-slate-400">100% Natural Pregnancy Products</p>
            <p className="text-[10px] text-emerald-500 font-black mt-2 uppercase tracking-widest">🎁 Free Delivery on orders ₹500+</p>
          </div>
          <ShoppingBag className="absolute -bottom-4 -right-4 text-slate-100" size={100} />
        </div>

        {/* LAST ORDER STATUS (STICKY PERSISTENT) */}
        {lastOrder && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col space-y-3 animate-in fade-in duration-700">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500/10 p-2 rounded-full"><Package size={18} className="text-emerald-600" /></div>
                  <div>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Your Recent Order</p>
                      <p className="text-[9px] text-emerald-600 font-bold opacity-70 mt-0.5">Ordered: {lastOrder.time}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-700 leading-none">Status: <span className="text-emerald-500">Shipped</span></p>
                    <p className="text-[8px] text-emerald-600 font-black mt-1 uppercase tracking-tighter">Est. Delivery: {lastOrder.delivery}</p>
                </div>
             </div>
             <button 
                onClick={() => { setLastOrder(null); localStorage.removeItem('mhc_last_order'); }}
                className="w-full py-2 bg-white/50 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-100/50 transition-all active:scale-95"
             >
                Cancel Order ✕
             </button>
          </div>
        )}

        {/* CART SUMMARY */}
        {cartEntries.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-800 text-sm flex items-center">
                <ShoppingCart className="mr-2 text-indigo-500" size={16} /> 
                Your Bag
              </h3>
              <div className="flex items-center space-x-2">
                 <button onClick={() => setCart({})} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-2 py-1 rounded-lg transition-all border border-transparent hover:border-rose-100">Clear Bag</button>
                 <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{itemCount} items</span>
              </div>
            </div>

            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto no-scrollbar">
              {cartEntries.map((item) => (
                <div key={item._id || item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">₹{item.price} each</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <button onClick={() => decrementFromCart(item._id || item.id)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-rose-300 hover:text-rose-500 active:scale-90 transition-all">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-black text-slate-800 w-5 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item._id || item.id)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-300 hover:text-indigo-500 active:scale-90 transition-all">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item._id || item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 active:scale-90 transition-all ml-1">
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <p className="text-sm font-black text-slate-800 w-14 text-right ml-2">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-bold text-slate-600">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Delivery</span>
                <span className={`font-bold ${deliveryCharge === 0 ? 'text-emerald-500' : 'text-slate-600'}`}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>GST (5%)</span>
                <span className="font-bold text-slate-600">₹{gst}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-800 pt-2 border-t border-dashed border-slate-200 mt-2">
                <span>Grand Total</span>
                <span className="text-indigo-600">₹{grandTotal}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="w-full mt-4 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
              <Receipt size={16} />
              <span>View Bill & Checkout</span>
            </button>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ShoppingCart className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search herbal products (e.g. Dates, Ragi)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400/20 focus:bg-white transition-all placeholder:font-normal placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 pt-1">
           {['All', 'Supplements', 'Traditional', 'Herbal', 'Food'].map(cat => (
             <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* PRODUCT GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">
              {searchTerm ? `Results for "${searchTerm}"` : `All Products`} ({filteredProducts.length})
            </h3>
            {loadingProducts && <Loader2 size={14} className="animate-spin text-slate-400" />}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-center space-y-3 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
               <Package size={40} className="text-slate-200" />
               <p className="text-sm font-bold text-slate-400">No products found matching your search.</p>
               <button onClick={() => setSearchTerm('')} className="text-xs font-black text-indigo-500 uppercase tracking-widest">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-24">
              {filteredProducts.map(product => {
                const pid = product._id || product.id;
                return (
                  <div key={pid} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{product.emoji}</span>
                      {cart[pid] && (
                        <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-full">x{cart[pid]}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-[11px] text-slate-800 leading-tight mb-1 flex-1">{product.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3">{product.benefit}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                      <p className="font-black text-slate-800 text-sm">₹{product.price}</p>
                      <button onClick={() => addToCart(pid)} className="bg-slate-50 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors active:scale-90 border border-slate-100">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* BILL / INVOICE MODAL - RE-ENGINEERED TO BE ON TOP OF EVERYTHING */}
      {showBill && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => !isPlacing && setShowBill(false)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-lg rounded-t-[40px] shadow-2xl animate-in slide-in-from-bottom-20 duration-500 flex flex-col h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="shrink-0 flex flex-col items-center pt-4 pb-2 bg-white border-b border-slate-50 relative z-20">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4"></div>
              <div className="w-full px-6 flex justify-between items-center mb-2">
                 <h3 className="text-xl font-black text-slate-800">Final Bill</h3>
                 <button onClick={() => !isPlacing && setShowBill(false)} className="text-slate-400 w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full font-black">✕</button>
              </div>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar bg-slate-50/50">
              {orderPlaced ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">Order Confirmed! 🎉</h3>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-left space-y-3">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest border-b border-emerald-100 pb-2">Tracking Details</p>
                    <div className="flex justify-between text-xs text-emerald-600"><span>Ordered At</span><span className="font-bold text-right text-[10px]">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
                    <div className="flex justify-between text-xs text-emerald-600"><span>Est. Delivery</span><span className="font-bold text-right text-[10px]">{new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
                    <div className="flex justify-between text-xs text-emerald-600"><span>Total Amount</span><span className="font-black underline">₹{grandTotal.toLocaleString()}</span></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                   {/* Items Recap */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Items in Bag</p>
                      <div className="space-y-2">
                        {cartEntries.map(item => (
                          <div key={item._id || item.id} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                               <span className="text-lg">{item.emoji}</span>
                               <span className="text-xs font-bold text-slate-700">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                            </div>
                            <span className="text-xs font-black text-slate-800">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Price Calculation */}
                   <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100 space-y-2">
                      <div className="flex justify-between text-xs text-indigo-100"><span>Subtotal</span><span>₹{subtotal}</span></div>
                      <div className="flex justify-between text-xs text-indigo-100"><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
                      <div className="flex justify-between text-xs text-indigo-100"><span>GST (5%)</span><span>₹{gst}</span></div>
                      <div className="pt-3 border-t border-white/20 flex justify-between items-center">
                         <span className="font-black uppercase tracking-widest text-[10px]">Total Amount</span>
                         <span className="text-2xl font-black">₹{grandTotal.toLocaleString()}</span>
                      </div>
                   </div>

                   {/* Post-Purchase Info */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                      <div className="flex items-center space-x-3 text-xs text-slate-600">
                         <Truck size={14} className="text-indigo-500" />
                         <span>Estimated Delivery: <span className="font-black">2-4 Days</span></span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-600">
                         <CreditCard size={14} className="text-emerald-500" />
                         <span>Payment Mode: <span className="font-black">Cash on Delivery</span></span>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* STICKY FOOTER - ALWAYS ON TOP */}
            {!orderPlaced && (
              <div className="shrink-0 p-6 bg-white border-t border-slate-100 space-y-3 pb-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] relative z-30">
                <button
                  disabled={isPlacing}
                  onClick={handlePlaceOrder}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  {isPlacing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  <span>{isPlacing ? 'Processing...' : `Confirm Order — ₹${grandTotal.toLocaleString()}`}</span>
                </button>
                <button
                  disabled={isPlacing}
                  onClick={() => setShowBill(false)}
                  className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-rose-500 transition-all"
                >
                  Cancel & Go Back
                </button>
              </div>
            )}

            {orderPlaced && (
               <div className="shrink-0 p-6 bg-white border-t border-slate-100 pb-10 text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest animate-pulse">Closing automatically...</p>
               </div>
            )}
            
          </div>
        </div>
      )}
    </FullScreenOverlay>
  );
}
