"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setToken(t);
  }, []);

  const login = (tokenValue: string) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
    router.push('/patients');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };

  const isAuthenticated = !!token;

  return { token, login, logout, isAuthenticated };
}
