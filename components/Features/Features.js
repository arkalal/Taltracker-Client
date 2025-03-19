import { BsFileText, BsPeople, BsBook } from "react-icons/bs";
import styles from "./Features.module.scss";

const Features = () => {
  const features = [
    {
      icon: <BsFileText />,
      title: "Competency Mapping",
      description:
        "Create comprehensive competency frameworks and generate different competency levels using AI.",
    },
    {
      icon: <BsPeople />,
      title: "Employee Management",
      description:
        "Manage employees, track their competencies, and identify development opportunities for career growth.",
    },
    {
      icon: <BsBook />,
      title: "Role & Company Management",
      description:
        "Define organizational roles and register company details for a complete talent management ecosystem.",
    },
  ];

  return (
    <section className={styles.features} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>See TalTracker in Action</h2>
          <p>
            Explore TalTracker, an AI-Powered platform designed to transform
            your talent management strategy
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${styles.feature} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.demo}>
          <video
            className={styles.video}
            autoPlay
            loop
            muted
            playsInline
            poster="/demo-poster.jpg"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Features;
