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
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch (dirErr) {}

    const tmpContactFilePath = path.join("/tmp", "contact_messages.json");
    function getContactFilePath() {
      if (fs.existsSync(tmpContactFilePath)) {
        return tmpContactFilePath;
      }
      return contactFilePath;
    }

    const activeContactFilePath = getContactFilePath();

    // Load existing messages or init
    let messages = [];
    if (fs.existsSync(activeContactFilePath)) {
      try {
        const fileContent = fs.readFileSync(activeContactFilePath, "utf8");
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
    try {
      fs.writeFileSync(contactFilePath, JSON.stringify(messages, null, 2), "utf8");
    } catch (writeError: any) {
      if (writeError.code === 'EROFS') {
        console.warn("Read-only filesystem detected, writing contact message to /tmp");
        try {
          fs.writeFileSync(tmpContactFilePath, JSON.stringify(messages, null, 2), "utf8");
        } catch (tmpErr) {
          console.error("Failed to write contact message to /tmp", tmpErr);
        }
      } else {
        throw writeError;
      }
    }

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
