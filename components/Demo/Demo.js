"use client";

import { useRef, useEffect } from "react";
import styles from "./Demo.module.scss";

const Demo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Auto-play was prevented:", error);
      });
    }
  }, []);

  return (
    <section className={styles.demo} id="demo">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>See TalTracker in Action</h2>
          <p>Watch how our AI-powered platform transforms HR operations</p>
        </div>

        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
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

          <div className={styles.overlay}>
            <div className={styles.feature}>
              <div className={styles.dot} />
              <div className={styles.tooltip}>
                AI-Powered Job Description Generation
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.dot} />
              <div className={styles.tooltip}>Smart Profile Analysis</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.dot} />
              <div className={styles.tooltip}>
                Automated Training Program Design
              </div>
            </div>
          </div>
        </div>

        <div className={styles.highlights}>
          <div className={styles.highlight}>
            <h3>95% Time Saved</h3>
            <p>Automate repetitive HR tasks with AI assistance</p>
          </div>
          <div className={styles.highlight}>
            <h3>99% Accuracy</h3>
            <p>Precise matching and analysis with our advanced algorithms</p>
          </div>
          <div className={styles.highlight}>
            <h3>24/7 Available</h3>
            <p>Access your HR tools anytime, anywhere</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
