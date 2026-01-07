import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Sparkles, Play, Zap, Upload, Clock, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import mockPlan from './mockPlan';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 2000);
  };

  const totalDuration = mockPlan.duration;
  const insertions = mockPlan.steps;

  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative">
          {/* NAV */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Smart B-Roll Inserter</h1>
            </div>
            <button
              onClick={() => setShowDashboard(true)}
              className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Try Now
            </button>
          </motion.nav>

          {/* HERO */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-200 mb-8 border border-white/20"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Video Editing Assistant
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Automatically Plan & Insert
                <br />
                <span className="gradient-text">B-Roll for Your Videos</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
              >
                Upload your A-roll, let AI understand the context, and receive a perfectly timed B-roll timeline. Save hours of editing time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => setShowDashboard(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2 justify-center">
                    Get Started
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="flex items-center gap-2 justify-center">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>

                <div className="bg-slate-900/80 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                    <Video className="w-4 h-4" />
                    <span>Video Timeline Preview</span>
                  </div>

                  <div className="relative h-20 bg-slate-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600" />

                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute left-1/4 top-2 bottom-2 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded"
                    />
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute left-1/2 top-2 bottom-2 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded"
                    />
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute left-3/4 top-2 bottom-2 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded"
                    />
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0:00</span>
                    <span>0:30</span>
                    <span>1:00</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Features */}
          <section className="max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-white mb-4">
                Intelligent Video Enhancement
              </h3>
              <p className="text-xl text-gray-400">
                Powered by AI to understand your content perfectly
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'AI Analysis',
                  description: 'Advanced AI analyzes your video content and speech patterns'
                },
                {
                  icon: Zap,
                  title: 'Instant Suggestions',
                  description: 'Get contextual B-roll recommendations in seconds'
                },
                {
                  icon: Video,
                  title: 'Perfect Timing',
                  description: 'Precise insertion points that enhance your narrative'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="relative bg-slate-950 border-t border-white/10 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Brand Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Smart B-Roll Inserter</span>
                  </div>
                  <p className="text-gray-400 mb-4 max-w-md">
                    AI-powered video editing assistant that automatically plans and generates B-roll insertions for your talking videos.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group">
                      <Twitter className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group">
                      <Github className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group">
                      <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group">
                      <Mail className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </a>
                  </div>
                </div>

                {/* Product Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Demo</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a>
                    </li>
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-400 text-sm">
                    © 2026 Smart B-Roll Inserter. All rights reserved.
                  </p>
                  <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Smart B-Roll Inserter</span>
            </div>
            <button
              onClick={() => setShowDashboard(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-400">Upload your video and let AI do the magic</p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Upload A-Roll Video</h3>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste A-roll video URL or upload file..."
              className="flex-1 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Timeline
                </span>
              )}
            </button>
          </div>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <div className="flex items-center gap-3 text-purple-300 mb-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm">AI is analyzing your video...</span>
              </div>
              <div className="h-2 bg-slate-900/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Timeline */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Timeline Overview</h3>
                </div>
                <div className="text-sm text-gray-400">
                  Total Duration: <span className="text-white font-semibold">{totalDuration}s</span>
                </div>
              </div>

              <div className="relative">
                <div className="relative h-16 bg-slate-900/80 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700" />

                  {insertions.map((insertion, index) => {
                    const startPercent = (insertion.content.start / totalDuration) * 100;
                    const widthPercent = ((insertion.content.end - insertion.content.start) / totalDuration) * 100;

                    return (
                      <motion.div
                        key={insertion.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="absolute top-2 bottom-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all group"
                        style={{
                          left: `${startPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            B-roll {index + 1}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-3 px-2">
                  {[0, 15, 30, 45, Math.floor(totalDuration)].map((time) => (
                    <div key={time} className="text-xs text-gray-500">
                      0:{time.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insertion Cards */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">B-Roll Insertions</h3>
              <div className="grid gap-6">
                {insertions.map((insertion, index) => (
                  <motion.div
                    key={insertion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-40 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500 transition-colors">
                        <Play className="w-8 h-8 text-purple-400" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">
                            {insertion.content.camera.replace('_', ' ').toUpperCase()}
                          </h4>
                          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">
                              {insertion.content.start}s - {insertion.content.end}s
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 mb-3">{insertion.content.reason}</p>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-slate-900/80 rounded-lg text-xs text-gray-400">
                            Duration: {(insertion.content.end - insertion.content.start).toFixed(1)}s
                          </span>
                          <span className="px-3 py-1 bg-slate-900/80 rounded-lg text-xs text-gray-400">
                            Position: {insertion.content.start}s
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!showResults && !isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-400 mb-2">No video uploaded yet</h4>
            <p className="text-gray-600">Upload your A-roll video to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}