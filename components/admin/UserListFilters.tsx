"use client";

import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UserListFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const currentUserType = searchParams.get("userType") || "";
  const currentCity = searchParams.get("city") || "";
  const currentCategory = searchParams.get("category") || "";

  // Add User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Update local query state when URL changes (e.g. back button, clear filters)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Only trigger if query is different from initialQuery to avoid loops
    if (query === initialQuery) return;

    const delayDebounceFn = setTimeout(() => {
      router.push(pathname + "?" + createQueryString("q", query));
    }, 400); // Slightly longer debounce for smoother experience

    return () => clearTimeout(delayDebounceFn);
  }, [query, pathname, router, createQueryString, initialQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      router.push(pathname + "?" + createQueryString("q", query));
    }
  };

  const toggleRoleFilter = () => {
    const currentRole = searchParams.get("role") || "";
    let nextRole = "";
    if (currentRole === "") nextRole = "admin";
    else if (currentRole === "admin") nextRole = "organizer";
    else if (currentRole === "organizer") nextRole = "student";
    else nextRole = ""; // Reset
    
    router.push(pathname + "?" + createQueryString("role", nextRole));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create user');
      }

      setIsAddUserOpen(false);
      setFormData({ name: "", email: "", password: "", role: "student" });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = searchParams.get("role") || "";

  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
      <div className="relative group min-w-[200px] md:w-80">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or email..."
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all w-full shadow-sm"
        />
      </div>

      {/* User Type Filter */}
      <select
        value={currentUserType}
        onChange={(e) => router.push(pathname + "?" + createQueryString("userType", e.target.value))}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-sm appearance-none relative"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25em 1.25em',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <option value="" className="dark:bg-slate-950 text-slate-900 dark:text-white">All Types</option>
        <option value="Student" className="dark:bg-slate-950 text-slate-900 dark:text-white">Student</option>
        <option value="Faculty / Staff" className="dark:bg-slate-950 text-slate-900 dark:text-white">Faculty / Staff</option>
        <option value="Alumni" className="dark:bg-slate-950 text-slate-900 dark:text-white">Alumni</option>
        <option value="Event Organizer" className="dark:bg-slate-950 text-slate-900 dark:text-white">Organizer</option>
        <option value="Guest / Visitor" className="dark:bg-slate-950 text-slate-900 dark:text-white">Guest</option>
        <option value="Working Professional" className="dark:bg-slate-950 text-slate-900 dark:text-white">Professional</option>
      </select>

      {/* City Filter */}
      <select
        value={currentCity}
        onChange={(e) => router.push(pathname + "?" + createQueryString("city", e.target.value))}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-sm appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25em 1.25em',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <option value="" className="dark:bg-slate-950 text-slate-900 dark:text-white">All Cities</option>
        <option value="Amravati" className="dark:bg-slate-950 text-slate-900 dark:text-white">Amravati</option>
        <option value="Nagpur" className="dark:bg-slate-950 text-slate-900 dark:text-white">Nagpur</option>
        <option value="Pune" className="dark:bg-slate-950 text-slate-900 dark:text-white">Pune</option>
        <option value="Mumbai" className="dark:bg-slate-950 text-slate-900 dark:text-white">Mumbai</option>
        <option value="Online" className="dark:bg-slate-950 text-slate-900 dark:text-white">Online</option>
        <option value="Other" className="dark:bg-slate-950 text-slate-900 dark:text-white">Other</option>
      </select>

      {/* Interested Category Filter */}
      <select
        value={currentCategory}
        onChange={(e) => router.push(pathname + "?" + createQueryString("category", e.target.value))}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-sm appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25em 1.25em',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <option value="" className="dark:bg-slate-950 text-slate-900 dark:text-white">All Categories</option>
        <option value="Music" className="dark:bg-slate-950 text-slate-900 dark:text-white">Music</option>
        <option value="Workshops" className="dark:bg-slate-950 text-slate-900 dark:text-white">Workshops</option>
        <option value="Sports" className="dark:bg-slate-950 text-slate-900 dark:text-white">Sports</option>
        <option value="Tech" className="dark:bg-slate-950 text-slate-900 dark:text-white">Tech</option>
        <option value="Art & Design" className="dark:bg-slate-950 text-slate-900 dark:text-white">Art & Design</option>
        <option value="Food" className="dark:bg-slate-950 text-slate-900 dark:text-white">Food</option>
        <option value="Networking" className="dark:bg-slate-950 text-slate-900 dark:text-white">Networking</option>
        <option value="Cultural" className="dark:bg-slate-950 text-slate-900 dark:text-white">Cultural</option>
        <option value="Gaming" className="dark:bg-slate-950 text-slate-900 dark:text-white">Gaming</option>
        <option value="Career" className="dark:bg-slate-950 text-slate-900 dark:text-white">Career</option>
        <option value="Hackathons" className="dark:bg-slate-950 text-slate-900 dark:text-white">Hackathons</option>
        <option value="Competitions" className="dark:bg-slate-950 text-slate-900 dark:text-white">Competitions</option>
      </select>

      <button 
        onClick={toggleRoleFilter}
        className={`p-3 border rounded-2xl transition-all shadow-sm flex items-center justify-center relative ${
          currentRole 
            ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400" 
            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
        title="Filter by Role"
      >
        <Filter size={20} />
        {currentRole && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        )}
      </button>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap">
            <Plus size={18} />
            Add User
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Add New User</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
              Create a new user account with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Access Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsAddUserOpen(false)}
                className="px-5 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create User
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
