const express = require('express');
const router = express.Router();
const twitterService = require('../services/twitterService');
const analyticsService = require('../services/analyticsService');

/**
 * GET /api/trends/current
 * Get current trending topics with analytics
 */
router.get('/current', async (req, res, next) => {
    try {
        const { location = 'worldwide', limit = 10 } = req.query;
        const trends = await twitterService.getTrendingTopics(location);
        
        res.json({
            success: true,
            location,
            timestamp: new Date().toISOString(),
            count: trends.length,
            data: trends.slice(0, parseInt(limit))
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/trends/analyze
 * Analyze a specific trend with LDA and sentiment analysis
 */
router.post('/analyze', async (req, res, next) => {
    try {
        const { query, max_results = 100 } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        // Fetch tweets
        const tweetData = await twitterService.searchTweets(query, parseInt(max_results));
        const tweets = tweetData.data || [];

        // Perform LDA analysis
        const ldaAnalysis = analyticsService.performLDAAnalysis(tweets);

        // Perform sentiment analysis
        const sentimentAnalysis = analyticsService.analyzeSentiment(tweets);

        // Extract hashtags
        const hashtags = analyticsService.extractHashtags(tweets);

        // Extract influencers
        const influencers = analyticsService.extractInfluencers(tweets);

        // Analyze engagement
        const engagement = analyticsService.analyzeEngagement(tweets);

        res.json({
            success: true,
            query,
            timestamp: new Date().toISOString(),
            analysis: {
                lda: ldaAnalysis,
                sentiment: sentimentAnalysis,
                hashtags,
                influencers,
                engagement
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/trends/hashtags
 * Get trending hashtags
 */
router.get('/hashtags', async (req, res, next) => {
    try {
        const { location = 'worldwide' } = req.query;
        const trends = await twitterService.getTrendingTopics(location);
        
        // Filter only hashtags
        const hashtags = trends
            .filter(trend => trend.name.startsWith('#'))
            .slice(0, 20);

        res.json({
            success: true,
            location,
            timestamp: new Date().toISOString(),
            count: hashtags.length,
            data: hashtags
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
