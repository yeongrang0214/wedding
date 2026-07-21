"use client";

import { FormEvent, useState } from "react";

type LoginFormProps = {
  returnTo: string;
};

export default function LoginForm({ returnTo }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      window.location.replace(returnTo);
    } catch {
      setError("로그인 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="site-password">비밀번호</label>
      <input
        autoComplete="current-password"
        autoFocus
        id="site-password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="함께 정한 비밀번호를 입력하세요"
        required
        type="password"
        value={password}
      />
      {error && <p className="login-error" role="alert">{error}</p>}
      <button disabled={isSubmitting || !password} type="submit">
        {isSubmitting ? "확인 중…" : "우리의 기록 열기"}
      </button>
    </form>
  );
}
