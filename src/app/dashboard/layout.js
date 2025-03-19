"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./dashboard.module.scss";
import { FaHome, FaUserTie, FaUsers, FaBrain, FaBars } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: FaHome, label: "Home", path: "/dashboard" },
    { icon: FaBrain, label: "Competency", path: "/dashboard/competency" },
    { icon: FaUserTie, label: "Add Roles", path: "/dashboard/roles" },
    { icon: FaUsers, label: "Add Employees", path: "/dashboard/employees" },
    {
      icon: FaBrain,
      label: "Generate Competency",
      path: "/dashboard/generate",
    },
  ];

  const sidebarVariants = {
    expanded: {
      width: "250px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      width: "70px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const menuItemVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className={styles.dashboardContainer}>
      <motion.div
        className={styles.sidebar}
        variants={sidebarVariants}
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
      >
        <div className={styles.sidebarHeader}>
          <motion.button
            className={styles.toggleButton}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaBars />
          </motion.button>
          {!isSidebarCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              TalTracker
            </motion.h1>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index}>
              <motion.div
                className={`${styles.menuItem} ${
                  pathname === item.path ? styles.active : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={styles.icon} />
                <motion.span
                  variants={menuItemVariants}
                  animate={isSidebarCollapsed ? "collapsed" : "expanded"}
                  className={styles.label}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          ))}
        </nav>
      </motion.div>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
