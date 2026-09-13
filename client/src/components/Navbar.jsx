import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang, theme, toggleTheme } = useLang();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: { en: 'Home', bn: 'হোম' } },
    { path: '/demos', label: { en: 'Demos', bn: 'ডেমো' } },
    { path: '/pricing', label: { en: 'Pricing', bn: 'প্রাইসিং' } },
    { path: '/about', label: { en: 'About', bn: 'আমাদের সম্পর্কে' } },
  ];

  return (
    <>
      <nav className={`glass fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md shadow-black/5 dark:shadow-black/20 border-b border-cyan-500/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-1 group">
                <span className="text-2xl font-extrabold gradient-text">Nexa</span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">Web</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label[lang]}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)]"></span>
                  )}
                </Link>
              ))}
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all border border-slate-200 dark:border-slate-700/50"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-slate-700/50 ml-1"
              >
                {lang === 'en' ? 'বাং' : 'EN'}
              </button>
              <Link
                to="/order"
                className="ml-2 btn-primary text-sm"
              >
                Order Now
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                onClick={toggleLang}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50"
              >
                {lang === 'en' ? 'বাং' : 'EN'}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-500 dark:text-slate-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-current rounded-full transform transition-all duration-300 origin-left ${isOpen ? 'rotate-45 translate-y-[-1px]' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-200 ${isOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current rounded-full transform transition-all duration-300 origin-left ${isOpen ? '-rotate-45 translate-y-[1px]' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 glass border-b border-cyan-500/10 transform transition-all duration-300 ease-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-l-4 border-cyan-500 dark:border-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-white/5'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {item.label[lang]}
            </Link>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-700/50 mt-2 pt-3">
            <Link to="/order" className="block text-center btn-primary text-sm">
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
