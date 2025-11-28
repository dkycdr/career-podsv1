import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '@/lib/db';
import { ensureUsersIndex, indexUsersBulk } from '@/lib/search';

async function run() {
  console.log('Env check - MEILISEARCH_URL:', process.env.MEILISEARCH_URL);
  console.log('Indexing users into Meilisearch...');
  const idx = await ensureUsersIndex();
  if (!idx) {
    console.error('Meilisearch not configured. Set MEILISEARCH_URL and MEILISEARCH_API_KEY.');
    process.exit(1);
  }

  const users = await db.user.findMany({ select: { id: true, name: true, email: true, avatar: true, major: true, year: true, role: true } });
  const docs = users.map(u => ({
    id: u.id,
    name: u.name || '',
    email: u.email || null,
    avatar: u.avatar || null,
    major: u.major || null,
    year: u.year || null,
    role: u.role || 'STUDENT'
  }));

  const res = await indexUsersBulk(docs);
  console.log('Index response:', res);
  console.log('Done');
}

run().catch(err => { console.error(err); process.exit(1); });
