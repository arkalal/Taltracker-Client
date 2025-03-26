"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./home.module.scss";
import { FaBrain, FaUserTie, FaUsers, FaChartLine } from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Save user session to localStorage for dashboard layout
      localStorage.setItem("userSession", JSON.stringify(session.user));
      setLoading(false);
    }
  }, [status, session, router]);

  // Theme colors
  const themeColors = {
    primary: "rgba(107, 115, 255, 0.8)",
    primaryDark: "rgba(0, 13, 255, 0.8)",
    secondary: "rgba(75, 192, 192, 0.8)",
    tertiary: "rgba(153, 102, 255, 0.8)",
    quaternary: "rgba(255, 159, 64, 0.8)",
    gray: "rgba(201, 203, 207, 0.8)",
    primaryTransparent: "rgba(107, 115, 255, 0.2)",
    white: "rgba(255, 255, 255, 0.8)",
  };

  const [chartData, setChartData] = useState({
    competencyDistribution: {
      labels: ["High", "Medium", "Low", "Undefined"],
      datasets: [
        {
          data: [30, 40, 20, 10],
          backgroundColor: [
            themeColors.primary,
            themeColors.primaryDark,
            themeColors.secondary,
            themeColors.gray,
          ],
          borderColor: [
            themeColors.primary.replace("0.8", "1"),
            themeColors.primaryDark.replace("0.8", "1"),
            themeColors.secondary.replace("0.8", "1"),
            themeColors.gray.replace("0.8", "1"),
          ],
          borderWidth: 1,
        },
      ],
    },
    employeeGrowth: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Employee Growth",
          data: [10, 25, 55, 70, 90, 150],
          fill: true,
          backgroundColor: themeColors.primaryTransparent,
          borderColor: themeColors.primary.replace("0.8", "1"),
          tension: 0.4,
        },
      ],
    },
    competencyProgress: {
      labels: [
        "Leadership",
        "Technical",
        "Communication",
        "Problem Solving",
        "Teamwork",
      ],
      datasets: [
        {
          label: "Average Score",
          data: [85, 70, 90, 75, 95],
          backgroundColor: [
            themeColors.primary,
            themeColors.primaryDark,
            themeColors.secondary,
            themeColors.tertiary,
            themeColors.quaternary,
          ],
          borderColor: themeColors.white,
          borderWidth: 1,
        },
      ],
    },
  });

  const [animatedNumbers, setAnimatedNumbers] = useState({
    employees: 0,
    roles: 0,
    competencies: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedNumbers((prev) => ({
        employees: prev.employees < 150 ? prev.employees + 3 : 150,
        roles: prev.roles < 25 ? prev.roles + 1 : 25,
        competencies: prev.competencies < 100 ? prev.competencies + 2 : 100,
      }));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Competency Distribution",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.formattedValue || "";
            return `${label}: ${value}%`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Employee Growth Rate",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Competency Scores by Category",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  };

  const features = [
    {
      icon: FaBrain,
      title: "Competency Mapping",
      description:
        "Map and track employee competencies across different roles and departments with our advanced AI-powered system.",
    },
    {
      icon: FaUserTie,
      title: "Role Management",
      description:
        "Define and manage roles with specific competency requirements, making it easier to align talent with organizational needs.",
    },
    {
      icon: FaUsers,
      title: "Employee Management",
      description:
        "Efficiently manage your workforce with comprehensive employee profiles and competency tracking.",
    },
    {
      icon: FaChartLine,
      title: "AI-Powered Competency Generation",
      description:
        "Leverage artificial intelligence to automatically generate and suggest competency frameworks based on role requirements.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  if (status === "loading" || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome, {session.user.name}!</h1>
        <p>Company: {session.user.companyName}</p>
      </motion.div>

      <motion.div
        className={styles.chartsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.chartCard}>
          <Pie data={chartData.competencyDistribution} options={pieOptions} />
        </div>
        <div className={styles.chartCard}>
          <Line data={chartData.employeeGrowth} options={lineOptions} />
        </div>
        <div className={styles.chartCard}>
          <Bar data={chartData.competencyProgress} options={barOptions} />
        </div>
      </motion.div>

      <motion.div
        className={styles.featuresGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.featureCard}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.iconWrapper}>
              <feature.icon className={styles.icon} />
            </div>
            <h2 className={styles.featureTitle}>{feature.title}</h2>
            <p className={styles.featureDescription}>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={styles.statsSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Employees</h3>
          <motion.span className={styles.statValue}>
            {animatedNumbers.employees}+
          </motion.span>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Roles Defined</h3>
          <motion.span className={styles.statValue}>
            {animatedNumbers.roles}+
          </motion.span>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Competencies Mapped</h3>
          <motion.span className={styles.statValue}>
            {animatedNumbers.competencies}+
          </motion.span>
        </div>
      </motion.div>

      <div className={styles.actionsSection}>
        <h2>Quick Actions</h2>
        <div className={styles.actionCards}>
          <div
            className={styles.actionCard}
            onClick={() => router.push("/dashboard/employees")}
          >
            <h3>Add Employee</h3>
            <p>Add a new employee to your company</p>
          </div>
          <div
            className={styles.actionCard}
            onClick={() => router.push("/dashboard/roles")}
          >
            <h3>Create Role</h3>
            <p>Define a new role for your organization</p>
          </div>
          <div
            className={styles.actionCard}
            onClick={() => router.push("/dashboard/competencies")}
          >
            <h3>Generate Competency</h3>
            <p>Create competency mappings for roles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
