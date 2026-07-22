import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "영냥 × 상뭉의 웨딩 아카이브",
    short_name: "영냥상뭉",
    description: "결혼 예산, 지출과 할 일을 함께 기록하는 비공개 웨딩 아카이브",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f5f0",
    theme_color: "#64715b",
    orientation: "portrait-primary",
    lang: "ko-KR",
    categories: ["lifestyle", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
