import React, { useState, useEffect } from 'react';
import { loginAdmin, getAdminOrders, updateAdminOrder, getAdminStats } from '../api';
import FadeIn from '../components/FadeIn';

const AdminDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, monthly: 0, byPackage: {} });
  const [filter, setFilter] = useState('all');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders(token);
      setOrders(data);
    } catch (e) {
      if (e.message.includes('401') || e.message.includes('Unauthorized')) {
        localStorage.removeItem('adminToken');
        setToken(null);
      }
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const data = await getAdminStats(token);
      setStats(data);
    } catch (e) {}
  };

  useEffect(() => {
    if (token) { loadOrders(); loadStats(); }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await loginAdmin({ username: loginForm.username, password: loginForm.password });
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } catch (e) {
      setLoginError('Invalid credentials');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateAdminOrder(token, orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {}
    setUpdating(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <FadeIn>
          <div className="card-futuristic p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm mt-1">Sign in to manage orders</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">Username</label>
                <input value={loginForm.username} onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                  className="mt-1 w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-400 dark:placeholder-slate-500" placeholder="admin" />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">Password</label>
                <input type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  className="mt-1 w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-400 dark:placeholder-slate-500" placeholder="••••••••" />
              </div>
              {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              <button type="submit" className="btn-primary w-full text-center">Sign In</button>
              <p className="text-slate-600 text-xs text-center">Default: admin / password</p>
            </form>
          </div>
        </FadeIn>
      </div>
    );
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage orders and track business metrics</p>
          </div>
          <button onClick={() => { localStorage.removeItem('adminToken'); setToken(null); }} className="btn-outline text-xs">Logout</button>
        </div>

        {/* Stats */}
        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: stats.total || orders.length, icon: '📦' },
              { label: 'This Month', value: stats.monthly || 0, icon: '📅' },
              { label: 'Active Filters', value: filtered.length, icon: '🔍' },
            ].map(s => (
              <div key={s.label} className="card-futuristic p-5 flex items-center gap-4">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <div className="text-2xl font-extrabold text-slate-800 dark:text-white">{s.value}</div>
                  <div className="text-slate-500 text-sm">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'received', 'in design', 'review', 'live'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Orders Table */}
        <FadeIn delay={150}>
          <div className="card-futuristic overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800/80">
                      {['ID', 'Business', 'Package', 'Status', 'Contact', 'Actions'].map(h => (
                        <th key={h} className="text-left p-4 text-slate-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => (
                      <tr key={order.id} className="border-b border-slate-200 dark:border-slate-800/30 hover:bg-slate-100 dark:bg-slate-800/10 transition-colors">
                        <td className="p-4 text-slate-400 font-mono text-xs">{order.id?.slice(0, 8)}</td>
                        <td className="p-4 text-slate-800 dark:text-white font-medium">{order.business_name}</td>
                        <td className="p-4"><span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">{order.package_name}</span></td>
                        <td className="p-4">
                          <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-2 py-1 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50">
                            {['received', 'in design', 'review', 'live'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-4 text-slate-400 text-xs">{order.contact_email}</td>
                        <td className="p-4">
                          <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors">
                            {selectedOrder?.id === order.id ? 'Close' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <FadeIn>
            <div className="card-futuristic p-6 mt-6 glow-cyan">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Order Details — {selectedOrder.business_name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {[
                  ['Package', selectedOrder.package_name],
                  ['Category', selectedOrder.business_category],
                  ['Domain', selectedOrder.preferred_domain || 'TBD'],
                  ['Contact', selectedOrder.contact_name],
                  ['Email', selectedOrder.contact_email],
                  ['WhatsApp', selectedOrder.contact_whatsapp || '—'],
                  ['Total', `৳${Number(selectedOrder.total).toLocaleString()}`],
                  ['Status', selectedOrder.status],
                  ['Referral', selectedOrder.referral_code || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-slate-500 text-xs uppercase tracking-wider">{k}</div>
                    <div className="text-slate-800 dark:text-white mt-0.5">{v}</div>
                  </div>
                ))}
                {selectedOrder.content_notes && (
                  <div className="col-span-full border-t border-slate-200 dark:border-slate-800/50 pt-3 mt-2">
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Content Notes</div>
                    <p className="text-slate-600 dark:text-slate-300">{selectedOrder.content_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
