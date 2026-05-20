"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { useAppToast } from "@/components/ui/AppToast";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const { addToast } = useAppToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Simulate API call — replace with real auth endpoint
      await new Promise((res) => setTimeout(res, 1200));

      // Demo credentials check
      if (email === "admin@bawadittamal.com" && password === "admin123") {
        sessionStorage.setItem(
          "bdm_admin",
          JSON.stringify({ email, role: "admin", name: "Bawa Ditta Mal" })
        );
        addToast({ title: "Welcome Back!", message: "Login successful.", variant: "success" });
        router.push("/admin");
      } else {
        addToast({ title: "Access Denied", message: "Invalid email or password.", variant: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#ed1c27]/10 blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-[#ed1c27]/5 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-white/3 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-14 xl:p-20">
        {/* Diagonal red accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ed1c27]/8 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ed1c27]/40 to-transparent" />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png"
            alt="Bawa Ditta Mal Galleria"
            width={200}
            height={70}
            className="h-12 w-auto brightness-0 invert"
            priority
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ed1c27]/30 bg-[#ed1c27]/5 mb-8">
            <Shield size={12} className="text-[#ed1c27]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ed1c27]">
              Admin Access Portal
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Manage Your{" "}
            <span className="text-[#ed1c27]">Store</span>{" "}
            with Confidence
          </h1>
          <p className="text-white/40 text-sm leading-relaxed font-medium">
            Secure access to the Bawa Ditta Mal Galleria administration panel.
            Control products, brands, gallery, and inquiries from one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {["Product Management", "Brand Control", "Gallery Editor", "Inquiry Center"].map(
              (f) => (
                <span
                  key={f}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/10 rounded-full"
                >
                  {f}
                </span>
              )
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            © {new Date().getFullYear()} Bawa Ditta Mal Galleria · All rights reserved
          </p>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Image
              src="https://bawadittamal.com/wp-content/uploads/2019/07/bdm-website-logo-Copy.png"
              alt="Bawa Ditta Mal Galleria"
              width={160}
              height={56}
              className="h-10 w-auto brightness-0 invert"
              priority
            />
          </div>

          {/* Form card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 sm:p-10 backdrop-blur-sm">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#ed1c27] flex items-center justify-center">
                  <Lock size={14} className="text-white" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#ed1c27]/40 to-transparent" />
              </div>
              <h2 className="text-2xl font-bold text-white">Sign in to Admin</h2>
              <p className="text-white/40 text-xs font-medium mt-1.5 uppercase tracking-widest">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="admin-email"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <Mail size={16} />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="admin@bawadittamal.com"
                    className={cn(
                      "w-full bg-white/[0.05] border rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none transition-all duration-300",
                      errors.email
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-[#ed1c27]/60 focus:bg-white/[0.07]"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-bold uppercase tracking-tight text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="admin-password"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <Lock size={16} />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="••••••••"
                    className={cn(
                      "w-full bg-white/[0.05] border rounded-xl pl-11 pr-12 py-3.5 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none transition-all duration-300",
                      errors.password
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-[#ed1c27]/60 focus:bg-white/[0.07]"
                    )}
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold uppercase tracking-tight text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  id="forgot-password-btn"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#ed1c27]/70 hover:text-[#ed1c27] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                id="admin-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.15em] text-[11px] rounded-xl py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#ed1c27]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none cursor-pointer group mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                Demo Credentials
              </p>
              <p className="text-[11px] font-medium text-white/40">
                Email: <span className="text-white/60 font-bold">admin@bawadittamal.com</span>
              </p>
              <p className="text-[11px] font-medium text-white/40">
                Password: <span className="text-white/60 font-bold">admin123</span>
              </p>
            </div>
          </div>

          <p className="text-center mt-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
            Protected Area · Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
}
