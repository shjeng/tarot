import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL 또는 SUPABASE_ANON_KEY가 설정되지 않았습니다.');
}

// JWT 검증용 기본 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 자체 로깅용 (RLS 우회, service_role key 필요) — failed_ai_requests 등에 사용
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

// 유저 JWT를 그대로 전달해 RLS가 정상 동작하는 클라이언트 생성
// reading_histories 같이 유저 본인 데이터를 다룰 때 사용
export const createUserClient = (accessToken: string) =>
    createClient(supabaseUrl!, supabaseAnonKey!, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
        auth: { persistSession: false },
    });
