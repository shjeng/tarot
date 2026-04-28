import type { Metadata } from "next";
import Link from "next/link";
import { Moon, Star } from "lucide-react";
import HomeAnimations from "@/components/layout/HomeAnimations";

// 홈 페이지 개별 메타데이터 — 루트 layout의 template 적용됨
export const metadata: Metadata = {
  // absolute: 루트 layout 템플릿을 무시하고 정확한 title 적용 → Google OAuth 앱 이름 매칭
  title: { absolute: "고양이 점술관" },
  description:
    "AI 고양이가 타로 카드와 사주로 오늘의 운세를 풀어드립니다. 무료 AI 타로 리딩, 사주타로, 오늘의 타로 카드 운세를 지금 바로 확인하세요.",
  alternates: { canonical: "https://necessitycat.com" },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <HomeAnimations />

      {/* 서비스 소개 — 고양이 말투, 로그인 없이 누구나 볼 수 있는 앱 목적 설명 */}
      <p className="text-sm text-muted-foreground max-w-md px-4 break-keep">
        냥이가 타로 카드와 사주로 오늘의 운세를 봐주는 무료 점술관이다냥.
        가입만 하면 타로 사주를 봐준다냥~🐾
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
        <Link href="/daily" className="group relative overflow-hidden rounded-md border border-primary/20 bg-background/50 hover:bg-primary/10 transition-all p-8 flex flex-col items-center gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
          <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Moon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
          </div>
          <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">오늘의 운세</h2>
          <p className="text-sm text-muted-foreground">오늘 하루가 어떤 지 궁금하지 않느냥?</p>
        </Link>

        <Link href="/reading" className="group relative overflow-hidden rounded-md border border-primary/20 bg-background/50 hover:bg-primary/10 transition-all p-8 flex flex-col items-center gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
          <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <Star className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">고양이 타로 상담</h2>
          <p className="text-sm text-muted-foreground">요즘은 어떤 고민이 있느냥?</p>
        </Link>
      </div>

      {/* ─── 정적 콘텐츠 영역: AdSense/SEO용 고유 콘텐츠 ─────────────────────── */}
      <section className="max-w-3xl mx-auto mt-20 space-y-12 text-left">
        {/* 소개 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">AI 고양이가 들려주는 타로 이야기</h2>
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            고양이 점술관은 전통 타로 카드의 상징과 의미를 AI가 현대적으로 재해석하여,
            누구나 쉽게 이해할 수 있는 운세와 조언을 전달하는 무료 타로 서비스입니다.
            22장의 메이저 아르칸아 카드는 인간이 살아가며 마주하는 주요한 삶의 과제와
            영적 메시지를 담고 있으며, 매일 한 장의 카드를 통해 오늘의 기운을 살펴 볼 수 있습니다.
          </p>
        </div>

        {/* 오늘의 운세 설명 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-serif">오늘의 타로 운세는 어떻게 보는 건가요?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            타로 운세는 단순한 운세 예측이 아닌, 현재 당신의 에너지와 주변 상황을
            카드의 상징을 통해 비춰보는 도구입니다. 오늘의 운세에서는 메이저 아르칸아
            22장 중 한 장이 무작위로 선택되며, 그 카드가 지닌 키워드와 메시지를 바탕으로
            하루를 복기 위해 도움이 되는 조언을 들을 수 있습니다.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            예를 들어 <strong>태양(The Sun)</strong> 카드가 나왔다면 긍정적인 에너지와
            성공의 징조로, 새로운 도전을 시작하기에 매우 좋은 날임을 의미합니다.
            반대로 <strong>악마(The Devil)</strong> 카드가 나왔다면 지나친 집착이나
            중독에서 벗어나 스스로를 돌아볼 필요가 있음을 암시합니다.
          </p>
        </div>

        {/* 사주타로 설명 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-serif">사주타로란 무엇인가요?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            사주타로는 동양의 사주(생년월일시)와 서양의 타로 카드를 결합한 새로운 점술 방식입니다.
            단순히 카드만 보는 것이 아니라, 당신의 태어난 날짜와 시간에 담긴 오행의 기운을
            타로 카드와 교차 분석하여 더욱 개인화되고 깊이 있는 해석을 제공합니다.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            고양이 점술관의 사주타로 상담에서는 과거·현재·미래를 나타내는 3장의 스프레드를 통해
            현재 고민의 원인과 앞으로의 흐름을 파악합니다. 연애운, 직업운, 재물운 등
            구체적인 질문에 대해 생년월일을 반영한 맞춤형 해석을 받아보세요.
          </p>
        </div>

        {/* 타로 카드 가이드 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-serif">메이저 아르칸아 22장 카드 의미</h3>
          <p className="text-sm text-muted-foreground leading-relaxed break-keep">
            타로의 메이저 아르칸아는 0번 광대부터 21번 세계까지 총 22장으로 구성되어 있습니다.
            이 카드들은 인간의 영적 여정인 &quot;영웅의 여정&quot;을 상징하며,
            각각 새로운 시작, 직관, 사랑, 변화, 완성 등 인생의 중대한 전환점과 교훈을 나타냅니다.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {[
              ["광대", "새로운 시작"],
              ["마법사", "창조력 발현"],
              ["여사제", "직관과 지혜"],
              ["여황제", "풍요와 포용"],
              ["황제", "권위와 체계"],
              ["교황", "전통과 신념"],
              ["연인", "사랑과 선택"],
              ["전차", "의지와 승리"],
              ["힘", "납면의 용기"],
              ["은둔자", "성찰과 고독"],
              ["울명의 수레바퀴", "변화와 전환"],
              ["정의", "공평과 진실"],
              ["매달린 사람", "새로운 시각"],
              ["죽음", "끝맺음과 정화"],
              ["절제", "균형과 인내"],
              ["악마", "유혹과 집착"],
              ["탑", "붕괴와 각성"],
              ["별", "희망과 치유"],
              ["달", "불안과 직관"],
              ["태양", "성공과 긍정"],
              ["심판", "부활과 각성"],
              ["세계", "완성과 성취"],
            ].map(([name, meaning]) => (
              <div
                key={name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/10 bg-secondary/5 text-xs"
              >
                <span className="font-bold text-foreground">{name}</span>
                <span className="text-muted-foreground">{meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 이용 안내 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-serif">무료로 이용하는 방법</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed break-keep">
            <li>상단의 &quot;오늘의 운세&quot; 또는 &quot;고양이 타로 상담&quot; 버튼을 선택합니다.</li>
            <li>오늘의 운세는 별도 가입 없이 바로 카드를 뽑을 수 있습니다.</li>
            <li>사주타로 상담을 원하시면 생년월일과 성별을 입력한 뒤 고민을 적어주세요.</li>
            <li>3장의 카드를 선택하면 AI 고양이가 사주와 타로를 결합하여 해석을 전달합니다.</li>
            <li>마이페이지에서 지난 리딩 기록을 확인하고 친구들과 공유할 수도 있습니다.</li>
          </ol>
        </div>
      </section>

    </div>
  );
}
