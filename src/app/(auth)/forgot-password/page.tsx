"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, Send } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import PageTransition from "@/components/ui/PageTransition";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      });

      if (error) throw error;

      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-8 border-none shadow-float overflow-hidden relative">
        <Link 
          href="/login"
          className="absolute top-6 left-6 text-muted hover:text-brand-dark transition-colors"
          aria-label="Back to login"
        >
          <ArrowLeft size={20} />
        </Link>

        {!submitted ? (
          <>
            <div className="text-center space-y-2 pt-4">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Send size={28} className="text-brand-orange" />
              </div>
              <h1 className="text-3xl font-[900] text-brand-dark tracking-tighter leading-none">Reset Password</h1>
              <p className="text-muted font-medium text-sm">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-base shadow-sm font-bold" 
                isLoading={loading}
                disabled={loading || !email.includes("@")}
              >
                Send Reset Link
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail size={32} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-brand-dark">Check your inbox</h2>
              <p className="text-muted text-sm px-4">
                We've sent a password reset link to <br/>
                <span className="font-bold text-brand-dark">{email}</span>
              </p>
            </div>
            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full h-12 border-none text-brand-orange font-bold">
                Back to Sign In
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </PageTransition>
  );
}
