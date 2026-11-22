"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/config";
import {
  FiCalendar,
  FiHome,
  FiUser,
  FiBriefcase,
  FiLayers,
  FiCpu,
  FiSend,
  FiX,
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import { useBooking } from "@/context/BookingContext";

const navLinks = [
  { label: "Home", href: "#home", icon: FiHome },
  { label: "About", href: "#about", icon: FiUser },
  { label: "Experience", href: "#experience", icon: FiBriefcase },
  { label: "Projects", href: "#projects", icon: FiLayers },
  { label: "Skills", href: "#skills", icon: FiCpu },
  { label: "Contact", href: "#contact", icon: FiSend },
];

export default function Navbar() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);

      // Determine active section
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    const id = href.slice(1);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[100] bg-gradient-to-r from-cyber-blue via-neon-violet to-cyber-blue transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-border-glass py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container-max flex items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile hamburger button + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger button on the left side of header */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/10 hover:border-cyber-blue/40 text-ghost-white focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              whileTap={{ scale: 0.92 }}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-5 h-[2px] bg-ghost-white rounded-full block origin-center"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-[2px] bg-ghost-white rounded-full block"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-5 h-[2px] bg-ghost-white rounded-full block origin-center"
                />
              </div>
            </motion.button>

            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#home");
              }}
              className="text-xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="gradient-text">{siteConfig.name}</span>
              <span className="text-ghost-white/30">.</span>
            </motion.a>
          </div>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const isActive = activeSection === href.slice(1);
              return (
                <li key={href}>
                  <motion.button
                    onClick={() => scrollTo(href)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-cyber-blue"
                        : "text-ghost-white/60 hover:text-ghost-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 glass border border-cyber-blue/20 rounded-lg"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </motion.button>
                </li>
              );
            })}
          </ul>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Quick action button on mobile */}
            <motion.button
              onClick={() => openBooking()}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ghost-white rounded-lg glass border border-cyber-blue/30 hover:border-cyber-blue hover:text-cyber-blue transition-all"
              whileTap={{ scale: 0.95 }}
            >
              <FiCalendar size={13} className="text-cyber-blue" />
              <span>Book</span>
            </motion.button>

            {/* Desktop buttons */}
            <motion.button
              onClick={() => openBooking()}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-ghost-white rounded-lg glass border border-cyber-blue/30 hover:border-cyber-blue hover:text-cyber-blue hover:shadow-sm hover:shadow-cyber-blue/30 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiCalendar size={14} className="text-cyber-blue" /> Book a Call
            </motion.button>
            <motion.button
              onClick={() => scrollTo("#contact")}
              className="hidden md:flex items-center gap-2 px-5 py-2 text-sm font-semibold text-obsidian rounded-lg bg-gradient-to-r from-cyber-blue to-neon-violet glow-blue"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,240,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Hire Me
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer & backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md md:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out Menu Panel from left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-[#080811]/98 backdrop-blur-2xl border-r border-white/10 p-6 md:hidden flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div>
                    <a
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo("#home");
                      }}
                      className="text-xl font-bold tracking-tight block"
                    >
                      <span className="gradient-text">{siteConfig.name}</span>
                      <span className="text-cyber-blue">.</span>
                    </a>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ghost-white/60">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Available for work</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2.5 rounded-xl glass border border-white/10 text-ghost-white/70 hover:text-ghost-white hover:border-cyber-blue/40 transition-colors"
                    aria-label="Close menu"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="py-5 space-y-1">
                  <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-ghost-white/40 mb-2">
                    Menu
                  </p>
                  {navLinks.map(({ label, href, icon: Icon }, i) => {
                    const isActive = activeSection === href.slice(1);
                    return (
                      <motion.button
                        key={href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.04 }}
                        onClick={() => scrollTo(href)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.12)]"
                            : "text-ghost-white/70 hover:text-ghost-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className={isActive ? "text-cyber-blue" : "text-ghost-white/50"}
                          />
                          <span>{label}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_8px_#00F0FF]" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons & Footer */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  onClick={() => {
                    setMenuOpen(false);
                    openBooking();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-ghost-white glass border border-cyber-blue/30 hover:border-cyber-blue flex items-center justify-center gap-2 transition-all"
                >
                  <FiCalendar size={15} className="text-cyber-blue" />
                  <span>Book a 1:1 Call</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                  onClick={() => scrollTo("#contact")}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-obsidian bg-gradient-to-r from-cyber-blue to-neon-violet hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2"
                >
                  <FiSend size={14} />
                  <span>Hire Me</span>
                </motion.button>

                {/* Social icons */}
                <div className="pt-2 flex items-center justify-between text-ghost-white/40 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={siteConfig.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:text-cyber-blue hover:bg-white/5 transition-colors"
                      aria-label="GitHub"
                    >
                      <FiGithub size={17} />
                    </a>
                    <a
                      href={siteConfig.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:text-cyber-blue hover:bg-white/5 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin size={17} />
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="p-2 rounded-lg hover:text-cyber-blue hover:bg-white/5 transition-colors"
                      aria-label="Email"
                    >
                      <FiMail size={17} />
                    </a>
                  </div>
                  <span className="font-mono text-[11px] text-ghost-white/40">Palakkad, Kerala</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
