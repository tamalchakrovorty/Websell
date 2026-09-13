import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import t from '../i18n';
import FadeIn from '../components/FadeIn';

const Pricing = () => {
  const { lang } = useLang();

  const plans = [
    { name: 'Starter', price: '৳15,000', period: 'one-time', desc: 'Perfect for small businesses getting started online', features: { pages: '5 Pages', hosting: '1 Year Hosting', domain: '.com Domain', revisions: '2 Revisions', support: '30-Day Support', maintenance: '—', seo: '—', ecommerce: '—' }, accent: false },
    { name: 'Business', price: '৳35,000', period: 'one-time', desc: 'Ideal for growing businesses that need more features', features: { pages: '10 Pages', hosting: '1 Year Hosting', domain: '.com Domain', revisions: '5 Revisions', support: '90-Day Support', maintenance: '৳2,000/mo', seo: '✓ SEO Setup', ecommerce: '—' }, accent: true },
    { name: 'Custom', price: '৳75,000+', period: 'one-time', desc: 'Full-featured solution for ambitious projects', features: { pages: 'Unlimited', hosting: '2 Year Hosting', domain: 'Premium Domain', revisions: 'Unlimited', support: '1-Year Support', maintenance: '৳2,000/mo', seo: '✓ Full SEO', ecommerce: '✓ E-commerce' }, accent: false },
  ];

  const addOns = [
    { name: 'Extra Pages', price: '৳1,500/page', desc: 'Additional pages beyond package limit' },
    { name: 'Email Hosting', price: '৳3,000/yr', desc: 'Professional email (you@yourdomain.com)' },
    { name: 'SEO Setup', price: '৳5,000', desc: 'On-page SEO, sitemap, meta tags' },
    { name: 'Monthly Maintenance', price: '৳2,000/mo', desc: 'Updates, backups, security patches, monitoring' },
  ];

  const featureKeys = ['pages', 'hosting', 'domain', 'revisions', 'support', 'maintenance', 'seo', 'ecommerce'];

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">{t('pricingTitle', lang)}</h1>
            <p className="text-slate-400 max-w-xl mx-auto">{t('pricingSubtitle', lang)}</p>
          </div>
        </FadeIn>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 100}>
              <div className={`card-futuristic p-8 h-full flex flex-col ${plan.accent ? 'glow-cyan-strong border-cyan-500/30 relative' : ''}`}>
                {plan.accent && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-[#020617] text-xs font-bold rounded-full shadow-lg shadow-cyan-500/30">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{plan.price}</span>
                  <span className="text-slate-600 text-sm ml-1">/ {plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {featureKeys.map(k => (
                    <li key={k} className="flex items-center gap-2 text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${plan.features[k] !== '—' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600'}`}>
                        {plan.features[k] !== '—' ? '✓' : '—'}
                      </span>
                      <span className={plan.features[k] !== '—' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-600'}>{plan.features[k]}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/order?plan=${plan.name}`} className={`text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.accent ? 'btn-primary w-full' : 'btn-outline w-full'}`}>
                  Get Started
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Comparison Table */}
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-6 text-center">Feature Comparison</h2>
            <div className="card-futuristic overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800/80">
                    <th className="text-left p-4 text-slate-500 font-medium">Feature</th>
                    {plans.map(p => (
                      <th key={p.name} className={`p-4 text-center font-bold ${p.accent ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-800 dark:text-white'}`}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureKeys.map((k, i) => (
                    <tr key={k} className={`border-b border-slate-200 dark:border-slate-800/30 ${i % 2 === 0 ? 'bg-slate-100 dark:bg-slate-800/10' : ''}`}>
                      <td className="p-4 text-slate-400 capitalize">{k}</td>
                      {plans.map(p => (
                        <td key={p.name} className={`p-4 text-center ${p.accent ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-600 dark:text-slate-300'}`}>
                          {p.features[k]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Add-ons */}
        <FadeIn>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-6 text-center">Add-ons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {addOns.map(a => (
                <div key={a.name} className="card-futuristic p-5">
                  <h3 className="text-slate-800 dark:text-white font-semibold mb-1">{a.name}</h3>
                  <div className="text-cyan-400 font-bold text-lg mb-2">{a.price}</div>
                  <p className="text-slate-500 text-sm">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Pricing;
