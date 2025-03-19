import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Transform Your HR
            <br />
            Operations with
            <br />
            <span className={styles.highlight}>TalTracker</span>
          </h1>

          <p className={styles.subtitle}>
            Streamline your HR processes with AI-powered tools for job
            descriptions, profile analysis, training programs, and assessments.
          </p>

          <div className={styles.cta}>
            <Link href="/companyRegistration" className={styles.primaryBtn}>
              Get Started <BsArrowRight />
            </Link>
            <Link href="/login" className={styles.secondaryBtn}>
              Login Now
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3>10K+</h3>
              <p>Active Users</p>
            </div>
            <div className={styles.stat}>
              <h3>98%</h3>
              <p>Success Rate</p>
            </div>
            <div className={styles.stat}>
              <h3>50+</h3>
              <p>Enterprise Clients</p>
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.image}>
            {/* <Image
              src="/hero-image.png"
              alt="Professional woman using AI interface"
              width={600}
              height={600}
              priority
            /> */}
          </div>
          <div className={styles.shape1} />
          <div className={styles.shape2} />
          <div className={styles.shape3} />
        </div>
      </div>

      <div className={styles.scrollDown}>
        <span>Scroll Down</span>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
