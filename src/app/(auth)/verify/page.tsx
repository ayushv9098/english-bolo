"use client";

import { useState, useEffect, Suspense } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { handleAuthError } from "@/lib/error-handler";
import toast from "react-hot-toast";

function VerifyContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const supabase = createClient();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!phone) {
      toast.error("Phone number missing. Please start again.");
      router.push("/login");
    }
  }, [phone, router]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      if (error) setError("");
    }
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    
    if (!navigator.onLine) {
      handleAuthError(new Error("NetworkError"), setError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      
      toast.success("OTP sent again!");
      setCountdown(30);
      setCanResend(false);
      setOtp("");
    } catch (err: any) {
      handleAuthError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      const msg = "Please enter the 6-digit OTP.";
      setError(msg);
      toast.error(msg, { id: "validation-error" });
      return;
    }
    
    if (!navigator.onLine) {
      handleAuthError(new Error("NetworkError"), setError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      toast.success("Login successful!");

      if (data.user) {
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
      handleAuthError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = otp.length !== 6 || loading;
  const displayPhone = phone.startsWith("91") ? `+91 ${phone.slice(2, 7)} ${phone.slice(7)}` : phone;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <button 
        aria-label="Go back"
        onClick={() => router.back()}
        disabled={loading}
        className="absolute top-8 left-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
      >
        <ArrowLeft className="w-6 h-6 text-brand-dark" />
      </button>

      <Card className="w-full max-w-md p-10 space-y-10 border-none shadow-float">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight leading-none">Verify Number</h1>
          <p className="text-muted font-medium text-sm">
            Enter the 6-digit code sent to <br/>
            <span className="text-brand-dark font-bold mt-1 inline-block">{displayPhone}</span>
          </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6" noValidate>
          <div className="space-y-2 text-left">
            <label htmlFor="otp" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">OTP Code</label>
            <input
              id="otp"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              maxLength={6}
              className={`w-full px-4 py-4 text-center text-2xl tracking-[0.5em] rounded-xl bg-white border ${
                error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-brand-purple/20 focus:border-brand-purple'
              } focus:bg-white focus:ring-2 outline-none transition-all text-brand-dark font-bold placeholder:text-gray-300 placeholder:tracking-normal`}
              value={otp}
              onChange={handleOtpChange}
              autoComplete="one-time-code"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium hindi text-center animate-in fade-in slide-in-from-top-1">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full h-14 text-base shadow-sm bg-brand-purple hover:bg-brand-purple/90" 
            isLoading={loading}
            disabled={isButtonDisabled}
          >
            Verify & Continue
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>

        <div className="text-center space-y-4">
          <button 
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-sm font-bold text-muted hover:text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
          >
            {canResend ? (
              <span className="text-brand-purple">Resend OTP</span>
            ) : (
              `Resend OTP in 0:${countdown.toString().padStart(2, '0')}`
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
