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
      title: "Create Job Descriptions",
      description:
        "Generate professional job descriptions with AI assistance in minutes, customized to your company's needs.",
    },
    {
      icon: <BsPeople />,
      title: "Analyze Profiles",
      description:
        "Compare candidate profiles against job requirements using advanced AI matching algorithms.",
    },
    {
      icon: <BsLightbulb />,
      title: "Design Training Programs",
      description:
        "Create comprehensive training programs based on skill gaps and development needs.",
    },
    {
      icon: <BsClipboardData />,
      title: "Track Progress",
      description:
        "Monitor employee development and training completion with detailed analytics.",
    },
    {
      icon: <BsGraphUp />,
      title: "Generate Reports",
      description:
        "Get detailed insights and analytics on competency levels and training effectiveness.",
    },
    {
      icon: <BsGear />,
      title: "Automate Workflows",
      description:
        "Streamline HR processes with automated workflows and intelligent suggestions.",
    },
  ];

  return (
    <section className={styles.whatYouCanDo} id="capabilities">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>What You Can Do with TalTracker</h2>
          <p>Unlock powerful HR capabilities with our AI-powered platform</p>
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
