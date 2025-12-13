// pages/api/github-stats.js
// This API caches GitHub data to avoid rate limits

let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default async function handler(req, res) {
  // Check if we have cached data that's still valid
  if (cachedData && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
    return res.status(200).json({
      ...cachedData,
      cached: true,
      cacheAge: Math.floor((Date.now() - lastFetchTime) / 1000)
    });
  }

  const username = 'Achraftraf'; // Your GitHub username
  
  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Optional: Add your GitHub token for higher rate limits
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Fetch all repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Optional: Add your GitHub token
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const reposData = await reposResponse.json();

    // Calculate statistics
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalWatchers = reposData.reduce((sum, repo) => sum + repo.watchers_count, 0);

    // Get language statistics
    const languages = {};
    reposData.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Sort languages by count
    const sortedLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // Get top repositories by stars
    const topRepos = reposData
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        topics: repo.topics || []
      }));

    // Get recent activity (last 5 updated repos)
    const recentActivity = reposData
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      .map(repo => ({
        name: repo.name,
        updated_at: repo.updated_at,
        html_url: repo.html_url
      }));

    // Calculate contribution stats
    const accountAge = Math.floor(
      (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Prepare response data
    const responseData = {
      user: {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog,
        email: userData.email,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      },
      stats: {
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        totalStars,
        totalForks,
        totalWatchers,
        accountAgeDays: accountAge
      },
      languages: sortedLanguages,
      topRepos,
      recentActivity,
      fetchedAt: new Date().toISOString()
    };

    // Cache the data
    cachedData = responseData;
    lastFetchTime = Date.now();

    return res.status(200).json({
      ...responseData,
      cached: false
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    
    // Return cached data if available, even if expired
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        cached: true,
        error: 'Using cached data due to API error',
        cacheAge: Math.floor((Date.now() - lastFetchTime) / 1000)
      });
    }

    return res.status(500).json({
      error: 'Failed to fetch GitHub data',
      message: error.message
    });
  }
}

// Optional: Add a webhook endpoint to clear cache
// POST /api/github-stats?action=clear-cache
// This allows you to manually refresh the data