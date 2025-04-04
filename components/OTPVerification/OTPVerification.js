"use client";

import { useState } from "react";
import styles from "./OTPVerification.module.scss";
import { FaEnvelope, FaMobile, FaCheck, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const OTPVerification = ({ type, contact, onVerify, onResend }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // Handle input change for OTP digits
  const handleOTPChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const fullOTP = otp.join("");

    if (fullOTP.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate verification delay
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
      // Call the parent component's verification handler
      onVerify(fullOTP);
    }, 1500);
  };

  // Handle resend OTP
  const handleResend = async () => {
    setLoading(true);
    setError("");

    // Simulate resend delay
    setTimeout(() => {
      setLoading(false);
      // Just for simulation - in a real app, this would trigger an actual resend
      onResend();
    }, 1000);
  };

  if (verified) {
    return (
      <motion.div
        className={styles.verifiedContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.verifiedCheck}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaCheckCircle />
        </motion.div>
        <h3>{type === "email" ? "Email" : "Mobile"} Verified!</h3>
        <p>Your {type} has been successfully verified.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.otpContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.otpHeader}>
        {type === "email" ? (
          <FaEnvelope className={styles.otpIcon} />
        ) : (
          <FaMobile className={styles.otpIcon} />
        )}
        <h3>Verify Your {type === "email" ? "Email" : "Mobile"}</h3>
      </div>

      <p className={styles.otpMessage}>
        We&apos;ve sent a verification code to {contact}. Please enter the code
        below.
      </p>

      <div className={styles.otpInputGroup}>
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            className={styles.otpInput}
            value={digit}
            onChange={(e) => handleOTPChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.otpActions}>
        <motion.button
          className={styles.verifyButton}
          onClick={handleVerify}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Verifying..." : "Verify"}
          {!loading && <FaCheck className={styles.buttonIcon} />}
        </motion.button>

        <button
          className={styles.resendButton}
          onClick={handleResend}
          disabled={loading}
        >
          Resend OTP
        </button>
      </div>

      <div className={styles.simulationNote}>
        <p>For simulation purposes, any 6-digit code will work.</p>
      </div>
    </motion.div>
  );
};

export default OTPVerification;
