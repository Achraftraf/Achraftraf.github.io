import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitFork, Eye, Code, Activity, Award, RefreshCw, Clock, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { ParticleBackground } from './particle-background';

const GitHubStatsComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/github-stats');

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub stats');
      }

      const statsData = await response.json();
      setData(statsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'from-yellow-400 to-orange-500',
      TypeScript: 'from-blue-500 to-indigo-500',
      Python: 'from-blue-600 to-purple-600',
      Java: 'from-red-500 to-orange-600',
      HTML: 'from-orange-500 to-red-500',
      CSS: 'from-purple-500 to-pink-500',
      PHP: 'from-indigo-500 to-purple-500',
      C: 'from-gray-600 to-gray-700',
      'C++': 'from-pink-500 to-rose-500',
      'C#': 'from-green-600 to-emerald-600',
      Shell: 'from-green-500 to-teal-500',
      Jupyter: 'from-orange-400 to-amber-500'
    };
    return colors[language] || 'from-gray-500 to-gray-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (loading) {
    return (
      <div className="h-full min-h-screen bg-site pt-16 lg:pt-20 pb-8 px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-center relative">
        <ParticleBackground />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-cyan-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading GitHub Statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-screen bg-site pt-16 lg:pt-20 pb-8 px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-center relative">
        <ParticleBackground />
        <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-red-500/20 relative z-10">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchStats}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all"
          >
            <RefreshCw size={20} />
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-site pt-8 lg:pt-10 pb-8 px-4 sm:px-6 lg:px-8 xl:pr-40 overflow-y-auto relative">
      <ParticleBackground />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-6xl mx-auto relative z-10">


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header - Compact */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              GitHub <span className="text-cyan-400">Statistics</span>
            </h1>
            {data.cached && (
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm border border-cyan-500/20 mt-2">
                <Clock size={16} />
                Updated {data.cacheAge ? `${Math.floor(data.cacheAge / 60)} min ago` : 'recently'}
              </div>
            )}
          </motion.div>

          {/* User Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[#20202d]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.img
                whileHover={{ scale: 1.05, rotate: 3 }}
                src={data.user.avatar_url}
                alt="GitHub Avatar"
                className="w-24 h-24 rounded-full border-4 border-cyan-500 shadow-xl"
              />
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {data.user.name || data.user.username}
                </h2>
                <a
                  href={`https://github.com/${data.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-lg transition-colors inline-block mb-2"
                >
                  @{data.user.username}
                </a>
                {data.user.bio && (
                  <p className="text-gray-400 text-sm">{data.user.bio}</p>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-400 text-sm mt-3">
                  {data.user.location && <span>📍 {data.user.location}</span>}
                  {data.user.company && <span>🏢 {data.user.company}</span>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics Grid */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
            >
              <TrendingUp className="text-cyan-400" size={28} />
              Overview
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { icon: Code, color: 'from-blue-500 to-cyan-500', value: data.stats.publicRepos, label: 'Repos' },
                { icon: Star, color: 'from-yellow-500 to-orange-500', value: data.stats.totalStars, label: 'Stars' },
                { icon: Activity, color: 'from-purple-500 to-pink-500', value: data.stats.followers, label: 'Followers' },
                { icon: GitFork, color: 'from-green-500 to-emerald-500', value: data.stats.totalForks, label: 'Forks' },
                { icon: Eye, color: 'from-indigo-500 to-purple-500', value: data.stats.totalWatchers, label: 'Watchers' },
                { icon: Calendar, color: 'from-pink-500 to-rose-500', value: data.stats.accountAgeDays, label: 'Days' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                const isHovered = hoveredCard === `stat-${index}`;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredCard(`stat-${index}`)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -3 }}
                    className="group relative cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        opacity: isHovered ? 0.5 : 0,
                        scale: isHovered ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300`}
                    />
                    <div className="relative bg-[#20202d] backdrop-blur-xl rounded-xl p-4 border border-white/10 group-hover:border-white/20 transition-all">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Languages Section */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
            >
              <Code className="text-cyan-400" size={28} />
              Top Languages
            </motion.h2>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3"
            >
              {data.languages.slice(0, 12).map(([language, count], index) => (
                <motion.div
                  key={language}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${getLanguageColor(language)} rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300`} />
                  <div className="relative bg-[#20202d] rounded-lg p-3 border border-white/10 group-hover:border-white/20 transition-all text-center">
                    <div className={`h-16 rounded-lg bg-gradient-to-br ${getLanguageColor(language)} flex items-center justify-center mb-2`}>
                      <span className="text-2xl font-bold text-white">{count}</span>
                    </div>
                    <div className="text-white font-semibold text-xs mb-1 truncate">{language}</div>
                    <div className="text-gray-400 text-[10px]">
                      {Math.round((count / data.stats.publicRepos) * 100)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Top Repositories */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
            >
              <Award className="text-cyan-400" size={28} />
              Top Repositories
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.topRepos.slice(0, 6).map((repo, index) => (
                <motion.a
                  key={repo.id}
                  variants={itemVariants}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="group relative block"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
                  <div className="relative bg-[#20202d]/40 backdrop-blur-xl rounded-xl p-5 border border-white/10 group-hover:border-cyan-500/50 transition-all">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {repo.description || 'No description available'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                      {repo.language && (
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${getLanguageColor(repo.language)}`} />
                          <span className="text-gray-300">{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={16} />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <GitFork size={16} />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {repo.topics.slice(0, 3).map(topic => (
                          <span key={topic} className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
            >
              <GitBranch className="text-cyan-400" size={28} />
              Recent Activity
            </motion.h2>
            <div className="space-y-3">
              {data.recentActivity.slice(0, 5).map((activity, index) => (
                <motion.a
                  key={index}
                  variants={itemVariants}
                  href={activity.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  className="group flex items-center justify-between p-4 bg-[#20202d]/40 backdrop-blur-xl rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                      <GitBranch className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                        {activity.name}
                      </div>
                      <div className="text-gray-400 text-sm">Updated repository</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(activity.updated_at)}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-6"
          >
            <motion.a
              href={`https://github.com/${data.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-cyan-500/25"
            >
              <GitBranch size={20} />
              Visit GitHub Profile
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GitHubStatsComponent;