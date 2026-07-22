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
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((navigator as NavigatorWithStandalone).standalone);
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const stateFrame = window.requestAnimationFrame(() => {
      setIsInstalled(standalone);
      setIsIos(ios);
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
            <ol>
              <li>Safari 아래쪽의 <strong>공유</strong> 버튼을 누릅니다.</li>
              <li><strong>홈 화면에 추가</strong>를 선택합니다.</li>
              <li>오른쪽 위의 <strong>추가</strong>를 누르면 완료됩니다.</li>
            </ol>
            <button type="button" onClick={() => setShowIosInstall(false)}>확인</button>
          </section>
        </div>
      )}
    </>
  );
}
