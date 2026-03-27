import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL 또는 SUPABASE_ANON_KEY가 설정되지 않았습니다.');
}

// 일반 요청용 (JWT 검증에 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자용 (RLS 무시, 향후 커스텀 OAuth 등에서 사용)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
