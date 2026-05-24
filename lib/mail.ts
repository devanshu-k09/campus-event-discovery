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
 * Indigo-themed Ticket Template
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
    return `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">🎟️ Ticket Confirmed</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #1f2937;">Hi <b>${data.userName}</b>,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">Your spot for <b>${data.eventName}</b> is secured. We've attached your digital ticket to this email.</p>
            
            <div style="margin: 30px 0; padding: 25px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #4f46e5;">Event Summary</h2>
                <p style="margin: 5px 0; color: #1f2937;"><b>Event:</b> ${data.eventName}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Type:</b> ${data.eventType || 'PHYSICAL'}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Date:</b> ${data.date}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Time:</b> ${data.time}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Location:</b> ${isOnline ? 'Virtual / Online' : data.location}</p>
            </div>

            ${(isOnline || isHybrid) && data.meetingLink ? `
            <div style="margin: 30px 0; text-align: center;">
                <p style="font-size: 14px; color: #4b5563; margin-bottom: 15px;">This event has an online component. Click below to join:</p>
                <a href="${data.meetingLink}" style="display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                    💻 Join Online Event
                </a>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">Meeting Link: ${data.meetingLink}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 12px 24px; background-color: #f3f4f6; border-radius: 6px; font-family: monospace; font-size: 18px; font-weight: bold; color: #1f2937; letter-spacing: 2px; border: 1px dashed #d1d5db;">
                    ${data.ticketId.toUpperCase()}
                </div>
            </div>

            <p style="font-size: 14px; color: #9ca3af; text-align: center;">Please keep this ticket safe. See you at the event!</p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Powered by Campus Event Platform</p>
        </div>
    </div>
    `;
}

/**
 * Green-themed Publication Template
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
    return `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">🚀 Event Published Successfully</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #1f2937;">Hi <b>${data.userName}</b>,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">Congratulations! Your event is now live. Students can now discover and register for your event.</p>
            
            <div style="margin: 30px 0; padding: 25px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669;">Event Details</h2>
                <p style="margin: 5px 0; color: #1f2937;"><b>Event:</b> ${data.eventName}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Type:</b> ${data.eventType || 'PHYSICAL'}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Date:</b> ${data.date}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Time:</b> ${data.time}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Location:</b> ${data.eventType === 'ONLINE' ? 'Virtual / Online' : data.location}</p>
                ${data.meetingLink ? `<p style="margin: 5px 0; color: #1f2937;"><b>Meeting Link:</b> ${data.meetingLink}</p>` : ''}
            </div>

            <p style="font-size: 16px; color: #4b5563;">Your event is now live — start sharing the link to boost registrations!</p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Powered by Campus Event Platform</p>
        </div>
    </div>
    `;
}
/**
 * Red-themed Cancellation Template
 */
export function getCancellationEmailTemplate(data: {
    userName: string;
    eventName: string;
    date: string;
    location: string;
    eventType?: string;
}) {
    return `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">🚫 Registration Cancelled</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #1f2937;">Hi <b>${data.userName}</b>,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">This is to confirm that your registration for <b>${data.eventName}</b> has been successfully cancelled.</p>
            
            <div style="margin: 30px 0; padding: 25px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #ef4444;">Cancelled Event Details</h2>
                <p style="margin: 5px 0; color: #1f2937;"><b>Event:</b> ${data.eventName}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Type:</b> ${data.eventType || 'PHYSICAL'}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Date:</b> ${data.date}</p>
                <p style="margin: 5px 0; color: #1f2937;"><b>Location:</b> ${data.eventType === 'ONLINE' ? 'Virtual / Online' : data.location}</p>
            </div>

            <p style="font-size: 14px; color: #4b5563;">We're sorry you can't make it! If this was a mistake, you can always head back to the platform and register again if spots are still available.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Powered by Campus Event Platform</p>
        </div>
    </div>
    `;
}

/**
 * Account Deletion Template
 */
export function getAccountDeletionEmailTemplate(data: { userName: string }) {
    return `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Account Successfully Deleted</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #1f2937;">Hello <b>${data.userName}</b>,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">Your account has been permanently removed from Campus Event Discovery Platform.</p>
            
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">If this was not you, please contact support immediately.</p>
            
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5; margin-top: 30px;">Thank you for using our platform. We're sorry to see you go.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Powered by Campus Event Platform</p>
        </div>
    </div>
    `;
}
