import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');

type Database = {
  restockSubscriptions: { email: string, productId: string, productName: string, size: string }[];
  orders: any[];
};

export function getDb(): Database {
  if (!fs.existsSync(DB_FILE)) {
    return { restockSubscriptions: [], orders: [] };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

export function saveDb(db: Database) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
