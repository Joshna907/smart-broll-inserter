import { motion } from 'framer-motion';
import { Sparkles, Zap, Play } from 'lucide-react';

export default function Hero({ onStart }) {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-600/20 rounded-full blur-[120px]"
                    />
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-purple-200 mb-8 border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="tracking-wide">AI-Powered Video Editing Assistant</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
                >
                    Automate Your
                    <br />
                    <span className="gradient-text">B-Roll Workflow</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Transform your talking head videos into engaging content. Our AI understands context and perfectly times B-roll insertions in seconds.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-5 justify-center"
                >
                    <button
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-cyan-200 opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="relative flex items-center gap-2">
                            Start Creating
                            <Zap className="w-5 h-5 group-hover:fill-current" />
                        </span>
                    </button>

                    <button className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <span className="flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </span>
                    </button>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-24 relative mx-auto max-w-5xl"
                >
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-20 blur-2xl" />
                    <div className="relative bg-[#0a0a16] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="p-2">
                            <div className="relative h-[400px] w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <Play className="w-8 h-8 text-white/50 ml-1" />
                                    </div>
                                    <p className="text-gray-500 font-mono text-sm">Preview Mode.mp4</p>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-10 right-10 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs font-mono text-green-400">AI PROCESSING</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
