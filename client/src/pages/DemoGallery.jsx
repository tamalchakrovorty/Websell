import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEMOS } from '../utils/helpers';
import FadeIn from '../components/FadeIn';

const DemoGallery = () => {
  const [demos, setDemos] = useState(DEMOS);
  const [category, setCategory] = useState('all');
  const [budget, setBudget] = useState('all');

  const categories = ['all', ...new Set(DEMOS.map(d => d.category))];
  const budgets = ['all', 'starter', 'business', 'premium'];

  useEffect(() => {
    let filtered = DEMOS;
    if (category !== 'all') filtered = filtered.filter(d => d.category.toLowerCase() === category);
    if (budget !== 'all') filtered = filtered.filter(d => d.budget_tier?.toLowerCase() === budget);
    setDemos(filtered);
  }, [category, budget]);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-3">Live Demo Gallery</h1>
            <p className="text-slate-400 max-w-xl mx-auto">Browse our portfolio and see what we can build for you</p>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={100}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${category === c ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-center">
              {budgets.map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${budget === b ? 'bg-violet-50 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30' : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, i) => (
            <FadeIn key={demo.id} delay={i * 60}>
              <div className="card-futuristic overflow-hidden group h-full flex flex-col">
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
                  <img src={demo.image} alt={demo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="flex gap-2 w-full">
                      <a href={demo.url} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2.5 px-4 flex-1 text-center">Live Demo →</a>
                      <Link to={`/order?demo=${demo.id}`} className="btn-outline text-xs py-2.5 px-4 flex-1 text-center">Order Similar</Link>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{demo.category}</span>
                    {demo.budget_tier && <span className="text-[11px] font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full capitalize">{demo.budget_tier}</span>}
                  </div>
                  <h3 className="text-slate-800 dark:text-white font-bold">{demo.title}</h3>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2 flex-1">{demo.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {demos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No demos match your filters</p>
            <button onClick={() => { setCategory('all'); setBudget('all'); }} className="btn-outline mt-4 text-sm">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoGallery;
