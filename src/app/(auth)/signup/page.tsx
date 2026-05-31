"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
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
    
    if (!passwordValidations.length || !passwordValidations.number) {
      toast.error("Please follow password requirements (min 8 characters with a number)");
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
        if (method === "email" && !data.session) {
          toast.success("Verification link sent! Please check your email.", { duration: 6000 });
          router.push("/login");
        } else {
          toast.success("Account created successfully!");
          router.push("/onboarding/goal");
        }
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (method === "email" ? email.includes("@") : phone.length === 10) &&
    passwordValidations.length && 
    passwordValidations.number;

  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 border-none shadow-float overflow-hidden">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight leading-none">Create Account</h1>
          <p className="text-muted font-medium text-[13px]">Join AngreziBolo to start learning</p>
        </div>

        {/* Toggle Method */}
        <div className="flex p-0.5 bg-gray-50 rounded-lg">
          <button
            onClick={() => setSignupMethod("email")}
            className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
              method === "email" ? "bg-white text-brand-dark shadow-sm" : "text-muted hover:text-brand-dark/70"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setSignupMethod("phone")}
            className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
              method === "phone" ? "bg-white text-brand-dark shadow-sm" : "text-muted hover:text-brand-dark/70"
            }`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">Full Name (Optional)</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                id="name"
                type="text"
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-semibold text-sm placeholder:text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email/Phone Field */}
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">
              {method === "email" ? "Email Address" : "Phone Number"}
            </label>
            <div className="relative">
              {method === "email" ? (
                <>
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    id="identifier"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-semibold text-sm placeholder:text-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </>
              ) : (
                <>
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <div className="absolute left-[2.5rem] top-1/2 -translate-y-1/2 font-bold text-brand-dark text-sm">+91</div>
                  <input
                    id="identifier"
                    type="tel"
                    placeholder="00000 00000"
                    maxLength={10}
                    className="w-full pl-[4.5rem] pr-4 py-2.5 rounded-lg bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-semibold text-sm tracking-wider placeholder:text-gray-300 placeholder:tracking-normal"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border border-gray-100 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-brand-dark font-semibold text-sm"
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

          <Button 
            type="submit" 
            className="w-full h-11 text-sm shadow-sm font-bold mt-2 rounded-lg" 
            isLoading={loading}
            disabled={!isFormValid || loading}
          >
            Create Account
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-orange font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </Card>
      
      <p className="mt-6 text-[9px] text-center text-muted font-bold uppercase tracking-tight px-4 leading-relaxed max-w-xs">
        By creating an account, you agree to our <br/>
        <span className="underline cursor-pointer hover:text-brand-dark">Terms of Service</span> and <span className="underline cursor-pointer hover:text-brand-dark">Privacy Policy</span>.
      </p>
    </PageTransition>
  );
}
