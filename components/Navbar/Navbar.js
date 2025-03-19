"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About TalTracker" },
    { href: "#companies", label: "Companies" },
    { href: "#professionals", label: "Professionals" },
    { href: "#resources", label: "Resources" },
    { href: "#contact", label: "Contact Us" },
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {/* <Image
            src="/logo.png"
            alt="TalTracker Logo"
            width={40}
            height={40}
            priority
          /> */}
          <span>TalTracker</span>
        </Link>

        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.authButtons}>
          <Link href="/login" className={styles.loginBtn}>
            Login Now
          </Link>
          <Link href="/companyRegistration" className={styles.getStartedBtn}>
            Get Started
          </Link>
        </div>

        <button
          className={styles.menuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
