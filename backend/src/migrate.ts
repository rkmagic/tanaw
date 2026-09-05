import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import pool from './config/database';

dotenv.config();

async function migrate() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      const schemaPath = path.join(migrationsDir, file);
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(schema);
      console.log(`Migration ${file} completed successfully.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
