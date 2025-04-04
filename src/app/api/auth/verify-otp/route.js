import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { verifyOTP } from "../../../../../lib/otp-utils";

export async function POST(request) {
  try {
    const { email, mobile, otp, type } = await request.json();

    if ((!email && !mobile) || !otp || !type) {
      return NextResponse.json(
        { error: "Email/mobile, OTP, and type are required" },
        { status: 400 }
      );
    }

    await connectDB();

    let user;
    let storedOTP;

    if (type === "email" && email) {
      user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      storedOTP = user.emailOTP;
    } else if (type === "mobile" && mobile) {
      user = await User.findOne({ mobile });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      storedOTP = user.mobileOTP;
    } else {
      return NextResponse.json(
        { error: "Invalid verification type" },
        { status: 400 }
      );
    }

    // Verify the OTP
    const verification = verifyOTP(storedOTP, otp, user.otpExpiry);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message },
        { status: 400 }
      );
    }

    // Update verification status
    if (type === "email") {
      await User.findByIdAndUpdate(user._id, { emailVerified: true });
    } else if (type === "mobile") {
      await User.findByIdAndUpdate(user._id, { mobileVerified: true });
    }

    return NextResponse.json({
      success: true,
      message: `${type === "email" ? "Email" : "Mobile"} verified successfully`,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
