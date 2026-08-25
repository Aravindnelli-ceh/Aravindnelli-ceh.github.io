const path = require("path");
const Database = require("better-sqlite3");

const db = new Database(path.join(__dirname, "enquiries.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_type TEXT NOT NULL,
    requirements TEXT NOT NULL,
    source TEXT DEFAULT 'Rakhi Special 2040 Landing Page',
    created_at TEXT NOT NULL
  )
`);

function insertEnquiry({ name, phone, businessType, requirements, source }) {
  const stmt = db.prepare(`
    INSERT INTO enquiries (name, phone, business_type, requirements, source, created_at)
    VALUES (@name, @phone, @businessType, @requirements, @source, @createdAt)
  `);
  const createdAt = new Date().toISOString();
  const info = stmt.run({ name, phone, businessType, requirements, source, createdAt });
  return { id: info.lastInsertRowid, createdAt };
}

function getAllEnquiries() {
  return db.prepare(`SELECT * FROM enquiries ORDER BY created_at DESC`).all();
}

function getStats() {
  const total = db.prepare(`SELECT COUNT(*) AS c FROM enquiries`).get().c;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const today = db
    .prepare(`SELECT COUNT(*) AS c FROM enquiries WHERE created_at >= ?`)
    .get(todayStart.toISOString()).c;
  return { total, today };
}

module.exports = { insertEnquiry, getAllEnquiries, getStats };
