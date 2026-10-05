import { createClient } from "@supabase/supabase-js";

function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return reply({ message: "로그인이 필요합니다." }, 401);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return reply({ message: "로그인 설정을 확인해 주세요." }, 503);

  try {
    // A request-scoped client uses the user's JWT: existing RLS remains enforced.
    // The private role helper stays private and is used by the DB policies.
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return reply({ message: "로그인이 만료되었습니다. 다시 로그인해 주세요." }, 401);
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (error) return reply({ message: "관리자 권한을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 503);
    if (!profile || !["owner", "editor"].includes(profile.role)) {
      return reply({ message: "관리자 권한이 없습니다. owner 또는 editor 역할이 필요합니다." }, 403);
    }
    return reply({ email: user.email ?? "", role: profile.role });
  } catch {
    return reply({ message: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 503);
  }
}
