"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./companyRegistration.module.scss";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaUserGraduate,
  FaShieldAlt,
} from "react-icons/fa";
import { registerCompany } from "../../../actions/auth-actions.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import OTPVerification from "../../../components/OTPVerification";

const CompanyRegistration = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
    role: "",
    website: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // States for verification
  const [currentStage, setCurrentStage] = useState("form"); // form, email-verification, mobile-verification, success
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Mobile validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number (10 digits required)";
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    // Website validation (optional)
    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      newErrors.website = "Invalid website URL";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle initial form submission
  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setFormError("");

    // Simulate API call delay
    setTimeout(() => {
      // Proceed to email verification
      setCurrentStage("email-verification");
      setIsLoading(false);
    }, 1000);
  };

  // Handle email OTP verification
  const handleVerifyEmailOTP = async (otp) => {
    // For simulation, any 6-digit OTP works
    setEmailVerified(true);

    // Wait a moment to show the verified UI before moving to mobile verification
    setTimeout(() => {
      // Now move to mobile verification
      setCurrentStage("mobile-verification");
    }, 2000);
  };

  // Handle mobile OTP verification
  const handleVerifyMobileOTP = async (otp) => {
    // For simulation, any 6-digit OTP works
    setMobileVerified(true);

    // Wait a moment to show the verified UI before moving to summary
    setTimeout(() => {
      setCurrentStage("verification-summary");
    }, 2000);
  };

  // Handle resend OTP
  const handleResendOTP = async (type) => {
    // Just a simulation - in a real app, this would trigger an actual resend
    console.log(
      `Simulating resending OTP to ${type}: ${
        type === "email" ? formData.email : formData.mobile
      }`
    );
    return Promise.resolve();
  };

  // Complete registration after both verifications
  const completeRegistration = async () => {
    setIsLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      // Create FormData object for the server action
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      // Add verification status
      formDataObj.append("emailVerified", "true");
      formDataObj.append("mobileVerified", "true");

      const result = await registerCompany(formDataObj);

      if (result?.error) {
        setFormError(result.error);
        // Go back to form if there's an error
        setCurrentStage("verification-summary");
      } else if (result?.success) {
        setFormSuccess(result.success);
        setCurrentStage("success");

        // Reset form after successful registration
        setFormData({
          name: "",
          email: "",
          mobile: "",
          companyName: "",
          role: "",
          website: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      setFormError("An error occurred during registration. Please try again.");
      console.error("Registration error:", error);
      // Go back to summary if there's an error
      setCurrentStage("verification-summary");
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStage === "email-verification") {
      setCurrentStage("form");
    } else if (currentStage === "mobile-verification") {
      setCurrentStage("email-verification");
      setEmailVerified(false);
    } else if (currentStage === "verification-summary") {
      setCurrentStage("mobile-verification");
      setMobileVerified(false);
    }
  };

  // Animation variants for the floating elements
  const floatingIconVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={styles.container}>
      {/* Decorative floating elements */}
      <motion.div
        className={`${styles.floatingIcon} ${styles.icon1}`}
        variants={floatingIconVariants}
        animate="animate"
      >
        <FaChartLine />
      </motion.div>

      <motion.div
        className={`${styles.floatingIcon} ${styles.icon2}`}
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        <FaUsers />
      </motion.div>

      <motion.div
        className={`${styles.floatingIcon} ${styles.icon3}`}
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <FaUserGraduate />
      </motion.div>

      <motion.div
        className={`${styles.floatingIcon} ${styles.icon4}`}
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 1.5 }}
      >
        <FaShieldAlt />
      </motion.div>

      <div className={styles.glassBg}></div>

      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.formTitle}>
          {currentStage === "form" && "Sign up"}
          {currentStage === "email-verification" && "Email Verification"}
          {currentStage === "mobile-verification" && "Mobile Verification"}
          {currentStage === "verification-summary" && "Verification Complete"}
          {currentStage === "success" && "Sign up Successful"}
        </h1>

        {formError && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {formError}
          </motion.div>
        )}

        {formSuccess && (
          <motion.div
            className={styles.success}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {formSuccess}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {currentStage === "form" && (
            <motion.form
              key="registration-form"
              className={styles.formBody}
              onSubmit={handleInitialSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className={styles.signupMessage}>
                Join Taltracker today and start managing your company&apos;s
                talent more effectively.
              </p>

              <div className={styles.inputGroup}>
                <FaUser className={styles.icon} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaEnvelope className={styles.icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaPhone className={styles.icon} />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                {errors.mobile && (
                  <span className={styles.error}>{errors.mobile}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaBuilding className={styles.icon} />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                {errors.companyName && (
                  <span className={styles.error}>{errors.companyName}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaUser className={styles.icon} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="hiring_manager">Hiring Manager</option>
                  <option value="ld_professional">L&D Professional</option>
                  <option value="hr_professional">HR Professional</option>
                </select>
                {errors.role && (
                  <span className={styles.error}>{errors.role}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaGlobe className={styles.icon} />
                <input
                  type="url"
                  name="website"
                  placeholder="Company Website (Optional)"
                  value={formData.website}
                  onChange={handleChange}
                />
                {errors.website && (
                  <span className={styles.error}>{errors.website}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaLock className={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <span className={styles.error}>{errors.password}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <FaLock className={styles.icon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && (
                  <span className={styles.error}>{errors.confirmPassword}</span>
                )}
              </div>

              <motion.button
                type="submit"
                className={styles.registerButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Sign up"}
              </motion.button>

              <div className={styles.loginLink}>
                Already have an account? <Link href="/login">Login</Link>
              </div>
            </motion.form>
          )}

          {currentStage === "email-verification" && (
            <motion.div
              key="email-verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button className={styles.backButton} onClick={handleBack}>
                <FaArrowLeft /> Back
              </button>

              <OTPVerification
                type="email"
                contact={formData.email}
                onVerify={handleVerifyEmailOTP}
                onResend={() => handleResendOTP("email")}
              />
            </motion.div>
          )}

          {currentStage === "mobile-verification" && (
            <motion.div
              key="mobile-verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button className={styles.backButton} onClick={handleBack}>
                <FaArrowLeft /> Back
              </button>

              <OTPVerification
                type="mobile"
                contact={formData.mobile}
                onVerify={handleVerifyMobileOTP}
                onResend={() => handleResendOTP("mobile")}
              />
            </motion.div>
          )}

          {currentStage === "verification-summary" && (
            <motion.div
              key="verification-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.verificationSummary}
            >
              <div className={styles.verificationList}>
                <div className={styles.verificationItem}>
                  <div className={styles.verificationIcon}>
                    <FaCheckCircle />
                  </div>
                  <div className={styles.verificationDetails}>
                    <h3>Email Verified</h3>
                    <p>{formData.email}</p>
                  </div>
                </div>

                <div className={styles.verificationItem}>
                  <div className={styles.verificationIcon}>
                    <FaCheckCircle />
                  </div>
                  <div className={styles.verificationDetails}>
                    <h3>Mobile Verified</h3>
                    <p>{formData.mobile}</p>
                  </div>
                </div>
              </div>

              <p className={styles.summaryMessage}>
                Both your email and mobile have been verified successfully.
                Click below to complete sign up.
              </p>

              <motion.button
                className={styles.registerButton}
                onClick={completeRegistration}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Complete Sign up"}
              </motion.button>

              <button
                className={styles.backButton}
                onClick={handleBack}
                style={{ marginTop: "20px" }}
              >
                <FaArrowLeft /> Go Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CompanyRegistration;
