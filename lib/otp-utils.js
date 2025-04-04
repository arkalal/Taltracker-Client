"use server";

import nodemailer from "nodemailer";

// Function to generate a random OTP
export const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send OTP via email
export const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Taltracker - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6B73FF; text-align: center;">Taltracker Email Verification</h2>
          <p style="font-size: 16px; line-height: 1.5;">Thank you for registering with Taltracker. To complete your registration, please use the following OTP to verify your email address:</p>
          <div style="background-color: #f7f7f7; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">This OTP is valid for 10 minutes. If you didn't request this verification, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 14px; color: #888; text-align: center;">© ${new Date().getFullYear()} Taltracker. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, message: "OTP sent to email successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email OTP" };
  }
};

// Function to send OTP via SMS
export const sendSMSOTP = async (phone, otp) => {
  try {
    // This is a placeholder for actual SMS sending implementation
    // In production, you would integrate with an SMS service provider like Twilio, MessageBird, etc.
    console.log(`SMS OTP ${otp} would be sent to ${phone}`);

    // For demo purposes, we'll pretend this was successful
    return { success: true, message: "OTP sent to phone successfully" };

    // Example integration with an SMS API might look like this:
    /*
    const response = await fetch('https://sms-api-provider.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMS_API_KEY}`
      },
      body: JSON.stringify({
        to: phone,
        message: `Your Taltracker verification code is: ${otp}`,
      })
    });
    
    const data = await response.json();
    if (data.success) {
      return { success: true, message: 'OTP sent to phone successfully' };
    } else {
      throw new Error(data.message || 'Failed to send SMS');
    }
    */
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: "Failed to send SMS OTP" };
  }
};

// Verify OTP
export const verifyOTP = (storedOTP, providedOTP, expiryTime) => {
  if (!storedOTP || !providedOTP) {
    return { valid: false, message: "OTP is required" };
  }

  if (storedOTP !== providedOTP) {
    return { valid: false, message: "Invalid OTP" };
  }

  if (expiryTime && new Date() > new Date(expiryTime)) {
    return { valid: false, message: "OTP has expired" };
  }

  return { valid: true, message: "OTP verified successfully" };
};
