import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the wedding archive", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>영냥 × 상뭉의 웨딩 아카이브<\/title>/);
  assert.match(html, /OUR WEDDING ARCHIVE/);
  assert.match(html, /차분히 준비하는 기록/);
  assert.match(html, /wedding-editorial-hero\.png/);
  assert.match(html, /₩71,125,900/);
  assert.match(html, /예산·지출/);
  assert.doesNotMatch(html, /후보 비교/);
  assert.match(html, /7월 5일 · 1주차/);
  assert.match(html, /<meta property="og:image" content="http:\/\/localhost:3000\/og\.png"/);
});

test("keeps editing, backup, and responsive design capabilities", async () => {
  const [planner, css, page, layout] = await Promise.all([
    readFile(new URL("../app/WeddingPlanner.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(planner, /localStorage\.setItem/);
  assert.match(planner, /downloadBackup/);
  assert.match(planner, /importBackup/);
  assert.match(planner, /addExpense/);
  assert.match(planner, /payerSummaries/);
  assert.match(planner, /결제자별 한눈에 보기/);
  assert.match(planner, /expenseGroups\.map/);
  assert.match(planner, /분류 변경/);
  assert.match(planner, /taskGroups\.map/);
  assert.match(planner, /MONTHLY CHECKLIST/);
  assert.match(planner, /normalizePlannerData/);
  assert.match(planner, /title: "웨딩홀 확정".*month: 5, day: 15/);
  assert.match(planner, /getTaskWeek/);
  assert.match(planner, /updateTaskMonth/);
  assert.match(planner, /월과 날짜만 입력하면 해당 월의 주차로 자동 분류/);
  assert.match(planner, /remainingOverview/);
  assert.match(planner, /남은 준비 한눈에/);
  assert.match(planner, /가장 가까운 일정/);
  assert.match(planner, /addTask/);
  assert.doesNotMatch(planner, /activeTab === "compare"/);
  assert.doesNotMatch(planner, /updateVenue|updateRingChoice/);
  assert.match(planner, /\/wedding-editorial-hero\.png/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(page, /영냥 × 상뭉의 웨딩 아카이브/);
  assert.match(layout, /summary_large_image/);

  await Promise.all([
    access(new URL("../public/wedding-editorial-hero.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
});
