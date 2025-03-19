import { BsDatabase, BsPeople, BsLightning, BsAward } from "react-icons/bs";
import styles from "./WhyChoose.module.scss";

const WhyChoose = () => {
  const benefits = [
    {
      icon: <BsDatabase />,
      title: "Comprehensive Competency Database",
      description:
        "Access a rich database of competency frameworks tailored to various industries and roles.",
    },
    {
      icon: <BsLightning />,
      title: "AI-Generated Competency Levels",
      description:
        "Leverage advanced AI to automatically generate meaningful competency levels and benchmarks.",
    },
    {
      icon: <BsPeople />,
      title: "Complete Employee Lifecycle Management",
      description:
        "Seamlessly manage the entire employee journey from onboarding to professional development.",
    },
    {
      icon: <BsAward />,
      title: "Role-Based Competency Mapping",
      description:
        "Define precise competency requirements for each role to optimize your talent management strategy.",
    },
  ];

  return (
    <section className={styles.whyChoose} id="why-choose">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Why Choose Our Platform</h2>
          <p>
            Built with AI-driven competency mapping to transform your talent
            management approach
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
