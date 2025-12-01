const express = require('express');
const router = express.Router();
const twitterService = require('../services/twitterService');

/**
 * GET /api/twitter/trends
 * Get trending topics for a location
 */
router.get('/trends', async (req, res, next) => {
    try {
        const { location = 'worldwide' } = req.query;
        const trends = await twitterService.getTrendingTopics(location);
        
        res.json({
            success: true,
            location,
            timestamp: new Date().toISOString(),
            count: trends.length,
            data: trends
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/twitter/search
 * Search for tweets
 */
router.get('/search', async (req, res, next) => {
    try {
        const { query, max_results = 50 } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        const results = await twitterService.searchTweets(query, parseInt(max_results));
        
        res.json({
            success: true,
            query,
            timestamp: new Date().toISOString(),
            data: results
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/twitter/user/:userId/tweets
 * Get user timeline
 */
router.get('/user/:userId/tweets', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { max_results = 50 } = req.query;
        
        const tweets = await twitterService.getUserTimeline(userId, parseInt(max_results));
        
        res.json({
            success: true,
            userId,
            timestamp: new Date().toISOString(),
            data: tweets
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
