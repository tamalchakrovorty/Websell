import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

export default function Privacy() {
  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link to="/" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">← Back to Home</Link>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-4">Privacy Policy</h1>
            <p className="text-slate-500 text-sm mt-2">Last updated: September 2026</p>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="card-futuristic p-8">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">NexaWeb collects only the information necessary to fulfill your order: name, email, business details, and payment information. We do not sell or share your personal data with third parties except as required to deliver our services (e.g., domain registration, hosting). We use industry-standard security measures. Contact us at hello@nexaweb.com for any privacy-related questions or data deletion requests.</p>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
              <p className="text-slate-500 text-sm">For questions about this policy, contact us at <a href="mailto:hello@nexaweb.com" className="text-cyan-400 hover:text-cyan-300">hello@nexaweb.com</a></p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
