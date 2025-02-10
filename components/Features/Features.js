import { BsFileText, BsPeople, BsBook } from "react-icons/bs";
import styles from "./Features.module.scss";

const Features = () => {
  const features = [
    {
      icon: <BsFileText />,
      title: "Job Description Creation",
      description:
        "Create professional job descriptions with AI assistance and customizable templates.",
    },
    {
      icon: <BsPeople />,
      title: "Profile Analysis",
      description:
        "Analyze candidate profiles against job requirements with advanced AI matching.",
    },
    {
      icon: <BsBook />,
      title: "Training & Assessment",
      description:
        "Design comprehensive training programs and assessments for employee development.",
    },
  ];

  return (
    <section className={styles.features} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>See TalTracker in Action</h2>
          <p>
            Explore TalTracker, an AI-Powered HR solution designed to streamline
            your HR processes
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
