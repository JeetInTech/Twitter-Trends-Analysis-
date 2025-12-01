const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'twitter_trends.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('📦 Database connected successfully at:', dbPath);

module.exports = {
    query: (text, params) => {
        try {
            if (text.trim().toUpperCase().startsWith('SELECT')) {
                return { rows: db.prepare(text).all(...(params || [])) };
            } else {
                const result = db.prepare(text).run(...(params || []));
                return { rows: [], rowCount: result.changes };
            }
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
    db
};
