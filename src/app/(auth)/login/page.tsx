"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { handleAuthError } from "@/lib/error-handler";
import PageTransition from "@/components/ui/PageTransition";

type LoginMethod = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
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
        credentials.phone = phone.startsWith("+") ? phone : `91${phone.replace(/\D/g, "")}`;
      }

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) throw error;

      if (data.user) {
        toast.success("Welcome back!");
        // Check onboarding status
        const { data: profile } = await supabase
          .from("users")
          .select("goal")
          .eq("id", data.user.id)
          .single();

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
      const { data, error } = await supabase.auth.signInWithOAuth({
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
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-8 border-none shadow-float overflow-hidden">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-[900] text-brand-dark tracking-tighter leading-none">AngreziBolo</h1>
          <p className="text-muted font-medium text-base">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          {/* Google Login */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-14 border border-gray-200 text-brand-dark hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-bold text-base bg-white rounded-btn shadow-sm disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-brand-orange border-t-transparent rounded-full" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">or use credentials</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Toggle Method */}
          <div className="flex p-1 bg-gray-50 rounded-xl">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                method === "email" ? "bg-white text-brand-dark shadow-sm" : "text-muted"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                method === "phone" ? "bg-white text-brand-dark shadow-sm" : "text-muted"
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Phone Field */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                {method === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                {method === "email" ? (
                  <>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      id="identifier"
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </>
                ) : (
                  <>
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <div className="absolute left-11 top-1/2 -translate-y-1/2 font-bold text-brand-dark text-sm">+91</div>
                    <input
                      id="identifier"
                      type="tel"
                      placeholder="00000 00000"
                      maxLength={10}
                      className="w-full pl-20 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium tracking-wider"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-[10px] font-bold text-muted uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-bold text-brand-orange uppercase tracking-wider hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input 
                id="remember" 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-xs text-muted font-medium cursor-pointer">Remember me</label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-base shadow-sm font-bold mt-2" 
              isLoading={loading}
              disabled={loading}
            >
              Sign In
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-muted">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-orange font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </Card>
    </PageTransition>
  );
}
