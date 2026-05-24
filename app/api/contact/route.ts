import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const contactFilePath = path.join(dataDir, "contact_messages.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Load existing messages or init
    let messages = [];
    if (fs.existsSync(contactFilePath)) {
      try {
        const fileContent = fs.readFileSync(contactFilePath, "utf8");
        messages = JSON.parse(fileContent);
        if (!Array.isArray(messages)) {
          messages = [];
        }
      } catch (err) {
        console.error("Failed to parse contact_messages.json:", err);
      }
    }

    // Add new message
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);

    // Save back to file
    fs.writeFileSync(contactFilePath, JSON.stringify(messages, null, 2), "utf8");

    console.log(`[Contact API] Message from ${name} (${email}) saved.`);

    return NextResponse.json({
      success: true,
      message: "Thanks for contacting CampusPulse. Our support team will get back to you soon.",
    });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
