export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-serif mb-2">개인정보 처리방침</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 3월 30일</p>

      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제1조 (수집하는 개인정보)</h2>
          <p>서비스는 회원가입 및 서비스 제공을 위해 다음 정보를 수집합니다:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>필수: 이메일 주소</li>
            <li>소셜 로그인 시: 소셜 계정의 이메일 및 프로필 정보(이름, 프로필 이미지)</li>
            <li>자동 수집: 서비스 이용 기록, 접속 로그</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제2조 (개인정보 수집 및 이용 목적)</h2>
          <p>수집된 개인정보는 다음 목적으로만 이용됩니다:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>회원 식별 및 계정 관리</li>
            <li>서비스 이용 내역 저장 및 제공</li>
            <li>서비스 관련 공지 및 안내</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제3조 (개인정보 보유 및 이용 기간)</h2>
          <p>
            개인정보는 회원 탈퇴 시 즉시 파기됩니다. 단, 관계 법령에 따라 보존이 필요한
            경우 해당 기간 동안 보관됩니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제4조 (개인정보 제3자 제공)</h2>
          <p>
            서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 법령에 의한 요청이 있는 경우는 예외로 합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제5조 (개인정보 처리 위탁)</h2>
          <p>서비스는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Supabase Inc. — 인증 및 데이터베이스 관리</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제6조 (이용자의 권리)</h2>
          <p>
            이용자는 언제든지 자신의 개인정보를 조회·수정·삭제할 수 있습니다. 개인정보와
            관련한 문의는 서비스 내 문의 채널을 통해 연락하시기 바랍니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제7조 (쿠키 사용)</h2>
          <p>
            서비스는 이용자 인증 및 세션 유지를 위해 쿠키를 사용합니다. 브라우저 설정을 통해
            쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 기능이 제한될 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
