import { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관",
  description:
    "고양이 점술관 서비스 이용약관 — 서비스 이용 조건, 이용자 의무, 면책 조항 등을 안내합니다.",
  alternates: { canonical: "https://necessitycat.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-serif mb-2">서비스 이용약관</h1>
      <p className="text-sm text-muted-foreground mb-8">
        최종 수정일: 2026년 4월 14일
      </p>

      <section className="space-y-8 text-sm leading-relaxed text-foreground/80">

        {/* 1. 목적 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제1조 (목적)
          </h2>
          <p>
            이 약관은 고양이 점술관(이하 "서비스" 또는 "회사")이 운영하는
            웹사이트(<a href="https://necessitycat.com" className="underline">necessitycat.com</a>)에서
            제공하는 AI 타로·운세 서비스의 이용과 관련하여 서비스와 이용자
            간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </div>

        {/* 2. 용어 정의 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제2조 (용어의 정의)
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>"서비스"</strong>란 고양이 점술관이 제공하는 AI 타로 카드
              리딩, 사주타로, 오늘의 운세 등 일체의 콘텐츠 및 기능을 의미합니다.
            </li>
            <li>
              <strong>"이용자"</strong>란 본 약관에 따라 서비스를 이용하는
              회원 및 비회원을 말합니다.
            </li>
            <li>
              <strong>"회원"</strong>이란 서비스에 가입하여 계정을 생성한
              이용자를 말합니다.
            </li>
          </ul>
        </div>

        {/* 3. 약관의 효력 및 변경 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제3조 (약관의 효력 및 변경)
          </h2>
          <p>
            본 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이
            발생합니다. 서비스는 합리적인 사유가 있는 경우 약관을 변경할 수
            있으며, 변경된 약관은 공지 후 7일 이후부터 효력이 발생합니다.
            변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수
            있습니다.
          </p>
        </div>

        {/* 4. 회원 가입 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제4조 (회원 가입)
          </h2>
          <p>
            회원 가입은 이메일 가입 또는 Google, Kakao 등 소셜 계정을 통해
            이루어집니다. 회원은 정확한 정보를 제공해야 하며, 타인의 정보를
            도용하거나 허위 정보를 입력한 경우 이용이 제한될 수 있습니다.
          </p>
        </div>

        {/* 5. 서비스 제공 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제5조 (서비스의 제공)
          </h2>
          <p>
            서비스는 AI 기반 타로 카드 리딩 및 운세 콘텐츠를 제공합니다.
            제공되는 모든 콘텐츠는 오락 및 참고 목적으로만 활용되어야 하며,
            실제 의사 결정(의료, 법률, 재정 등)의 근거로 사용되어서는 안
            됩니다. 서비스는 운영상·기술상 필요한 경우 서비스를 일시 중단할
            수 있습니다.
          </p>
        </div>

        {/* 6. 이용자의 의무 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제6조 (이용자의 의무)
          </h2>
          <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>서비스 내 콘텐츠의 무단 복제·배포</li>
            <li>타인의 정보 도용 또는 허위 정보 등록</li>
            <li>서비스 운영을 방해하는 행위(크롤링, DDoS 등)</li>
            <li>서비스를 통해 불법·유해 정보를 유포하는 행위</li>
            <li>기타 관계 법령에 위반되는 행위</li>
          </ul>
        </div>

        {/* 7. 지식재산권 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제7조 (지식재산권)
          </h2>
          <p>
            서비스가 제공하는 콘텐츠(텍스트, 이미지, 디자인, AI 생성 결과물
            등)에 대한 지식재산권은 서비스에 귀속됩니다. 이용자는 개인적·비상업적
            용도로만 콘텐츠를 이용할 수 있으며, 상업적 목적의 재사용은 금지됩니다.
          </p>
        </div>

        {/* 8. 계정 정지 및 탈퇴 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제8조 (계정 정지 및 탈퇴)
          </h2>
          <p>
            서비스는 이용자가 본 약관을 위반한 경우 사전 통보 없이 계정을
            정지하거나 삭제할 수 있습니다. 이용자는 언제든지 서비스 내
            마이페이지 또는 이메일 요청을 통해 탈퇴할 수 있으며, 탈퇴 즉시
            개인정보가 파기됩니다.
          </p>
        </div>

        {/* 9. 면책 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제9조 (면책)
          </h2>
          <p>
            서비스에서 제공하는 타로 및 운세 콘텐츠는 오락 목적의 참고 자료이며,
            서비스는 해당 콘텐츠의 정확성·신뢰성을 보증하지 않습니다. 이용자가
            콘텐츠를 신뢰하여 발생한 손해에 대해 서비스는 책임을 지지 않습니다.
            서비스는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스
            중단에 대해 책임을 지지 않습니다.
          </p>
        </div>

        {/* 10. 준거법 및 관할 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제10조 (준거법 및 관할)
          </h2>
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한
            분쟁은 대한민국 법원을 전속 관할로 합니다.
          </p>
        </div>

        {/* 11. 문의 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제11조 (문의)
          </h2>
          <p>
            서비스 이용약관에 관한 문의는 아래 이메일로 연락해 주세요.
          </p>
          <p className="mt-2">
            이메일:{" "}
            <a
              href="mailto:necessitycat.ai@gmail.com"
              className="underline text-foreground"
            >
              necessitycat.ai@gmail.com
            </a>
          </p>
        </div>

      </section>
    </div>
  );
}
