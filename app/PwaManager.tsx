"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

export default function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((navigator as NavigatorWithStandalone).standalone);
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const iosSafari = ios
      && /safari/i.test(navigator.userAgent)
      && !/crios|fxios|edgios|opios/i.test(navigator.userAgent);
    const stateFrame = window.requestAnimationFrame(() => {
      setIsInstalled(standalone);
      setIsIos(ios);
      setIsIosSafari(iosSafari);
    });

    function handleInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    }

    function handleInstalled() {
      setInstallPrompt(null);
      setShowIosInstall(false);
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.cancelAnimationFrame(stateFrame);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setInstallPrompt(null);
      return;
    }

    if (isIos) setShowIosInstall(true);
  }

  if (isInstalled || (!installPrompt && !isIos)) return null;

  return (
    <>
      <button className="pwa-install-button" type="button" onClick={installApp}>
        <span aria-hidden="true">↓</span> 앱 설치
      </button>
      {showIosInstall && (
        <div className="pwa-guide-backdrop" role="presentation" onClick={() => setShowIosInstall(false)}>
          <section
            aria-labelledby="pwa-guide-title"
            aria-modal="true"
            className="pwa-guide"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <span className="pwa-guide-caption">ADD TO HOME SCREEN</span>
            <h2 id="pwa-guide-title">홈 화면에 앱을 추가해요.</h2>
            {!isIosSafari && (
              <div className="pwa-browser-warning">
                <strong>먼저 Safari에서 열어주세요.</strong>
                <span>현재 브라우저의 더보기 메뉴에서 ‘Safari에서 열기’를 선택한 뒤 아래 순서대로 진행해 주세요.</span>
              </div>
            )}
            <ol>
              <li>Safari의 <strong>더보기(•••) → 공유</strong> 또는 아래쪽 <strong>공유</strong> 버튼을 누릅니다.</li>
              <li>목록을 아래로 내려 <strong>홈 화면에 추가</strong>를 선택합니다.</li>
              <li>항목이 없다면 맨 아래 <strong>동작 편집</strong>에서 ‘홈 화면에 추가’를 활성화합니다.</li>
              <li><strong>웹 앱으로 열기</strong>를 켠 상태에서 오른쪽 위 <strong>추가</strong>를 누릅니다.</li>
            </ol>
            <button type="button" onClick={() => setShowIosInstall(false)}>확인</button>
          </section>
        </div>
      )}
    </>
  );
}
