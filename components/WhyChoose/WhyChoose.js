import { BsDatabase, BsPeople, BsLightning, BsAward } from "react-icons/bs";
import styles from "./WhyChoose.module.scss";

const WhyChoose = () => {
  const benefits = [
    {
      icon: <BsDatabase />,
      title: "Supported by Industry Database",
      description:
        "Access comprehensive industry-specific data for informed decision-making.",
    },
    {
      icon: <BsLightning />,
      title: "The Speed of Artificial Intelligence",
      description:
        "Experience lightning-fast processing and instant results powered by advanced AI.",
    },
    {
      icon: <BsPeople />,
      title: "Created by Industry Veterans",
      description:
        "Benefit from expertise of seasoned HR professionals who understand your needs.",
    },
    {
      icon: <BsAward />,
      title: "Validated by Corporate Leaders",
      description:
        "Trust a platform that has earned recognition from top industry executives.",
    },
  ];

  return (
    <section className={styles.whyChoose} id="why-choose">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Why Choose Our Platform</h2>
          <p>
            Built with cutting-edge technology to transform your HR operations
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`${styles.benefit} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.iconWrapper}>{benefit.icon}</div>
              <div className={styles.content}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
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

export default WhyChoose;
