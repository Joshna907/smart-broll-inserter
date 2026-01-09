import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

export default function Navbar({ onTryNow }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
    >
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Smart B-Roll Details</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors">Features</button>
          <button className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors">How it Works</button>
          <button className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors">Pricing</button>
          
          <button
            onClick={onTryNow}
            className="px-5 py-2 bg-white text-black rounded-lg font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105"
          >
            Try Now
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
