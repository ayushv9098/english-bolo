"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { handleAuthError } from "@/lib/error-handler";
import PageTransition from "@/components/ui/PageTransition";
import { useIsNativeApp } from "@/lib/capacitor/useIsNativeApp";

type LoginMethod = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  // Google OAuth is blocked inside the native app's webview, so hide it there.
  const isNativeApp = useIsNativeApp();
  
  const [method, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentials: any = { password };
      
      if (method === "email") {
        credentials.email = email;
      } else {
        credentials.phone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
      }

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) throw error;

      if (data.user) {
        toast.success("Welcome back!");
        // Use maybeSingle() or handle missing row to prevent error during login redirect
        const { data: profile } = await supabase
          .from("users")
          .select("goal")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile?.goal) {
          router.push("/home");
        } else {
          router.push("/onboarding/goal");
        }
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    const loadingToast = toast.loading("Connecting to Google...");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.dismiss(loadingToast);
      handleAuthError(err);
      setGoogleLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <Card className="w-full max-w-md p-8 space-y-8 border-none shadow-float overflow-hidden">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">AngreziBolo</h1>
          <p className="text-muted text-sm">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          {/* Toggle Method */}
          <div className="flex gap-6 border-b border-gray-100">
            <button
              onClick={() => setLoginMethod("email")}
              className={`pb-2 -mb-px text-sm font-semibold border-b-2 transition-colors ${
                method === "email" ? "border-brand-orange text-brand-dark" : "border-transparent text-muted hover:text-brand-dark/70"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`pb-2 -mb-px text-sm font-semibold border-b-2 transition-colors ${
                method === "phone" ? "border-brand-orange text-brand-dark" : "border-transparent text-muted hover:text-brand-dark/70"
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email/Phone Field */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="text-xs font-medium text-muted">
                {method === "email" ? "Email address" : "Phone number"}
              </label>
              {method === "email" ? (
                <input
                  id="identifier"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-brand-orange outline-none transition-colors text-brand-dark text-sm placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark text-sm">+91</span>
                  <input
                    id="identifier"
                    type="tel"
                    placeholder="00000 00000"
                    maxLength={10}
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-brand-orange outline-none transition-colors text-brand-dark text-sm placeholder:text-gray-300"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-medium text-muted">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-brand-orange hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 pr-10 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-brand-orange outline-none transition-colors text-brand-dark text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange/20 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-muted cursor-pointer">Remember me</label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold rounded-lg"
              isLoading={loading}
              disabled={loading}
            >
              Login
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>

          {/* Google login is hidden inside the native app (webview blocks Google OAuth) */}
          {!isNativeApp && (
            <>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-3 text-xs text-muted">or</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {/* Google Login at Bottom */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full h-11 border border-gray-200 text-brand-dark hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 font-medium text-sm bg-white rounded-lg disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-brand-orange border-t-transparent rounded-full" />
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-orange font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </Card>
    </PageTransition>
  );
}
