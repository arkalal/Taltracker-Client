"use server";

import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { signIn } from "../auth";
import { redirect } from "next/navigation";

// Register a new company user
export async function registerCompany(formData) {
  console.log("Register company action started");
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const mobile = formData.get("mobile");
    const companyName = formData.get("companyName");
    const role = formData.get("role");
    const website = formData.get("website") || "";
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    console.log("Form data processed:", { email, companyName, role });

    // Basic validation
    if (!name || !email || !mobile || !companyName || !role || !password) {
      return { error: "All required fields must be filled" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Invalid email address" };
    }

    // Mobile validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobile)) {
      return { error: "Invalid mobile number (10 digits required)" };
    }

    // Website validation (if provided)
    if (website && !/^https?:\/\/.*/.test(website)) {
      return { error: "Invalid website URL" };
    }

    console.log("Validation passed, connecting to database");
    await connectDB();
    console.log("Connected to database");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already exists:", email);
      return { error: "Email already registered" };
    }

    // Check if company already exists
    const existingCompany = await User.findOne({ companyName });
    if (existingCompany) {
      console.log("Company already exists:", companyName);
      return { error: "Company already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // Create new user
    const newUser = await User.create({
      name,
      email,
      mobile,
      companyName,
      role,
      website,
      password: hashedPassword,
      isCompanyAccount: true,
    });
    console.log("User created successfully:", newUser._id.toString());

    return { success: "Registration successful. Please log in." };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration: " + error.message };
  }
}

// Login company user
export async function loginCompany(formData) {
  console.log("Login company action started");
  const email = formData.get("email");
  const password = formData.get("password");

  // Basic validation
  if (!email || !password) {
    return { error: "All fields are required" };
  }

  try {
    console.log("Attempting to sign in:", email);
    const result = await signIn("company-login", {
      email,
      password,
      redirect: false,
    });

    console.log("Sign in result:", result ? "received" : "null");

    if (result?.error) {
      console.log("Sign in error:", result.error);
      return { error: "Invalid email or password" };
    }

    // Return success but let the client redirect
    return { success: "Login successful", redirectTo: "/dashboard" };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login: " + error.message };
  }
}
