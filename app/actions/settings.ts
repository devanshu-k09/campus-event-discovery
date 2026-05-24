'use server';

import fs from 'fs';
import path from 'path';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const settingsDir = path.join(process.cwd(), 'data');
const settingsFilePath = path.join(settingsDir, 'settings.json');

export async function getSystemSettings() {
    try {
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }
        if (!fs.existsSync(settingsFilePath)) {
            fs.writeFileSync(
                settingsFilePath, 
                JSON.stringify({ 
                    maintenanceMode: false, 
                    message: "We are currently undergoing scheduled maintenance. Please check back in a few minutes." 
                }, null, 2)
            );
        }
        const data = fs.readFileSync(settingsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to read settings", e);
        return { 
            maintenanceMode: false, 
            message: "We are currently undergoing scheduled maintenance. Please check back in a few minutes." 
        };
    }
}

export async function updateSystemSettings(settings: { maintenanceMode: boolean; message: string }) {
    try {
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }
        fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

        // Update the maintenance_mode cookie in sync
        const cookieStore = await cookies();
        cookieStore.set("maintenance_mode", settings.maintenanceMode ? "true" : "false", { path: "/" });

        revalidatePath('/admin/settings');
        revalidatePath('/api/settings/maintenance');
        revalidatePath('/');
        revalidatePath('/maintenance');
        return { success: true };
    } catch (e) {
        console.error("Failed to write settings", e);
        return { success: false, error: String(e) };
    }
}
