import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Using edge runtime might be good, but nodejs is safer for now with environment variables and SDK
// export const runtime = 'edge'; 

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const { cards, question } = await req.json();

        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            return NextResponse.json(
                { error: "No cards provided" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const cardDescriptions = cards.map((card, index) => {
            const position = index === 0 ? "Past" : index === 1 ? "Present" : "Future";
            return `${position}: ${card.name} (${card.nameKo}) - ${card.meaningUpright}`;
        }).join("\n");

        const prompt = `
      당신은 깊은 통찰력과 따뜻한 공감 능력을 지닌 신비로운 타로 마스터입니다.
      사용자가 '과거, 현재, 미래' 스프레드로 다음 3장의 타로 카드를 뽑았습니다:
      
      ${cardDescriptions}
      
      사용자의 고민/질문: ${question || "전반적인 운세 흐름"}
      
      위 카드들과 사용자의 질문을 바탕으로 심도 있는 타로 리딩을 제공해주세요.
      1. 각 위치(과거, 현재, 미래)에 나타난 카드의 의미를 문맥에 맞게 해석해주세요.
      2. 세 카드의 연결 고리와 흐름을 종합적으로 분석해주세요.
      3. 사용자에게 용기와 영감을 주는 따뜻한 조언으로 마무리해주세요.
      
      어조: 신비롭고, 공감하며, 통찰력 있고, 부드러운 경어체 (예: ~해요, ~습니다)
      형식: 마크다운(Markdown)을 사용하여 소제목(###)과 글머리 기호(-), 굵은 글씨(** **) 등을 적절히 활용해 가독성 좋게 작성해주세요.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error("Error generating tarot reading:", error);
        return NextResponse.json(
            { error: "Failed to generate reading" },
            { status: 500 }
        );
    }
}
