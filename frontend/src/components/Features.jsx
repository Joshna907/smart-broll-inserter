import { motion } from 'framer-motion';
import { Sparkles, Zap, Video, CloudLightning, Brain, Smartphone } from 'lucide-react';

const features = [
    {
        icon: Brain,
        title: 'Contextual AI Analysis',
        description: 'Our advanced models understand the nuance of your speech to pick perfectly relevant footage.'
    },
    {
        icon: Zap,
        title: 'Instant Generation',
        description: 'Get a complete B-roll timeline in seconds, not hours. Speed up your workflow by 10x.'
    },
    {
        icon: Video,
        title: 'Stock Library Integration',
        description: 'Access millions of royalty-free clips automatically matched to your content.'
    },
    {
        icon: CloudLightning,
        title: 'Cloud Rendering',
        description: 'No heavy lifting for your computer. All processing happens on our high-speed servers.'
    },
    {
        icon: Sparkles,
        title: 'Auto-beat Sync',
        description: 'Cuts and transitions are automatically timed to the rhythm of your speech.'
    },
    {
        icon: Smartphone,
        title: 'Vertical & Horizontal',
        description: 'Optimized for both YouTube Long-form and Shorts/TikTok/Reels.'
    }
];

export default function Features() {
    return (
        <section className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Intelligent <span className="gradient-text">Video Enhancement</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Packed with powerful features to automate the most tedious parts of video editing.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                <feature.icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
