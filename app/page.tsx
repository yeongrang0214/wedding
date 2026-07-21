import type { Metadata } from "next";
import WeddingPlanner from "./WeddingPlanner";

export const metadata: Metadata = {
  title: "영냥상뭉의 결혼 준비실",
  description: "결혼 예산, 지출, 할 일, 식장과 웨딩밴드 후보를 한곳에서 관리하는 페이지",
};

export default function Home() {
  return <WeddingPlanner />;
}
