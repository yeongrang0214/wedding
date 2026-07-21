import { readPlannerState, writePlannerState } from "../../../db/planner";

function isPlannerData(value: unknown): value is { expenses: unknown[]; tasks: unknown[]; commonFund?: unknown } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { expenses?: unknown; tasks?: unknown };
  return Array.isArray(candidate.expenses) && Array.isArray(candidate.tasks);
}

export async function GET() {
  try {
    const stored = await readPlannerState();
    return Response.json({
      data: stored ? JSON.parse(stored.data) : null,
      updatedAt: stored?.updatedAt ?? null,
    });
  } catch (error) {
    console.error("Failed to read planner state", error);
    return Response.json({ error: "저장된 데이터를 불러오지 못했습니다." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    if (!isPlannerData(data)) {
      return Response.json({ error: "올바르지 않은 데이터입니다." }, { status: 400 });
    }
    const serialized = JSON.stringify(data);
    if (serialized.length > 1_000_000) {
      return Response.json({ error: "저장할 데이터가 너무 큽니다." }, { status: 413 });
    }
    const updatedAt = await writePlannerState(serialized);
    return Response.json({ ok: true, updatedAt });
  } catch (error) {
    console.error("Failed to save planner state", error);
    return Response.json({ error: "데이터를 저장하지 못했습니다." }, { status: 503 });
  }
}
