import type { Metadata } from "next";
import WeddingPlanner from "./WeddingPlanner";

export const metadata: Metadata = {
  title: "영냥 × 상뭉의 웨딩 아카이브",
  description: "결혼 예산, 지출과 할 일을 우리다운 속도로 기록하는 페이지",
};

export default function Home() {
  return <WeddingPlanner />;
}
