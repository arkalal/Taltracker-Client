"use client";

import {
  BsFileText,
  BsPeople,
  BsLightbulb,
  BsClipboardData,
  BsGraphUp,
  BsGear,
} from "react-icons/bs";
import styles from "./WhatYouCanDo.module.scss";

const WhatYouCanDo = () => {
  const capabilities = [
    {
      icon: <BsFileText />,
      title: "Register Your Company",
      description:
        "Easily register your organization and set up your talent management workspace in minutes.",
    },
    {
      icon: <BsPeople />,
      title: "Add and Manage Employees",
      description:
        "Build your talent database with comprehensive employee profiles and competency assessments.",
    },
    {
      icon: <BsLightbulb />,
      title: "Define Competency Frameworks",
      description:
        "Create detailed competency frameworks tailored to your organization's unique requirements.",
    },
    {
      icon: <BsClipboardData />,
      title: "Generate Competency Levels",
      description:
        "Use AI to automatically generate different levels of competency with detailed descriptions.",
    },
    {
      icon: <BsGraphUp />,
      title: "Manage Organizational Roles",
      description:
        "Define roles with specific competency requirements and track competency fulfillment across your organization.",
    },
    {
      icon: <BsGear />,
      title: "Analyze Competency Gaps",
      description:
        "Identify skill gaps and development opportunities with AI-powered competency analytics.",
    },
  ];

  return (
    <section className={styles.whatYouCanDo} id="capabilities">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>What You Can Do with TalTracker</h2>
          <p>
            Streamline your competency mapping and talent management processes
          </p>
        </div>

        <div className={styles.grid}>
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className={`${styles.capability} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.iconWrapper}>{capability.icon}</div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.backgroundShapes}>
          <div className={styles.shape1} />
          <div className={styles.shape2} />
          <div className={styles.shape3} />
        </div>
      </div>
    </section>
  );
};

export default WhatYouCanDo;
