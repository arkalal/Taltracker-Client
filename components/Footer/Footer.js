import Link from "next/link";
import Image from "next/image";
import { BsGithub, BsTwitter, BsLinkedin, BsInstagram } from "react-icons/bs";
import styles from "./Footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Partners", href: "/partners" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Support", href: "/support" },
      { label: "Status", href: "/status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" },
    ],
  };

  const socialLinks = [
    { icon: <BsGithub />, href: "https://github.com/taltracker" },
    { icon: <BsTwitter />, href: "https://twitter.com/taltracker" },
    { icon: <BsLinkedin />, href: "https://linkedin.com/company/taltracker" },
    { icon: <BsInstagram />, href: "https://instagram.com/taltracker" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="TalTracker Logo"
                width={40}
                height={40}
                priority
              />
              <span>TalTracker</span>
            </Link>
            <p>
              Transform your HR operations with AI-powered tools for job
              descriptions, profile analysis, and training programs.
            </p>
            <div className={styles.social}>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.href.split(".com/")[1]} page`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.links}>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className={styles.linkGroup}>
                <h3>{category}</h3>
                <ul>
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} TalTracker. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
