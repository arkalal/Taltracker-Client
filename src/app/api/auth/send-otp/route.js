import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import {
  generateOTP,
  sendEmailOTP,
  sendSMSOTP,
} from "../../../../../lib/otp-utils";

export async function POST(request) {
  try {
    const { email, mobile, type } = await request.json();

    if (!email && !mobile) {
      return NextResponse.json(
        { error: "Email or mobile number is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // For sending OTP during registration or verification
    const otp = generateOTP();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); // OTP valid for 10 minutes

    let result;
    let updateData = { otpExpiry: expiryTime };

    // Send OTP based on type (email or mobile)
    if (type === "email" && email) {
      updateData.emailOTP = otp;
      const user = await User.findOne({ email });

      if (user) {
        // Update existing user with new OTP
        await User.findOneAndUpdate({ email }, updateData);
      } else {
        // Create temporary user entry to store OTP
        await User.create({
          email,
          emailOTP: otp,
          otpExpiry: expiryTime,
          name: "Temporary", // These fields will be updated during actual registration
          password: "temporary",
          mobile: "temporary",
          companyName: "temporary",
          role: "temporary",
        });
      }

      result = await sendEmailOTP(email, otp);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "OTP sent to email successfully",
      });
    } else if (type === "mobile" && mobile) {
      updateData.mobileOTP = otp;
      const user = await User.findOne({ mobile });

      if (user) {
        await User.findOneAndUpdate({ mobile }, updateData);
      } else {
        // Create temporary user entry or update existing one by email
        const tempUser = await User.findOne({ mobile: "temporary" });
        if (tempUser) {
          await User.findByIdAndUpdate(tempUser._id, {
            mobile,
            mobileOTP: otp,
            otpExpiry: expiryTime,
          });
        } else {
          await User.create({
            mobile,
            mobileOTP: otp,
            otpExpiry: expiryTime,
            name: "Temporary",
            password: "temporary",
            email: "temporary@example.com",
            companyName: "temporary",
            role: "temporary",
          });
        }
      }

      result = await sendSMSOTP(mobile, otp);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "OTP sent to mobile successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid verification type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
