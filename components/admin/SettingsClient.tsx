"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Lock, 
  User,
  Save,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";
import { updateSystemSettings } from "@/app/actions/settings";
import { cn } from "@/lib/utils";

interface SettingsClientProps {
  initialSettings: {
    maintenanceMode: boolean;
    message: string;
  };
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Admin Profile");
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenanceMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(initialSettings.message);
  const [isSaving, setIsSaving] = useState(false);

  // Mock states for other settings
  const [profile, setProfile] = useState({ name: "System Administrator", email: "supportplus24x7@gmail.com" });
  const [general, setGeneral] = useState({ platformName: "CampusPulse", supportEmail: "support@campuspulse.com" });
  const [security, setSecurity] = useState({ require2FA: true, sessionTimeout: "120" });
  const [notifications, setNotifications] = useState({ emailAlerts: true, pushAlerts: false });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateSystemSettings({
        maintenanceMode,
        message: maintenanceMessage
      });
      if (res.success) {
        toast.success("System configurations committed successfully", {
          description: "Changes have been applied to the global environment."
        });
        router.refresh();
      } else {
        toast.error("Failed to commit system configurations", {
          description: res.error || "An error occurred."
        });
      }
    } catch (e) {
      toast.error("Failed to commit system configurations");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWipeCache = () => {
    toast.warning("Platform cache wiped", {
      description: "All transient data and session tokens have been cleared."
    });
  };

  const handleRestart = () => {
    toast.error("Global server restart initiated", {
      description: "System will be unavailable for approximately 45 seconds."
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Admin Profile":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">System Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        );
      case "General Settings":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Platform Name</label>
              <input 
                type="text" 
                value={general.platformName}
                onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Contact Email</label>
              <input 
                type="email" 
                value={general.supportEmail}
                onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        );
      case "Security & Auth":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Require Two-Factor Authentication</h4>
                <p className="text-xs font-medium text-slate-500">Force all admins to use 2FA</p>
              </div>
              <div 
                onClick={() => setSecurity({ ...security, require2FA: !security.require2FA })}
                className={cn(
                  "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300",
                  security.require2FA ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  security.require2FA ? "left-7" : "left-1"
                )} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session Timeout (Minutes)</label>
              <select 
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
                <option value="1440">24 Hours</option>
              </select>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Email Alerts</h4>
                <p className="text-xs font-medium text-slate-500">Receive system alerts via email</p>
              </div>
              <div 
                onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                className={cn(
                  "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300",
                  notifications.emailAlerts ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  notifications.emailAlerts ? "left-7" : "left-1"
                )} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Push Notifications</h4>
                <p className="text-xs font-medium text-slate-500">Enable browser push notifications</p>
              </div>
              <div 
                onClick={() => setNotifications({ ...notifications, pushAlerts: !notifications.pushAlerts })}
                className={cn(
                  "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300",
                  notifications.pushAlerts ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  notifications.pushAlerts ? "left-7" : "left-1"
                )} />
              </div>
            </div>
          </div>
        );
      case "System & API":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Global API Key</label>
              <input 
                type="text" 
                readOnly
                value="pk_live_51Mxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm font-mono text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400 pl-1 mt-1">This key grants full access to the API. Keep it secret.</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="text-sm font-black text-blue-800 dark:text-blue-400">Database Connection</h4>
              <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mt-1">Status: Connected to Primary Replica (us-east-1)</p>
            </div>
          </div>
        );
      case "Maintenance Mode":
        return (
          <div className="space-y-6">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">Enable Maintenance Mode</h4>
                <p className="text-xs font-medium text-slate-500 mt-1">Disable platform access for regular users. Only admins will be able to log in.</p>
              </div>
              <div 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={cn(
                  "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 group flex-shrink-0",
                  maintenanceMode ? "bg-amber-500 shadow-lg shadow-amber-500/30" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  maintenanceMode ? "left-7" : "left-1"
                )} />
              </div>
            </div>

            {maintenanceMode && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest ml-1">Public Maintenance Message</label>
                <textarea 
                  rows={4}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="w-full bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl py-3 px-4 text-sm font-medium text-amber-900 dark:text-amber-400 outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Configuration</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage platform parameters, security protocols, and integration keys</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-wait"
          >
            {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? "Saving..." : "Commit Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation / Categories */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { icon: User, label: "Admin Profile" },
            { icon: Globe, label: "General Settings" },
            { icon: Shield, label: "Security & Auth" },
            { icon: Bell, label: "Notifications" },
            { icon: Database, label: "System & API" },
            { icon: Lock, label: "Maintenance Mode" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all",
                activeTab === item.label 
                  ? "bg-white dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-800" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#111827] p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{activeTab}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {activeTab === "Admin Profile" ? "Manage your administrative identity" :
                   activeTab === "General Settings" ? "Configure platform-wide defaults and settings" :
                   activeTab === "Security & Auth" ? "Monitor access protocols and encryption keys" :
                   activeTab === "Notifications" ? "Setup webhook and email communication channels" :
                   activeTab === "System & API" ? "Integration parameters and external service keys" :
                   "Toggle emergency platform availability"}
                </p>
              </div>

              <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderTabContent()}
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-900/10 p-10 rounded-[3rem] border border-rose-100 dark:border-rose-900/20">
            <h3 className="text-lg font-black text-rose-600 tracking-tight">Danger Zone</h3>
            <p className="text-sm font-medium text-rose-500/80 mt-1">Irreversible administrative actions</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button 
                onClick={handleWipeCache}
                className="px-6 py-3 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/30 text-rose-600 rounded-2xl text-xs font-black hover:bg-rose-50 transition-all"
              >
                Wipe Platform Cache
              </button>
              <button 
                onClick={handleRestart}
                className="px-6 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
              >
                Restart Global Server
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
