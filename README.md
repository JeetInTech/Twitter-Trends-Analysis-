# Twitter Trends Analysis

A robust, production-ready web application for real-time Twitter trends analysis using advanced Natural Language Processing techniques including **Latent Dirichlet Allocation (LDA)** topic modeling and comprehensive sentiment analysis.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### Analytics & Processing
- 🔥 **Real-time Trending Topics** - Fetch current Twitter trends from multiple global locations
- 🔍 **LDA Topic Modeling** - Extract meaningful themes using Latent Dirichlet Allocation with configurable topic counts
- 😊 **Advanced Sentiment Analysis** - 5-tier classification system (very positive, positive, neutral, negative, very negative)
- 👥 **Influencer Detection** - Identify key voices driving conversations based on engagement metrics
- #️⃣ **Hashtag Analytics** - Track popular hashtags with frequency analysis and trend visualization
- 📊 **Engagement Metrics** - Comprehensive analysis of likes, retweets, replies, quotes, and overall engagement rates

### User Experience
- 🎨 **Modern UI** - Clean, responsive interface with gradient backgrounds and smooth animations
- 🌍 **Multi-Location Support** - Worldwide, India, USA, UK trend tracking
- ⚡ **Real-time Updates** - Dynamic data fetching with loading states and error handling
- 📱 **Mobile Responsive** - Fully optimized for all screen sizes
- 🔒 **Secure** - Helmet.js security headers and CORS protection

### Technical
- 💾 **SQLite Database** - Zero-configuration, file-based database (no server installation required)
- ⚡ **Smart Caching** - 15-minute TTL to optimize API usage and response times
- 🔄 **Mock Data System** - Built-in testing data for development without API keys
- 🛡️ **Error Handling** - Comprehensive error handling and graceful degradation
- 📝 **Logging** - Morgan HTTP request logging for debugging

---

## 🏗️ Architecture

### Backend Stack
```
Node.js + Express.js
├── SQLite (better-sqlite3) - Data persistence
├── Natural.js - NLP & topic modeling
├── Sentiment.js - Sentiment analysis
├── Axios - HTTP client for Twitter API v2
├── node-cache - In-memory caching
├── Helmet - Security middleware
├── CORS - Cross-origin resource sharing
└── Morgan - HTTP request logger
```

### Frontend Stack
```
Vanilla JavaScript + Modern CSS
├── Fetch API - RESTful API integration
├── CSS Grid & Flexbox - Responsive layouts
├── CSS Animations - Smooth transitions
└── Modal UI - Analysis result display
```

### Analytics Pipeline
```
Tweet Collection → Text Preprocessing → Parallel Analysis
├── LDA Topic Modeling (Natural.js)
│   ├── Tokenization
│   ├── Stopword Removal
│   ├── Term Frequency Analysis
│   └── Topic Clustering
├── Sentiment Analysis (Sentiment.js)
│   ├── Polarity Detection
│   ├── Score Calculation
│   └── Classification
├── Influencer Detection
│   ├── Engagement Scoring
│   └── Author Ranking
├── Hashtag Extraction
│   ├── Regex Pattern Matching
│   └── Frequency Counting
└── Engagement Metrics
    ├── Aggregation
    └── Statistical Analysis
```

---

## 📋 Prerequisites

### Required
- **Node.js** v16.0.0 or higher
- **npm** v7.0.0 or higher (comes with Node.js)

### Optional (for real Twitter data)
- **Twitter Developer Account** - [Apply here](https://developer.twitter.com/en/portal/dashboard)
- **Twitter API v2 Bearer Token** - Generated from Twitter Developer Portal

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/JeetInTech/Twitter-Trends-Analysis-.git
cd Twitter-Trends-Analysis-
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages:
- express (v4.18.2)
- better-sqlite3 (v9.2.2)
- axios (v1.6.2)
- natural (v6.10.4)
- sentiment (v5.0.2)
- helmet (v7.1.0)
- cors (v2.8.5)
- compression (v1.7.4)
- morgan (v1.10.0)
- node-cache (v5.1.2)
- stopword (v2.0.8)
- dotenv (v16.3.1)
- nodemon (v3.0.2) - Dev dependency

### 3. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Twitter API v2 Credentials (optional for testing)
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here

# Feature Flags
ENABLE_MOCK_DATA=true        # Use mock data for testing
ENABLE_CACHING=true          # Enable response caching
CACHE_TTL=900                # Cache time-to-live in seconds (15 minutes)
```

### 4. Initialize Database

The database is automatically created on first run, but you can manually initialize it:

```bash
npm run setup
```

This creates:
- `data/` directory (if it doesn't exist)
- `data/twitter_trends.db` SQLite database
- 5 tables: `trends`, `tweets`, `hashtags`, `topics`, `analytics_summary`
- Indexes for performance optimization

### 5. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

### 6. Access the Application

Open your browser and navigate to:
- **Landing Page**: http://localhost:3000
- **Trends Analysis**: http://localhost:3000/html/trending.html
- **API Health Check**: http://localhost:3000/api/health

---

## 📁 Project Structure

```
Twitter-Trends-Analysis-/
├── data/
│   └── twitter_trends.db          # SQLite database (auto-created)
│
├── server/
│   ├── index.js                   # Express server entry point
│   │
│   ├── config/
│   │   └── database.js            # SQLite connection & query wrapper
│   │
│   ├── routes/
│   │   ├── twitter.js             # Twitter API endpoints
│   │   ├── trends.js              # Trend analysis endpoints
│   │   └── analytics.js           # Analytics endpoints
│   │
│   ├── services/
│   │   ├── twitterService.js      # Twitter API integration & mock data
│   │   └── analyticsService.js    # LDA, sentiment, NLP processing
│   │
│   └── scripts/
│       └── setupDatabase.js       # Database initialization script
│
├── html/
│   ├── index.html                 # Landing page
│   └── trending.html              # Main trends analysis page
│
├── javascript/
│   ├── app.js                     # General application JS
│   └── trendAnalysis.js           # API integration & UI updates
│
├── css/
│   └── styles.css                 # Application styles
│
├── .env                           # Environment configuration (create from .env.example)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | Number | `3000` | Server port |
| `NODE_ENV` | String | `development` | Environment mode |
| `TWITTER_API_KEY` | String | - | Twitter API key (optional) |
| `TWITTER_API_SECRET` | String | - | Twitter API secret (optional) |
| `TWITTER_BEARER_TOKEN` | String | - | Twitter API v2 Bearer Token |
| `ENABLE_MOCK_DATA` | Boolean | `true` | Use mock data when API unavailable |
| `ENABLE_CACHING` | Boolean | `true` | Enable response caching |
| `CACHE_TTL` | Number | `900` | Cache TTL in seconds |

### Database Schema

#### `trends` Table
```sql
CREATE TABLE trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    query TEXT,
    location TEXT,
    tweet_volume INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `tweets` Table
```sql
CREATE TABLE tweets (
    id TEXT PRIMARY KEY,
    trend_id INTEGER,
    text TEXT NOT NULL,
    author_id TEXT,
    created_at DATETIME,
    metrics TEXT,
    FOREIGN KEY (trend_id) REFERENCES trends(id)
);
```

#### `hashtags` Table
```sql
CREATE TABLE hashtags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    trend_id INTEGER,
    FOREIGN KEY (trend_id) REFERENCES trends(id)
);
```

#### `topics` Table
```sql
CREATE TABLE topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trend_id INTEGER,
    topic_number INTEGER,
    keywords TEXT,
    FOREIGN KEY (trend_id) REFERENCES trends(id)
);
```

#### `analytics_summary` Table
```sql
CREATE TABLE analytics_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trend_id INTEGER,
    sentiment TEXT,
    engagement_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trend_id) REFERENCES trends(id)
);
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check

#### GET `/health`
Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-01T12:00:00.000Z",
  "environment": "development"
}
```

---

### Twitter Endpoints

#### GET `/twitter/trends`
Fetch current trending topics.

**Query Parameters:**
- `location` (string, optional): `worldwide` | `india` | `usa` | `uk`

**Example:**
```bash
curl "http://localhost:3000/api/twitter/trends?location=india"
```

**Response:**
```json
{
  "success": true,
  "location": "india",
  "timestamp": "2025-12-01T12:00:00.000Z",
  "count": 10,
  "data": [
    {
      "rank": 1,
      "name": "#MachineLearning",
      "tweet_volume": 125000,
      "query": "%23MachineLearning"
    }
  ]
}
```

#### GET `/twitter/search`
Search tweets by query.

**Query Parameters:**
- `query` (string, required): Search query
- `max_results` (number, optional): Max 100, default 50

**Example:**
```bash
curl "http://localhost:3000/api/twitter/search?query=%23AI&max_results=50"
```

#### GET `/twitter/user/:userId/tweets`
Get user's timeline.

**Parameters:**
- `userId` (string, required): Twitter user ID

---

### Trends Endpoints

#### GET `/trends/current`
Get current trends with filtering.

**Query Parameters:**
- `location` (string, optional): Location filter
- `limit` (number, optional): Result limit (default: 10)

#### POST `/trends/analyze`
Comprehensive trend analysis.

**Request Body:**
```json
{
  "query": "#MachineLearning",
  "max_results": 100
}
```

**Response:**
```json
{
  "success": true,
  "query": "#MachineLearning",
  "analysis": {
    "lda": {
      "topics": [
        {
          "id": 1,
          "name": "Topic 1",
          "keywords": [
            {"word": "learning", "frequency": 45},
            {"word": "data", "frequency": 38}
          ],
          "topKeywords": "learning, data, model, neural, deep"
        }
      ],
      "totalDocuments": 100,
      "uniqueTerms": 350
    },
    "sentiment": {
      "overall": "positive",
      "averageScore": 1.25,
      "breakdown": {
        "very positive": {"count": 20, "percentage": 20},
        "positive": {"count": 45, "percentage": 45},
        "neutral": {"count": 25, "percentage": 25},
        "negative": {"count": 8, "percentage": 8},
        "very negative": {"count": 2, "percentage": 2}
      }
    },
    "hashtags": [
      {"tag": "#machinelearning", "count": 87},
      {"tag": "#ai", "count": 65}
    ],
    "influencers": [
      {
        "id": "12345",
        "username": "ml_expert",
        "tweetCount": 5,
        "averageEngagement": 250.5
      }
    ],
    "engagement": {
      "totalTweets": 100,
      "totalLikes": 15000,
      "totalRetweets": 4500,
      "averageLikes": 150,
      "averageRetweets": 45
    }
  }
}
```

#### GET `/trends/hashtags`
Get trending hashtags only.

---

### Analytics Endpoints

#### POST `/analytics/full`
Full analysis pipeline.

**Request Body:**
```json
{
  "query": "#AI",
  "max_results": 100
}
```

#### POST `/analytics/lda`
LDA topic modeling only.

**Request Body:**
```json
{
  "tweets": ["tweet text 1", "tweet text 2"],
  "numTopics": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": 1,
        "keywords": [
          {"word": "learning", "frequency": 45}
        ],
        "topKeywords": "learning, machine, deep"
      }
    ],
    "totalDocuments": 2,
    "uniqueTerms": 15
  }
}
```

#### POST `/analytics/sentiment`
Sentiment analysis only.

**Request Body:**
```json
{
  "tweets": ["Great product!", "Not good"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": "positive",
    "averageScore": 1.5,
    "breakdown": {
      "very positive": {"count": 1, "percentage": 50},
      "positive": {"count": 0, "percentage": 0},
      "neutral": {"count": 0, "percentage": 0},
      "negative": {"count": 1, "percentage": 50},
      "very negative": {"count": 0, "percentage": 0}
    },
    "details": [
      {
        "text": "Great product!",
        "score": 3,
        "comparative": 3,
        "sentiment": "very positive"
      }
    ]
  }
}
```

#### POST `/analytics/influencers`
Influencer detection.

#### POST `/analytics/hashtags`
Hashtag extraction.

#### POST `/analytics/engagement`
Engagement metrics calculation.

---

### Error Handling

All errors return:
```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server (auto-reload with nodemon)
npm run dev

# Start production server
npm start

# Initialize/reset database
npm run setup

# Run tests (if available)
npm test
```

### Development Workflow

1. **Enable Mock Data** for testing without Twitter API:
   ```env
   ENABLE_MOCK_DATA=true
   ```

2. **Auto-reload** is enabled in development mode via nodemon

3. **Logging** is active - check terminal for request logs

4. **Database** is auto-created in `data/` directory

### Adding New Features

1. **New API Endpoint**:
   - Add route in `server/routes/`
   - Import and use in `server/index.js`

2. **New Analytics**:
   - Add function in `server/services/analyticsService.js`
   - Create endpoint to expose it

3. **Frontend Changes**:
   - Update `html/trending.html` for UI
   - Update `javascript/trendAnalysis.js` for logic

### Testing with Mock Data

The application includes rich mock data:
- **10 trending topics** (AI, ML, Cloud, DevOps, etc.)
- **10 detailed tweets** per query with realistic engagement
- **Variety of sentiments** for comprehensive testing

---

## 🔧 Troubleshooting

### Server Won't Start

**Issue**: Port 3000 already in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID>)
taskkill /PID <PID> /F
```

**Issue**: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Errors

**Issue**: Database locked or corrupted
```bash
# Delete and recreate
rm -rf data/
npm run setup
```

**Issue**: Permission denied
```bash
# Check write permissions on data/ directory
chmod 755 data/
```

### API Errors

**Issue**: 404 errors for trends endpoint
- **Expected behavior** - Twitter API v2 doesn't have direct trends endpoint
- Mock data will be returned automatically
- This is normal and handled gracefully

**Issue**: 401 Unauthorized
- Check Twitter Bearer Token in `.env`
- Ensure token is on a single line (no line breaks)
- Verify token is valid in Twitter Developer Portal

**Issue**: Rate limit exceeded
- Twitter API v2 has rate limits
- Application caching helps reduce API calls
- Consider using `ENABLE_MOCK_DATA=true` for development

### Frontend Issues

**Issue**: Trends not loading
- Check browser console for errors
- Verify server is running on port 3000
- Check network tab for failed API requests

**Issue**: Analysis modal not showing
- Check JavaScript console for errors
- Ensure `trendAnalysis.js` is loaded
- Verify API response format

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test changes with both mock and real data
- Update documentation for new features
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Natural.js** - NLP library
- **Sentiment** - Sentiment analysis
- **Twitter API v2** - Data source
- **Express.js** - Web framework
- **SQLite** - Embedded database

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Report a bug](https://github.com/JeetInTech/Twitter-Trends-Analysis-/issues)
- **Repository**: [View source](https://github.com/JeetInTech/Twitter-Trends-Analysis-)

---

## 🎯 Roadmap

### Planned Features
- [ ] Historical trend tracking
- [ ] Data visualization charts (Chart.js/D3.js)
- [ ] Export analysis as PDF/CSV
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Scheduled trend reports
- [ ] WebSocket for real-time updates
- [ ] User authentication
- [ ] Saved searches
- [ ] Trend comparison tool

### Future Enhancements
- [ ] Machine learning model training
- [ ] Predictive trend analysis
- [ ] Network graph visualization
- [ ] Advanced NLP features
- [ ] Mobile app (React Native)

---

**Made with ❤️ using Node.js, Express, SQLite, Natural.js, and modern web technologies**

© 2025 Twitter Trends Analysis. All rights reserved.
