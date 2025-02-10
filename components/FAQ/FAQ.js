"use client";

import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import styles from "./FAQ.module.scss";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate is TalTracker's AI in creating job descriptions?",
      answer:
        "Our AI is trained on millions of job descriptions and industry data, achieving over 95% accuracy in generating professional and relevant content. The system continuously learns and improves through user feedback and industry updates.",
    },
    {
      question:
        "Can I customize the AI-generated content to match my company's tone?",
      answer:
        "Yes, absolutely! TalTracker allows you to customize all AI-generated content. You can adjust the tone, style, and specific requirements to match your company's voice and industry standards.",
    },
    {
      question: "How does the profile analysis feature work?",
      answer:
        "Our profile analysis feature uses advanced AI algorithms to compare candidate profiles against job requirements. It analyzes skills, experience, qualifications, and potential cultural fit, providing detailed matching scores and insights.",
    },
    {
      question: "What types of training programs can TalTracker generate?",
      answer:
        "TalTracker can generate various types of training programs, including technical skills development, soft skills training, leadership development, and role-specific training. All programs are customizable and based on industry best practices.",
    },
    {
      question: "Is my data secure with TalTracker?",
      answer:
        "Yes, we take data security very seriously. We use enterprise-grade encryption, regular security audits, and comply with GDPR and other data protection regulations. Your data is stored securely and never shared with third parties.",
    },
    {
      question: "Can I integrate TalTracker with my existing HR systems?",
      answer:
        "Yes, TalTracker offers seamless integration with most popular HR systems through our API. We also provide custom integration solutions for enterprise clients to ensure smooth data flow between systems.",
    },
  ];

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about TalTracker</p>
        </div>

        <div className={styles.questions}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.question} ${
                activeIndex === index ? styles.active : ""
              }`}
            >
              <button
                className={styles.questionHeader}
                onClick={() => toggleQuestion(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.question}</span>
                <BsChevronDown className={styles.icon} />
              </button>
              <div className={styles.answer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.support}>
          <p>Still have questions?</p>
          <a href="/contact" className={styles.contactButton}>
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
