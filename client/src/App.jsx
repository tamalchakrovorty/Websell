import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsappButton from './components/WhatsappButton';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';

const Home = lazy(() => import('./pages/Home'));
const DemoGallery = lazy(() => import('./pages/DemoGallery'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Order = lazy(() => import('./pages/Order'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demos" element={<DemoGallery />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/track/:trackingLink" element={<OrderTracking />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsappButton />
      <ScrollToTopButton />
    </>
  );
}

export default App;
