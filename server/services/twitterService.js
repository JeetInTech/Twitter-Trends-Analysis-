const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes cache

class TwitterService {
    constructor() {
        this.bearerToken = process.env.TWITTER_BEARER_TOKEN;
        this.baseUrl = 'https://api.twitter.com/2';
    }

    async getTrendingTopics(location = 'worldwide') {
        const cacheKey = `trends_${location}`;
        const cached = cache.get(cacheKey);
        
        if (cached) {
            console.log('📦 Returning cached trends');
            return cached;
        }

        try {
            // Note: Twitter API v2 trends endpoint requires different approach
            // This is a placeholder - you'll need to implement based on your API access
            const response = await axios.get(`${this.baseUrl}/trends/place.json`, {
                headers: {
                    'Authorization': `Bearer ${this.bearerToken}`
                },
                params: {
                    id: this.getLocationId(location)
                }
            });

            const trends = this.parseTrends(response.data);
            cache.set(cacheKey, trends);
            return trends;
        } catch (error) {
            console.error('Error fetching trends:', error.response?.status || error.message);
            // Return mock data for development
            return this.getMockTrends();
        }
    }

    async searchTweets(query, maxResults = 100) {
        try {
            const response = await axios.get(`${this.baseUrl}/tweets/search/recent`, {
                headers: {
                    'Authorization': `Bearer ${this.bearerToken}`
                },
                params: {
                    query: query,
                    max_results: Math.min(maxResults, 100),
                    'tweet.fields': 'created_at,public_metrics,entities,author_id',
                    'user.fields': 'name,username,verified,public_metrics'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error searching tweets:', error.response?.status || error.message);
            return this.getMockTweets(query);
        }
    }

    async getUserTimeline(userId, maxResults = 50) {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${userId}/tweets`, {
                headers: {
                    'Authorization': `Bearer ${this.bearerToken}`
                },
                params: {
                    max_results: Math.min(maxResults, 100),
                    'tweet.fields': 'created_at,public_metrics'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching user timeline:', error.response?.status || error.message);
            return { data: [] };
        }
    }

    getLocationId(location) {
        const locations = {
            'worldwide': 1,
            'india': 23424848,
            'usa': 23424977,
            'uk': 23424975
        };
        return locations[location.toLowerCase()] || 1;
    }

    parseTrends(data) {
        if (!data || !data[0] || !data[0].trends) return [];
        
        return data[0].trends.map((trend, index) => ({
            rank: index + 1,
            name: trend.name,
            url: trend.url,
            tweet_volume: trend.tweet_volume || 'N/A',
            query: trend.query
        }));
    }

    getMockTrends() {
        return [
            { rank: 1, name: '#MachineLearning', tweet_volume: 125000, query: '%23MachineLearning' },
            { rank: 2, name: '#AI', tweet_volume: 98000, query: '%23AI' },
            { rank: 3, name: '#DataScience', tweet_volume: 87500, query: '%23DataScience' },
            { rank: 4, name: '#Python', tweet_volume: 76000, query: '%23Python' },
            { rank: 5, name: '#CloudComputing', tweet_volume: 65400, query: '%23CloudComputing' },
            { rank: 6, name: '#WebDevelopment', tweet_volume: 54300, query: '%23WebDevelopment' },
            { rank: 7, name: '#Blockchain', tweet_volume: 45200, query: '%23Blockchain' },
            { rank: 8, name: '#CyberSecurity', tweet_volume: 38900, query: '%23CyberSecurity' },
            { rank: 9, name: '#IoT', tweet_volume: 32100, query: '%23IoT' },
            { rank: 10, name: '#DevOps', tweet_volume: 28700, query: '%23DevOps' }
        ];
    }

    getMockTweets(query) {
        const mockTweets = [
            {
                id: '1234567890123456789',
                text: `Excited about the latest developments in ${query}! The future is looking bright. Machine learning models are getting more sophisticated every day. #AI #MachineLearning #TechNews`,
                author_id: '123456789',
                user: { username: 'tech_enthusiast' },
                created_at: new Date(Date.now() - 3600000).toISOString(),
                public_metrics: {
                    retweet_count: 250,
                    reply_count: 67,
                    like_count: 892,
                    quote_count: 34
                }
            },
            {
                id: '2345678901234567890',
                text: `Just published a comprehensive guide on ${query}. Check it out! Deep learning architectures are revolutionizing the industry. Amazing what neural networks can do now. #DeepLearning #AI`,
                author_id: '234567890',
                user: { username: 'data_scientist_pro' },
                created_at: new Date(Date.now() - 7200000).toISOString(),
                public_metrics: {
                    retweet_count: 189,
                    reply_count: 45,
                    like_count: 567,
                    quote_count: 23
                }
            },
            {
                id: '3456789012345678901',
                text: `Attending a conference about ${query} today. So much innovation happening! Natural language processing has come such a long way. The presentations are mind-blowing. #NLP #Conference`,
                author_id: '345678901',
                user: { username: 'ml_researcher' },
                created_at: new Date(Date.now() - 10800000).toISOString(),
                public_metrics: {
                    retweet_count: 156,
                    reply_count: 89,
                    like_count: 734,
                    quote_count: 19
                }
            },
            {
                id: '4567890123456789012',
                text: `The impact of ${query} on businesses is incredible. Companies are seeing real results. Automation and efficiency gains are substantial. This technology is a game-changer. #Business #Tech`,
                author_id: '456789012',
                user: { username: 'business_analyst' },
                created_at: new Date(Date.now() - 14400000).toISOString(),
                public_metrics: {
                    retweet_count: 98,
                    reply_count: 34,
                    like_count: 423,
                    quote_count: 12
                }
            },
            {
                id: '5678901234567890123',
                text: `New research paper on ${query} shows promising results! The methodology is solid and reproducible. Peer review feedback has been overwhelmingly positive. Can't wait to see applications. #Research #Science`,
                author_id: '567890123',
                user: { username: 'phd_candidate' },
                created_at: new Date(Date.now() - 18000000).toISOString(),
                public_metrics: {
                    retweet_count: 234,
                    reply_count: 78,
                    like_count: 1024,
                    quote_count: 45
                }
            },
            {
                id: '6789012345678901234',
                text: `Starting a new project involving ${query}. Looking for collaborators! We're building something revolutionary. Open source contributions welcome. Join us! #OpenSource #Collaboration`,
                author_id: '678901234',
                user: { username: 'startup_founder' },
                created_at: new Date(Date.now() - 21600000).toISOString(),
                public_metrics: {
                    retweet_count: 145,
                    reply_count: 56,
                    like_count: 678,
                    quote_count: 28
                }
            },
            {
                id: '7890123456789012345',
                text: `Industry leaders are investing heavily in ${query}. The market potential is enormous. Venture capital funding is pouring in. Exciting times ahead for this sector. #Investment #Innovation`,
                author_id: '789012345',
                user: { username: 'venture_capitalist' },
                created_at: new Date(Date.now() - 25200000).toISOString(),
                public_metrics: {
                    retweet_count: 312,
                    reply_count: 92,
                    like_count: 1456,
                    quote_count: 67
                }
            },
            {
                id: '8901234567890123456',
                text: `Concerns about ethics in ${query} need to be addressed. Responsible development is crucial. Bias mitigation and transparency should be priorities. Let's build technology that benefits everyone. #Ethics #Responsibility`,
                author_id: '890123456',
                user: { username: 'ethics_professor' },
                created_at: new Date(Date.now() - 28800000).toISOString(),
                public_metrics: {
                    retweet_count: 456,
                    reply_count: 134,
                    like_count: 2103,
                    quote_count: 89
                }
            },
            {
                id: '9012345678901234567',
                text: `Tutorial series on ${query} is now live! Perfect for beginners. Step-by-step guidance with practical examples. Free access for everyone interested in learning. #Education #Tutorial`,
                author_id: '901234567',
                user: { username: 'coding_instructor' },
                created_at: new Date(Date.now() - 32400000).toISOString(),
                public_metrics: {
                    retweet_count: 287,
                    reply_count: 103,
                    like_count: 1789,
                    quote_count: 54
                }
            },
            {
                id: '0123456789012345678',
                text: `Government regulations around ${query} are evolving. Policy makers need to understand the technology. Balancing innovation with safety is essential. Public input is important. #Policy #Regulation`,
                author_id: '012345678',
                user: { username: 'policy_analyst' },
                created_at: new Date(Date.now() - 36000000).toISOString(),
                public_metrics: {
                    retweet_count: 178,
                    reply_count: 67,
                    like_count: 945,
                    quote_count: 41
                }
            }
        ];

        return {
            data: mockTweets,
            meta: {
                result_count: mockTweets.length,
                newest_id: mockTweets[0].id,
                oldest_id: mockTweets[mockTweets.length - 1].id
            }
        };
    }
}

module.exports = new TwitterService();
