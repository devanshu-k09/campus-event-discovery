const nodemailer = require('nodemailer');
require('dotenv').config();

const testSMTP = async () => {
    console.log('--- SMTP TEST ---');
    console.log('User:', process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SUCCESS: Connection verified!');
    } catch (err) {
        console.error('❌ FAILED:', err.message);
        if (err.message.includes('Invalid login')) {
            console.log('\n💡 HINT: Gmail rejected the password. You MUST use an "App Password" (16-char code) instead of your regular Gmail password.');
        }
    }
};

testSMTP();
