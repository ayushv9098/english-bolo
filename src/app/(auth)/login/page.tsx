"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      if (error) setError("");
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = `91${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success("OTP sent successfully!");
      router.push(`/verify?phone=${encodeURIComponent(formattedPhone)}`);
    } catch (err: any) {
      setError(err.message || "Kuch galat ho gaya. Phir se try karein.");
      toast.error(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = phone.length !== 10 || loading;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-10 border-none shadow-float">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2">
            Namaste! Welcome back
          </div>
          <h1 className="text-4xl font-[900] text-brand-dark tracking-tighter leading-none">AngreziBolo</h1>
          <p className="text-muted font-medium text-base">Master English with an Indian heart</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleLogin}
            isLoading={googleLoading}
            variant="ghost"
            className="w-full h-14 border-gray-200 text-brand-dark hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-bold text-base bg-white"
          >
            {!googleLoading && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">or use phone</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {!showPhoneLogin ? (
            <Button 
              variant="soft" 
              className="w-full h-14 font-bold text-base"
              onClick={() => setShowPhoneLogin(true)}
            >
              Continue with Phone
            </Button>
          ) : (
            <form onSubmit={handlePhoneLogin} className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2 text-left">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-gray-100">
                    <Phone className="text-muted" size={16} />
                    <span className="text-sm font-bold text-brand-dark">+91</span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    placeholder="00000 00000"
                    className={`w-full pl-20 pr-4 py-4 rounded-xl bg-white border ${
                      error ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:ring-brand-orange/20 focus:border-brand-orange'
                    } focus:bg-white focus:ring-2 outline-none transition-all text-brand-dark font-bold text-lg tracking-wider placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-medium`}
                    value={phone}
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium hindi text-center animate-in fade-in slide-in-from-top-1">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 text-base shadow-sm font-bold" 
                isLoading={loading}
                disabled={isButtonDisabled}
              >
                Get OTP Code
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>
          )}
        </div>
        
        <p className="text-[10px] text-center text-muted font-medium px-4 leading-relaxed">
          By continuing, you agree to our <span className="underline decoration-gray-300 cursor-pointer">Terms</span> and <span className="underline decoration-gray-300 cursor-pointer">Privacy Policy</span>.
        </p>
      </Card>
    </div>
  );
}
