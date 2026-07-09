"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

type HeaderMode = "home" | "submit" | "results";

const navVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
};

const mobileOverlayVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function Header({ mode = "home" }: { mode?: HeaderMode }) {
  const [open, setOpen] = useState(false);

  const isSubmitPage = mode === "submit";
  const isResultsPage = mode === "results";

  const actionButtonClass =
    "inline-flex h-8 w-[7.5rem] items-center justify-center rounded-full px-2 text-[0.82rem] transition-all cursor-pointer";

  const links = [
    { label: "Overview", href: "/#method" },
    { label: "Runs", href: "/#runs" },
    { label: "FAQ", href: "/#faq" },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3 mb-3.5"
    >
      <motion.div variants={itemVariants}>
        <Link
          href="/"
          className="text-[1.15rem] font-bold tracking-tight text-[--text]"
        >
          Preflight
        </Link>
      </motion.div>

      {/* Desktop nav */}
      <motion.ul
        variants={navVariants}
        className="hidden md:flex gap-8 list-none m-0 p-0"
      >
        {links.map((item) => (
          <motion.li key={item.label} variants={itemVariants}>
            <a
              href={item.href}
              className="text-[--text-muted] text-[0.85rem] hover:text-[--text] transition-colors"
            >
              {item.label}
            </a>
          </motion.li>
        ))}
      </motion.ul>

      {/* Desktop actions */}
      <motion.div
        variants={itemVariants}
        className="hidden md:flex gap-2.5 items-center"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={isSubmitPage || isResultsPage ? "/" : "/submit"}
            className={`${actionButtonClass} font-medium bg-white/6 text-[--text] hover:bg-white/12`}
          >
            {isSubmitPage || isResultsPage ? "Back home" : "View demo"}
          </Link>
        </motion.div>
      </motion.div>

      {/* Hamburger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="md:hidden relative z-1001 w-6 h-3.5 bg-transparent border-0 cursor-pointer p-0 flex flex-col justify-between"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`block w-6 h-0.5 bg-white rounded-sm transition-transform duration-300 origin-center ${
            open ? "translate-y-1.75 rotate-45" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white rounded-sm transition-transform duration-300 origin-center ${
            open ? "-translate-y-1.75 -rotate-45" : ""
          }`}
        />
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed top-0 h-screen w-full bg-[--bg] flex flex-col px-7 pt-24 gap-0 z-1000"
          >
            <ul className="list-none p-0 m-0 flex flex-col gap-0 mb-7 w-full">
              {links.map((item) => (
                <motion.li key={item.label} variants={itemVariants}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[1.4rem] text-[--text]"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 w-full"
            >
              <Link
                href={isSubmitPage || isResultsPage ? "/" : "/submit"}
                className="w-full h-12 inline-flex items-center justify-center px-4 text-[0.95rem] font-medium rounded-full bg-white/6 text-[--text] cursor-pointer"
              >
                {isSubmitPage || isResultsPage ? "Back home" : "View demo"}
              </Link>

              <Link
                href={isResultsPage ? "/submit" : "/results"}
                className="w-full h-12 inline-flex items-center justify-center px-4 text-[0.95rem] font-semibold rounded-full bg-white text-[#0a0a0f] cursor-pointer"
              >
                {isResultsPage ? "Run again" : "Start a run"}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
