"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      });

      if (result?.error) {
        toast.error("❌ Invalid Admin Credentials");
      } else {
        toast.success("✅ Welcome Admin");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("❌ An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-indigo-600 rounded-[1.25rem] mb-6 shadow-xl shadow-indigo-600/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Access</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-bold uppercase tracking-widest text-[10px]">CampusPulse Management Suite</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campuspulse.com"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-700'}`}>
                    {rememberMe && <ShieldCheck className="w-full h-full text-white p-0.5" />}
                  </div>
                </div>
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">Remember Session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Access Admin Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
              Authorized Infrastructure Access
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">
          Forgot credentials? Contact <span className="text-indigo-500 cursor-pointer hover:underline">Platform Security</span>
        </p>
      </div>
    </div>
  );
}
