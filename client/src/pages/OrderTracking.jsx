import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api';
import FadeIn from '../components/FadeIn';

const statuses = ['received', 'in design', 'review', 'live'];
const statusColors = { received: 'cyan', 'in design': 'violet', review: 'amber', live: 'emerald' };
const statusIcons = { received: '📋', 'in design': '🎨', review: '👁️', live: '🚀' };

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id).then(setOrder).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-futuristic p-8 text-center max-w-md">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Order Not Found</h1>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    </div>
  );

  const currentIdx = statuses.indexOf(order.status);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Order Tracking</h1>
            <p className="text-slate-500">Order #{id?.slice(0, 8)}</p>
          </div>
        </FadeIn>

        {/* Progress bar */}
        <FadeIn delay={100}>
          <div className="card-futuristic p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              {statuses.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                      i <= currentIdx ? `bg-${statusColors[s]}-500/20 border-2 border-${statusColors[s]}-400 text-slate-800 dark:text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]` : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600'
                    }`}>
                      {statusIcons[s]}
                    </div>
                    <span className={`mt-2 text-xs font-medium capitalize text-center ${i <= currentIdx ? 'text-slate-800 dark:text-white' : 'text-slate-600'}`}>{s}</span>
                  </div>
                  {i < statuses.length - 1 && (
                    <div className="flex-1 mx-2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-0 sm:-mt-5">
                      <div className={`h-full rounded-full transition-all duration-700 ${i < currentIdx ? 'bg-cyan-500' : 'bg-slate-100 dark:bg-slate-800'}`} style={{ width: i < currentIdx ? '100%' : '0%' }}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Status</div>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-white capitalize">{order.status}</div>
            </div>
          </div>
        </FadeIn>

        {/* Order details */}
        <FadeIn delay={200}>
          <div className="card-futuristic p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Package', order.package_name],
                ['Business', order.business_name],
                ['Category', order.business_category],
                ['Domain', order.preferred_domain || 'TBD'],
                ['Email', order.contact_email],
                ['Total', `৳${Number(order.total).toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-slate-500 text-xs uppercase tracking-wider">{k}</div>
                  <div className="text-slate-800 dark:text-white mt-0.5 font-medium">{v}</div>
                </div>
              ))}
            </div>
            {order.content_notes && (
              <div className="border-t border-slate-200 dark:border-slate-800/50 pt-4">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Notes</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{order.content_notes}</p>
              </div>
            )}
            {order.admin_notes && (
              <div className="border-t border-slate-200 dark:border-slate-800/50 pt-4">
                <div className="text-cyan-400 text-xs uppercase tracking-wider mb-1">Team Notes</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{order.admin_notes}</p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
