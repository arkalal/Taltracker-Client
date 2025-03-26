"use server";

import mongoose from "mongoose";

// This check prevents errors during client-side rendering
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Don't include by default in queries
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    unique: true,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["hiring_manager", "ld_professional", "hr_professional"],
  },
  website: {
    type: String,
    match: [/^https?:\/\/.*/, "Please enter a valid URL"],
  },
  isCompanyAccount: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Fix for client-side rendering issues using optional chaining
// This pattern is recommended for models in NextJS with Mongoose when used with NextAuth v5 beta
const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
