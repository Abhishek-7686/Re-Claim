// This file sends the OTP email for "Forgot Password".
//
// If you've filled in the SMTP_* variables in your .env file, it sends
// a real email using nodemailer. If you HAVEN'T set those up (which is
// totally fine for testing/development), it just prints the OTP to the
// server's terminal instead, so you can still complete the flow.

const nodemailer = require("nodemailer");

let transporter = null;

// Only create a real email transporter if SMTP settings are actually provided
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for others
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

async function sendOtpEmail(toEmail, otp) {
    if (!transporter) {
        // No email service configured - just log it so development/testing still works
        console.log(`\n[DEV MODE] No SMTP configured. OTP for ${toEmail} is: ${otp}\n`);
        return;
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject: "ReClaim - Your Password Reset OTP",
        text: `Your OTP to reset your ReClaim password is: ${otp}\n\nThis code expires in 10 minutes. If you didn't request this, you can ignore this email.`,
        html: `<p>Your OTP to reset your ReClaim password is:</p>
               <h2 style="letter-spacing:4px;">${otp}</h2>
               <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
    });
}

module.exports = { sendOtpEmail };
