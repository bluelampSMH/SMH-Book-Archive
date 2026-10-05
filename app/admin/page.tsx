"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

type Staff = { email: string; role: "owner" | "editor" };

export default function AdminPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let active = true;
    let sequence = 0;
    let unsubscribe = () => {};
    async function verify() {
      const current = ++sequence;
      setStaff(null);
      setChecking(true);
      setMessage("");
      try {
        const { data: { session }, error } = await getSupabaseClient().auth.getSession();
        if (!active || current !== sequence) return;
        if (error || !session) { router.replace("/admin/login"); return; }
        const response = await fetch("/api/admin/session", {
          headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store",
        });
        const result = await response.json();
        if (!active || current !== sequence) return;
        if (response.status === 401) { router.replace("/admin/login"); return; }
        if (!response.ok) { setMessage(result.message ?? "관리자 권한을 확인하지 못했습니다."); return; }
        if (result.role !== "owner" && result.role !== "editor") {
          setMessage("관리자 권한이 없습니다."); return;
        }
        setStaff({ email: result.email, role: result.role });
      } catch {
        if (active && current === sequence) setMessage("관리자 권한을 확인하지 못했습니다. 연결과 로그인 설정을 확인한 후 다시 시도해 주세요.");
      } finally {
        if (active && current === sequence) setChecking(false);
      }
    }
    // Defer auth callbacks so session reads run outside Supabase's auth lock.
    let timer: ReturnType<typeof setTimeout>;
    try {
      const { data } = getSupabaseClient().auth.onAuthStateChange(() => {
        clearTimeout(timer);
        timer = setTimeout(() => { if (active) void verify(); }, 0);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch { /* verify displays a configuration error without exposing values. */ }
    void verify();
    const onFocus = () => { void verify(); };
    window.addEventListener("focus", onFocus);
    return () => { active = false; clearTimeout(timer); unsubscribe(); window.removeEventListener("focus", onFocus); };
  }, [router]);

  async function logout() {
    setLeaving(true);
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) { setMessage("로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요."); return; }
      setStaff(null);
      router.replace("/admin/login");
    } catch {
      setMessage("로그아웃하지 못했습니다. 네트워크 연결을 확인해 주세요.");
    } finally { setLeaving(false); }
  }

  return (
    <section aria-labelledby="admin-title">
      <p className="eyebrow">ARCHIVE DESK / STAFF ONLY</p>
      <h1 id="admin-title">아카이브 관리</h1>
      {checking ? <p className="admin-copy" role="status">로그인과 관리자 권한을 확인하고 있습니다…</p> : staff ? (
        <>
          <p className="admin-copy">책의 기록을 차분히 이어가는 공간입니다.</p>
          <dl className="record-list admin-records">
            <div><dt>로그인 계정</dt><dd>{staff.email}</dd></div>
            <div><dt>역할</dt><dd>{staff.role}</dd></div>
          </dl>
          <section className="admin-next" aria-labelledby="books-title"><span className="eyebrow">01 / BOOK RECORDS</span><h2 id="books-title">책 등록</h2><p className="admin-copy">다음 단계에서 구현 예정입니다.</p></section>
        </>
      ) : <p className="admin-copy">관리자 화면을 사용할 수 없습니다.</p>}
      <p className="admin-message" role="alert">{message}</p>
      {!checking && <div className="admin-actions"><button className="admin-button" disabled={leaving} onClick={logout}>{leaving ? "로그아웃 중…" : "로그아웃"}</button>{!staff && <button className="admin-button admin-button-outline" onClick={() => window.location.reload()}>다시 확인</button>}</div>}
    </section>
  );
}
