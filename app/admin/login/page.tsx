"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
      });
      if (error) {
        const messages: Record<string, string> = {
          invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
          email_not_confirmed: "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.",
          over_request_rate_limit: "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
          over_email_send_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
          user_banned: "이 계정으로 로그인할 수 없습니다. 관리자에게 문의해 주세요.",
        };
        setMessage(messages[error.code ?? ""] ?? "로그인하지 못했습니다. 입력 정보와 네트워크 연결을 확인해 주세요.");
        return;
      }
      router.replace("/admin");
    } catch {
      setMessage("로그인 서비스에 연결하지 못했습니다. 네트워크 연결과 로그인 설정을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="admin-login" aria-labelledby="login-title">
      <p className="eyebrow">STAFF ACCESS / SMH BOOK ARCHIVE</p>
      <h1 id="login-title">관리자 로그인</h1>
      <p className="admin-copy">아카이브를 돌보는 사람들을 위한 공간입니다.</p>
      <form className="admin-form" onSubmit={login} aria-busy={pending}>
        <label htmlFor="email">이메일</label>
        <input id="email" name="email" type="email" autoComplete="username" required disabled={pending} />
        <label htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required disabled={pending} />
        <p className="admin-message" role="alert">{message}</p>
        <button className="admin-button" type="submit" disabled={pending}>{pending ? "로그인 중…" : "로그인"}</button>
      </form>
      <p className="admin-footnote">등록된 owner 또는 editor 계정만 관리자 화면을 사용할 수 있습니다.</p>
    </section>
  );
}
