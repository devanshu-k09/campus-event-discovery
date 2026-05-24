import { getSystemSettings } from "@/app/actions/settings";
import { SettingsClient } from "@/components/admin/SettingsClient";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();
  
  return <SettingsClient initialSettings={settings} />;
}
