import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description:
    "고양이 점술관 개인정보 처리방침 — 수집 항목, 이용 목적, 보유 기간, Google 사용자 데이터 처리 방식을 안내합니다.",
  alternates: { canonical: "https://necessitycat.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-serif mb-2">개인정보 처리방침</h1>
      <p className="text-sm text-muted-foreground mb-8">
        최종 수정일: 2026년 4월 14일
      </p>

      <section className="space-y-8 text-sm leading-relaxed text-foreground/80">

        {/* 1. 수집 항목 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제1조 (수집하는 개인정보)
          </h2>
          <p>서비스는 회원가입 및 서비스 제공을 위해 다음 정보를 수집합니다.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>필수: 이메일 주소</li>
            <li>
              소셜 로그인(Google, Kakao 등) 시: 소셜 계정의 이메일 주소 및
              프로필 정보(이름, 프로필 이미지)
            </li>
            <li>자동 수집: 서비스 이용 기록, 접속 로그</li>
          </ul>
        </div>

        {/* 2. 이용 목적 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제2조 (개인정보 수집 및 이용 목적)
          </h2>
          <p>수집된 개인정보는 다음 목적으로만 이용됩니다.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>회원 식별 및 계정 관리</li>
            <li>서비스 이용 내역(타로 리딩 기록 등) 저장 및 제공</li>
            <li>서비스 관련 공지 및 안내</li>
          </ul>
        </div>

        {/* 3. Google 사용자 데이터 (구글 브랜딩 필수 항목) */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제3조 (Google 사용자 데이터 처리)
          </h2>
          <p>
            서비스는 Google OAuth 2.0을 통해 Google 계정으로 로그인할 수 있는
            기능을 제공합니다. Google 로그인 시 수집되는 데이터 범위와 처리
            방식은 다음과 같습니다.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>
              <strong>수집 범위:</strong> 이메일 주소, 이름, 프로필 이미지
              (Google 기본 프로필 스코프)
            </li>
            <li>
              <strong>이용 목적:</strong> 본인 확인 및 계정 생성·로그인 처리에만
              사용하며, 그 외 용도로 사용하지 않습니다.
            </li>
            <li>
              <strong>제3자 제공 및 판매 금지:</strong> Google로부터 획득한
              사용자 데이터는 제3자에게 제공하거나 판매하지 않습니다.
            </li>
            <li>
              <strong>광고 활용 금지:</strong> Google 사용자 데이터를 광고 목적
              또는 타겟팅 광고에 활용하지 않습니다.
            </li>
            <li>
              <strong>최소 권한 원칙:</strong> 서비스 운영에 필요한 최소한의
              데이터만 요청합니다.
            </li>
          </ul>
          <p className="mt-3">
            본 서비스의 Google API 사용은{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground"
            >
              Google API 서비스 사용자 데이터 정책
            </a>
            을 준수합니다.
          </p>
        </div>

        {/* 4. 보유 및 이용 기간 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제4조 (개인정보 보유 및 이용 기간)
          </h2>
          <p>
            개인정보는 회원 탈퇴 요청 시 지체 없이 파기됩니다. 단, 관계 법령에
            따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              전자상거래 등에서의 소비자 보호에 관한 법률: 계약·청약 철회 기록
              5년
            </li>
            <li>통신비밀보호법: 로그 기록 3개월</li>
          </ul>
        </div>

        {/* 5. 제3자 제공 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제5조 (개인정보 제3자 제공)
          </h2>
          <p>
            서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 법령에 의한 요청이 있는 경우는 예외로 합니다.
          </p>
        </div>

        {/* 6. 처리 위탁 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제6조 (개인정보 처리 위탁)
          </h2>
          <p>
            서비스는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를
            위탁합니다.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Supabase Inc. — 인증 및 데이터베이스 관리</li>
            <li>Google LLC — Google 소셜 로그인(OAuth 2.0) 인증</li>
          </ul>
        </div>

        {/* 7. 이용자의 권리 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제7조 (이용자의 권리 및 행사 방법)
          </h2>
          <p>
            이용자는 언제든지 다음 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>개인정보 열람, 수정 요청</li>
            <li>개인정보 삭제(회원 탈퇴) 요청</li>
            <li>개인정보 처리 정지 요청</li>
          </ul>
          <p className="mt-2">
            권리 행사는 서비스 내 마이페이지 또는 아래 연락처로 요청하시면
            지체 없이 처리합니다.
          </p>
        </div>

        {/* 8. 쿠키 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제8조 (쿠키 사용)
          </h2>
          <p>
            서비스는 이용자 인증 및 세션 유지를 위해 쿠키를 사용합니다.
            브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인
            등 일부 기능이 제한될 수 있습니다.
          </p>
        </div>

        {/* 9. 보안 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제9조 (개인정보 보호를 위한 기술적·관리적 조치)
          </h2>
          <p>서비스는 개인정보 보호를 위해 다음 조치를 취하고 있습니다.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>HTTPS를 통한 전송 구간 암호화</li>
            <li>비밀번호 등 민감 정보 암호화 저장</li>
            <li>최소 권한 원칙에 따른 접근 통제</li>
          </ul>
        </div>

        {/* 10. 연락처 */}
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">
            제10조 (개인정보 처리방침 문의)
          </h2>
          <p>
            개인정보 처리방침에 대한 문의 또는 권리 행사 요청은 아래 이메일로
            연락해 주세요.
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
          <p className="mt-1 text-xs text-muted-foreground">
            ※ 접수 후 영업일 기준 3일 이내에 답변드립니다.
          </p>
        </div>

      </section>
    </div>
  );
}
