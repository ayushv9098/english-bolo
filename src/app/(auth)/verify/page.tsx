"use client";

import { useState, Suspense } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function VerifyContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const supabase = createClient();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has finished onboarding
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
      setError(err.message || "OTP galat hai. Phir se try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-brand-dark" />
      </button>

      <Card className="w-full max-w-md p-10 space-y-10 border-none shadow-float">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-brand-purple/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-purple/20">
            <KeyRound size={28} className="text-brand-purple" />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight leading-none">Verify Number</h1>
          <p className="text-muted font-medium text-sm">
            Enter the 6-digit code sent to <br/>
            <span className="text-brand-dark font-bold mt-1 inline-block">{phone}</span>
          </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">OTP Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] rounded-xl bg-white border border-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-brand-dark font-bold placeholder:text-gray-300 placeholder:tracking-normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium hindi text-center">{error}</p>
          )}

          <Button type="submit" className="w-full h-14 text-base shadow-sm bg-brand-purple hover:bg-brand-purple/90" isLoading={loading}>
            Verify & Continue
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
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
