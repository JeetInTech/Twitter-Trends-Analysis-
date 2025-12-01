const express = require('express');
const router = express.Router();
const twitterService = require('../services/twitterService');
const analyticsService = require('../services/analyticsService');

/**
 * POST /api/analytics/lda
 * Perform LDA topic modeling on provided text/tweets
 */
router.post('/lda', async (req, res, next) => {
    try {
        const { tweets, numTopics = 5 } = req.body;
        
        if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tweets array is required and must not be empty'
            });
        }

        const analysis = analyticsService.performLDAAnalysis(tweets, numTopics);
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: analysis
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/analytics/sentiment
 * Analyze sentiment of provided tweets
 */
router.post('/sentiment', async (req, res, next) => {
    try {
        const { tweets } = req.body;
        
        if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tweets array is required and must not be empty'
            });
        }

        const analysis = analyticsService.analyzeSentiment(tweets);
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: analysis
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/analytics/influencers
 * Extract key influencers from tweet data
 */
router.post('/influencers', async (req, res, next) => {
    try {
        const { tweets } = req.body;
        
        if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tweets array is required and must not be empty'
            });
        }

        const influencers = analyticsService.extractInfluencers(tweets);
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            count: influencers.length,
            data: influencers
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/analytics/hashtags
 * Extract popular hashtags from tweets
 */
router.post('/hashtags', async (req, res, next) => {
    try {
        const { tweets } = req.body;
        
        if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tweets array is required and must not be empty'
            });
        }

        const hashtags = analyticsService.extractHashtags(tweets);
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            count: hashtags.length,
            data: hashtags
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/analytics/engagement
 * Analyze engagement metrics from tweets
 */
router.post('/engagement', async (req, res, next) => {
    try {
        const { tweets } = req.body;
        
        if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tweets array is required and must not be empty'
            });
        }

        const metrics = analyticsService.analyzeEngagement(tweets);
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: metrics
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/analytics/full
 * Perform complete analysis (LDA + Sentiment + Influencers + Hashtags + Engagement)
 */
router.post('/full', async (req, res, next) => {
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

        if (tweets.length === 0) {
            return res.json({
                success: true,
                message: 'No tweets found for the given query',
                data: null
            });
        }

        // Perform all analyses
        const lda = analyticsService.performLDAAnalysis(tweets);
        const sentiment = analyticsService.analyzeSentiment(tweets);
        const influencers = analyticsService.extractInfluencers(tweets);
        const hashtags = analyticsService.extractHashtags(tweets);
        const engagement = analyticsService.analyzeEngagement(tweets);

        res.json({
            success: true,
            query,
            timestamp: new Date().toISOString(),
            tweetCount: tweets.length,
            analysis: {
                lda,
                sentiment,
                influencers,
                hashtags,
                engagement
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
