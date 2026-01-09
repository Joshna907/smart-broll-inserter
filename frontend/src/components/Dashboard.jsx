import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Sparkles, Upload, Clock, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateTimeline } from '../api/client';

export default function Dashboard({ onBack }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [customBRollJson, setCustomBRollJson] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [timelineData, setTimelineData] = useState(null);
  const [error, setError] = useState(null);

  // Logic
  const handleGenerate = async () => {
    if (!videoUrl) return;
    setIsProcessing(true);
    setError(null);
    setShowResults(false);

    try {
      let customBRolls = null;
      if (showAdvanced && customBRollJson.trim()) {
        try {
          const parsed = JSON.parse(customBRollJson);
          if (parsed.b_rolls && Array.isArray(parsed.b_rolls)) {
            customBRolls = parsed.b_rolls;
          } else if (Array.isArray(parsed)) {
            customBRolls = parsed;
          } else {
            throw new Error("Invalid format. Expected object with 'b_rolls' array or raw array.");
          }
        } catch (e) {
          throw new Error("Invalid User JSON: " + e.message);
        }
      }

      const data = await generateTimeline(videoUrl, customBRolls);
      setTimelineData(data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate timeline. Please ensure the backend is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalDuration = timelineData?.duration || 0;
  const insertions = timelineData?.steps || [];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <button
              onClick={onBack}
              className="text-sm text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
            </button>
            <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-gray-400">Upload your A-roll and let our AI handle the rest.</p>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Upload Source Video</h3>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste A-roll video URL or upload file..."
                className="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all font-mono text-sm"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isProcessing || !videoUrl}
              className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95 whitespace-nowrap h-fit"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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

          <div className="mt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Configuration
              <span className="text-xs text-gray-500">(Custom B-Rolls)</span>
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/10">
                    <label className="block text-sm text-gray-400 mb-2">Paste B-Roll JSON (optional)</label>
                    <textarea
                      value={customBRollJson}
                      onChange={(e) => setCustomBRollJson(e.target.value)}
                      placeholder='{ "b_rolls": [ ... ] } or [ ... ]'
                      className="w-full h-32 px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-xs text-gray-300 font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-y"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      If left empty, we'll use our default library of high-quality stock footage.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-3 text-purple-300">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="font-mono">ANALYZING CONTENT CONTEXT...</span>
                  </div>
                  <span className="text-gray-500 font-mono">STEP 1/3</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Timeline */}
              <div className="glass-panel rounded-3xl p-8 mb-8 border border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <Clock className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Smart Timeline</h3>
                      <p className="text-sm text-cyan-200/60 font-medium">AI Optimization • {insertions.length} Clips Inserted</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    {timelineData?.downloadUrl && (
                      <a
                        href={timelineData.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 group"
                      >
                        <Video className="w-5 h-5 group-hover:animate-pulse" />
                        Download Final Cut
                      </a>
                    )}
                    <div className="px-5 py-3 bg-black/30 rounded-xl border border-white/10 font-mono text-cyan-400 text-sm shadow-inner min-w-[120px] text-center">
                      <span className="text-gray-500 mr-2">DUR</span>
                      {totalDuration.toFixed(2)}s
                    </div>
                  </div>
                </div>

                {/* Transcript View */}
                <div className="mb-8 p-6 bg-black/40 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-purple-400">#</span> Transcript
                  </h3>
                  <div className="h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {timelineData?.transcript?.map((seg, idx) => (
                      <div key={idx} className="flex gap-4 text-sm hover:bg-white/5 p-2 rounded-lg transition-colors group">
                        <span className="text-gray-500 font-mono whitespace-nowrap pt-0.5">
                          {seg.start.toFixed(1)}s
                        </span>
                        <p className="text-gray-300 group-hover:text-white transition-colors">
                          {seg.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative pt-8 pb-4">
                  {/* Timeline Track Removed by User Request */}
                </div>
              </div>

              {/* Insertion Cards */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-purple-500 rounded-full" />
                  Insertion Strategy
                </h3>
                <div className="grid gap-4">
                  {insertions.map((insertion, index) => (
                    <motion.div
                      key={insertion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Time Thumbnail */}
                        <div className="flex-shrink-0 w-full md:w-24 h-24 bg-black/60 rounded-xl flex flex-col items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
                          <span className="text-2xl font-bold text-purple-400 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">CLIP ID</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-white truncate flex items-center gap-3">
                              {insertion.content.camera.replace(/_/g, ' ').toUpperCase()}
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] rounded border border-purple-500/20 font-mono">
                                {['1080p', '4K'][index % 2]}
                              </span>
                            </h4>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 text-gray-300 rounded-lg border border-white/10 text-xs font-mono group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-colors">
                              <Clock className="w-3 h-3" />
                              <span>{insertion.content.start.toFixed(1)}s - {insertion.content.end.toFixed(1)}s</span>
                            </div>
                          </div>

                          <div className="mb-4 pl-4 border-l-2 border-white/10 group-hover:border-purple-500/50 transition-colors">
                            <p className="text-gray-300 italic text-sm leading-relaxed">
                              "{insertion.content.reason}"
                            </p>
                          </div>

                          <div className="flex items-center gap-6 border-t border-white/5 pt-3">
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Relevance</div>
                              <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[95%]" />
                              </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Context Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Raw JSON View */}
              <div className="mt-8">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4"
                >
                  {showJson ? 'Hide' : 'Show'} Raw Output JSON
                </button>
                {showJson && (
                  <div className="bg-black/80 p-6 rounded-2xl border border-white/10 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono">
                      {JSON.stringify({
                        insertions: timelineData?.timeline?.map(({ url, ...rest }) => rest) // Show strict format
                      }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>


            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!showResults && !isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 opacity-50"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 dashed">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-500">Waiting for video input...</p>
          </motion.div>
        )}
      </div>
    </div >
  );
}