import nodemailer from 'nodemailer';

/**
 * PRODUCTION-READY SMTP CONFIGURATION
 * Fixes common ETIMEDOUT and EAUTH issues.
 */
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,          // STARTTLS (Port 587 requires secure: false)
    requireTLS: true,       // Force TLS upgrade
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be a 16-char Gmail App Password
    },
    tls: {
        // Handles self-signed cert edge cases common in some hosting environments
        rejectUnauthorized: false,
    },
    connectionTimeout: 10000,   // Fail fast (10s) instead of hanging
    greetingTimeout: 5000,
});

/**
 * Call this to verify SMTP connection.
 * Recommended to call during server startup or first request.
 */
export async function verifyTransporter() {
    try {
        await transporter.verify();
        console.log('✅ Gmail SMTP connection verified and ready');
    } catch (err: any) {
        console.error('❌ Gmail SMTP verification failed:', err.message);
        console.error('DEBUG CHECKLIST:');
        console.error('1. Is EMAIL_USER set correctly?');
        console.error('2. Is EMAIL_PASS a 16-char App Password (NOT normal password)?');
        console.error('3. Is 2-Step Verification enabled on the Google account?');
    }
}

// Auto-verify in development/startup if configured
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    verifyTransporter();
}

/**
 * Reusable async sendEmail utility.
 * Fire-and-forget safe (errors logged but won't crash main flow).
 */
export async function sendEmail({ to, subject, html, attachments }: {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
}) {
    // Defensive: never send if config or required fields are missing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email skipped: SMTP credentials missing in .env');
        return;
    }
    if (!to || !subject || !html) {
        console.warn('⚠️ Email skipped: Missing required fields (to/subject/html)');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"CampusPulse" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
        console.log(`📧 Email sent to ${to} — MessageId: ${info.messageId}`);
        return info;
    } catch (err: any) {
        // Log full error for debugging — NEVER rethrow
        console.error('❌ Email send failed:', err.message);
        // Detailed logging for connection/auth issues
        if (err.code === 'EAUTH') {
            console.error('AUTH FAILURE: Check if App Password is still valid.');
        }
    }
}

/**
 * Base Layout Wrapper for modern dark-themed emails
 */
function getBaseEmailLayout(content: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CampusPulse Email</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body, html {
                margin: 0;
                padding: 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #0f172a;
                color: #e2e8f0;
            }
            .email-wrapper {
                width: 100%;
                background-color: #0f172a;
                padding: 40px 20px;
                box-sizing: border-box;
            }
            .email-content {
                max-width: 600px;
                margin: 0 auto;
                background-color: #1e293b;
                border: 1px solid #334155;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            }
            .header {
                background-color: #1e293b;
                padding: 30px;
                text-align: center;
                border-bottom: 1px solid #334155;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 800;
                background: linear-gradient(to right, #8b5cf6, #ec4899);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -0.5px;
            }
            .body-content {
                padding: 40px 30px;
                color: #cbd5e1;
                line-height: 1.6;
                font-size: 16px;
            }
            .body-content h2 {
                color: #f8fafc;
                margin-top: 0;
                font-size: 20px;
                margin-bottom: 24px;
            }
            .card {
                background-color: #0f172a;
                border: 1px solid #334155;
                border-radius: 8px;
                padding: 24px;
                margin: 30px 0;
            }
            .card p {
                margin: 10px 0;
                display: flex;
            }
            .card strong {
                color: #f8fafc;
                min-width: 100px;
                display: inline-block;
            }
            .button {
                display: inline-block;
                padding: 14px 28px;
                background: linear-gradient(to right, #6366f1, #8b5cf6);
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
                transition: transform 0.2s;
            }
            .button-red {
                background: linear-gradient(to right, #ef4444, #f43f5e);
            }
            .button-green {
                background: linear-gradient(to right, #10b981, #34d399);
            }
            .footer {
                background-color: #0f172a;
                padding: 24px;
                text-align: center;
                border-top: 1px solid #334155;
                font-size: 13px;
                color: #64748b;
            }
            .text-center { text-align: center; }
            .mt-6 { margin-top: 24px; }
            .mb-6 { margin-bottom: 24px; }
            .ticket-badge {
                display: inline-block;
                padding: 12px 24px;
                background-color: #0f172a;
                border-radius: 6px;
                font-family: monospace;
                font-size: 18px;
                font-weight: bold;
                color: #f8fafc;
                letter-spacing: 2px;
                border: 1px dashed #475569;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-content">
                <div class="header">
                    <h1>CampusPulse</h1>
                </div>
                <div class="body-content">
                    ${content}
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} CampusPulse. All rights reserved.</p>
                    <p>Discover, host, and experience events seamlessly.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Welcome Email Template (New User Signup)
 */
export function getWelcomeEmailTemplate(data: { userName: string }) {
    const content = `
        <h2>Welcome to CampusPulse! 🎉</h2>
        <p>Hi <b>${data.userName}</b>,</p>
        <p>We're thrilled to have you join our community. CampusPulse is your go-to platform for discovering amazing events, workshops, and gatherings happening around your campus.</p>
        
        <div class="card">
            <h3 style="margin-top: 0; color: #f8fafc;">What's next?</h3>
            <ul style="padding-left: 20px; margin-bottom: 0;">
                <li style="margin-bottom: 10px;"><b>Discover:</b> Find events that match your interests.</li>
                <li style="margin-bottom: 10px;"><b>Connect:</b> Meet like-minded students and professionals.</li>
                <li><b>Host:</b> Organize your own events and reach a wider audience.</li>
            </ul>
        </div>

        <div class="text-center mt-6">
            <a href="${process.env.BASE_URL || 'https://campuspulse.com'}/events" class="button">Explore Events</a>
        </div>
    `;
    return getBaseEmailLayout(content);
}

/**
 * Ticket/Registration Confirmed Template
 */
export function getBookingEmailTemplate(data: {
    userName: string;
    eventName: string;
    date: string;
    time: string;
    location: string;
    ticketId: string;
    eventType?: string;
    meetingLink?: string | null;
}) {
    const isOnline = data.eventType === 'ONLINE';
    const isHybrid = data.eventType === 'HYBRID';
    
    const content = `
        <h2 style="color: #818cf8;">🎟️ Ticket Confirmed</h2>
        <p>Hi <b>${data.userName}</b>,</p>
        <p>Your spot for <b>${data.eventName}</b> is successfully secured. We've attached your digital ticket as a PDF to this email.</p>
        
        <div class="card">
            <strong style="display: block; margin-bottom: 16px; color: #818cf8; font-size: 18px;">Event Summary</strong>
            <p><strong>Event:</strong> <span>${data.eventName}</span></p>
            <p><strong>Type:</strong> <span>${data.eventType || 'PHYSICAL'}</span></p>
            <p><strong>Date:</strong> <span>${data.date}</span></p>
            <p><strong>Time:</strong> <span>${data.time}</span></p>
            <p><strong>Location:</strong> <span>${isOnline ? 'Virtual / Online' : data.location}</span></p>
        </div>

        ${(isOnline || isHybrid) && data.meetingLink ? `
        <div class="text-center mt-6 mb-6">
            <p style="margin-bottom: 16px;">This event has an online component. Click below to join when it's time:</p>
            <a href="${data.meetingLink}" class="button">💻 Join Online Event</a>
            <p style="font-size: 12px; color: #64748b; margin-top: 12px;">Link: ${data.meetingLink}</p>
        </div>
        ` : ''}

        <div class="text-center mt-6">
            <p style="margin-bottom: 12px; font-size: 14px;">Your Registration ID</p>
            <div class="ticket-badge">
                ${data.ticketId.toUpperCase()}
            </div>
        </div>
        <p class="text-center mt-6" style="font-size: 14px;">Please keep this ticket safe. See you at the event!</p>
    `;
    return getBaseEmailLayout(content);
}

/**
 * Event Published/Created Template
 */
export function getEventPublishedEmailTemplate(data: {
    userName: string;
    eventName: string;
    date: string;
    time: string;
    location: string;
    eventType?: string;
    meetingLink?: string | null;
}) {
    const content = `
        <h2 style="color: #34d399;">🚀 Event Published Successfully</h2>
        <p>Hi <b>${data.userName}</b>,</p>
        <p>Congratulations! Your event is now live. Students and users across the platform can now discover and register for your event.</p>
        
        <div class="card" style="border-left: 4px solid #34d399;">
            <strong style="display: block; margin-bottom: 16px; color: #34d399; font-size: 18px;">Event Details</strong>
            <p><strong>Event:</strong> <span>${data.eventName}</span></p>
            <p><strong>Type:</strong> <span>${data.eventType || 'PHYSICAL'}</span></p>
            <p><strong>Date:</strong> <span>${data.date}</span></p>
            <p><strong>Time:</strong> <span>${data.time}</span></p>
            <p><strong>Location:</strong> <span>${data.eventType === 'ONLINE' ? 'Virtual / Online' : data.location}</span></p>
            ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <span>${data.meetingLink}</span></p>` : ''}
        </div>

        <div class="text-center mt-6">
            <p style="margin-bottom: 16px;">Start sharing your event link to boost registrations!</p>
            <a href="${process.env.BASE_URL || 'https://campuspulse.com'}/events" class="button button-green">View Event on Platform</a>
        </div>
    `;
    return getBaseEmailLayout(content);
}

/**
 * Registration Cancellation Template
 */
export function getCancellationEmailTemplate(data: {
    userName: string;
    eventName: string;
    date: string;
    location: string;
    eventType?: string;
}) {
    const content = `
        <h2 style="color: #f87171;">🚫 Registration Cancelled</h2>
        <p>Hi <b>${data.userName}</b>,</p>
        <p>This email is to confirm that your registration for <b>${data.eventName}</b> has been successfully cancelled.</p>
        
        <div class="card" style="border-left: 4px solid #f87171;">
            <strong style="display: block; margin-bottom: 16px; color: #f87171; font-size: 18px;">Cancelled Event Details</strong>
            <p><strong>Event:</strong> <span>${data.eventName}</span></p>
            <p><strong>Date:</strong> <span>${data.date}</span></p>
            <p><strong>Location:</strong> <span>${data.eventType === 'ONLINE' ? 'Virtual / Online' : data.location}</span></p>
        </div>

        <p>We're sorry you can't make it! If this was a mistake, you can always head back to the platform and register again if spots are still available.</p>
        
        <div class="text-center mt-6">
            <a href="${process.env.BASE_URL || 'https://campuspulse.com'}/events" class="button button-red">Find Other Events</a>
        </div>
    `;
    return getBaseEmailLayout(content);
}

/**
 * Hosted Event Deletion Template
 */
export function getEventDeletionEmailTemplate(data: {
    userName: string;
    eventName: string;
}) {
    const content = `
        <h2 style="color: #f87171;">🗑️ Event Deleted</h2>
        <p>Hi <b>${data.userName}</b>,</p>
        <p>Your hosted event <b>${data.eventName}</b> has been successfully deleted from the platform.</p>
        <p>All associated registrations have been removed, and the event is no longer visible to users.</p>
        <p>If you're ready to host another event, you can always create a new one from your dashboard.</p>
        <div class="text-center mt-6">
            <a href="${process.env.BASE_URL || 'https://campuspulse.com'}/create-event" class="button">Create New Event</a>
        </div>
    `;
    return getBaseEmailLayout(content);
}

/**
 * Account Deletion Template
 */
export function getAccountDeletionEmailTemplate(data: { userName: string }) {
    const content = `
        <h2 style="color: #f87171;">Account Deleted</h2>
        <p>Hello <b>${data.userName}</b>,</p>
        <p>Your account has been permanently removed from CampusPulse.</p>
        <p>If this was not you, please contact support immediately.</p>
        <p style="margin-top: 30px;">Thank you for using our platform. We're sorry to see you go.</p>
    `;
    return getBaseEmailLayout(content);
}
