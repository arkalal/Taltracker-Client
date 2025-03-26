"use server";

import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";

export async function authorizeUser(credentials) {
  console.log("Authorize function called");

  if (!credentials?.email || !credentials?.password) {
    console.log("Missing credentials");
    return null;
  }

  try {
    // Connect to the database
    await connectDB();

    // Find company user by email and include password in the query result
    const user = await User.findOne({
      email: credentials.email,
      isCompanyAccount: true,
    }).select("+password");

    if (!user) {
      console.log("User not found");
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      console.log("Invalid password");
      return null;
    }

    console.log("Authentication successful");

    // Return user object without password
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
      isCompanyAccount: user.isCompanyAccount,
    };
  } catch (error) {
    console.error("Authorization error:", error);
    return null;
  }
}
