'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "../../../utils/token";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");
    if (access && refresh) {
      setTokens({ access, refresh });
    }
    router.replace("/");
  }, [router]);

  return <div className="min-h-screen bg-white"></div>;
}