"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Tab = "overview" | "budget" | "tasks";
type Expense = {
  id: string;
  category: string;
  item: string;
  status: string;
  total: number;
  paidBy: string;
  paid: number;
  notes: string;
};
type Task = {
  id: string;
  title: string;
  category: string;
  owner: string;
  due: string;
  done: boolean;
};
type PlannerData = {
  expenses: Expense[];
  tasks: Task[];
};

const STORAGE_KEY = "wedding-planner-yss-v1";

const DEFAULT_DATA: PlannerData = {
  expenses: [
    { id: "e01", category: "결혼식", item: "웨딩홀", status: "확정", total: 2500000, paidBy: "상원", paid: 1000000, notes: "" },
    { id: "e02", category: "결혼식", item: "식대", status: "확정", total: 10000000, paidBy: "", paid: 0, notes: "" },
    { id: "e03", category: "결혼식", item: "스냅앨범", status: "", total: 1500000, paidBy: "", paid: 0, notes: "" },
    { id: "e04", category: "결혼식", item: "비디오", status: "", total: 400000, paidBy: "", paid: 0, notes: "" },
    { id: "e05", category: "결혼식", item: "사회", status: "", total: 400000, paidBy: "", paid: 0, notes: "" },
    { id: "e06", category: "결혼식", item: "혼주 메이크업", status: "", total: 690000, paidBy: "", paid: 0, notes: "여자 18만, 남자 5만(부모님×2, 상원 누님, 서백)" },
    { id: "e07", category: "결혼식", item: "혼주 한복 추가금", status: "", total: 500000, paidBy: "", paid: 0, notes: "금액 확인 필요" },
    { id: "e08", category: "결혼식", item: "드레스 도우미", status: "", total: 120000, paidBy: "", paid: 0, notes: "" },
    { id: "e09", category: "결혼식", item: "예식도우미", status: "", total: 150000, paidBy: "", paid: 0, notes: "" },
    { id: "e10", category: "결혼식", item: "식전영상", status: "", total: 300000, paidBy: "", paid: 0, notes: "" },
    { id: "e11", category: "결혼식", item: "아이폰스냅", status: "", total: 200000, paidBy: "", paid: 0, notes: "" },
    { id: "e12", category: "결혼식", item: "아버님 양복", status: "", total: 2000000, paidBy: "", paid: 0, notes: "아버지×2" },
    { id: "e13", category: "결혼식", item: "어머님 선물", status: "", total: 10000000, paidBy: "", paid: 0, notes: "어머니×2" },
    { id: "e14", category: "결혼식", item: "형제 선물", status: "", total: 2000000, paidBy: "", paid: 0, notes: "누나×1, 동생×1" },
    { id: "e15", category: "결혼식", item: "드레스", status: "", total: 3000000, paidBy: "", paid: 0, notes: "" },
    { id: "e16", category: "결혼식", item: "상원 양복", status: "8.2 대여", total: 850000, paidBy: "상원", paid: 850000, notes: "" },
    { id: "e17", category: "결혼식", item: "웨딩슈즈", status: "", total: 100000, paidBy: "", paid: 0, notes: "" },
    { id: "e18", category: "결혼식", item: "답례품", status: "", total: 750000, paidBy: "", paid: 0, notes: "복호두?" },
    { id: "e19", category: "결혼식", item: "닭 이벤트", status: "", total: 600000, paidBy: "", paid: 0, notes: "" },
    { id: "e20", category: "결혼식", item: "생화", status: "", total: 3000000, paidBy: "", paid: 0, notes: "" },
    { id: "e21", category: "스튜디오", item: "노마", status: "8.4 대구", total: 4100000, paidBy: "영랑", paid: 2000000, notes: "" },
    { id: "e22", category: "스튜디오", item: "부케", status: "Eef, 피크닉플라워", total: 460000, paidBy: "공용", paid: 460000, notes: "웨딩 네일, 속옷" },
    { id: "e23", category: "스튜디오", item: "필름", status: "", total: 105900, paidBy: "공용", paid: 105900, notes: "" },
    { id: "e24", category: "청첩장", item: "청첩장", status: "", total: 200000, paidBy: "", paid: 0, notes: "" },
    { id: "e25", category: "양가인사", item: "4인×2회", status: "8월중", total: 400000, paidBy: "", paid: 0, notes: "" },
    { id: "e26", category: "상견례", item: "식비", status: "9월중", total: 400000, paidBy: "", paid: 0, notes: "7인" },
    { id: "e27", category: "상견례", item: "선물", status: "", total: 400000, paidBy: "", paid: 0, notes: "" },
    { id: "e28", category: "웨딩반지", item: "웨딩반지", status: "7.5 서울방문", total: 3000000, paidBy: "", paid: 0, notes: "" },
    { id: "e29", category: "신혼여행", item: "신혼여행", status: "", total: 20000000, paidBy: "", paid: 0, notes: "카드할부" },
    { id: "e30", category: "피부과", item: "밴스의원", status: "", total: 3000000, paidBy: "영랑", paid: 3000000, notes: "5개월 할부" },
  ],
  tasks: [
    { id: "t01", title: "웨딩홀 확정", category: "예식", owner: "공용", due: "", done: true },
    { id: "t02", title: "식대 확정", category: "예식", owner: "공용", due: "", done: true },
    { id: "t03", title: "웨딩밴드 서울 방문", category: "일정", owner: "공용", due: "7월 5일", done: false },
    { id: "t04", title: "상원 양복 대여", category: "일정", owner: "상원", due: "8월 2일", done: false },
    { id: "t05", title: "노마 웨딩 촬영", category: "일정", owner: "공용", due: "8월 4일 · 대구", done: false },
    { id: "t06", title: "양가 인사", category: "일정", owner: "공용", due: "8월 중", done: false },
    { id: "t07", title: "상견례", category: "일정", owner: "공용", due: "9월 중", done: false },
    { id: "t08", title: "속옷(브라, 속바지)", category: "촬영 준비물", owner: "영랑", due: "", done: false },
    { id: "t09", title: "슈즈", category: "촬영 준비물", owner: "영랑", due: "", done: false },
    { id: "t10", title: "네일", category: "촬영 준비물", owner: "영랑", due: "", done: false },
    { id: "t11", title: "부케", category: "촬영 준비물", owner: "영랑", due: "", done: false },
    { id: "t12", title: "귀걸이", category: "촬영 준비물", owner: "영랑", due: "", done: false },
    { id: "t13", title: "렌즈", category: "촬영 준비물", owner: "영랑", due: "", done: false },
    { id: "t14", title: "양말", category: "촬영 준비물", owner: "상원", due: "", done: false },
    { id: "t15", title: "수트", category: "촬영 준비물", owner: "상원", due: "", done: false },
  ],
};

const cloneDefault = () => JSON.parse(JSON.stringify(DEFAULT_DATA)) as PlannerData;
const money = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("ko-KR");
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const tabItems: { id: Tab; label: string; hint: string }[] = [
  { id: "overview", label: "한눈에", hint: "요약" },
  { id: "budget", label: "예산·지출", hint: "30개 항목" },
  { id: "tasks", label: "할 일", hint: "체크리스트" },
];

export default function WeddingPlanner() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [data, setData] = useState<PlannerData>(() => cloneDefault());
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [budgetQuery, setBudgetQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [taskFilter, setTaskFilter] = useState<"all" | "todo" | "done">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PlannerData;
        setData({ expenses: parsed.expenses, tasks: parsed.tasks });
      }
    } catch {
      setNotice("저장된 데이터를 읽지 못해 원본 엑셀 데이터로 시작했습니다.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const totals = useMemo(() => {
    const total = data.expenses.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const paid = data.expenses.reduce((sum, item) => sum + Number(item.paid || 0), 0);
    const taskDone = data.tasks.filter((task) => task.done).length;
    return { total, paid, remaining: total - paid, taskDone, taskTotal: data.tasks.length };
  }, [data]);

  const categories = useMemo(
    () => ["전체", ...Array.from(new Set(data.expenses.map((expense) => expense.category).filter(Boolean)))],
    [data.expenses],
  );

  const categoryTotals = useMemo(() => {
    const grouped = new Map<string, number>();
    data.expenses.forEach((expense) => grouped.set(expense.category, (grouped.get(expense.category) || 0) + Number(expense.total || 0)));
    return [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  }, [data.expenses]);

  const visibleExpenses = useMemo(() => {
    const query = budgetQuery.trim().toLowerCase();
    return data.expenses.filter((expense) => {
      const categoryMatch = categoryFilter === "전체" || expense.category === categoryFilter;
      const queryMatch = !query || [expense.category, expense.item, expense.status, expense.paidBy, expense.notes].join(" ").toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }, [budgetQuery, categoryFilter, data.expenses]);

  const payerSummaries = useMemo(() => {
    const payers = ["상원", "공용", "영랑", "미지정"];
    return payers.map((payer) => {
      const expenses = data.expenses.filter((expense) => (expense.paidBy || "미지정") === payer);
      const total = expenses.reduce((sum, expense) => sum + Number(expense.total || 0), 0);
      const paid = expenses.reduce((sum, expense) => sum + Number(expense.paid || 0), 0);
      return { payer, count: expenses.length, total, paid, remaining: total - paid, progress: total ? Math.round((paid / total) * 100) : 0 };
    });
  }, [data.expenses]);

  const expenseGroups = useMemo(() => {
    const grouped = new Map<string, Expense[]>();
    visibleExpenses.forEach((expense) => {
      const category = expense.category.trim() || "미분류";
      grouped.set(category, [...(grouped.get(category) || []), expense]);
    });
    return [...grouped.entries()];
  }, [visibleExpenses]);

  const visibleTasks = data.tasks.filter((task) => taskFilter === "all" || (taskFilter === "done" ? task.done : !task.done));
  const progress = totals.taskTotal ? Math.round((totals.taskDone / totals.taskTotal) * 100) : 0;
  const paidProgress = totals.total ? Math.min(100, Math.round((totals.paid / totals.total) * 100)) : 0;

  function updateExpense(id: string, field: keyof Expense, value: string | number) {
    setData((current) => ({ ...current, expenses: current.expenses.map((expense) => expense.id === id ? { ...expense, [field]: value } : expense) }));
  }

  function addExpense() {
    setData((current) => ({ ...current, expenses: [...current.expenses, { id: uid("e"), category: "새 구분", item: "새 항목", status: "", total: 0, paidBy: "", paid: 0, notes: "" }] }));
    setActiveTab("budget");
  }

  function removeExpense(id: string) {
    setData((current) => ({ ...current, expenses: current.expenses.filter((expense) => expense.id !== id) }));
  }

  function addTask() {
    setData((current) => ({ ...current, tasks: [{ id: uid("t"), title: "새 할 일", category: "준비", owner: "공용", due: "", done: false }, ...current.tasks] }));
    setActiveTab("tasks");
  }

  function updateTask(id: string, field: keyof Task, value: string | boolean) {
    setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, [field]: value } : task) }));
  }

  function removeTask(id: string) {
    setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }));
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `결혼준비-백업-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("백업 파일을 저장했습니다.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const next = JSON.parse(await file.text()) as PlannerData;
      if (!Array.isArray(next.expenses) || !Array.isArray(next.tasks)) throw new Error("invalid");
      setData({ expenses: next.expenses, tasks: next.tasks });
      setNotice("백업 파일을 불러왔습니다.");
    } catch {
      setNotice("이 파일은 결혼 준비 백업 형식이 아닙니다.");
    } finally {
      event.target.value = "";
    }
  }

  function resetData() {
    if (!window.confirm("현재 수정한 내용을 지우고 원본 엑셀 데이터로 돌아갈까요?")) return;
    setData(cloneDefault());
    setNotice("원본 엑셀 데이터로 복원했습니다.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" type="button" onClick={() => setActiveTab("overview")} aria-label="홈으로 이동">
          <span className="brand-caption">YEONGNYANG &amp; SANGMUNG</span>
          <span className="brand-mark" aria-hidden="true">y&amp;s</span>
        </button>
        <nav className="tab-list" role="tablist" aria-label="결혼 준비 메뉴">
          {tabItems.map((tab) => (
            <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`} role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.label}</span><small>{tab.hint}</small>
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <span className="save-state"><i /> {ready ? "SAVED" : "LOADING"}</span>
          <button className="header-link" onClick={downloadBackup}>백업</button>
          <button className="header-link" onClick={() => fileInputRef.current?.click()}>불러오기</button>
          <input ref={fileInputRef} className="sr-only" type="file" accept=".json,application/json" onChange={importBackup} />
        </div>
      </header>

      <div className="workspace">
        <section className="content" role="tabpanel">
          {notice && <div className="notice"><span>{notice}</span><button aria-label="알림 닫기" onClick={() => setNotice("")}>×</button></div>}

          {activeTab === "overview" && (
            <>
              <section className="hero-panel">
                <figure className="hero-visual">
                  <img src="/wedding-editorial-hero.png" alt="햇살이 드는 나무 테이블 위 청첩장 종이와 반지 상자, 창밖의 초록 정원" />
                  <figcaption><span>OUR WEDDING ARCHIVE</span><span>2026 — FOREVER</span></figcaption>
                </figure>
                <div className="hero-editorial">
                  <div className="hero-copy">
                    <span className="source-badge">영냥 × 상뭉의 결혼 기록</span>
                    <h2>우리 둘의 계절을<br /><em>차분히 준비하는 기록.</em></h2>
                    <p>예산과 일정, 앞으로 챙길 일들을 한곳에 모았습니다. 엑셀에서 시작한 계획을 우리다운 속도로 계속 이어가요.</p>
                    <div className="hero-actions">
                      <button className="button primary" onClick={addExpense}>지출 항목 추가</button>
                      <button className="button ghost" onClick={addTask}>할 일 추가</button>
                    </div>
                  </div>
                  <div className="hero-total">
                    <span>PLANNED BUDGET</span>
                    <strong>{money.format(totals.total)}</strong>
                    <div className="progress-track"><div style={{ width: `${paidProgress}%` }} /></div>
                    <div className="progress-caption"><span>선결제 {paidProgress}%</span><b>{money.format(totals.paid)}</b></div>
                  </div>
                </div>
              </section>

              <section className="metric-grid" aria-label="예산 요약">
                <article className="metric-card accent-coral"><span>남은 잔금</span><strong>{money.format(totals.remaining)}</strong><small>총 예산 - 선결제</small></article>
                <article className="metric-card accent-sage"><span>선결제 완료</span><strong>{money.format(totals.paid)}</strong><small>{data.expenses.filter((expense) => expense.paid > 0).length}개 항목에 결제 내역 있음</small></article>
                <article className="metric-card accent-gold"><span>할 일 진행률</span><strong>{progress}%</strong><small>{totals.taskDone}개 완료 · {totals.taskTotal - totals.taskDone}개 남음</small></article>
              </section>

              <section className="overview-grid">
                <article className="panel category-panel">
                  <div className="section-heading"><div><span className="section-kicker">BUDGET MAP</span><h3>항목별 예산</h3></div><button className="text-button" onClick={() => setActiveTab("budget")}>전체 보기 →</button></div>
                  <div className="category-list">
                    {categoryTotals.slice(0, 6).map(([category, value], index) => (
                      <div className="category-row" key={category}>
                        <div className="category-rank">{String(index + 1).padStart(2, "0")}</div>
                        <div className="category-main"><div><strong>{category}</strong><span>{money.format(value)}</span></div><div className="mini-track"><i style={{ width: `${totals.total ? (value / totals.total) * 100 : 0}%` }} /></div></div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel task-preview">
                  <div className="section-heading"><div><span className="section-kicker">NEXT UP</span><h3>다음 할 일</h3></div><button className="text-button" onClick={() => setActiveTab("tasks")}>체크리스트 →</button></div>
                  <div className="next-list">
                    {data.tasks.filter((task) => !task.done).slice(0, 5).map((task) => (
                      <button className="next-task" key={task.id} onClick={() => updateTask(task.id, "done", true)}>
                        <span className="empty-check" aria-hidden="true" />
                        <span><strong>{task.title}</strong><small>{task.owner} {task.due ? `· ${task.due}` : ""}</small></span>
                      </button>
                    ))}
                  </div>
                </article>
              </section>

            </>
          )}

          {activeTab === "budget" && (
            <section className="page-section">
              <div className="page-title-row"><div><span className="section-kicker">BUDGET & SPENDING</span><h2>예산·지출 내역</h2><p>셀을 클릭해 바로 수정하면 자동 저장됩니다.</p></div><button className="button primary" onClick={addExpense}>+  항목 추가</button></div>
              <div className="compact-metrics">
                <div><span>총 예산</span><strong>{money.format(totals.total)}</strong></div>
                <div><span>선결제</span><strong>{money.format(totals.paid)}</strong></div>
                <div><span>남은 금액</span><strong>{money.format(totals.remaining)}</strong></div>
              </div>
              <section className="payer-overview" aria-labelledby="payer-overview-title">
                <div className="budget-subheading">
                  <div><span className="section-kicker">PAYMENT BY PERSON</span><h3 id="payer-overview-title">결제자별 한눈에 보기</h3></div>
                  <p>결제자를 지정하면 배정 예산과 실제 결제액이 자동으로 합산됩니다.</p>
                </div>
                <div className="payer-table-wrap">
                  <table className="payer-table">
                    <thead><tr><th>결제자</th><th>배정 항목</th><th>배정 예산</th><th>선결제</th><th>남은 금액</th><th>결제율</th></tr></thead>
                    <tbody>
                      {payerSummaries.map((summary) => (
                        <tr key={summary.payer} className={`payer-${summary.payer === "미지정" ? "unassigned" : summary.payer}`}>
                          <th scope="row"><span className="payer-dot" />{summary.payer}</th>
                          <td>{summary.count}개</td>
                          <td>{money.format(summary.total)}</td>
                          <td>{money.format(summary.paid)}</td>
                          <td>{money.format(summary.remaining)}</td>
                          <td><div className="payer-progress"><i style={{ width: `${summary.progress}%` }} /></div><b>{summary.progress}%</b></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <div className="toolbar">
                <label className="search-field"><span className="sr-only">지출 검색</span><input value={budgetQuery} onChange={(event) => setBudgetQuery(event.target.value)} placeholder="항목, 상태, 비고 검색" /></label>
                <div className="filter-chips" aria-label="구분 필터">{categories.map((category) => <button key={category} className={categoryFilter === category ? "active" : ""} onClick={() => setCategoryFilter(category)}>{category}</button>)}</div>
              </div>
              <div className="expense-groups">
                {expenseGroups.map(([category, expenses], groupIndex) => {
                  const groupTotal = expenses.reduce((sum, expense) => sum + expense.total, 0);
                  const groupPaid = expenses.reduce((sum, expense) => sum + expense.paid, 0);
                  return (
                    <section className="expense-group" key={category} aria-labelledby={`expense-group-${groupIndex}`}>
                      <div className="expense-group-heading">
                        <div><span>{String(groupIndex + 1).padStart(2, "0")}</span><h3 id={`expense-group-${groupIndex}`}>{category}</h3><small>{expenses.length}개 항목</small></div>
                        <dl><div><dt>예산</dt><dd>{money.format(groupTotal)}</dd></div><div><dt>선결제</dt><dd>{money.format(groupPaid)}</dd></div><div><dt>잔금</dt><dd>{money.format(groupTotal - groupPaid)}</dd></div></dl>
                      </div>
                      <div className="table-wrap">
                        <table className="editable-table budget-table grouped-budget-table">
                          <thead><tr><th>항목</th><th>진행여부</th><th>총예산</th><th>결제자</th><th>선결제</th><th>잔금</th><th>비고</th><th>분류 변경</th><th><span className="sr-only">삭제</span></th></tr></thead>
                          <tbody>
                            {expenses.map((expense) => (
                              <tr key={expense.id}>
                                <td><input aria-label="항목" value={expense.item} onChange={(event) => updateExpense(expense.id, "item", event.target.value)} /></td>
                                <td><input aria-label={`${expense.item} 진행여부`} value={expense.status} placeholder="미정" onChange={(event) => updateExpense(expense.id, "status", event.target.value)} /></td>
                                <td><input className="number-input" aria-label={`${expense.item} 총예산`} type="number" min="0" value={expense.total || ""} onChange={(event) => updateExpense(expense.id, "total", Number(event.target.value))} /></td>
                                <td><select className={`payer-select payer-select-${expense.paidBy || "unassigned"}`} aria-label={`${expense.item} 결제자`} value={expense.paidBy} onChange={(event) => updateExpense(expense.id, "paidBy", event.target.value)}><option value="">미지정</option><option>상원</option><option>공용</option><option>영랑</option></select></td>
                                <td><input className="number-input" aria-label={`${expense.item} 선결제`} type="number" min="0" value={expense.paid || ""} onChange={(event) => updateExpense(expense.id, "paid", Number(event.target.value))} /></td>
                                <td className="calculated">{number.format(expense.total - expense.paid)}</td>
                                <td><input aria-label={`${expense.item} 비고`} value={expense.notes} onChange={(event) => updateExpense(expense.id, "notes", event.target.value)} /></td>
                                <td><input className="category-change" aria-label={`${expense.item} 구분`} value={expense.category} onChange={(event) => updateExpense(expense.id, "category", event.target.value)} /></td>
                                <td><button className="icon-button" aria-label={`${expense.item} 삭제`} onClick={() => removeExpense(expense.id)}>×</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  );
                })}
                {expenseGroups.length === 0 && <p className="empty-budget-state">검색 조건에 맞는 예산 항목이 없습니다.</p>}
              </div>
            </section>
          )}

          {activeTab === "tasks" && (
            <section className="page-section">
              <div className="page-title-row"><div><span className="section-kicker">CHECKLIST</span><h2>할 일·준비물</h2><p>일정과 웨딩촬영 준비물을 함께 체크하세요.</p></div><button className="button primary" onClick={addTask}>+  할 일 추가</button></div>
              <div className="task-progress-panel">
                <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div>
                <div><span>준비 진행률</span><strong>{totals.taskDone}개 완료, {totals.taskTotal - totals.taskDone}개 남았어요</strong><div className="progress-track wide"><div style={{ width: `${progress}%` }} /></div></div>
              </div>
              <div className="task-filter" aria-label="할 일 필터">
                <button className={taskFilter === "all" ? "active" : ""} onClick={() => setTaskFilter("all")}>전체 {data.tasks.length}</button>
                <button className={taskFilter === "todo" ? "active" : ""} onClick={() => setTaskFilter("todo")}>할 일 {data.tasks.filter((task) => !task.done).length}</button>
                <button className={taskFilter === "done" ? "active" : ""} onClick={() => setTaskFilter("done")}>완료 {totals.taskDone}</button>
              </div>
              <div className="task-list">
                {visibleTasks.map((task) => (
                  <article className={`task-card ${task.done ? "done" : ""}`} key={task.id}>
                    <label className="check-control"><input type="checkbox" checked={task.done} onChange={(event) => updateTask(task.id, "done", event.target.checked)} /><span /></label>
                    <div className="task-fields">
                      <input className="task-title-input" aria-label="할 일" value={task.title} onChange={(event) => updateTask(task.id, "title", event.target.value)} />
                      <div className="task-meta-fields">
                        <input aria-label="분류" value={task.category} onChange={(event) => updateTask(task.id, "category", event.target.value)} />
                        <select aria-label="담당" value={task.owner} onChange={(event) => updateTask(task.id, "owner", event.target.value)}><option>공용</option><option>영랑</option><option>상원</option></select>
                        <input aria-label="일정" value={task.due} placeholder="일정 미정" onChange={(event) => updateTask(task.id, "due", event.target.value)} />
                      </div>
                    </div>
                    <button className="icon-button" aria-label={`${task.title} 삭제`} onClick={() => removeTask(task.id)}>×</button>
                  </article>
                ))}
              </div>
            </section>
          )}

          <footer className="footer"><span>영냥 × 상뭉의 결혼 준비실</span><div><button onClick={resetData}>원본 데이터로 복원</button><span>·</span><span>변경 내용은 현재 브라우저에 저장됩니다.</span></div></footer>
        </section>
      </div>
    </main>
  );
}
