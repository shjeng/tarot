import { GoogleGenerativeAI } from '@google/generative-ai';

// 환경변수 로딩 확인 (안전장치)
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface CardInput {
    name: string;
    nameKo: string;
    meaningUpright: string;
    [key: string]: any;
}

export interface SpreadReadingOptions {
    cards: CardInput[];
    question: string;
    birthDate: string;
    birthTime: string | null | undefined;
    gender: 'male' | 'female' | 'other';
}

const genderToKorean = (gender: SpreadReadingOptions['gender']): string => {
    const map = { male: '남성', female: '여성', other: '기타' };
    return map[gender];
};

const birthDateToKorean = (birthDate: string): string => {
    const [year, month, day] = birthDate.split('-').map(Number);
    return `${year}년 ${month}월 ${day}일`;
};

const birthTimeToKorean = (birthTime: string | null | undefined): string => {
    if (!birthTime) return '태어난 시각은 알 수 없습니다';
    const [hh, mm] = birthTime.split(':').map(Number);
    if (hh < 12) {
        return `오전 ${hh}시 ${mm}분`;
    }
    const displayHour = hh === 12 ? 12 : hh - 12;
    return `오후 ${displayHour}시 ${mm}분`;
};

// 타로 리더로서의 기본 컨텍스트 부여
const dailySystemInstruction = `
당신은 신비롭고 지혜로운 타로 리더입니다.
사용자가 뽑은 타로 카드를 바탕으로, 따뜻하면서도 통찰력 있는 조언을 한국어로 존댓말을 사용하여 제공해주세요.
사용자의 현재 상황과 감정을 공감하며, 지나치게 단정적이거나 부정적인 표현은 피하고 희망적이고 건설적인 방향으로 해석해주세요.
`;

const spreadSystemInstruction = `
당신은 사주와 타로를 결합한 신비롭고 지혜로운 상담사입니다.
사용자의 생년월일, 성별, 태어난 시각을 바탕으로 사주의 기운을 읽고,
뽑은 타로 카드와 연결지어 한국어 존댓말로 따뜻하고 통찰력 있는 조언을 드립니다.
사용자의 감정을 공감하며, 지나치게 단정적이거나 부정적인 표현은 피하고
희망적이고 건설적인 방향으로 해석해주세요.
`;

export const generateDailyReading = async (card: any): Promise<string> => {
    try {
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return `[API KEY 미설정 상태]\n"${card.nameKo}" 카드를 뽑으셨군요. 이 카드는 "${card.meaningUpright}"의 의미를 담고 있습니다.\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-pro', // 또는 gemini-1.5-flash
            systemInstruction: dailySystemInstruction
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

export const generateSpreadReading = async (options: SpreadReadingOptions): Promise<string> => {
    const { cards, question, birthDate, birthTime, gender } = options;

    const genderKo = genderToKorean(gender);
    const birthDateKo = birthDateToKorean(birthDate);
    const birthTimeKo = birthTimeToKorean(birthTime);

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return `[API KEY 미설정 상태]\n의뢰인: ${birthDateKo} / ${genderKo} / 태어난 시각: ${birthTimeKo}\n질문: ${question}\n과거: ${cards[0].nameKo}, 현재: ${cards[1].nameKo}, 미래: ${cards[2].nameKo}\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-pro',
            systemInstruction: spreadSystemInstruction
        });

        const prompt = `
[의뢰인 정보]
- 생년월일: ${birthDateKo} / 성별: ${genderKo}
- 태어난 시각: ${birthTimeKo}

[질문]
${question}

[뽑은 카드]
1. 과거 (배경): [${cards[0].nameKo}] — 키워드: ${cards[0].meaningUpright}
2. 현재 (상황): [${cards[1].nameKo}] — 키워드: ${cards[1].meaningUpright}
3. 미래 (결과/조언): [${cards[2].nameKo}] — 키워드: ${cards[2].meaningUpright}

사주의 기운과 세 장의 카드를 유기적으로 연결하여, 질문에 대한 종합적인 사주타로 리딩을 4~5문단으로 작성해주세요.
`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Gemini API Error (Spread):', error);
        throw new Error('AI 응답 생성 실패');
    }
};
