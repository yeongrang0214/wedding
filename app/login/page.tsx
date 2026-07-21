import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "비밀번호 입력 | 영냥 × 상뭉",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

function safeReturnTo(value: string | string[] | undefined) {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-copy">
          <span className="login-eyebrow">PRIVATE WEDDING ARCHIVE</span>
          <span className="login-monogram" aria-hidden="true">y&amp;s</span>
          <h1 id="login-title">우리 둘의 기록입니다.</h1>
          <p>예산과 일정이 담긴 비공개 공간이에요.<br />비밀번호를 입력하면 기록이 열립니다.</p>
          <LoginForm returnTo={safeReturnTo(params.returnTo)} />
          <small>YEONGNYANG &amp; SANGMUNG · 2026</small>
        </div>
        <figure className="login-image">
          <Image
            fill
            priority
            sizes="(max-width: 760px) 100vw, 48vw"
            src="/wedding-editorial-hero.png"
            alt="햇살이 드는 테이블 위의 청첩장과 반지 상자"
          />
          <figcaption>OUR WEDDING, OUR PRIVATE STORY</figcaption>
        </figure>
      </section>
    </main>
  );
}
