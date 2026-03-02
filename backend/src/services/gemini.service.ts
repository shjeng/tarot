import { GoogleGenerativeAI } from '@google/generative-ai';

// 환경변수 로딩 확인 (안전장치)
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// 타로 리더로서의 기본 컨텍스트 부여
const systemInstruction = `
당신은 신비롭고 지혜로운 타로 리더입니다. 
사용자가 뽑은 타로 카드를 바탕으로, 따뜻하면서도 통찰력 있는 조언을 한국어로 존댓말을 사용하여 제공해주세요.
사용자의 현재 상황과 감정을 공감하며, 지나치게 단정적이거나 부정적인 표현은 피하고 희망적이고 건설적인 방향으로 해석해주세요.
`;

export const generateDailyReading = async (card: any): Promise<string> => {
    try {
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return `[API KEY 미설정 상태]\n"${card.nameKo}" 카드를 뽑으셨군요. 이 카드는 "${card.meaningUpright}"의 의미를 담고 있습니다.\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro', // 또는 gemini-1.5-flash
            systemInstruction
        });

        const prompt = `
사용자가 오늘을 위한 카드로 [${card.nameKo} (${card.name})] 카드를 정방향으로 뽑았습니다. 
이 카드의 주요 키워드는 "${card.meaningUpright}"이며, 기본 의미는 "${card.desc}" 입니다.

이 카드가 오늘 하루 사용자에게 어떤 의미와 조언을 주는지 3~4문단 정도로 자연스럽게 해석해주세요.
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error (Daily):', error);
        throw new Error('AI 응답 생성 실패');
    }
};

export const generateSpreadReading = async (cards: any[]): Promise<string> => {
    try {
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return `[API KEY 미설정 상태]\n과거: ${cards[0].nameKo}, 현재: ${cards[1].nameKo}, 미래: ${cards[2].nameKo}\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            systemInstruction
        });

        const prompt = `
사용자가 자신의 상황에 대해 조언을 얻기 위해 3장의 카드를 뽑았습니다.

1. 과거(배경): [${cards[0].nameKo}] - 키워드: ${cards[0].meaningUpright}
2. 현재(상황): [${cards[1].nameKo}] - 키워드: ${cards[1].meaningUpright}
3. 미래(결과/조언): [${cards[2].nameKo}] - 키워드: ${cards[2].meaningUpright}

이 세 장의 카드가 유기적으로 연결되도록 종합적인 타로 리딩을 제공해주세요.
각 카드의 의미를 단순히 나열하는 것이 아니라, 이야기처럼 자연스럽게 이어지도록 해석해주세요.
분량은 문단 구분을 잘 지켜서 상세하게 작성해주세요.
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error (Spread):', error);
        throw new Error('AI 응답 생성 실패');
    }
};
