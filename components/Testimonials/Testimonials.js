"use client";

import { useState } from "react";
import Image from "next/image";
import { BsChevronLeft, BsChevronRight, BsStarFill } from "react-icons/bs";
import styles from "./Testimonials.module.scss";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "HR Director",
      company: "Tech Innovations Inc.",
      image: "/testimonials/sarah.jpg",
      content:
        "The AI-powered job description generator has saved our HR team countless hours. It's incredibly accurate and professional.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "L&D Manager",
      company: "Global Solutions Ltd.",
      image: "/testimonials/michael.jpg",
      content:
        "This platform has revolutionized how we create and manage training programs. The AI suggestions are spot-on!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Talent Acquisition Lead",
      company: "Future Corp",
      image: "/testimonials/emily.jpg",
      content:
        "The assessment generation tool has made our hiring process much more efficient and objective. Highly recommended!",
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className={styles.testimonials} id="testimonials">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>What Our Clients Say</h2>
          <p>Dont just take our word for it</p>
        </div>

        <div className={styles.carousel}>
          <button
            className={styles.navButton}
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <BsChevronLeft />
          </button>

          <div className={styles.testimonialWrapper}>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`${styles.testimonial} ${
                  index === activeIndex ? styles.active : ""
                }`}
              >
                <div className={styles.content}>
                  <p>{testimonial.content}</p>
                  <div className={styles.rating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <BsStarFill key={i} />
                    ))}
                  </div>
                </div>

                <div className={styles.author}>
                  <div className={styles.avatar}>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className={styles.info}>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                    <p className={styles.company}>{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className={styles.navButton}
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <BsChevronRight />
          </button>
        </div>

        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === activeIndex ? styles.active : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
