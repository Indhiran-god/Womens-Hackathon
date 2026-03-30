import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, ShoppingCart, Activity, ShieldCheck, CheckCircle2, ChevronRight, Download, Package, Clock, Plus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AdminDashboard({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, alerts: 0, orders: 0, todayUsers: 0 });
  const [usersList, setUsersList] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAlerts();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`);
      const data = await res.json();
      if (res.ok && !data.error) {
        setStats({
          users: data.totalUsers || 0,
          alerts: data.activeAlerts || 0,
          orders: data.pendingOrders || 0,
          todayUsers: data.newUsersToday || 0
        });
      }
    } catch (err) {
      console.warn("Offline/DB Error fetching Admin Stats", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`);
      const data = await res.json();
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Offline/DB Error fetching Admin Users", err);
      setUsersList([]);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/sos/active`);
      const data = await res.json();
      setAlertsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Offline/DB Error fetching Admin Alerts", err);
      setAlertsList([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders`);
      const data = await res.json();
      setOrdersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Offline/DB Error fetching Admin Orders", err);
      setOrdersList([]);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id) => {
    try {
      await fetch(`${API_BASE}/admin/sos/${id}/resolve`, { method: 'PUT' });
      fetchAlerts();
      fetchStats();
    } catch (err) {
      alert("Failed to resolve alert");
    }
  };

  const updateOrder = async (id, status) => {
    try {
      await fetch(`${API_BASE}/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
      fetchStats();
    } catch (err) {
      alert("Failed to update order");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 rounded-b-3xl">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight">MHC Admin</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Command Center</p>
              </div>
            </div>
            <button onClick={() => navigateTo('dashboard', 'Returning...')} className="text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors">
              Exit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 p-2 overflow-x-auto no-scrollbar bg-white sticky top-0 z-20">
          {['overview', 'users', 'sos-alerts', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto pb-24 space-y-4">
          
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <Users size={20} className="text-indigo-500 mb-2" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-indigo-400 mb-1">Total Users</p>
                  <h3 className="text-2xl font-black text-indigo-700">{stats.users}</h3>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <AlertTriangle size={20} className="text-rose-500 mb-2" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-rose-400 mb-1">Active SOS</p>
                  <h3 className="text-2xl font-black text-rose-700">{stats.alerts}</h3>
                </div>
                <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
                  <ShoppingCart size={20} className="text-teal-500 mb-2" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-teal-400 mb-1">Pending Orders</p>
                  <h3 className="text-2xl font-black text-teal-700">{stats.orders}</h3>
                </div>
                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                  <Activity size={20} className="text-sky-500 mb-2" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-sky-400 mb-1">New Today</p>
                  <h3 className="text-2xl font-black text-sky-700">+{stats.todayUsers}</h3>
                </div>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">System Setup</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Reset & Seed demo data</p>
                </div>
                <button 
                  onClick={async () => {
                    const ok = window.confirm("Reset entire DB with sample products?");
                    if (ok) {
                      await fetch('http://localhost:5000/api/admin/seed', { method: 'POST' });
                      alert("Database Seeded!");
                      window.location.reload();
                    }
                  }}
                  className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Export Database</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Download CSV records</p>
                </div>
                <button className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all">
                  <Download size={16} />
                </button>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="space-y-3">
              {usersList.length === 0 ? <p className="text-center text-slate-400 py-10 text-xs">No users found</p> : 
                usersList.map((u, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500">
                        {u.profilePic ? <img src={u.profilePic} className="w-full h-full rounded-full object-cover"/> : u.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{u.name}</h4>
                        <p className="text-[10px] text-slate-400">{u.contact} • Week {u.week}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${u.risk === 'High' ? 'bg-rose-50 text-rose-600' : u.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{u.risk}</span>
                  </div>
                ))
              }
            </div>
          )}

          {activeTab === 'sos-alerts' && (
            <div className="space-y-3">
              {alertsList.length === 0 ? <p className="text-center text-slate-400 py-10 text-xs">No active alerts</p> :
                alertsList.map((a, i) => (
                  <div key={i} className={`p-4 rounded-2xl border shadow-sm ${a.status === 'Active' ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 flex items-center">{a.name || a.user?.name} <span className="text-[10px] text-slate-400 ml-2 font-normal">{new Date(a.createdAt).toLocaleTimeString()}</span></h4>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${a.status === 'Active' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>{a.status}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center mb-3">📍 {a.location?.addr || `${a.location?.lat}, ${a.location?.lng}`}</p>
                    
                    {a.status === 'Active' && (
                      <button onClick={() => resolveAlert(a._id)} className="w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center hover:bg-emerald-600 active:scale-[0.98]">
                          <CheckCircle2 size={14} className="mr-1" /> Mark Resolved
                      </button>
                    )}
                  </div>
                ))
              }
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {ordersList.length === 0 ? <p className="text-center text-slate-400 py-10 text-xs">No orders found</p> :
                ordersList.map((o, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Order #{o._id.slice(-6).toUpperCase()}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{o.user?.name} • {o.user?.contact}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : o.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}`}>{o.status}</span>
                    </div>
                    
                    <div className="border-y border-dashed border-slate-100 py-2">
                       {o.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-[10px]">
                           <span className="text-slate-500">{item.qty}x {item.name}</span>
                           <span className="font-bold text-slate-700">₹{item.price * item.qty}</span>
                         </div>
                       ))}
                    </div>

                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-indigo-600">Total: ₹{o.grandTotal}</span>
                       <div className="flex space-x-2">
                          {o.status === 'Pending' && (
                            <button onClick={() => updateOrder(o._id, 'Confirmed')} className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg active:scale-95">Confirm</button>
                          )}
                          {(o.status === 'Confirmed' || o.status === 'Pending') && (
                            <button onClick={() => updateOrder(o._id, 'Delivered')} className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg active:scale-95">Deliver</button>
                          )}
                       </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
