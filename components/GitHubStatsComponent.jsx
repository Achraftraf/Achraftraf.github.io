import React, { useState, useEffect, useRef } from 'react';
import { GitBranch, Star, GitFork, Eye, Code, Activity, TrendingUp, Calendar, Award, RefreshCw, Clock } from 'lucide-react';

const GitHubStatsComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    fetchStats();
    
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animateId]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (data && observerRef.current) {
      const elements = document.querySelectorAll('[data-animate-id]');
      elements.forEach((el) => {
        observerRef.current.observe(el);
      });
    }
  }, [data]);

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
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-500',
      Python: 'bg-blue-600',
      Java: 'bg-red-500',
      HTML: 'bg-orange-500',
      CSS: 'bg-purple-500',
      PHP: 'bg-indigo-500',
      C: 'bg-gray-600',
      'C++': 'bg-pink-500',
      'C#': 'bg-green-600',
      Shell: 'bg-green-500',
      Jupyter: 'bg-orange-400'
    };
    return colors[language] || 'bg-gray-500';
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

  const isVisible = (id) => visibleElements.has(id);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg sm:text-xl">Loading GitHub Statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <p className="text-red-400 text-lg sm:text-xl mb-4">Error: {error}</p>
          <button 
            onClick={fetchStats}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all"
          >
            <RefreshCw size={20} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto overflow-x-hidden">
      <div className="w-full pl-6 pr-24 sm:pl-8 sm:pr-32 lg:pl-12 lg:pr-40 py-4 sm:py-6 lg:py-8 space-y-32 sm:space-y-40 pb-20">
        
        {/* Header Section - Takes full viewport initially */}
        <section 
          data-animate-id="header"
          className={`h-screen flex items-center justify-center transition-all duration-1000 transform ${
            isVisible('header') 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}
        >
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
              <img 
                src={data.user.avatar_url} 
                alt="GitHub Avatar"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-purple-500 shadow-2xl hover:scale-110 transition-transform duration-500 hover:rotate-6"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  {data.user.name || data.user.username}
                </h1>
                <a 
                  href={`https://github.com/${data.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-xl sm:text-2xl transition-all hover:scale-105 inline-block"
                >
                  @{data.user.username}
                </a>
              </div>
            </div>
            
            {data.user.bio && (
              <p className="text-gray-300 text-lg sm:text-xl mb-4 px-4 max-w-2xl mx-auto">{data.user.bio}</p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-gray-400 text-sm sm:text-base px-4 mb-8">
              {data.user.location && <span className="hover:text-purple-400 transition-colors">📍 {data.user.location}</span>}
              {data.user.company && <span className="hover:text-purple-400 transition-colors">🏢 {data.user.company}</span>}
              {data.user.blog && (
                <a href={data.user.blog} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                  🔗 {data.user.blog}
                </a>
              )}
            </div>

            {data.cached && (
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm">
                <Clock size={16} />
                Cached ({data.cacheAge ? `${Math.floor(data.cacheAge / 60)} min ago` : 'recent'})
              </div>
            )}

            <div className="mt-12 animate-bounce">
              <div className="text-gray-400 text-sm mb-2">Scroll to explore</div>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section - Full viewport */}
        <section 
          data-animate-id="stats"
          className={`h-screen flex items-center justify-center py-20 transition-all duration-1000 transform ${
            isVisible('stats') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-12">
              GitHub Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {[
                { icon: Code, color: 'from-blue-500 to-blue-600', value: data.stats.publicRepos, label: 'Repositories' },
                { icon: Star, color: 'from-yellow-500 to-orange-600', value: data.stats.totalStars, label: 'Total Stars' },
                { icon: Activity, color: 'from-purple-500 to-pink-600', value: data.stats.followers, label: 'Followers' },
                { icon: GitFork, color: 'from-green-500 to-emerald-600', value: data.stats.totalForks, label: 'Total Forks' },
                { icon: Eye, color: 'from-indigo-500 to-indigo-600', value: data.stats.totalWatchers, label: 'Watchers' },
                { icon: Calendar, color: 'from-pink-500 to-red-600', value: data.stats.accountAgeDays, label: 'Days Active' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  data-animate-id={`stat-${index}`}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 sm:p-8 shadow-2xl hover:scale-110 transition-all duration-500 cursor-pointer hover:rotate-3 ${
                    isVisible(`stat-${index}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="text-white mb-3" size={28} />
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/90 text-sm sm:text-base font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages Section - Full viewport */}
        <section 
          data-animate-id="languages"
          className={`min-h-screen flex items-center justify-center py-20 transition-all duration-1000 transform ${
            isVisible('languages') 
              ? 'opacity-100 translate-x-0 rotate-0' 
              : 'opacity-0 -translate-x-20 -rotate-3'
          }`}
        >
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 flex items-center justify-center gap-3">
              <Code size={32} />
              Most Used Languages
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
              {data.languages.map(([language, count], index) => (
                <div 
                  key={language}
                  data-animate-id={`lang-${index}`}
                  className={`text-center transition-all duration-700 transform ${
                    isVisible(`lang-${index}`)
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-50 rotate-45'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className={`${getLanguageColor(language)} h-24 sm:h-28 rounded-2xl flex items-center justify-center mb-3 shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer`}>
                    <span className="text-2xl sm:text-3xl font-bold text-white">{count}</span>
                  </div>
                  <div className="text-white font-semibold text-sm sm:text-base mb-1">{language}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {Math.round((count / data.stats.publicRepos) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Repositories Section - Full viewport */}
        <section 
          data-animate-id="repos"
          className={`min-h-screen flex items-center justify-center py-20 transition-all duration-1000 transform ${
            isVisible('repos') 
              ? 'opacity-100 translate-x-0 rotate-0' 
              : 'opacity-0 translate-x-20 rotate-3'
          }`}
        >
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 flex items-center justify-center gap-3">
              <Award size={32} />
              Top Repositories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.topRepos.slice(0, 6).map((repo, index) => (
                <a
                  key={repo.id}
                  data-animate-id={`repo-${index}`}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 hover:from-white/10 hover:to-white/15 transition-all duration-500 border border-white/10 hover:border-purple-500 group hover:scale-105 hover:shadow-2xl ${
                    isVisible(`repo-${index}`)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-white font-bold text-xl sm:text-2xl mb-3 group-hover:text-purple-400 transition-colors">
                    {repo.name}
                  </h3>

                  <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2">
                    {repo.description || 'No description available'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    {repo.language && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className={`w-4 h-4 rounded-full ${getLanguageColor(repo.language)}`}></span>
                        <span className="font-medium">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Star size={18} />
                      <span className="font-bold">{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                      <GitFork size={18} />
                      <span className="font-bold">{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Eye size={18} />
                      <span className="font-bold">{repo.watchers_count}</span>
                    </div>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.topics.slice(0, 4).map(topic => (
                        <span key={topic} className="bg-purple-500/30 text-purple-200 text-xs font-medium px-3 py-1 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 font-medium">
                    Updated {formatDate(repo.updated_at)}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity Section - Full viewport */}
        <section 
          data-animate-id="activity"
          className={`min-h-screen flex items-center justify-center py-20 transition-all duration-1000 transform ${
            isVisible('activity') 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}
        >
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 flex items-center justify-center gap-3">
              <TrendingUp size={32} />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <a
                  key={index}
                  data-animate-id={`activity-${index}`}
                  href={activity.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl hover:from-white/10 hover:to-white/15 transition-all duration-500 gap-3 hover:scale-105 hover:shadow-xl ${
                    isVisible(`activity-${index}`)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl flex-shrink-0 hover:rotate-12 transition-transform">
                      <GitBranch className="text-white" size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-bold text-base sm:text-lg mb-1">{activity.name}</div>
                      <div className="text-gray-400 text-sm">Updated repository</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm font-medium pl-16 sm:pl-0">
                    {formatDate(activity.updated_at)}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action - Full viewport */}
        <section 
          data-animate-id="cta"
          className={`h-screen flex items-center justify-center transition-all duration-1000 transform ${
            isVisible('cta') 
              ? 'opacity-100 scale-100 rotate-0' 
              : 'opacity-0 scale-75 rotate-12'
          }`}
        >
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              Let's Connect!
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl mb-12 max-w-2xl mx-auto px-4">
              Explore more of my work and contributions on GitHub
            </p>
            <a
              href={`https://github.com/${data.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-full font-bold transition-all shadow-2xl text-xl hover:scale-110 hover:shadow-purple-500/50 active:scale-95"
            >
              <GitBranch size={28} />
              Visit GitHub Profile
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default GitHubStatsComponent;