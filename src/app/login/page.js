"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./login.module.scss";
import { FaEnvelope, FaLock, FaBuilding, FaUser } from "react-icons/fa";

const Login = () => {
  const [activeTab, setActiveTab] = useState("employee");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted:", { type: activeTab, ...formData });
    }
  };

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
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </div>

            <motion.button
              type="submit"
              className={styles.submitButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
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
