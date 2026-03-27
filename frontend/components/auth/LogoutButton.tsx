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
    }
    router.refresh();
    router.push("/login");
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
