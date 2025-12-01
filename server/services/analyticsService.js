const natural = require('natural');
const { removeStopwords } = require('stopword');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();
const tokenizer = new natural.WordTokenizer();

class AnalyticsService {
    constructor() {
        this.tfidf = new natural.TfIdf();
    }

    /**
     * Perform LDA (Latent Dirichlet Allocation) topic modeling
     * This extracts common themes from tweets
     */
    performLDAAnalysis(tweets, numTopics = 5) {
        if (!tweets || tweets.length === 0) {
            return { topics: [], summary: 'No data available for analysis' };
        }

        // Preprocess tweets
        const processedTexts = tweets.map(tweet => this.preprocessText(tweet.text || tweet));

        // Build term frequency
        const termFrequency = this.buildTermFrequency(processedTexts);

        // Extract topics using simple clustering approach
        const topics = this.extractTopics(termFrequency, numTopics);

        return {
            topics,
            totalDocuments: tweets.length,
            uniqueTerms: Object.keys(termFrequency).length,
            summary: `Analyzed ${tweets.length} tweets and identified ${topics.length} main topics`
        };
    }

    /**
     * Analyze sentiment of tweets
     */
    analyzeSentiment(tweets) {
        if (!tweets || tweets.length === 0) {
            return { overall: 'neutral', breakdown: {}, details: [] };
        }

        const sentiments = tweets.map(tweet => {
            const text = tweet.text || tweet;
            const result = sentiment.analyze(text);
            
            return {
                text: text.substring(0, 100),
                score: result.score,
                comparative: result.comparative,
                sentiment: this.categorizeSentiment(result.score)
            };
        });

        const breakdown = this.calculateSentimentBreakdown(sentiments);

        return {
            overall: this.getOverallSentiment(breakdown),
            breakdown,
            details: sentiments,
            averageScore: sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length
        };
    }

    /**
     * Extract key influencers from tweet data
     */
    extractInfluencers(tweets) {
        const influencers = {};

        tweets.forEach(tweet => {
            if (tweet.author_id || tweet.user) {
                const userId = tweet.author_id || tweet.user.id;
                const username = tweet.user?.username || `user_${userId}`;
                
                if (!influencers[userId]) {
                    influencers[userId] = {
                        id: userId,
                        username,
                        tweetCount: 0,
                        totalEngagement: 0,
                        averageEngagement: 0
                    };
                }

                influencers[userId].tweetCount++;
                const engagement = this.calculateEngagement(tweet);
                influencers[userId].totalEngagement += engagement;
            }
        });

        // Calculate averages and sort
        const influencersList = Object.values(influencers)
            .map(inf => ({
                ...inf,
                averageEngagement: inf.totalEngagement / inf.tweetCount
            }))
            .sort((a, b) => b.averageEngagement - a.averageEngagement)
            .slice(0, 10);

        return influencersList;
    }

    /**
     * Extract popular hashtags
     */
    extractHashtags(tweets) {
        const hashtagCount = {};

        tweets.forEach(tweet => {
            const text = tweet.text || tweet;
            const hashtags = text.match(/#[\w]+/g) || [];
            
            hashtags.forEach(tag => {
                const normalized = tag.toLowerCase();
                hashtagCount[normalized] = (hashtagCount[normalized] || 0) + 1;
            });
        });

        return Object.entries(hashtagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    }

    /**
     * Analyze engagement metrics
     */
    analyzeEngagement(tweets) {
        const metrics = {
            totalTweets: tweets.length,
            totalLikes: 0,
            totalRetweets: 0,
            totalReplies: 0,
            averageLikes: 0,
            averageRetweets: 0,
            averageReplies: 0
        };

        tweets.forEach(tweet => {
            if (tweet.public_metrics) {
                metrics.totalLikes += tweet.public_metrics.like_count || 0;
                metrics.totalRetweets += tweet.public_metrics.retweet_count || 0;
                metrics.totalReplies += tweet.public_metrics.reply_count || 0;
            }
        });

        if (tweets.length > 0) {
            metrics.averageLikes = Math.round(metrics.totalLikes / tweets.length);
            metrics.averageRetweets = Math.round(metrics.totalRetweets / tweets.length);
            metrics.averageReplies = Math.round(metrics.totalReplies / tweets.length);
        }

        return metrics;
    }

    // Helper methods

    preprocessText(text) {
        // Convert to lowercase
        let processed = text.toLowerCase();
        
        // Remove URLs
        processed = processed.replace(/https?:\/\/\S+/g, '');
        
        // Remove mentions
        processed = processed.replace(/@[\w]+/g, '');
        
        // Remove hashtag symbols but keep words
        processed = processed.replace(/#/g, '');
        
        // Remove special characters
        processed = processed.replace(/[^\w\s]/g, ' ');
        
        // Tokenize
        let tokens = tokenizer.tokenize(processed);
        
        // Remove stopwords
        tokens = removeStopwords(tokens);
        
        // Filter short words
        tokens = tokens.filter(word => word.length > 2);
        
        return tokens.join(' ');
    }

    buildTermFrequency(texts) {
        const frequency = {};
        
        texts.forEach(text => {
            const words = text.split(' ');
            words.forEach(word => {
                if (word) {
                    frequency[word] = (frequency[word] || 0) + 1;
                }
            });
        });

        return frequency;
    }

    extractTopics(termFrequency, numTopics) {
        // Sort terms by frequency
        const sortedTerms = Object.entries(termFrequency)
            .sort((a, b) => b[1] - a[1]);

        const topics = [];
        const termsPerTopic = Math.ceil(sortedTerms.length / numTopics);

        for (let i = 0; i < numTopics && i * termsPerTopic < sortedTerms.length; i++) {
            const topicTerms = sortedTerms
                .slice(i * termsPerTopic, (i + 1) * termsPerTopic)
                .slice(0, 10);

            topics.push({
                id: i + 1,
                name: `Topic ${i + 1}`,
                keywords: topicTerms.map(([word, freq]) => ({ word, frequency: freq })),
                topKeywords: topicTerms.slice(0, 5).map(([word]) => word).join(', ')
            });
        }

        return topics;
    }

    calculateEngagement(tweet) {
        if (!tweet.public_metrics) return 0;
        
        const metrics = tweet.public_metrics;
        return (metrics.like_count || 0) + 
               (metrics.retweet_count || 0) * 2 + 
               (metrics.reply_count || 0) * 1.5;
    }

    categorizeSentiment(score) {
        if (score > 2) return 'very positive';
        if (score > 0) return 'positive';
        if (score === 0) return 'neutral';
        if (score > -2) return 'negative';
        return 'very negative';
    }

    calculateSentimentBreakdown(sentiments) {
        const breakdown = {
            'very positive': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'very negative': 0
        };

        sentiments.forEach(s => {
            breakdown[s.sentiment]++;
        });

        const total = sentiments.length;
        Object.keys(breakdown).forEach(key => {
            breakdown[key] = {
                count: breakdown[key],
                percentage: Math.round((breakdown[key] / total) * 100)
            };
        });

        return breakdown;
    }

    getOverallSentiment(breakdown) {
        const scores = {
            'very positive': 2,
            'positive': 1,
            'neutral': 0,
            'negative': -1,
            'very negative': -2
        };

        let totalScore = 0;
        let totalCount = 0;

        Object.entries(breakdown).forEach(([sentiment, data]) => {
            totalScore += scores[sentiment] * data.count;
            totalCount += data.count;
        });

        const average = totalScore / totalCount;
        
        if (average > 1) return 'very positive';
        if (average > 0.2) return 'positive';
        if (average > -0.2) return 'neutral';
        if (average > -1) return 'negative';
        return 'very negative';
    }
}

module.exports = new AnalyticsService();
