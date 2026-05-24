'use server';

import fs from 'fs';
import path from 'path';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const settingsDir = path.join(process.cwd(), 'data');
const settingsFilePath = path.join(settingsDir, 'settings.json');
const tmpSettingsDir = '/tmp';
const tmpSettingsFilePath = path.join(tmpSettingsDir, 'settings.json');

function getFilePath() {
    if (fs.existsSync(tmpSettingsFilePath)) {
        return tmpSettingsFilePath;
    }
    return settingsFilePath;
}

export async function getSystemSettings() {
    try {
        const filePath = getFilePath();
        if (!fs.existsSync(filePath)) {
            // If data dir doesn't exist, we try to create it, but ignore failure on EROFS
            try {
                if (!fs.existsSync(settingsDir)) {
                    fs.mkdirSync(settingsDir, { recursive: true });
                }
            } catch (dirErr) {}
            return { 
                maintenanceMode: false, 
                message: "We are currently undergoing scheduled maintenance. Please check back in a few minutes." 
            };
        }
        const data = fs.readFileSync(filePath, 'utf-8');
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
        try {
            if (!fs.existsSync(settingsDir)) {
                fs.mkdirSync(settingsDir, { recursive: true });
            }
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
        } catch (writeError: any) {
            if (writeError.code === 'EROFS') {
                console.warn("Read-only filesystem detected, writing settings to /tmp/settings.json");
                try {
                    if (!fs.existsSync(tmpSettingsDir)) {
                        fs.mkdirSync(tmpSettingsDir, { recursive: true });
                    }
                } catch (dirErr) {}
                fs.writeFileSync(tmpSettingsFilePath, JSON.stringify(settings, null, 2));
            } else {
                throw writeError;
            }
        }

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
