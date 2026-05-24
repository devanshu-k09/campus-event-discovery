import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const newsletterFilePath = path.join(dataDir, "newsletter_subscribers.json");

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON payload in request body" },
        { status: 400 }
      );
    }

    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing subscribers or init
    let subscribers = [];
    if (fs.existsSync(newsletterFilePath)) {
      try {
        const fileContent = fs.readFileSync(newsletterFilePath, "utf8");
        if (fileContent && fileContent.trim()) {
          subscribers = JSON.parse(fileContent);
        }
        if (!Array.isArray(subscribers)) {
          subscribers = [];
        }
      } catch (err) {
        console.error("Failed to parse newsletter_subscribers.json:", err);
        subscribers = []; // fallback to empty array if JSON is corrupt
      }
    }

    // Check if email already exists
    const emailLower = email.toLowerCase().trim();
    const alreadySubscribed = subscribers.some(
      (sub: any) => sub && typeof sub === 'object' && typeof sub.email === 'string' && sub.email.toLowerCase().trim() === emailLower
    );

    if (alreadySubscribed) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to CampusPulse updates.",
      });
    }

    // Add new subscriber
    const newSubscriber = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: emailLower,
      subscribedAt: new Date().toISOString(),
    };

    subscribers.push(newSubscriber);

    // Save back to file
    fs.writeFileSync(newsletterFilePath, JSON.stringify(subscribers, null, 2), "utf8");

    console.log(`[Newsletter API] New subscriber added: ${emailLower}`);

    return NextResponse.json({
      success: true,
      message: "You have successfully subscribed to CampusPulse updates.",
    });
  } catch (error) {
    console.error("Error handling newsletter subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
