import { neon } from "@neondatabase/serverless";

const createPlannerStateTable = `
  CREATE TABLE IF NOT EXISTS planner_state (
    id INTEGER PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  )
`;

async function getClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  const sql = neon(databaseUrl);
  await sql.query(createPlannerStateTable);
  return sql;
}

export async function readPlannerState() {
  const sql = await getClient();
  const rows = await sql`
    SELECT data, updated_at AS "updatedAt"
    FROM planner_state
    WHERE id = ${1}
  `;
  return (rows[0] as { data: string; updatedAt: string } | undefined) ?? null;
}

export async function writePlannerState(data: string) {
  const sql = await getClient();
  const updatedAt = new Date().toISOString();
  await sql`
    INSERT INTO planner_state (id, data, updated_at)
    VALUES (${1}, ${data}, ${updatedAt})
    ON CONFLICT(id) DO UPDATE
    SET data = excluded.data, updated_at = excluded.updated_at
  `;
  return updatedAt;
}
