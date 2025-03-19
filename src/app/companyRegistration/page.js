"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./companyRegistration.module.scss";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaLock,
} from "react-icons/fa";

const CompanyRegistration = () => {
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
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted:", formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.formTitle}>Company Registration</h1>
        <form className={styles.formBody} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
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
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="hiring_manager">Hiring Manager</option>
              <option value="ld_professional">L&D Professional</option>
              <option value="hr_professional">HR Professional</option>
            </select>
            {errors.role && <span className={styles.error}>{errors.role}</span>}
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

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className={styles.error}>{errors.confirmPassword}</span>
            )}
          </div>

          <motion.button
            type="submit"
            className={styles.registerButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompanyRegistration;
