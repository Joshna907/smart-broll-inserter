import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Clock, Video, Play } from 'lucide-react';
import { generatePlan } from "../api/planApi";


function Dashboard() {
  const [videoUrl, setVideoUrl] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
const [plan, setPlan] = useState(null);
const [error, setError] = useState(null);

const handleGenerate = async () => {
  try {
    setIsProcessing(true);
    setError(null);

    const payload = {
      a_roll: {
        url: videoUrl,
        metadata: "User uploaded talking video"
      },
      b_rolls: [] // backend already handles default logic
    };

    const result = await generatePlan(payload);

    setPlan(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsProcessing(false);
  }
};

const totalDuration = plan?.duration;
const insertions = plan?.steps || [];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Smart B-Roll Inserter</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
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
            <h2 className="text-xl font-semibold text-white">Upload A-Roll Video</h2>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL or upload file..."
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
{error && (
  <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300">
    {error}
  </div>
)}

        {/* Results Section */}
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Timeline Visualization */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">Timeline Overview</h2>
                </div>
                <div className="text-sm text-gray-400">
                  Total Duration: <span className="text-white font-semibold">{totalDuration}s</span>
                </div>
              </div>

              {/* Horizontal Timeline */}
              <div className="relative">
                {/* Timeline Bar */}
                <div className="relative h-16 bg-slate-900/80 rounded-xl overflow-hidden">
                  {/* Base layer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700" />
                  
                  {/* B-roll insertion blocks */}
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

                {/* Time markers */}
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
              <h2 className="text-xl font-semibold text-white mb-6">B-Roll Insertions</h2>
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
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-40 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500 transition-colors">
                        <Play className="w-8 h-8 text-purple-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">
                            {insertion.content.camera.replace('_', ' ').toUpperCase()}
                          </h3>
                          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">
                              {insertion.content.start}s - {insertion.content.end}s
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-400 mb-3">
                          {insertion.content.reason}
                        </p>

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
        {!plan && !isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No video uploaded yet</h3>
            <p className="text-gray-600">Upload your A-roll video to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;