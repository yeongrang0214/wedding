import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("is configured as a standard Next.js project for Vercel", async () => {
  const [packageJson, dbHelper, schema, drizzleConfig, apiRoute, envExample, gitignore, readme] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../db/planner.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/planner/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"dev": "next dev"/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(packageJson, /@neondatabase\/serverless/);
  assert.doesNotMatch(packageJson, /vinext|wrangler|@cloudflare\/vite-plugin/);
  assert.match(dbHelper, /from "@neondatabase\/serverless"/);
  assert.match(dbHelper, /process\.env\.DATABASE_URL/);
  assert.match(dbHelper, /CREATE TABLE IF NOT EXISTS planner_state/);
  assert.match(dbHelper, /ON CONFLICT\(id\) DO UPDATE/);
  assert.match(schema, /pgTable\("planner_state"/);
  assert.match(drizzleConfig, /dialect: "postgresql"/);
  assert.match(apiRoute, /readPlannerState/);
  assert.match(apiRoute, /writePlannerState/);
  assert.match(envExample, /^DATABASE_URL=/);
  assert.match(gitignore, /\.env\*/);
  assert.match(gitignore, /!\.env\.example/);
  assert.match(readme, /Vercel Marketplace/);
  assert.match(readme, /Neon Postgres/);

  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
  await assert.rejects(access(new URL("../vite.config.ts", import.meta.url)));
});

test("keeps wedding editing, durable saves, backup, and responsive design", async () => {
  const [planner, css, page, layout] = await Promise.all([
    readFile(new URL("../app/WeddingPlanner.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(planner, /fetch\("\/api\/planner"/);
  assert.match(planner, /saveCurrentPage/);
  assert.match(planner, /activeTab !== "overview"/);
  assert.match(planner, /예산·지출/);
  assert.match(planner, /MONTHLY CHECKLIST/);
  assert.match(planner, /WEDDING CALENDAR/);
  assert.match(planner, /downloadBackup/);
  assert.match(planner, /importBackup/);
  assert.match(planner, /결제자별 한눈에 보기/);
  assert.match(planner, /공용금 입금액/);
  assert.match(planner, /paid > 0 \? "확정"/);
  assert.doesNotMatch(planner, /후보 비교|선결제/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /page-save-button/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(page, /영냥 × 상뭉의 웨딩 아카이브/);
  assert.match(layout, /summary_large_image/);

  await Promise.all([
    access(new URL("../public/wedding-editorial-hero.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
});
