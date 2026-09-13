import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const About = () => (
  <div className="min-h-screen px-4 pt-24 pb-20">
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <FadeIn>
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">About NexaWeb</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We're a team of passionate developers and designers helping businesses across Bangladesh build powerful online presences. From stunning websites to reliable hosting — we handle it all.
          </p>
        </div>
      </FadeIn>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <FadeIn delay={100}>
          <div className="card-futuristic p-8 h-full">
            <div className="text-3xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
              To make professional web development accessible to every business in Bangladesh — with transparent pricing, reliable hosting, and designs that actually convert visitors into customers.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="card-futuristic p-8 h-full">
            <div className="text-3xl mb-4">🔭</div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Our Vision</h2>
            <p className="text-slate-400 leading-relaxed">
              To become Bangladesh's most trusted web development partner — known for quality work, honest communication, and results that speak for themselves.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Why Choose Us */}
      <FadeIn>
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-8 text-center">Why Choose NexaWeb</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'Fast Delivery', desc: 'Get your website live in 5-14 business days depending on your package.' },
              { icon: '🎨', title: 'Custom Design', desc: 'No templates. Every website is custom-designed for your brand and goals.' },
              { icon: '🔒', title: 'Reliable Hosting', desc: '99.9% uptime with daily backups and SSL certificates included.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees. What you see is what you pay, bundled with domain & hosting.' },
              { icon: '🤝', title: 'Ongoing Support', desc: 'We don\'t disappear after launch. Get help whenever you need it.' },
              { icon: '📈', title: 'SEO-Ready', desc: 'Every site is built with SEO best practices to help you rank on Google.' },
            ].map((item, i) => (
              <div key={item.title} className="card-futuristic p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-slate-800 dark:text-white font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Timeline */}
      <FadeIn>
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-8 text-center">Our Journey</h2>
          <div className="space-y-6 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent"></div>
            {[
              { year: '2021', title: 'Founded', desc: 'Started with a vision to help Bangladeshi businesses go digital.' },
              { year: '2022', title: '100th Client', desc: 'Reached our first 100 satisfied clients across the country.' },
              { year: '2023', title: 'Expanded Services', desc: 'Added hosting bundles, SEO, and maintenance plans.' },
              { year: '2024', title: '200+ Projects', desc: 'Delivered 200+ projects with 99% client satisfaction rate.' },
            ].map((item, i) => (
              <div key={item.year} className="flex gap-6 items-start">
                <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 text-xs font-bold">{item.year.slice(2)}</span>
                </div>
                <div className="card-futuristic p-5 flex-1">
                  <div className="text-cyan-400 text-xs font-bold tracking-widest mb-1">{item.year}</div>
                  <h3 className="text-slate-800 dark:text-white font-bold">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Team */}
      <FadeIn>
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-8">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: 'Rafiq Hossain', role: 'Founder & Lead Developer', img: 'https://i.pravatar.cc/200?img=3' },
              { name: 'Anika Rahman', role: 'UI/UX Designer', img: 'https://i.pravatar.cc/200?img=5' },
              { name: 'Tanvir Hasan', role: 'Full-Stack Developer', img: 'https://i.pravatar.cc/200?img=8' },
            ].map(p => (
              <div key={p.name} className="card-futuristic p-6 text-center">
                <img src={p.img} alt={p.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-slate-200 dark:border-slate-700" loading="lazy" />
                <h3 className="text-slate-800 dark:text-white font-bold">{p.name}</h3>
                <p className="text-cyan-400 text-sm">{p.role}</p>
              </div>
            ))}
          </div>
          <Link to="/order" className="btn-primary inline-block mt-10 px-8 py-3">Work With Us →</Link>
        </div>
      </FadeIn>
    </div>
  </div>
);

export default About;
