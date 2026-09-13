import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

export default function Refund() {
  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link to="/" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">← Back to Home</Link>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-4">Refund Policy</h1>
            <p className="text-slate-500 text-sm mt-2">Last updated: September 2026</p>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="card-futuristic p-8">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">Full refund before design work begins. Once design work starts, refunds are prorated based on work completed. No refunds after final delivery and approval. Hosting fees are non-refundable once activated. Domain registration fees are non-refundable per ICANN policy. Refund requests should be sent to hello@nexaweb.com within 7 days. We aim to process all refunds within 5-7 business days.</p>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
              <p className="text-slate-500 text-sm">For questions about this policy, contact us at <a href="mailto:hello@nexaweb.com" className="text-cyan-400 hover:text-cyan-300">hello@nexaweb.com</a></p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
