import { Pool } from '@neondatabase/serverless';

let _pool: Pool | null = null;

function getPool() {
  if (!_pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    _pool = new Pool({ connectionString: url });
  }
  return _pool;
}

// Converts SQLite-style queries to PostgreSQL
function convertToPostgres(query: string): string {
  const isInsertOrIgnore = /^\s*INSERT\s+OR\s+IGNORE\s+INTO/i.test(query);

  let q = query
    .replace(/datetime\('now'\)/gi, 'NOW()')
    .replace(/\bINTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT\b/gi, 'SERIAL PRIMARY KEY');

  if (isInsertOrIgnore) {
    q = q.replace(/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i, 'INSERT INTO');
  }

  // Convert ? to $1, $2...
  let i = 0;
  q = q.replace(/\?/g, () => `$${++i}`);

  // Add RETURNING id to INSERT statements
  if (/^\s*INSERT\s+INTO/i.test(q)) {
    q = q.trimEnd().replace(/;?\s*$/, '');
    if (isInsertOrIgnore) {
      q += ' ON CONFLICT DO NOTHING RETURNING id';
    } else {
      q += ' RETURNING id';
    }
  }

  return q;
}

// Neon PostgreSQL client with SQLite-compatible API wrapper
export function getDb() {
  const pool = getPool();

  return {
    async execute({ sql: query, args = [] }: { sql: string; args?: unknown[] }) {
      const pgQuery = convertToPostgres(query);
      const result = await pool.query(pgQuery, args as unknown[]);
      const rows = result.rows as Record<string, unknown>[];
      return {
        rows,
        lastInsertRowid: rows[0]?.id ?? null,
      };
    },

    async batch(queries: string[]) {
      for (const q of queries) {
        const pgQuery = convertToPostgres(q);
        await pool.query(pgQuery);
      }
    },
  };
}
