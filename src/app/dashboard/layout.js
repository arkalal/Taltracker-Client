"use client";

import Link from "next/link";
import styles from "./dashboard.module.scss";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const DashboardLayout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Get user info from session or localStorage as backup
    if (session?.user) {
      setUserName(session.user.name || "User");
      setCompanyName(session.user.companyName || "Company");
    } else {
      // Fallback to localStorage if session isn't available yet
      const userInfo = localStorage.getItem("userSession");
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setUserName(user.name || "User");
          setCompanyName(user.companyName || "Company");
        } catch (error) {
          console.error("Error parsing user info:", error);
        }
      }
    }

    // Set active menu based on current path
    if (pathname === "/dashboard") {
      setActiveMenu("Home");
    } else if (pathname.includes("/employees")) {
      setActiveMenu("Employees");
    } else if (pathname.includes("/roles")) {
      setActiveMenu("Roles");
    } else if (pathname.includes("/competencies")) {
      setActiveMenu("Competencies");
    }
  }, [pathname, session, status, router]);

  const handleLogout = async () => {
    // Clear local storage
    localStorage.removeItem("userSession");

    // Sign out using NextAuth
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/dashboard" },
    { name: "Employees", icon: <FaUsers />, path: "/dashboard/employees" },
    { name: "Roles", icon: <FaUserTie />, path: "/dashboard/roles" },
    {
      name: "Competencies",
      icon: <FaListAlt />,
      path: "/dashboard/competencies",
    },
  ];

  // Show loading if session is loading
  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar} style={{ width: "250px" }}>
        <div className={styles.sidebarHeader}>
          <h1>TalTracker</h1>
        </div>

        <div className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link
              href={item.path}
              key={item.name}
              className={`${styles.menuItem} ${
                activeMenu === item.name ? styles.active : ""
              }`}
              onClick={() => setActiveMenu(item.name)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.name}</span>
            </Link>
          ))}
          <div
            className={styles.menuItem}
            onClick={handleLogout}
            style={{ marginTop: "auto" }}
          >
            <span className={styles.icon}>
              <FaSignOutAlt />
            </span>
            <span className={styles.label}>Logout</span>
          </div>
        </div>
      </div>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
