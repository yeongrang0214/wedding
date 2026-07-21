const createPlannerStateTable = `
  CREATE TABLE IF NOT EXISTS planner_state (
    id INTEGER PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

async function getBinding() {
  const { env } = await import("cloudflare:workers");
  const binding = env.DB;
  if (!binding) throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  await binding.prepare(createPlannerStateTable).run();
  return binding;
}

export async function readPlannerState() {
  const binding = await getBinding();
  return binding
    .prepare("SELECT data, updated_at AS updatedAt FROM planner_state WHERE id = ?")
    .bind(1)
    .first<{ data: string; updatedAt: string }>();
}

export async function writePlannerState(data: string) {
  const binding = await getBinding();
  const updatedAt = new Date().toISOString();
  await binding
    .prepare(`
      INSERT INTO planner_state (id, data, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
    `)
    .bind(1, data, updatedAt)
    .run();
  return updatedAt;
}
