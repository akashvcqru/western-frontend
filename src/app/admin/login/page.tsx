"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useAppToast } from "@/components/ui/AppToast";
import Input from "@/components/ui/inputs/Input";
import Card from "@/components/ui/Card";

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
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? `http://${window.location.hostname}:5073` : "http://localhost:5073");
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store JWT token for API calls
        localStorage.setItem("auth_token", data.token);
        // Store session info for layout/guards
        sessionStorage.setItem(
          "bdm_admin",
          JSON.stringify({ email: data.email, role: "admin", name: "Western Office Solutions" })
        );
        addToast({ title: "Welcome Back!", message: "Login successful.", variant: "success" });
        router.push("/admin");
      } else {
        const errData = await res.json().catch(() => null);
        addToast({
          title: "Access Denied",
          message: errData?.message || "Invalid email or password.",
          variant: "error",
        });
      }
    } catch {
      addToast({ title: "Connection Error", message: "Could not reach the server. Please try again.", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium glowing background effect optimized for Light Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Sleek Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Login Container */}
      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center">
            <Image
              src="/logo-western.png"
              alt="Western Interio AI Logo"
              width={240}
              height={68}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Premium Light-Mode Card using custom Card component with no custom classes */}
        <Card>
          <Card.Body>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">Sign In</h2>
              <p className="text-zinc-500 text-xs mt-1.5">
                Enter your administration credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form" noValidate>
              {/* Email Field - Custom UI Input with light-mode parameters */}
              <Input
                id="admin-email"
                name="admin-email"
                type="email"
                autoComplete="email"
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="admin@westernofficesolutions.com"
                icon={<Mail size={16} className="text-zinc-400" />}
                error={errors.email}
                className="bg-zinc-50/50 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all duration-300 rounded-xl"
              />

              {/* Password Field - Custom UI Input with light-mode parameters and action toggle */}
              <Input
                id="admin-password"
                name="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                label="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                placeholder="••••••••"
                icon={<Lock size={16} className="text-zinc-400" />}
                error={errors.password}
                className="bg-zinc-50/50 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                rightElement={
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />


              {/* Submit Button */}
              <button
                id="admin-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-500 text-white font-bold uppercase tracking-[0.15em] text-[11px] rounded-xl py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none cursor-pointer group mt-2"
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

          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
