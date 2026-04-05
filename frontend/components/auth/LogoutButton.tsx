"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패:", error.message);
      return;
    }
    // push로 이동하면 서버 컴포넌트(Header)가 새 세션 상태로 다시 렌더링됨
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/40 hover:bg-primary/10 transition-colors"
    >
      로그아웃
    </button>
  );
}
