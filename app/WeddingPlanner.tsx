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
  month: number | "";
  day: number | "";
  week?: number | "";
  due: string;
  done: boolean;
};
type CommonFund = {
  sangwon: number;
  yeongrang: number;
};
type PlannerData = {
  expenses: Expense[];
  tasks: Task[];
  commonFund: CommonFund;
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
  commonFund: { sangwon: 0, yeongrang: 0 },
  tasks: [
    { id: "t01", title: "웨딩홀 확정", category: "예식", owner: "공용", month: 5, day: 15, due: "", done: true },
    { id: "t02", title: "식대 확정", category: "예식", owner: "공용", month: 5, day: 15, due: "", done: true },
    { id: "t03", title: "웨딩밴드 서울 방문", category: "일정", owner: "공용", month: 7, day: 5, due: "서울 방문", done: false },
    { id: "t04", title: "상원 양복 대여", category: "일정", owner: "상원", month: 8, day: 2, due: "대여", done: false },
    { id: "t05", title: "노마 웨딩 촬영", category: "일정", owner: "공용", month: 8, day: 4, due: "대구", done: false },
    { id: "t06", title: "양가 인사", category: "일정", owner: "공용", month: 8, day: 15, due: "", done: false },
    { id: "t07", title: "상견례", category: "일정", owner: "공용", month: 9, day: 15, due: "", done: false },
    { id: "t08", title: "속옷(브라, 속바지)", category: "촬영 준비물", owner: "영랑", month: 7, day: 22, due: "", done: false },
    { id: "t09", title: "슈즈", category: "촬영 준비물", owner: "영랑", month: 7, day: 22, due: "", done: false },
    { id: "t10", title: "네일", category: "촬영 준비물", owner: "영랑", month: 7, day: 22, due: "", done: false },
    { id: "t11", title: "부케", category: "촬영 준비물", owner: "영랑", month: 7, day: 22, due: "", done: false },
    { id: "t12", title: "귀걸이", category: "촬영 준비물", owner: "영랑", month: 7, day: 22, due: "", done: false },
    { id: "t13", title: "렌즈", category: "촬영 준비물", owner: "영랑", month: 7, day: 22, due: "", done: false },
    { id: "t14", title: "양말", category: "촬영 준비물", owner: "상원", month: 7, day: 22, due: "", done: false },
    { id: "t15", title: "수트", category: "촬영 준비물", owner: "상원", month: 7, day: 22, due: "", done: false },
  ],
};

const cloneDefault = () => normalizePlannerData(JSON.parse(JSON.stringify(DEFAULT_DATA)) as PlannerData);
const money = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("ko-KR");
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const WEDDING_YEAR = 2026;
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];
const daysInMonth = (month: number | "") => month ? new Date(WEDDING_YEAR, month, 0).getDate() : 31;
const dayOptions = (month: number | "") => Array.from({ length: daysInMonth(month) }, (_, index) => index + 1);
const getTaskWeek = (day: number | "") => day ? Math.min(5, Math.ceil(day / 7)) : "";
const representativeDayForWeek = (week: number | "" | undefined) => week ? Math.min(31, (week - 1) * 7 + 1) : "";

function normalizeTask(task: Task) {
  const fallback = DEFAULT_DATA.tasks.find((item) => item.id === task.id);
  const monthMatch = task.due?.match(/(\d{1,2})월/);
  const dayMatch = task.due?.match(/(\d{1,2})일/);
  const inferredMonth = monthMatch ? Number(monthMatch[1]) : "";
  const inferredDay = dayMatch ? Number(dayMatch[1]) : task.due?.includes("초") ? 1 : task.due?.includes("중") ? 15 : task.due?.includes("말") ? 22 : "";
  return {
    id: task.id,
    title: task.title,
    category: task.category,
    owner: task.owner,
    month: task.month ?? (inferredMonth || fallback?.month || ""),
    day: task.day ?? (inferredDay || fallback?.day || representativeDayForWeek(task.week)),
    due: task.due,
    done: task.done,
  };
}

function normalizePlannerData(input: PlannerData): PlannerData {
  return {
    expenses: input.expenses.map((expense) => ({
      ...expense,
      status: Number(expense.paid || 0) > 0 ? "확정" : expense.status,
    })),
    tasks: input.tasks.map(normalizeTask),
    commonFund: {
      sangwon: Number(input.commonFund?.sangwon || 0),
      yeongrang: Number(input.commonFund?.yeongrang || 0),
    },
  };
}

function taskScheduleLabel(task: Task) {
  if (!task.month) return "일정 미정";
  if (!task.day) return `${task.month}월 · 날짜 미정`;
  return `${task.month}월 ${task.day}일 · ${getTaskWeek(task.day)}주차`;
}

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
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<{ month: number; day: number } | null>(null);
  const [commonFundDraft, setCommonFundDraft] = useState<Record<keyof CommonFund, string>>({ sangwon: "", yeongrang: "" });
  const [confirmedCommonFund, setConfirmedCommonFund] = useState<keyof CommonFund | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PlannerData;
        setData(normalizePlannerData(parsed));
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

  useEffect(() => {
    setCommonFundDraft({
      sangwon: data.commonFund.sangwon ? String(data.commonFund.sangwon) : "",
      yeongrang: data.commonFund.yeongrang ? String(data.commonFund.yeongrang) : "",
    });
  }, [data.commonFund.sangwon, data.commonFund.yeongrang]);

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

  const actualSpending = useMemo(() => {
    const directPaid = (payer: "상원" | "영랑") => data.expenses
      .filter((expense) => expense.paidBy === payer)
      .reduce((sum, expense) => sum + Number(expense.paid || 0), 0);
    const commonSpent = data.expenses
      .filter((expense) => expense.paidBy === "공용")
      .reduce((sum, expense) => sum + Number(expense.paid || 0), 0);
    const totalFunded = data.commonFund.sangwon + data.commonFund.yeongrang;
    return {
      people: [
        { key: "sangwon" as const, label: "상원", direct: directPaid("상원"), common: data.commonFund.sangwon, total: directPaid("상원") + data.commonFund.sangwon },
        { key: "yeongrang" as const, label: "영랑", direct: directPaid("영랑"), common: data.commonFund.yeongrang, total: directPaid("영랑") + data.commonFund.yeongrang },
      ],
      commonSpent,
      totalFunded,
      balance: totalFunded - commonSpent,
    };
  }, [data.commonFund, data.expenses]);

  const expenseGroups = useMemo(() => {
    const grouped = new Map<string, Expense[]>();
    visibleExpenses.forEach((expense) => {
      const category = expense.category.trim() || "미분류";
      grouped.set(category, [...(grouped.get(category) || []), expense]);
    });
    return [...grouped.entries()];
  }, [visibleExpenses]);

  const visibleTasks = useMemo(
    () => data.tasks.filter((task) => {
      const statusMatch = taskFilter === "all" || (taskFilter === "done" ? task.done : !task.done);
      const dateMatch = !selectedCalendarDate || (task.month === selectedCalendarDate.month && task.day === selectedCalendarDate.day);
      return statusMatch && dateMatch;
    }),
    [data.tasks, selectedCalendarDate, taskFilter],
  );

  const taskGroups = useMemo(() => {
    const grouped = new Map<number | "", Map<number | "", Task[]>>();
    visibleTasks.forEach((task) => {
      const month = task.month || "";
      const week = getTaskWeek(task.day);
      const weeks = grouped.get(month) || new Map<number | "", Task[]>();
      weeks.set(week, [...(weeks.get(week) || []), task]);
      grouped.set(month, weeks);
    });
    return [...grouped.entries()]
      .sort(([a], [b]) => (a === "" ? 99 : a) - (b === "" ? 99 : b))
      .map(([month, weeks]) => ({
        month,
        weeks: [...weeks.entries()]
          .sort(([a], [b]) => (a === "" ? 99 : a) - (b === "" ? 99 : b))
          .map(([week, tasks]) => ({ week, tasks })),
      }));
  }, [visibleTasks]);

  const remainingOverview = useMemo(() => {
    const tasks = data.tasks
      .filter((task) => !task.done)
      .sort((a, b) => ((a.month || 99) * 100 + (a.day || 99)) - ((b.month || 99) * 100 + (b.day || 99)));
    const owners = ["공용", "영랑", "상원"].map((owner) => ({ owner, count: tasks.filter((task) => task.owner === owner).length }));
    const grouped = new Map<string, { month: number | ""; week: number | ""; tasks: Task[] }>();
    tasks.forEach((task) => {
      const month = task.month || "";
      const week = getTaskWeek(task.day);
      const key = `${month || "none"}-${week || "none"}`;
      const current = grouped.get(key) || { month, week, tasks: [] };
      grouped.set(key, { ...current, tasks: [...current.tasks, task] });
    });
    return { tasks, next: tasks[0] || null, owners, groups: [...grouped.values()] };
  }, [data.tasks]);

  const calendarOverview = useMemo(() => {
    const tasksByDay = new Map<number, Task[]>();
    data.tasks.filter((task) => task.month === calendarMonth && task.day).forEach((task) => {
      const day = Number(task.day);
      tasksByDay.set(day, [...(tasksByDay.get(day) || []), task]);
    });
    const firstWeekday = new Date(WEDDING_YEAR, calendarMonth - 1, 1).getDay();
    const cells: Array<number | null> = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth(calendarMonth) }, (_, index) => index + 1),
    ];
    const monthTasks = [...tasksByDay.values()].flat().sort((a, b) => Number(a.day || 99) - Number(b.day || 99));
    const agendaTasks = selectedCalendarDate
      ? tasksByDay.get(selectedCalendarDate.day) || []
      : monthTasks;
    return { tasksByDay, cells, monthTasks, agendaTasks };
  }, [calendarMonth, data.tasks, selectedCalendarDate]);
  const progress = totals.taskTotal ? Math.round((totals.taskDone / totals.taskTotal) * 100) : 0;
  const paidProgress = totals.total ? Math.min(100, Math.round((totals.paid / totals.total) * 100)) : 0;

  function updateExpense(id: string, field: keyof Expense, value: string | number) {
    setData((current) => ({
      ...current,
      expenses: current.expenses.map((expense) => {
        if (expense.id !== id) return expense;
        if (field === "paid") {
          const paid = Number(value) || 0;
          return { ...expense, paid, status: paid > 0 ? "확정" : expense.status };
        }
        return { ...expense, [field]: value };
      }),
    }));
  }

  function confirmCommonFund(payer: keyof CommonFund) {
    const value = Math.max(0, Number(commonFundDraft[payer]) || 0);
    setCommonFundDraft((current) => ({ ...current, [payer]: value ? String(value) : "" }));
    setData((current) => ({
      ...current,
      commonFund: { ...current.commonFund, [payer]: value },
    }));
    setConfirmedCommonFund(payer);
  }

  function addExpense() {
    setData((current) => ({ ...current, expenses: [...current.expenses, { id: uid("e"), category: "새 구분", item: "새 항목", status: "", total: 0, paidBy: "", paid: 0, notes: "" }] }));
    setActiveTab("budget");
  }

  function removeExpense(id: string) {
    setData((current) => ({ ...current, expenses: current.expenses.filter((expense) => expense.id !== id) }));
  }

  function addTask() {
    const today = new Date();
    const month = selectedCalendarDate?.month || today.getMonth() + 1;
    const day = selectedCalendarDate?.day || today.getDate();
    setData((current) => ({ ...current, tasks: [{ id: uid("t"), title: "새 할 일", category: "준비", owner: "공용", month, day, due: "", done: false }, ...current.tasks] }));
    setActiveTab("tasks");
  }

  function moveCalendarMonth(offset: number) {
    setCalendarMonth((current) => ((current - 1 + offset + 12) % 12) + 1);
    setSelectedCalendarDate(null);
  }

  function updateTaskMonth(id: string, month: number | "") {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id ? { ...task, month, day: task.day && task.day > daysInMonth(month) ? daysInMonth(month) : task.day } : task),
    }));
  }

  function updateTask(id: string, field: keyof Task, value: string | number | boolean) {
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
      setData(normalizePlannerData(next));
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
                    <div className="progress-caption"><span>결제 {paidProgress}%</span><b>{money.format(totals.paid)}</b></div>
                  </div>
                </div>
              </section>

              <section className="metric-grid" aria-label="예산 요약">
                <article className="metric-card accent-coral"><span>남은 잔금</span><strong>{money.format(totals.remaining)}</strong><small>총 예산 - 결제</small></article>
                <article className="metric-card accent-sage"><span>결제 완료</span><strong>{money.format(totals.paid)}</strong><small>{data.expenses.filter((expense) => expense.paid > 0).length}개 항목에 결제 내역 있음</small></article>
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
                        <span><strong>{task.title}</strong><small>{task.owner} · {taskScheduleLabel(task)}</small></span>
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
                <div><span>결제</span><strong>{money.format(totals.paid)}</strong></div>
                <div><span>남은 금액</span><strong>{money.format(totals.remaining)}</strong></div>
              </div>
              <section className="payer-overview" aria-labelledby="payer-overview-title">
                <div className="budget-subheading">
                  <div><span className="section-kicker">PAYMENT BY PERSON</span><h3 id="payer-overview-title">결제자별 한눈에 보기</h3></div>
                  <p>결제자를 지정하면 배정 예산과 실제 결제액이 자동으로 합산됩니다.</p>
                </div>
                <div className="payer-table-wrap">
                  <table className="payer-table">
                    <thead><tr><th>결제자</th><th>배정 항목</th><th>배정 예산</th><th>결제</th><th>남은 금액</th><th>결제율</th></tr></thead>
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
                <div className="actual-spending-summary">
                  <div className="actual-spending-intro">
                    <span>실제로 낸 돈</span>
                    <p>개인 결제와 공용금 입금을 합산해요.</p>
                  </div>
                  {actualSpending.people.map((person) => (
                    <article className={`actual-spending-person person-${person.key}`} key={person.key}>
                      <div className="actual-spending-person-title"><span>{person.label}</span><strong>{money.format(person.total)}</strong></div>
                      <div className="actual-spending-formula">
                        <small>직접 결제 {money.format(person.direct)}</small><i>+</i>
                        <form className="actual-spending-entry" onSubmit={(event) => { event.preventDefault(); confirmCommonFund(person.key); }}>
                          <div className="actual-spending-field">
                            <span>공용금 입금</span>
                            <input aria-label={`${person.label} 공용금 입금액`} type="number" min="0" step="1" inputMode="numeric" value={commonFundDraft[person.key]} placeholder="금액 입력" onChange={(event) => { setCommonFundDraft((current) => ({ ...current, [person.key]: event.target.value })); setConfirmedCommonFund((current) => current === person.key ? null : current); }} />
                          </div>
                          <button className={`actual-spending-confirm ${confirmedCommonFund === person.key ? "confirmed" : ""}`} type="submit">{confirmedCommonFund === person.key ? "완료" : "확인"}</button>
                        </form>
                      </div>
                    </article>
                  ))}
                  <div className={`common-fund-balance ${actualSpending.balance < 0 ? "shortage" : ""}`}>
                    <span>공용금 잔액</span>
                    <strong>{money.format(actualSpending.balance)}</strong>
                    <small>입금 {money.format(actualSpending.totalFunded)} · 사용 {money.format(actualSpending.commonSpent)}</small>
                  </div>
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
                        <dl><div><dt>예산</dt><dd>{money.format(groupTotal)}</dd></div><div><dt>결제</dt><dd>{money.format(groupPaid)}</dd></div><div><dt>잔금</dt><dd>{money.format(groupTotal - groupPaid)}</dd></div></dl>
                      </div>
                      <div className="table-wrap">
                        <table className="editable-table budget-table grouped-budget-table">
                          <thead><tr><th>항목</th><th>진행여부</th><th>총예산</th><th>결제자</th><th>결제</th><th>잔금</th><th>비고</th><th>분류 변경</th><th><span className="sr-only">삭제</span></th></tr></thead>
                          <tbody>
                            {expenses.map((expense) => (
                              <tr key={expense.id}>
                                <td><input aria-label="항목" value={expense.item} onChange={(event) => updateExpense(expense.id, "item", event.target.value)} /></td>
                                <td><input aria-label={`${expense.item} 진행여부`} value={expense.status} placeholder="미정" onChange={(event) => updateExpense(expense.id, "status", event.target.value)} /></td>
                                <td><input className="number-input" aria-label={`${expense.item} 총예산`} type="number" min="0" value={expense.total || ""} onChange={(event) => updateExpense(expense.id, "total", Number(event.target.value))} /></td>
                                <td><select className={`payer-select payer-select-${expense.paidBy || "unassigned"}`} aria-label={`${expense.item} 결제자`} value={expense.paidBy} onChange={(event) => updateExpense(expense.id, "paidBy", event.target.value)}><option value="">미지정</option><option>상원</option><option>공용</option><option>영랑</option></select></td>
                                <td><input className="number-input" aria-label={`${expense.item} 결제`} type="number" min="0" value={expense.paid || ""} onChange={(event) => updateExpense(expense.id, "paid", Number(event.target.value))} /></td>
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
              <div className="page-title-row"><div><span className="section-kicker">MONTHLY CHECKLIST</span><h2>월별·주차별 할 일</h2><p>월과 날짜만 입력하면 해당 월의 주차로 자동 분류됩니다.</p></div><button className="button primary" onClick={addTask}>+  할 일 추가</button></div>
              <div className="task-progress-panel">
                <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div>
                <div><span>준비 진행률</span><strong>{totals.taskDone}개 완료, {totals.taskTotal - totals.taskDone}개 남았어요</strong><div className="progress-track wide"><div style={{ width: `${progress}%` }} /></div></div>
              </div>
              <section className="task-calendar" aria-labelledby="task-calendar-title">
                <header className="calendar-header">
                  <div><span className="section-kicker">WEDDING CALENDAR</span><h3 id="task-calendar-title">일정 캘린더</h3></div>
                  <div className="calendar-controls">
                    <button aria-label="이전 달" onClick={() => moveCalendarMonth(-1)}>←</button>
                    <strong>{WEDDING_YEAR}. {String(calendarMonth).padStart(2, "0")}</strong>
                    <button aria-label="다음 달" onClick={() => moveCalendarMonth(1)}>→</button>
                  </div>
                  <div className="calendar-legend"><span><i className="open" />미완료</span><span><i className="complete" />완료</span></div>
                </header>
                <div className="calendar-layout">
                  <div className="calendar-board">
                    <div className="calendar-weekdays">{weekdayLabels.map((label) => <span key={label}>{label}</span>)}</div>
                    <div className="calendar-grid">
                      {calendarOverview.cells.map((day, index) => {
                        if (!day) return <span className="calendar-empty-day" key={`empty-${index}`} />;
                        const dayTasks = calendarOverview.tasksByDay.get(day) || [];
                        const hasOpen = dayTasks.some((task) => !task.done);
                        const hasComplete = dayTasks.some((task) => task.done);
                        const selected = selectedCalendarDate?.month === calendarMonth && selectedCalendarDate.day === day;
                        return (
                          <button
                            className={`calendar-day ${dayTasks.length ? "has-tasks" : ""} ${hasOpen ? "has-open" : ""} ${hasComplete && !hasOpen ? "all-complete" : ""} ${selected ? "selected" : ""}`}
                            key={day}
                            aria-label={`${calendarMonth}월 ${day}일, 일정 ${dayTasks.length}개`}
                            aria-pressed={selected}
                            onClick={() => setSelectedCalendarDate((current) => current?.month === calendarMonth && current.day === day ? null : { month: calendarMonth, day })}
                          >
                            <span className="calendar-date-number">{day}</span>
                            {dayTasks.length > 1 && <small>{dayTasks.length}</small>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <aside className="calendar-agenda" aria-live="polite">
                    <div className="calendar-agenda-heading">
                      <div><span>{selectedCalendarDate ? "선택한 날짜" : "이번 달 일정"}</span><h4>{selectedCalendarDate ? `${selectedCalendarDate.month}월 ${selectedCalendarDate.day}일` : `${calendarMonth}월`}</h4></div>
                      <div><b>{calendarOverview.agendaTasks.length}개</b>{selectedCalendarDate && <button onClick={() => setSelectedCalendarDate(null)}>전체 보기</button>}</div>
                    </div>
                    <div className="calendar-agenda-list">
                      {calendarOverview.agendaTasks.map((task) => (
                        <button className={`calendar-agenda-item ${task.done ? "done" : ""}`} key={task.id} onClick={() => updateTask(task.id, "done", !task.done)}>
                          <span className="calendar-agenda-check" />
                          <span><strong>{task.title}</strong><small>{task.day}일 · {task.owner}{task.due ? ` · ${task.due}` : ""}</small></span>
                        </button>
                      ))}
                      {!calendarOverview.agendaTasks.length && (
                        <div className="calendar-agenda-empty">
                          <strong>등록된 일정이 없어요.</strong>
                          <span>{selectedCalendarDate ? "선택한 날짜에 새 할 일을 추가해 보세요." : "날짜를 선택하면 그날의 일정을 볼 수 있어요."}</span>
                          {selectedCalendarDate && <button className="button secondary" onClick={addTask}>이 날짜에 할 일 추가</button>}
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
              </section>
              <section className="remaining-overview" aria-labelledby="remaining-overview-title">
                <div className="remaining-overview-heading">
                  <div><span className="section-kicker">AT A GLANCE</span><h3 id="remaining-overview-title">남은 준비 한눈에</h3></div>
                  <p>완료하지 않은 항목만 월·주차와 담당자 기준으로 요약합니다.</p>
                </div>
                {remainingOverview.tasks.length ? (
                  <>
                    <div className="remaining-summary-grid">
                      <article className="remaining-count"><span>남은 할 일</span><strong>{remainingOverview.tasks.length}</strong><small>전체 {data.tasks.length}개 중</small></article>
                      <article className="remaining-next"><span>가장 가까운 일정</span><strong>{remainingOverview.next?.title}</strong><small>{remainingOverview.next ? taskScheduleLabel(remainingOverview.next) : "-"}</small></article>
                      <article className="remaining-owners"><span>담당자별</span><div>{remainingOverview.owners.map((item) => <p key={item.owner}><b>{item.owner}</b><strong>{item.count}</strong></p>)}</div></article>
                    </div>
                    <div className="remaining-week-grid">
                      {remainingOverview.groups.map((group) => (
                        <article key={`${group.month || "none"}-${group.week || "none"}`}>
                          <span>{group.month ? `${group.month}월` : "일정 미정"} · {group.week ? `${group.week}주차` : "날짜 미정"}</span>
                          <strong>{group.tasks.slice(0, 2).map((task) => task.title).join(" · ")}</strong>
                          <small>{group.tasks.length > 2 ? `외 ${group.tasks.length - 2}개` : `${group.tasks.length}개 남음`}</small>
                        </article>
                      ))}
                    </div>
                  </>
                ) : <div className="remaining-complete"><strong>모든 준비를 완료했어요.</strong><span>새로운 할 일이 생기면 위의 버튼으로 추가할 수 있습니다.</span></div>}
              </section>
              <div className="task-filter" aria-label="할 일 필터">
                <button className={taskFilter === "all" ? "active" : ""} onClick={() => setTaskFilter("all")}>전체 {data.tasks.length}</button>
                <button className={taskFilter === "todo" ? "active" : ""} onClick={() => setTaskFilter("todo")}>할 일 {data.tasks.filter((task) => !task.done).length}</button>
                <button className={taskFilter === "done" ? "active" : ""} onClick={() => setTaskFilter("done")}>완료 {totals.taskDone}</button>
              </div>
              <div className="task-schedule">
                {taskGroups.map((monthGroup) => {
                  const monthTasks = monthGroup.weeks.flatMap((weekGroup) => weekGroup.tasks);
                  const monthDone = monthTasks.filter((task) => task.done).length;
                  return (
                    <section className="task-month-group" key={monthGroup.month || "unscheduled"}>
                      <header className="task-month-heading">
                        <div><span>{monthGroup.month ? `${monthGroup.month}월` : "일정 미정"}</span><small>{monthDone}/{monthTasks.length} 완료</small></div>
                        <div className="month-progress"><i style={{ width: `${monthTasks.length ? (monthDone / monthTasks.length) * 100 : 0}%` }} /></div>
                      </header>
                      <div className="task-week-list">
                        {monthGroup.weeks.map((weekGroup) => (
                          <section className="task-week-group" key={`${monthGroup.month || "unscheduled"}-${weekGroup.week || "unscheduled"}`}>
                            <div className="task-week-heading"><span>{weekGroup.week ? `${weekGroup.week}주차` : "날짜 미정"}</span><small>자동 분류 · {weekGroup.tasks.length}개</small></div>
                            <div className="task-list">
                              {weekGroup.tasks.map((task) => (
                                <article className={`task-card ${task.done ? "done" : ""}`} key={task.id}>
                                  <label className="check-control"><input type="checkbox" checked={task.done} onChange={(event) => updateTask(task.id, "done", event.target.checked)} /><span /></label>
                                  <div className="task-fields">
                                    <input className="task-title-input" aria-label="할 일" value={task.title} onChange={(event) => updateTask(task.id, "title", event.target.value)} />
                                    <div className="task-meta-fields">
                                      <label><span>월</span><select aria-label={`${task.title} 월`} value={task.month} onChange={(event) => updateTaskMonth(task.id, event.target.value ? Number(event.target.value) : "")}><option value="">미정</option>{monthOptions.map((month) => <option key={month} value={month}>{month}월</option>)}</select></label>
                                      <label><span>일</span><select aria-label={`${task.title} 일`} value={task.day} onChange={(event) => updateTask(task.id, "day", event.target.value ? Number(event.target.value) : "")}><option value="">미정</option>{dayOptions(task.month).map((day) => <option key={day} value={day}>{day}일</option>)}</select></label>
                                      <label><span>분류</span><input aria-label={`${task.title} 분류`} value={task.category} onChange={(event) => updateTask(task.id, "category", event.target.value)} /></label>
                                      <label><span>담당</span><select aria-label={`${task.title} 담당`} value={task.owner} onChange={(event) => updateTask(task.id, "owner", event.target.value)}><option>공용</option><option>영랑</option><option>상원</option></select></label>
                                      <label><span>메모</span><input aria-label={`${task.title} 메모`} value={task.due} placeholder="장소·준비사항" onChange={(event) => updateTask(task.id, "due", event.target.value)} /></label>
                                    </div>
                                  </div>
                                  <button className="icon-button" aria-label={`${task.title} 삭제`} onClick={() => removeTask(task.id)}>×</button>
                                </article>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    </section>
                  );
                })}
                {!taskGroups.length && (
                  <div className="task-schedule-empty">
                    <strong>{selectedCalendarDate ? `${selectedCalendarDate.month}월 ${selectedCalendarDate.day}일에 표시할 일정이 없어요.` : "표시할 일정이 없어요."}</strong>
                    <span>{selectedCalendarDate ? "새 할 일을 추가하거나 전체 보기를 눌러주세요." : "필터를 변경하거나 새 할 일을 추가해 주세요."}</span>
                    {selectedCalendarDate && <button className="button secondary" onClick={addTask}>이 날짜에 할 일 추가</button>}
                  </div>
                )}
              </div>
            </section>
          )}

          <footer className="footer"><span>영냥 × 상뭉의 결혼 준비실</span><div><button onClick={resetData}>원본 데이터로 복원</button><span>·</span><span>변경 내용은 현재 브라우저에 저장됩니다.</span></div></footer>
        </section>
      </div>
    </main>
  );
}
