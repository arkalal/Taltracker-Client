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
  FaChevronRight,
  FaPlus,
  FaTable,
} from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const DashboardLayout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const [openSubMenu, setOpenSubMenu] = useState(null);
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

    // Set active menu and submenu based on current path
    if (pathname === "/dashboard") {
      setActiveMenu("Home");
      setActiveSubMenu("");
    } else if (pathname.includes("/employees")) {
      setActiveMenu("Employees");
      setActiveSubMenu("");
    } else if (pathname.includes("/roles")) {
      setActiveMenu("Roles");
      setOpenSubMenu("Roles");

      if (pathname.includes("/create")) {
        setActiveSubMenu("Create Role");
      } else if (pathname.includes("/view")) {
        setActiveSubMenu("View Roles");
      }
    } else if (pathname.includes("/competencies")) {
      setActiveMenu("Competencies");
      setOpenSubMenu("Competencies");

      if (pathname.includes("/view")) {
        setActiveSubMenu("View Competencies");
      }
    }
  }, [pathname, session, status, router]);

  const handleLogout = async () => {
    // Clear local storage
    localStorage.removeItem("userSession");

    // Sign out using NextAuth
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const toggleSubMenu = (menuName) => {
    if (openSubMenu === menuName) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(menuName);
    }
  };

  const menuItems = [
    {
      name: "Home",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Employees",
      icon: <FaUsers />,
      path: "/dashboard/employees",
    },
    {
      name: "Roles",
      icon: <FaUserTie />,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Create Role",
          icon: <FaPlus />,
          path: "/dashboard/roles/create",
        },
        {
          name: "View Roles",
          icon: <FaTable />,
          path: "/dashboard/roles/view",
        },
      ],
    },
    {
      name: "Competencies",
      icon: <FaListAlt />,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "View Competencies",
          icon: <FaTable />,
          path: "/dashboard/competencies/view",
        },
      ],
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
            <div key={item.name}>
              {item.hasSubMenu ? (
                // Menu item with submenu
                <>
                  <div
                    className={`${styles.menuItem} ${
                      activeMenu === item.name ? styles.active : ""
                    }`}
                    onClick={() => {
                      setActiveMenu(item.name);
                      toggleSubMenu(item.name);
                    }}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.name}</span>
                    <span
                      className={`${styles.arrow} ${
                        openSubMenu === item.name ? styles.open : ""
                      }`}
                    >
                      <FaChevronRight />
                    </span>
                  </div>

                  <div
                    className={`${styles.subMenu} ${
                      openSubMenu === item.name ? styles.open : ""
                    }`}
                  >
                    {item.subMenuItems.map((subItem) => (
                      <Link
                        href={subItem.path}
                        key={subItem.name}
                        className={`${styles.subMenuItem} ${
                          activeSubMenu === subItem.name ? styles.active : ""
                        }`}
                        onClick={() => {
                          setActiveSubMenu(subItem.name);
                        }}
                      >
                        <span className={styles.icon}>{subItem.icon}</span>
                        <span className={styles.label}>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                // Regular menu item without submenu
                <Link
                  href={item.path}
                  className={`${styles.menuItem} ${
                    activeMenu === item.name ? styles.active : ""
                  }`}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setActiveSubMenu("");
                  }}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.name}</span>
                </Link>
              )}
            </div>
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
