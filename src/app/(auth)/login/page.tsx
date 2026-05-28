"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Supabase test numbers in the dashboard often exclude the '+' prefix
      const formattedPhone = phone.startsWith("+") ? phone.replace("+", "") : `91${phone.replace(/\D/g, "")}`;
      
      console.log("DEBUG: Attempting login...");
      console.log("DEBUG: Formatted Phone:", formattedPhone);
      console.log("DEBUG: Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error("DEBUG: Supabase Error:", error);
        throw error;
      }

      router.push(`/verify?phone=${encodeURIComponent(formattedPhone)}`);
    } catch (err: any) {
      console.error("DEBUG: Catch Block Error:", err);
      setError(err.message || "Kuch galat ho gaya. Phir se try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      {/* DEBUG INFO - REMOVE AFTER FIX */}
      <div className="mb-4 p-2 bg-black text-white text-[10px] rounded font-mono">
        Config URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING"}
      </div>
      
      <Card className="w-full max-w-md p-10 space-y-10 border-navy-100 shadow-float">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-orange/20">
            <span className="text-2xl font-black text-brand-orange">A</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight leading-none">AngreziBolo</h1>
          <p className="text-muted font-medium text-sm">Sign in to continue learning</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-left">
            <label htmlFor="phone" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="phone"
                type="tel"
                placeholder="+91 00000 00000"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium placeholder:text-gray-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium hindi text-center">{error}</p>
          )}

          <Button type="submit" className="w-full h-14 text-base shadow-sm" isLoading={loading}>
            Get Started
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
        
        <p className="text-[10px] text-center text-muted font-medium px-4 leading-relaxed">
          By signing up, you agree to our <span className="underline decoration-gray-300">Terms of Service</span> and <span className="underline decoration-gray-300">Privacy Policy</span>.
        </p>
      </Card>
    </div>
  );
}
