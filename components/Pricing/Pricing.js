import { BsCheck2 } from "react-icons/bs";
import styles from "./Pricing.module.scss";

const Pricing = () => {
  const plans = [
    {
      name: "Monthly",
      description: "Perfect for trying out TalTracker",
      price: "49",
      period: "/month",
      features: [
        "Up to 25 job descriptions per month",
        "50 profile analyses",
        "Basic training program templates",
        "Standard assessment generation",
        "Email support",
        "Basic analytics dashboard",
      ],
      buttonText: "Start Monthly Plan",
      buttonLink: "/signup?plan=monthly",
    },
    {
      name: "Quarterly",
      description: "Best value for growing teams",
      price: "129",
      period: "/quarter",
      features: [
        "Up to 100 job descriptions per quarter",
        "Unlimited profile analyses",
        "Advanced training program builder",
        "Custom assessment templates",
        "Priority support",
        "Advanced analytics & reporting",
        "Team collaboration features",
        "API access",
      ],
      buttonText: "Start Quarterly Plan",
      buttonLink: "/signup?plan=quarterly",
      popular: true,
    },
    {
      name: "Lifetime",
      description: "For enterprises committed to innovation",
      price: "999",
      period: "one-time",
      features: [
        "Unlimited job descriptions",
        "Unlimited profile analyses",
        "Custom training program builder",
        "White-label assessments",
        "24/7 priority support",
        "Enterprise analytics suite",
        "Dedicated account manager",
        "Custom AI model training",
        "Full API access",
        "SSO integration",
      ],
      buttonText: "Get Lifetime Access",
      buttonLink: "/signup?plan=lifetime",
    },
  ];

  return (
    <section className={styles.pricing} id="pricing">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the perfect plan for your HR needs</p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.plan} ${
                plan.popular ? styles.popular : ""
              } animate-fadeIn`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}

              <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>

              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>

              <ul className={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <BsCheck2 className={styles.checkIcon} />
                    {feature}
                  </li>
                ))}
              </ul>

              <a href={plan.buttonLink} className={styles.button}>
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
