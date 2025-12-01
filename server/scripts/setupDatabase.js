const { db } = require('../config/database');

const createTables = () => {
    try {
        console.log('🔨 Creating database tables...');

        // Trends table
        db.exec(`
            CREATE TABLE IF NOT EXISTS trends (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                query TEXT,
                location TEXT DEFAULT 'worldwide',
                tweet_volume INTEGER DEFAULT 0,
                rank INTEGER,
                url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created trends table');

        // Tweets table
        db.exec(`
            CREATE TABLE IF NOT EXISTS tweets (
                id TEXT PRIMARY KEY,
                text TEXT NOT NULL,
                author_id TEXT,
                author_username TEXT,
                created_at DATETIME,
                like_count INTEGER DEFAULT 0,
                retweet_count INTEGER DEFAULT 0,
                reply_count INTEGER DEFAULT 0,
                quote_count INTEGER DEFAULT 0,
                sentiment_score REAL,
                sentiment_label TEXT,
                trend_id INTEGER,
                stored_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (trend_id) REFERENCES trends(id) ON DELETE CASCADE
            );
        `);
        console.log('✅ Created tweets table');

        // Hashtags table
        db.exec(`
            CREATE TABLE IF NOT EXISTS hashtags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tag TEXT NOT NULL,
                count INTEGER DEFAULT 1,
                location TEXT DEFAULT 'worldwide',
                date DATE DEFAULT CURRENT_DATE
            );
        `);
        console.log('✅ Created hashtags table');

        // Topics table (for LDA analysis)
        db.exec(`
            CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trend_id INTEGER,
                topic_number INTEGER NOT NULL,
                keywords TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (trend_id) REFERENCES trends(id) ON DELETE CASCADE
            );
        `);
        console.log('✅ Created topics table');

        // Analytics summary table
        db.exec(`
            CREATE TABLE IF NOT EXISTS analytics_summary (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT NOT NULL,
                tweet_count INTEGER,
                sentiment_overall TEXT,
                sentiment_breakdown TEXT,
                top_hashtags TEXT,
                top_influencers TEXT,
                engagement_metrics TEXT,
                topics TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created analytics_summary table');

        // Create indexes for better performance
        db.exec(`CREATE INDEX IF NOT EXISTS idx_trends_location ON trends(location);`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_trends_created_at ON trends(created_at DESC);`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_tweets_author ON tweets(author_id);`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_tweets_created_at ON tweets(created_at DESC);`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_hashtags_count ON hashtags(count DESC);`);
        console.log('✅ Created indexes');

        console.log('🎉 Database setup completed successfully!');
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        throw error;
    } finally {
        db.close();
        process.exit();
    }
};

// Run the setup
createTables();
