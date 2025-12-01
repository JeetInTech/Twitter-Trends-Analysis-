// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Utility function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Fetch trending topics
async function fetchTrendingTopics(location = 'worldwide') {
    try {
        showLoading('Fetching trending topics...');
        const data = await apiCall(`/trends/current?location=${location}&limit=50`);
        displayTrends(data.data);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to fetch trending topics. Please try again.');
    }
}

// Analyze a specific trend
async function analyzeTrend(query) {
    try {
        showLoading(`Analyzing "${query}"...`);
        
        const data = await apiCall('/analytics/full', {
            method: 'POST',
            body: JSON.stringify({ query, max_results: 100 })
        });

        displayAnalysis(data);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to analyze trend. Please try again.');
    }
}

// Display trends in a table
function displayTrends(trends) {
    const trendsContainer = document.getElementById('trends-container');
    if (!trendsContainer) return;

    if (!trends || trends.length === 0) {
        trendsContainer.innerHTML = '<p class="no-data">No trends available at the moment.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'trends-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Trending Topic</th>
                <th>Tweet Volume</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${trends.map(trend => `
                <tr>
                    <td>${trend.rank}</td>
                    <td class="trend-name">${escapeHtml(trend.name)}</td>
                    <td>${formatNumber(trend.tweet_volume)}</td>
                    <td>
                        <button onclick="analyzeTrend('${escapeHtml(trend.name)}')" class="btn-analyze">
                            Analyze
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    trendsContainer.innerHTML = '';
    trendsContainer.appendChild(table);
}

// Display analysis results
function displayAnalysis(data) {
    const analysisContainer = document.getElementById('analysis-container');
    if (!analysisContainer) {
        // Create modal for analysis
        createAnalysisModal(data);
        return;
    }

    const analysis = data.analysis;
    
    let html = `
        <div class="analysis-header">
            <h2>Analysis Results for "${data.query}"</h2>
            <p class="timestamp">Generated: ${new Date(data.timestamp).toLocaleString()}</p>
        </div>

        <div class="analysis-grid">
            <!-- Sentiment Analysis -->
            <div class="analysis-card">
                <h3>📊 Sentiment Analysis</h3>
                <div class="sentiment-overall">
                    <span class="label">Overall Sentiment:</span>
                    <span class="sentiment-badge ${analysis.sentiment.overall}">
                        ${analysis.sentiment.overall.toUpperCase()}
                    </span>
                </div>
                <div class="sentiment-breakdown">
                    ${Object.entries(analysis.sentiment.breakdown).map(([sentiment, data]) => `
                        <div class="sentiment-item">
                            <span class="sentiment-label">${sentiment}:</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${data.percentage}%"></div>
                            </div>
                            <span class="sentiment-value">${data.percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Topic Modeling (LDA) -->
            <div class="analysis-card">
                <h3>🔍 Topic Analysis (LDA)</h3>
                <p class="summary">${analysis.lda.summary}</p>
                <div class="topics-list">
                    ${analysis.lda.topics.map(topic => `
                        <div class="topic-item">
                            <h4>${topic.name}</h4>
                            <p class="keywords">${topic.topKeywords}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Popular Hashtags -->
            <div class="analysis-card">
                <h3>#️⃣ Popular Hashtags</h3>
                <div class="hashtags-cloud">
                    ${analysis.hashtags.slice(0, 15).map(hashtag => `
                        <span class="hashtag-item" style="font-size: ${Math.min(24, 12 + hashtag.count / 10)}px">
                            ${escapeHtml(hashtag.tag)}
                            <span class="count">(${hashtag.count})</span>
                        </span>
                    `).join('')}
                </div>
            </div>

            <!-- Key Influencers -->
            <div class="analysis-card">
                <h3>👥 Key Influencers</h3>
                <div class="influencers-list">
                    ${analysis.influencers.map((influencer, index) => `
                        <div class="influencer-item">
                            <span class="rank">#${index + 1}</span>
                            <span class="username">@${influencer.username}</span>
                            <span class="engagement">${Math.round(influencer.averageEngagement)} avg engagement</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Engagement Metrics -->
            <div class="analysis-card">
                <h3>📈 Engagement Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric">
                        <span class="metric-value">${formatNumber(analysis.engagement.totalLikes)}</span>
                        <span class="metric-label">Total Likes</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${formatNumber(analysis.engagement.totalRetweets)}</span>
                        <span class="metric-label">Total Retweets</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${formatNumber(analysis.engagement.averageLikes)}</span>
                        <span class="metric-label">Avg Likes/Tweet</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${formatNumber(data.tweetCount)}</span>
                        <span class="metric-label">Tweets Analyzed</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    analysisContainer.innerHTML = html;
    analysisContainer.style.display = 'block';
}

// Create analysis modal
function createAnalysisModal(data) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div id="modal-analysis-container"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const container = document.getElementById('modal-analysis-container');
    if (container) {
        displayAnalysis(data);
    }

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Utility functions
function showLoading(message = 'Loading...') {
    let loader = document.getElementById('loading-overlay');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loading-overlay';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p class="loader-message">${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        loader.querySelector('.loader-message').textContent = message;
        loader.style.display = 'flex';
    }
}

function hideLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showError(message) {
    alert(message); // Replace with better UI notification
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Export functions for use in HTML
window.fetchTrendingTopics = fetchTrendingTopics;
window.analyzeTrend = analyzeTrend;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Twitter Trends Analysis App Initialized');
    
    // Check if we're on the trending page
    if (document.getElementById('trends-container')) {
        fetchTrendingTopics();
    }
});
