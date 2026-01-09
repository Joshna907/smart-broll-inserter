import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#030014] overflow-x-hidden selection:bg-purple-500/30">
      <Navbar onTryNow={() => setShowDashboard(true)} />
      <Hero onStart={() => setShowDashboard(true)} />
      <Features />
      <Footer />
    </div>
  );
}