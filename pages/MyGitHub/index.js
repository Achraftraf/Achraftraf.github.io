import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Star, GitFork, Eye, Code, Activity,
  Award, RefreshCw, Clock, Calendar, TrendingUp,
  ArrowRight, MapPin, Building, Globe, ExternalLink
} from 'lucide-react';
import { ParticleBackground } from '../../components/particle-background';

const GitHubStatsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Placeholder for fetchStats function
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/github-stats');

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub stats');
        }

        const statsData = await response.json();
        setData(statsData);
      } catch (err) {
        setError(err.message);
        console.error("GitHub stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Helper function for language colors (example)
  const getLanguageColor = (language) => {
    switch (language) {
      case 'JavaScript': return 'from-yellow-400 to-yellow-600';
      case 'TypeScript': return 'from-blue-400 to-blue-600';
      case 'Python': return 'from-green-400 to-green-600';
      case 'HTML': return 'from-orange-400 to-orange-600';
      case 'CSS': return 'from-purple-400 to-purple-600';
      case 'Go': return 'from-cyan-400 to-cyan-600';
      case 'Rust': return 'from-red-400 to-red-600';
      case 'C++': return 'from-indigo-400 to-indigo-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Loading State - Robust Check
  if (loading || !data) {
    return (
      <div className="h-full min-h-screen bg-site flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-cyan-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl font-light tracking-wider">Analyzing GitHub Profile...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="h-full min-h-screen bg-site flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center relative z-10 p-4">
          <h2 className="text-red-500 text-3xl font-bold mb-4">Error!</h2>
          <p className="text-white text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-site h-screen w-full relative overflow-hidden selection:bg-cyan-500/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Background Elements - Fixed */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ParticleBackground />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen"
        />
      </div>

      {/* Scrollable Container - Hidden Scrollbar */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll overflow-x-hidden relative z-10 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Main Content Area */}
        <div className="pb-20 pt-32 lg:pt-36 px-4 sm:px-6 lg:px-8 xl:pr-40 max-w-7xl mx-auto">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
          >
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold mb-4 tracking-tight"
              >
                GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Stats</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 font-light max-w-lg"
              >
                Tracking contributions, analyzing code, and visualizing development progress.
              </motion.p>
            </div>

            {/* User Profile Card - Floating Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-[#20202d] p-6 rounded-2xl border border-white/10 backdrop-blur-xl flex items-center gap-6 pr-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20" />
                  <img
                    src={data?.user?.avatar_url}
                    alt={data?.user?.name || 'GitHub User'}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/10 relative z-10"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{data?.user?.name || 'User'}</h3>
                  <a href={`https://github.com/${data?.user?.username}`} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm hover:underline">@{data?.user?.username}</a>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    {data?.user?.location && <span className="flex items-center gap-1"><MapPin size={12} /> {data.user.location}</span>}
                    {data?.user?.company && <span className="flex items-center gap-1"><Building size={12} /> {data.user.company}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Grid - Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl font-bold">Analytics Overview</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Code, color: 'from-blue-500 to-cyan-500', value: data?.stats?.publicRepos || 0, label: 'Repos' },
                { icon: Star, color: 'from-yellow-500 to-orange-500', value: data?.stats?.totalStars || 0, label: 'Stars' },
                { icon: Activity, color: 'from-purple-500 to-pink-500', value: data?.stats?.followers || 0, label: 'Followers' },
                { icon: GitFork, color: 'from-green-500 to-emerald-500', value: data?.stats?.totalForks || 0, label: 'Forks' },
                { icon: Eye, color: 'from-indigo-500 to-purple-500', value: data?.stats?.totalWatchers || 0, label: 'Watchers' },
                { icon: Calendar, color: 'from-pink-500 to-rose-500', value: data?.stats?.accountAgeDays || 0, label: 'Days Active' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-[#20202d]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-[#20202d] transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-4 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Languages Section - Horizontal Scroll Feel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Award size={24} />
              </div>
              <h2 className="text-3xl font-bold">Top Languages</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data?.languages?.slice(0, 8).map(([language, count], index) => {
                const percentage = Math.round((count / (data?.stats?.publicRepos || 1)) * 100); // Approximate
                return (
                  <motion.div
                    key={language}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#20202d]/30 p-4 rounded-xl border border-white/5 relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-10 bg-gradient-to-bl ${getLanguageColor(language)} blur-xl transition-opacity duration-500`} />
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-lg">{language}</span>
                      <span className="text-xs text-gray-500 px-2 py-1 bg-white/5 rounded-full">{count} repos</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }} // Simple visualization, purely aesthetic
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getLanguageColor(language)}`}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Top Projects - The main attraction */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                  <Star size={24} />
                </div>
                <h2 className="text-3xl font-bold">Featured Projects</h2>
              </div>
              <a href={`https://github.com/${data?.user?.username}?tab=repositories`} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                View all <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.topRepos?.slice(0, 6).map((repo, index) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-[#20202d] rounded-2xl p-6 md:p-8 border border-white/5 hover:border-cyan-500/30 transition-all overflow-hidden"
                >
                  {/* Glow Effect */}
                  <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${getLanguageColor(repo.language)} blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{repo.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] border border-white/10 text-gray-400 uppercase tracking-widest">{repo.visibility}</span>
                      </div>
                      <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                      {repo.description || "No description provided for this repository."}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-4">
                        {repo.language && (
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getLanguageColor(repo.language)}`} />
                            {repo.language}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors"><Star size={14} /> {repo.stargazers_count}</span>
                        <span className="flex items-center gap-1 hover:text-blue-400 transition-colors"><GitFork size={14} /> {repo.forks_count}</span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Timeline - Clean List */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <GitBranch size={24} />
              </div>
              <h2 className="text-3xl font-bold">Latest Activity</h2>
            </div>

            <div className="space-y-4">
              {data?.recentActivity?.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between bg-[#20202d]/40 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all border-l-4 border-l-green-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <GitBranch size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {activity.repo?.name ? activity.repo.name.split('/')[1] : 'Unknown Repository'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.type ? activity.type.replace('Event', '') : 'Activity'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {formatDate(activity.created_at)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm py-10 border-t border-white/5 mt-20">
            <p>Data provided by GitHub API • Refreshed just now</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GitHubStatsPage;