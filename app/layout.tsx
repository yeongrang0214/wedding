import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import PwaManager from "./PwaManager";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#64715b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("x-forwarded-host") ?? incomingHeaders.get("host") ?? "localhost:3000";
  const protocol = incomingHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "영냥 × 상뭉의 웨딩 아카이브";
  const description = "두 사람의 결혼 예산, 지출과 할 일을 차분히 기록하는 웨딩 아카이브";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    applicationName: "영냥상뭉",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "영냥상뭉",
    },
    formatDetection: { telephone: false },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "영냥과 상뭉의 웨딩 아카이브" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}<PwaManager /></body></html>;
}
