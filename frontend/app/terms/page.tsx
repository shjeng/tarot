export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-serif mb-2">서비스 이용약관</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 3월 30일</p>

      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제1조 (목적)</h2>
          <p>
            이 약관은 고양이 점술관(이하 "서비스")이 제공하는 타로 점술 서비스의 이용과 관련하여
            서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제2조 (용어의 정의)</h2>
          <p>
            "서비스"란 고양이 점술관이 제공하는 타로 카드 리딩, 운세 해석 등 일체의 콘텐츠 및
            기능을 의미합니다. "이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을
            말합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제3조 (약관의 효력 및 변경)</h2>
          <p>
            본 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이 발생합니다.
            서비스는 합리적인 사유가 있는 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후
            7일 이후부터 효력이 발생합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제4조 (서비스의 제공)</h2>
          <p>
            서비스는 타로 카드 기반의 운세 및 점술 콘텐츠를 제공합니다. 제공되는 모든 콘텐츠는
            오락 및 참고 목적으로만 활용되어야 하며, 실제 의사 결정의 근거로 사용되어서는
            안 됩니다. 서비스는 운영상·기술상 필요한 경우 서비스를 일시 중단할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제5조 (이용자의 의무)</h2>
          <p>
            이용자는 다음 행위를 하여서는 안 됩니다: ① 서비스 내 콘텐츠의 무단 복제·배포,
            ② 타인의 정보 도용, ③ 서비스 운영을 방해하는 행위, ④ 기타 관계 법령에 위반되는
            행위.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제6조 (면책)</h2>
          <p>
            서비스에서 제공하는 타로 및 운세 콘텐츠는 오락 목적의 참고 자료이며, 서비스는
            해당 콘텐츠의 정확성·신뢰성에 대해 보증하지 않습니다. 이용자가 콘텐츠를 신뢰하여
            발생한 손해에 대해 서비스는 책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제7조 (준거법 및 관할)</h2>
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁은 대한민국
            법원을 전속 관할로 합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
