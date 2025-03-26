"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./login.module.scss";
import {
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { loginCompany } from "../../../actions/auth-actions";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const Login = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check if user is already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setFormError("");
    setFormSuccess("");

    if (activeTab === "company") {
      try {
        const result = await signIn("company-login", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setFormError(result.error || "Invalid email or password");
        } else {
          setFormSuccess("Login successful");

          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      } catch (error) {
        console.error("Login error:", error);
        setFormError(`An error occurred during login: ${error.message}`);
      }
    } else {
      // Employee login is not implemented yet
      setFormError("Employee login is not available yet.");
    }

    setIsLoading(false);
  };

  // If checking authentication status
  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const tabVariants = {
    active: {
      backgroundColor: "#6B73FF",
      color: "white",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    inactive: {
      backgroundColor: "#f0f0f0",
      color: "#666",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.loginContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.tabs}>
          <motion.button
            variants={tabVariants}
            animate={activeTab === "employee" ? "active" : "inactive"}
            onClick={() => setActiveTab("employee")}
            className={styles.tab}
          >
            <FaUser className={styles.tabIcon} />
            Employee Login
          </motion.button>
          <motion.button
            variants={tabVariants}
            animate={activeTab === "company" ? "active" : "inactive"}
            onClick={() => setActiveTab("company")}
            className={styles.tab}
          >
            <FaBuilding className={styles.tabIcon} />
            Company Login
          </motion.button>
        </div>

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
          <motion.form
            key={activeTab}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit}
          >
            <h2 className={styles.heading}>
              {activeTab === "employee" ? "Employee Login" : "Company Login"}
            </h2>

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

            <motion.button
              type="submit"
              className={styles.submitButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>

            <div className={styles.forgotPassword}>
              <a href="#">Forgot Password?</a>
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
