import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

export async function GET() {
    const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');
    try {
        if (fs.existsSync(settingsFilePath)) {
            const data = fs.readFileSync(settingsFilePath, 'utf-8');
            return NextResponse.json(JSON.parse(data));
        }
    } catch (e) {
        console.error("Failed to read settings in API route", e);
    }
    return NextResponse.json({ 
        maintenanceMode: false, 
        message: "We are currently undergoing scheduled maintenance. Please check back in a few minutes." 
    });
}
