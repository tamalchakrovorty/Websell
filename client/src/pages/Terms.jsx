import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

export default function Terms() {
  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link to="/" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">← Back to Home</Link>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-4">Terms of Service</h1>
            <p className="text-slate-500 text-sm mt-2">Last updated: September 2026</p>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="card-futuristic p-8">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">By using NexaWeb services, you agree to these terms. We provide web development, domain registration, and hosting services. Payment is required before work begins. Domain and hosting are bundled with website packages as specified. We reserve the right to modify service offerings. Client content must not violate applicable laws. We are not responsible for third-party service disruptions.</p>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
              <p className="text-slate-500 text-sm">For questions about this policy, contact us at <a href="mailto:hello@nexaweb.com" className="text-cyan-400 hover:text-cyan-300">hello@nexaweb.com</a></p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
