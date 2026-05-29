"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { handleAuthError } from "@/lib/error-handler";
import PageTransition from "@/components/ui/PageTransition";

type SignupMethod = "email" | "phone";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [method, setSignupMethod] = useState<SignupMethod>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setPasswordValidations({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (!passwordValidations.length || !passwordValidations.number) {
      toast.error("Please follow password requirements");
      return;
    }

    setLoading(true);
    
    try {
      const signupData: any = {
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      };

      if (method === "email") {
        signupData.email = email;
      } else {
        signupData.phone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
      }

      const { data, error } = await supabase.auth.signUp(signupData);

      if (error) throw error;

      if (data.user) {
        toast.success("Account created successfully!");
        // If email confirmation is enabled, they might need to check email.
        // For now, redirect to onboarding.
        router.push("/onboarding/goal");
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.length > 0 && 
    (method === "email" ? email.includes("@") : phone.length === 10) &&
    passwordValidations.length && 
    passwordValidations.number &&
    password === confirmPassword;

  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-8 border-none shadow-float overflow-hidden">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-[900] text-brand-dark tracking-tighter leading-none">Create Account</h1>
          <p className="text-muted font-medium text-sm">Join AngreziBolo to start learning</p>
        </div>

        {/* Toggle Method */}
        <div className="flex p-1 bg-gray-50 rounded-xl">
          <button
            onClick={() => setSignupMethod("email")}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              method === "email" ? "bg-white text-brand-dark shadow-sm" : "text-muted"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setSignupMethod("phone")}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              method === "phone" ? "bg-white text-brand-dark shadow-sm" : "text-muted"
            }`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in duration-300">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Full Name (Optional)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="name"
                type="text"
                placeholder="Rahul Sharma"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium placeholder:text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium placeholder:text-gray-300"
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
                    className="w-full pl-20 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium tracking-wider placeholder:text-gray-300 placeholder:tracking-normal"
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
            <label htmlFor="password" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Create Password</label>
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

          {/* Password Strength Indicators */}
          <div className="flex gap-2 px-1">
            {[
              { key: 'length', label: '8+ chars' },
              { key: 'number', label: 'Number' },
              { key: 'special', label: 'Symbol' }
            ].map((rule) => (
              <div 
                key={rule.key}
                className={`flex items-center gap-1 text-[9px] font-bold uppercase transition-colors ${
                  passwordValidations[rule.key as keyof typeof passwordValidations] ? "text-green-500" : "text-gray-300"
                }`}
              >
                {passwordValidations[rule.key as keyof typeof passwordValidations] ? <Check size={10} strokeWidth={3} /> : <div className="w-2.5 h-2.5" />}
                {rule.label}
              </div>
            ))}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 pt-1">
            <label htmlFor="confirmPassword" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border ${
                  confirmPassword && password !== confirmPassword ? 'border-red-200' : 'border-gray-100'
                } focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-medium`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-base shadow-sm font-bold mt-4" 
            isLoading={loading}
            disabled={!isFormValid || loading}
          >
            Create Account
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-orange font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
      
      <p className="mt-8 text-[10px] text-center text-muted font-medium px-4 leading-relaxed max-w-xs">
        By creating an account, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </PageTransition>
  );
}
