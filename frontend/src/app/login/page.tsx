"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  ShieldCheck,
  FileSearch,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Stethoscope,
  User,
  CheckCircle2,
  Sparkles,
  FileText,
  Calendar,
  Pill,
} from "lucide-react";

type RoleType = "DOCTOR" | "PATIENT";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Role selection state: null = ask user first, "DOCTOR" or "PATIENT" = show form
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize role from URL query param if available (?role=doctor or ?role=patient)
  useEffect(() => {
    const roleParam = searchParams.get("role")?.toUpperCase();
    if (roleParam === "DOCTOR" || roleParam === "PATIENT") {
      setSelectedRole(roleParam as RoleType);
    }
  }, [searchParams]);

  // If already authenticated, redirect to appropriate workspace
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          if (res.data.role === "DOCTOR") {
            router.replace("/doctor");
          } else {
            router.replace("/dashboard");
          }
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("role");
        });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      const me = await api.get("/auth/me");
      localStorage.setItem("role", me.data.role);
      localStorage.setItem("user_name", me.data.full_name || "");

      // Route user to their corresponding portal
      if (me.data.role === "DOCTOR") {
        router.push("/doctor");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50/50 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* LEFT PANEL - Branding & Medical Visual (Hidden on mobile) */}
      <div className="hidden lg:flex w-[42%] xl:w-[45%] bg-slate-900 flex-col relative overflow-hidden text-white p-12 justify-between isolate shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 -z-10"></div>
        <div
          className="absolute inset-0 opacity-[0.03] -z-10"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-white block">
              VitaScan AI
            </span>
            <span className="text-[11px] text-cyan-300 font-medium tracking-wide block uppercase">
              Intelligent Clinical Diagnostic Platform
            </span>
          </div>
        </Link>

        {/* Left Side Highlight Card */}
        <div className="my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-300 text-xs font-semibold mb-6">
            <Sparkles size={14} className="animate-pulse" />
            <span>Multi-Disease AI Diagnostic Engine</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5">
            Precision Healthcare.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              Doctors & Patients,
            </span>
            <br />
            Unified.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed max-w-md mb-8">
            Empowering medical professionals with AI-validated scans and giving patients
            instant access to diagnostic reports and clinical appointments.
          </p>

          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Doctor Portal</p>
                <p className="text-xs text-slate-400">
                  Review scans, write clinical notes & issue prescriptions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Patient Portal</p>
                <p className="text-xs text-slate-400">
                  Screen MRI, CT & Ultrasound images with instant AI analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>© {new Date().getFullYear()} VitaScan AI. All rights reserved.</span>
          <span className="text-cyan-400 font-medium">HIPAA Compliant AI System</span>
        </div>
      </div>

      {/* RIGHT PANEL - Role Selection OR Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Mobile Top Brand (Hidden on desktop) */}
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                VitaScan AI
              </span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase">
                Clinical Diagnostics
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SCREEN 1: ASK USER FIRST - DOCTOR OR PATIENT SELECTION     */}
          {/* ══════════════════════════════════════════════════════════ */}
          {selectedRole === null ? (
            <div className="animate-in fade-in duration-200">
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
                  Select Your Portal
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Welcome to VitaScan AI
                </h2>
                <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
                  Please choose whether you are logging in as a medical doctor or as a patient.
                </p>
              </div>

              {/* 2 Big Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {/* Doctor Selection Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("DOCTOR")}
                  className="group relative flex flex-col text-left p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm mb-4">
                    <Stethoscope size={28} strokeWidth={2} />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Doctor
                    </h3>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Physician
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    For licensed doctors, radiologists, and healthcare providers.
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                      <span>Review AI scan predictions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                      <span>Approve & sign off reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                      <span>Clinical notes & prescriptions</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 text-blue-600 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
                    <span>Continue as Doctor</span>
                    <ArrowRight size={16} />
                  </div>
                </button>

                {/* Patient Selection Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("PATIENT")}
                  className="group relative flex flex-col text-left p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-cyan-600 hover:shadow-xl hover:shadow-cyan-600/10 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm mb-4">
                    <User size={28} strokeWidth={2} />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      Patient
                    </h3>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                      Personal
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    For individuals seeking AI diagnostic screenings and personal health records.
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-cyan-600 shrink-0" />
                      <span>Upload MRI, CT, & scan images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-cyan-600 shrink-0" />
                      <span>Instant AI disease screening</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-cyan-600 shrink-0" />
                      <span>Download medical reports</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 text-cyan-600 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
                    <span>Continue as Patient</span>
                    <ArrowRight size={16} />
                  </div>
                </button>
              </div>

              {/* Registration links */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                <p className="text-xs text-slate-500 mb-2">New to VitaScan AI? Create an account:</p>
                <div className="flex items-center justify-center gap-4 text-sm font-semibold">
                  <Link
                    href="/register/doctor"
                    className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <Stethoscope size={14} /> Register as Doctor
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link
                    href="/register"
                    className="text-cyan-600 hover:text-cyan-700 hover:underline flex items-center gap-1"
                  >
                    <User size={14} /> Register as Patient
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════ */
            /* SCREEN 2: ROLE-SPECIFIC LOGIN FORM                         */
            /* ══════════════════════════════════════════════════════════ */
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Back to Role Selection Button + Role Switcher */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Change Portal</span>
                </button>

                {/* Segmented Pill Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("DOCTOR")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                      selectedRole === "DOCTOR"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Stethoscope size={12} />
                    <span>Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("PATIENT")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                      selectedRole === "PATIENT"
                        ? "bg-white text-cyan-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <User size={12} />
                    <span>Patient</span>
                  </button>
                </div>
              </div>

              {/* Form Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
                      selectedRole === "DOCTOR"
                        ? "bg-blue-600 shadow-blue-500/30"
                        : "bg-cyan-600 shadow-cyan-500/30"
                    }`}
                  >
                    {selectedRole === "DOCTOR" ? (
                      <Stethoscope size={20} strokeWidth={2.5} />
                    ) : (
                      <User size={20} strokeWidth={2.5} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedRole === "DOCTOR" ? "Doctor Sign In" : "Patient Sign In"}
                    </h2>
                    <span
                      className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        selectedRole === "DOCTOR"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-cyan-50 text-cyan-700 border-cyan-200"
                      }`}
                    >
                      {selectedRole === "DOCTOR"
                        ? "Clinical Staff Workspace"
                        : "Personal Health Portal"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {selectedRole === "DOCTOR"
                    ? "Enter your licensed medical credentials to access patient reports & notes."
                    : "Enter your patient account credentials to view scans and book appointments."}
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-start gap-2.5 text-xs font-medium animate-in fade-in">
                  <ShieldCheck size={16} className="text-rose-500 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder={
                        selectedRole === "DOCTOR"
                          ? "ramesh123@gmail.com"
                          : "rajathbg123@gmail.com"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full relative flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-xl shadow-lg focus:ring-4 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 mt-2 ${
                    selectedRole === "DOCTOR"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30 hover:shadow-blue-500/40 focus:ring-blue-500/20"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/30 hover:shadow-cyan-500/40 focus:ring-cyan-500/20"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {selectedRole === "DOCTOR" ? "Doctor" : "Patient"}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Registration footer link */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  {selectedRole === "DOCTOR" ? (
                    <>
                      Don&apos;t have a verified doctor account?{" "}
                      <Link
                        href="/register/doctor"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Register as Doctor
                      </Link>
                    </>
                  ) : (
                    <>
                      Don&apos;t have a patient account?{" "}
                      <Link
                        href="/register"
                        className="text-cyan-600 font-semibold hover:underline"
                      >
                        Register as Patient
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}