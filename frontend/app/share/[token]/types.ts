// 공유된 리딩 데이터 타입 (백엔드 응답 구조)
export interface SharedReading {
  type: "daily" | "spread";
  request_data: {
    card?: { name: string; nameKo: string };
    cards?: { name: string; nameKo: string }[];
    question?: string;
  };
  reading: string;
  created_at: string;
}
