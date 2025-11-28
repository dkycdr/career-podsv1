import { MeiliSearch } from 'meilisearch';

let client: MeiliSearch | null = null;
let indexName = 'users';

function getClient() {
  const MEILI_URL = process.env.MEILISEARCH_URL;
  const MEILI_KEY = process.env.MEILISEARCH_API_KEY;
  if (!MEILI_URL) return null;
  if (!client) {
    client = new MeiliSearch({ host: MEILI_URL, apiKey: MEILI_KEY });
  }
  return client;
}

export async function ensureUsersIndex() {
  const c = getClient();
  if (!c) return null;
  const idx = await c.index(indexName).fetchInfo().catch(() => null);
  if (!idx) {
    await c.createIndex(indexName, { primaryKey: 'id' });
  }
  return c.index(indexName);
}

export async function indexUsersBulk(docs: any[]) {
  const c = getClient();
  if (!c) throw new Error('Meilisearch not configured');
  const idx = c.index(indexName);
  return idx.addDocuments(docs);
}

export async function searchUsersMeili(q: string, role?: string, limit = 10, offset = 0) {
  const c = getClient();
  if (!c) throw new Error('Meilisearch not configured');
  const idx = c.index(indexName);
  const filter = role ? `role = "${role}"` : undefined;
  const searchParams: any = { limit, offset };
  if (filter) searchParams.filter = filter;
  const res = await idx.search(q || '', searchParams);
  return res; // contains hits, estimatedTotalHits, offset, limit
}
