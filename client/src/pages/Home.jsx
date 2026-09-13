import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DEMOS } from '../utils/helpers';
import { useLang } from '../context/LanguageContext';
import t from '../i18n';
import FadeIn from '../components/FadeIn';

/* Animated counter hook */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return [count, ref];
}

const Home = () => {
  const [demos, setDemos] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const { lang } = useLang();

  useEffect(() => { setDemos(DEMOS.slice(0, 8)); }, []);

  const statTargets = [
    { num: 5, suffix: '+', label: { en: 'Years Active', bn: 'বছর সক্রিয়' } },
    { num: 200, suffix: '+', label: { en: 'Projects Delivered', bn: 'প্রকল্প সম্পন্ন' } },
    { num: 150, suffix: '+', label: { en: 'Happy Clients', bn: 'সন্তুষ্ট ক্লায়েন্ট' } },
    { num: 99, suffix: '%', label: { en: 'Uptime Guarantee', bn: 'আপটাইম গ্যারান্টি' } },
  ];
  const c0 = useCountUp(statTargets[0].num, 1500);
  const c1 = useCountUp(statTargets[1].num, 2000);
  const c2 = useCountUp(statTargets[2].num, 2000);
  const c3 = useCountUp(statTargets[3].num, 1800);
  const counters = [c0, c1, c2, c3];

  const plans = [
    { name: 'Starter', price: '৳15,000', period: 'one-time', features: ['5 Pages', '1 Year Hosting', '.com Domain', '2 Revisions', '30-Day Support'], accent: false },
    { name: 'Business', price: '৳35,000', period: 'one-time', features: ['10 Pages', '1 Year Hosting', '.com Domain', '5 Revisions', '90-Day Support', 'SEO Setup', 'Contact Form'], accent: true },
    { name: 'Custom', price: '৳75,000+', period: 'one-time', features: ['Unlimited Pages', '2 Year Hosting', 'Premium Domain', 'Unlimited Revisions', '1-Year Support', 'E-commerce Ready', 'Custom Features', 'Priority Support'], accent: false },
  ];

  const caseStudies = [
    { title: 'Spice Garden Restaurant', category: 'Restaurant', problem: 'No online presence, losing customers to competitors with websites.', solution: 'Built a full ordering website with menu, gallery, and WhatsApp integration.', result: '280% increase in online orders within 3 months.', icon: '🍽️' },
    { title: 'ModaStyle BD', category: 'E-commerce', problem: 'Selling only through Facebook, missing out on search traffic.', solution: 'Created a modern e-commerce site with payment gateway integration.', result: '৳15L+ monthly revenue, 45% from organic search.', icon: '👗' },
    { title: 'TechStart Solutions', category: 'Business', problem: 'Outdated website that didn\'t reflect their actual expertise.', solution: 'Complete redesign with service pages, testimonials, and lead capture.', result: '3x more inbound leads per month.', icon: '💻' },
  ];

  const testimonials = [
    { name: 'Sarah Khan', photo: 'https://i.pravatar.cc/150?img=1', quote: 'NexaWeb transformed our online presence! Our business grew 300% in 6 months. The design is stunning and our customers love it.', business: 'Restaurant Owner', rating: 5 },
    { name: 'Rahim Ahmed', photo: 'https://i.pravatar.cc/150?img=2', quote: 'Professional, fast, and exceeded expectations. The domain + hosting bundle made everything so simple.', business: 'E-commerce Store', rating: 5 },
    { name: 'Fatima Begum', photo: 'https://i.pravatar.cc/150?img=5', quote: 'Best investment for our small business. We got a professional site within a week and the support has been amazing.', business: 'Fashion Boutique', rating: 5 },
  ];

  const faqs = [
    { q: 'How long does it take to build my website?', a: 'Starter sites are delivered in 5-7 business days. Business sites take 10-14 days. Custom projects are scoped individually, typically 2-4 weeks.' },
    { q: 'Can I edit content after the website is live?', a: 'Yes! All our sites come with a simple admin panel. We also provide a free 30-minute walkthrough to help you manage your content.' },
    { q: 'What happens after my hosting expires?', a: 'We\'ll remind you 30 days before expiry. Renewal is simple and affordable. If hosting expires, your site stays safe for 30 more days before any action.' },
    { q: 'What is your refund policy?', a: 'We offer a full refund before design work begins. Once design starts, refunds are prorated. See our full Refund Policy page for details.' },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/8 dark:bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
              Trusted by 150+ businesses across Bangladesh
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              <span className="text-slate-800 dark:text-white">{t('heroTitle1', lang)}</span><br />
              <span className="gradient-text">{t('heroTitle2', lang)}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('heroSubtitle', lang)}
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="btn-primary text-base px-8 py-3.5 inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                {t('viewPackages', lang)}
              </Link>
              <Link to="/demos" className="btn-outline text-base px-8 py-3.5 inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                {t('seeDemos', lang)}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="py-16 border-y border-slate-200 dark:border-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statTargets.map((stat, i) => (
                <div key={i} ref={counters[i][1]} className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 text-glow mb-1">
                    {counters[i][0]}{stat.suffix}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label[lang]}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mt-10 overflow-hidden opacity-40">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(2)].map((_, j) => (
                  <React.Fragment key={j}>
                    {['Google', 'Meta', 'Shopify', 'Stripe', 'Vercel', 'Cloudflare', 'Namecheap', 'cPanel'].map(name => (
                      <span key={`${j}-${name}`} className="mx-8 text-lg font-bold text-slate-400 dark:text-slate-600 tracking-wider">{name}</span>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== PRICING CARDS ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/3 to-transparent dark:from-cyan-500/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">{t('pricingTitle', lang)}</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('pricingSubtitle', lang)}</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 100}>
                <div className={`card-futuristic p-8 h-full flex flex-col ${plan.accent ? 'glow-cyan-strong border-cyan-500/30 relative' : ''}`}>
                  {plan.accent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-white dark:text-[#020617] text-xs font-bold rounded-full shadow-lg shadow-cyan-500/30">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                        {f}
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
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">How It Works</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">From order to live website in 4 simple steps</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Choose Package', desc: 'Pick the plan that fits your business needs and budget.', icon: '📋' },
              { step: '02', title: 'Share Your Vision', desc: 'Tell us about your business, content, and design preferences.', icon: '💬' },
              { step: '03', title: 'We Build It', desc: 'Our team crafts your custom website with pixel-perfect design.', icon: '⚡' },
              { step: '04', title: 'Go Live!', desc: 'Review, approve, and launch your website with domain & hosting.', icon: '🚀' },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={i * 100}>
                <div className="card-futuristic p-6 text-center relative">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <div className="text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-2 tracking-widest">STEP {s.step}</div>
                  <h3 className="text-slate-800 dark:text-white font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm">{s.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-cyan-500/40 to-transparent"></div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE DEMO SHOWCASE ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/3 to-transparent dark:from-transparent dark:via-violet-500/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">{t('demoTitle', lang)}</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">See what we've built for other businesses like yours</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {demos.map((demo, i) => (
              <FadeIn key={demo.id} delay={i * 80}>
                <div className="card-futuristic overflow-hidden group">
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
                    <img
                      src={demo.image}
                      alt={demo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#0a0e1a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <a href={demo.url} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2 px-3 flex-1 text-center">View Demo</a>
                        <Link to={`/order?demo=${demo.id}`} className="btn-outline text-xs py-2 px-3 flex-1 text-center">Order Similar</Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{demo.category}</span>
                    <h3 className="text-slate-800 dark:text-white font-semibold mt-2 text-sm">{demo.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{demo.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div className="text-center mt-10">
              <Link to="/demos" className="btn-outline inline-flex items-center gap-2">
                View All Demos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Success Stories</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Real results from real businesses</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs, i) => (
              <FadeIn key={cs.title} delay={i * 120}>
                <div className="card-futuristic p-6 h-full flex flex-col">
                  <div className="text-4xl mb-4">{cs.icon}</div>
                  <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider w-fit mb-3">{cs.category}</span>
                  <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-4">{cs.title}</h3>
                  <div className="space-y-3 text-sm flex-1">
                    <div>
                      <div className="text-red-500 dark:text-red-400/80 font-semibold text-xs uppercase tracking-wider mb-1">Challenge</div>
                      <p className="text-slate-600 dark:text-slate-400">{cs.problem}</p>
                    </div>
                    <div>
                      <div className="text-cyan-600 dark:text-cyan-400/80 font-semibold text-xs uppercase tracking-wider mb-1">Solution</div>
                      <p className="text-slate-600 dark:text-slate-400">{cs.solution}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                    <div className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">{cs.result}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/3 to-transparent dark:from-cyan-500/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">What Clients Say</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Don't just take our word for it</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <FadeIn key={test.name} delay={i * 120}>
                <div className="card-futuristic p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm italic flex-1 leading-relaxed">"{test.quote}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                    <img src={test.photo} alt={test.name} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700" loading="lazy" />
                    <div>
                      <div className="text-slate-800 dark:text-white font-semibold text-sm">{test.name}</div>
                      <div className="text-slate-500 text-xs">{test.business}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-500 dark:text-slate-400">Everything you need to know</p>
            </div>
          </FadeIn>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className={`card-futuristic overflow-hidden transition-all ${openFaq === i ? 'glow-cyan' : ''}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-slate-800 dark:text-white font-semibold text-sm pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <div className={`transition-all duration-300 ease-out ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <p className="px-5 pb-5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="card-futuristic glow-cyan-strong p-10 sm:p-14 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/10 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Ready to Launch Your Website?</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
                  Join 150+ businesses that trust NexaWeb for their online presence. Get started today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/order" className="btn-primary text-base px-8 py-3.5 inline-flex items-center justify-center gap-2">
                    Start Your Order
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                  <a href="https://wa.me/8801774567162" target="_blank" rel="noreferrer" className="btn-outline text-base px-8 py-3.5 inline-flex items-center justify-center gap-2">
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Home;
