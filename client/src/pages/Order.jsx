import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitOrder } from '../api';
import { DEMOS } from '../utils/helpers';
import t from '../i18n';

export default function Order() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    packageName: 'Starter', maintenance: false,
    businessName: '', businessCategory: '', contentNotes: '',
    preferredDomain: '', referenceDemoId: '',
    contactName: '', contactEmail: '', contactWhatsapp: '',
    contactMethod: 'email', referralCode: '', total: 0
  });
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && ['Starter', 'Business', 'Custom'].includes(plan)) setForm(p => ({ ...p, packageName: plan }));
    const demoId = searchParams.get('demo');
    if (demoId) {
      const demo = DEMOS.find(d => d.id === Number(demoId));
      if (demo) setForm(p => ({ ...p, referenceDemoId: demo.id, businessCategory: demo.category, contentNotes: demo.hint }));
    }
  }, [searchParams]);

  const update = (key, value) => { setForm(p => ({ ...p, [key]: value })); setErrors(p => ({ ...p, [key]: '' })); };

  const validate = () => {
    const e = {};
    if (step === 2) {
      if (!form.businessName.trim()) e.businessName = 'Required';
      if (!form.businessCategory) e.businessCategory = 'Required';
    }
    if (step === 3) {
      if (!form.contactName.trim()) e.contactName = 'Required';
      if (!form.contactEmail.trim()) e.contactEmail = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) e.contactEmail = 'Invalid email';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const prices = { Starter: 15000, Business: 35000, Custom: 75000 };

  const handleNext = () => {
    if (step === 1) {
      setForm(p => ({ ...p, total: (prices[form.packageName] || 15000) + (form.maintenance ? 2000 : 0) }));
      setStep(2);
      return;
    }
    if (validate()) setStep(step + 1);
  };

  const handleSubmit = async () => {
    setStatus('loading'); setError('');
    try {
      const result = await submitOrder(form);
      setStatus('success'); setTrackingLink(result.tracking_link);
    } catch (e) {
      setStatus('error');
      if (e.message.includes('not connected') || e.message.includes('503')) {
        setError('Our order system is temporarily unavailable. Please try again in a few minutes or contact us on WhatsApp.');
      } else {
        setError(e.message || 'Something went wrong. Please try again.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="card-futuristic glow-cyan p-10 text-center max-w-lg w-full">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path className="stroke-2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4">Order Submitted!</h1>
          <p className="text-slate-400 mb-6">Thank you, {form.contactName}. Your {form.packageName} order has been received. A confirmation email has been sent to {form.contactEmail}.</p>
          <div className="glass-light rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1">Your tracking link:</p>
            <p className="font-mono text-cyan-400 text-sm break-all">{window.location.origin}/order/track/{trackingLink}</p>
          </div>
          <a href={`/order/track/${trackingLink}`} className="btn-primary inline-block px-6 py-3">Track Your Order</a>
        </div>
      </div>
    );
  }

  const fieldClass = (key) => `mt-1 block w-full bg-white dark:bg-slate-800/50 border rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-slate-400 dark:placeholder-slate-500 ${errors[key] ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-700/50'}`;
  const labelClass = 'text-sm font-medium text-slate-600 dark:text-slate-400';

  const steps = ['Select Package', 'Business Details', 'Contact Info', 'Review'];

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2 text-center">Order Your Website</h1>
        <p className="text-slate-500 text-center mb-10">Fill in the details below and we'll get started</p>

        {/* Step indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step > i + 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : step === i + 1 ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 border border-slate-200 dark:border-slate-700/50'}`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center hidden sm:block ${step === i + 1 ? 'text-cyan-400' : 'text-slate-600'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-0.5 bg-slate-100 dark:bg-slate-800 mt-0 sm:-mt-5">
                    <div className={`h-full transition-all duration-500 ${step > i + 1 ? 'bg-cyan-500' : 'bg-slate-100 dark:bg-slate-800'}`} style={{ width: step > i + 1 ? '100%' : '0%' }}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card-futuristic p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Choose Your Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[['Starter', '৳15,000', '5 pages, 1yr hosting'], ['Business', '৳35,000', '10 pages, SEO, forms'], ['Custom', '৳75,000+', 'Unlimited, e-commerce']].map(([pkg, price, desc]) => (
                  <button key={pkg} onClick={() => update('packageName', pkg)}
                    className={`p-5 rounded-xl border-2 text-center transition-all ${form.packageName === pkg ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'border-slate-200 dark:border-slate-700/50 hover:border-slate-600'}`}>
                    <div className="font-bold text-slate-800 dark:text-white">{pkg}</div>
                    <div className="text-lg font-extrabold text-cyan-400 mt-1">{price}</div>
                    <div className="text-xs text-slate-500 mt-1">{desc}</div>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 cursor-pointer hover:border-slate-600 transition-colors">
                <input type="checkbox" checked={form.maintenance} onChange={(e) => update('maintenance', e.target.checked)} className="w-5 h-5 accent-cyan-500" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-white text-sm">Monthly Maintenance Add-on</div>
                  <div className="text-xs text-slate-500">Updates, backups, security — ৳2,000/mo</div>
                </div>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Business Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Business Name *</label>
                  <input value={form.businessName} onChange={(e) => update('businessName', e.target.value)} className={fieldClass('businessName')} placeholder="Your business name" />
                  {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={form.businessCategory} onChange={(e) => update('businessCategory', e.target.value)} className={fieldClass('businessCategory')}>
                    <option value="">Select category</option>
                    {['Restaurant', 'Portfolio', 'Business', 'Event', 'E-commerce'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.businessCategory && <p className="text-red-400 text-xs mt-1">{errors.businessCategory}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Content Notes</label>
                <textarea value={form.contentNotes} onChange={(e) => update('contentNotes', e.target.value)} className={`${fieldClass()} min-h-24`} placeholder="What should your website include?" />
              </div>
              <div>
                <label className={labelClass}>Preferred Domain</label>
                <input value={form.preferredDomain} onChange={(e) => update('preferredDomain', e.target.value)} className={fieldClass()} placeholder="yourbusiness.com" />
              </div>
              <div>
                <label className={labelClass}>Reference Demo</label>
                <select value={form.referenceDemoId} onChange={(e) => update('referenceDemoId', e.target.value)} className={fieldClass()}>
                  <option value="">No preference</option>
                  {DEMOS.map(d => <option key={d.id} value={d.id}>{d.title} — {d.category}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input value={form.contactName} onChange={(e) => update('contactName', e.target.value)} className={fieldClass('contactName')} placeholder="Your name" />
                  {errors.contactName && <p className="text-red-400 text-xs mt-1">{errors.contactName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} className={fieldClass('contactEmail')} placeholder="you@example.com" />
                  {errors.contactEmail && <p className="text-red-400 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <label className={labelClass}>WhatsApp Number</label>
                  <input value={form.contactWhatsapp} onChange={(e) => update('contactWhatsapp', e.target.value)} className={fieldClass()} placeholder="+880" />
                </div>
                <div>
                  <label className={labelClass}>Preferred Contact</label>
                  <select value={form.contactMethod} onChange={(e) => update('contactMethod', e.target.value)} className={fieldClass()}>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Referred By (optional)</label>
                <input value={form.referralCode} onChange={(e) => update('referralCode', e.target.value)} className={fieldClass()} placeholder="Referral code or name" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Review Your Order</h2>
              <div className="glass-light rounded-xl p-5 space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    ['Package', form.packageName],
                    ['Maintenance', form.maintenance ? 'Yes — ৳2,000/mo' : 'No'],
                    ['Business', form.businessName || '-'],
                    ['Category', form.businessCategory || '-'],
                    ['Domain', form.preferredDomain || 'TBD'],
                    form.referralCode ? ['Referral', form.referralCode] : null,
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k}><div className="text-slate-500 text-xs uppercase tracking-wider">{k}</div><div className="text-slate-800 dark:text-white mt-0.5">{v}</div></div>
                  ))}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700/50 pt-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wider">Contact</div>
                  <div className="text-slate-800 dark:text-white mt-0.5">{form.contactName} — {form.contactEmail}</div>
                  {form.contactWhatsapp && <div className="text-slate-500 text-xs">WhatsApp: {form.contactWhatsapp}</div>}
                </div>
              </div>
              <div className="card-futuristic glow-cyan p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Total Amount</div>
                  <div className="text-3xl font-extrabold text-slate-800 dark:text-white">৳{form.total.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">one-time payment</div>
                </div>
                <div className="text-5xl">📦</div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{error}</div>}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-outline text-sm">← Back</button>
            )}
            <div className="flex gap-3 ml-auto">
              {step < 4 && <button onClick={handleNext} className="btn-primary text-sm">Continue →</button>}
              {step === 4 && (
                <button onClick={handleSubmit} disabled={status === 'loading'} className="bg-emerald-500 text-slate-800 dark:text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                  {status === 'loading' ? 'Submitting...' : 'Submit Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
