"use client";

import { motion, type Variants } from "motion/react";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#method" },
      { label: "Scenarios", href: "#method" },
      { label: "Reports", href: "#pricing" },
      { label: "Roadmap", href: "#faq" },
    ],
  },
  {
    title: "Workflow",
    links: [
      { label: "How it works", href: "#method" },
      { label: "Judge", href: "#faq" },
      { label: "CI", href: "#pricing" },
      { label: "Demo", href: "#method" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#faq" },
      { label: "Privacy", href: "#faq" },
      { label: "Security", href: "#faq" },
      { label: "Licensing", href: "#faq" },
    ],
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function Footer() {
  return (
    <>
      <motion.footer
        className="xero-footer-grid w-full max-w-[1600px] mx-auto px-10 pt-15 pb-10 grid gap-10 justify-items-center text-center max-[768px]:px-5 max-[768px]:pt-12.5 max-[768px]:pb-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div
          variants={item}
          className="flex flex-col items-center gap-3.5 max-w-70 max-[980px]:col-span-2 max-[980px]:max-w-none max-[768px]:col-span-1 max-[768px]:max-w-[24rem]"
        >
          <span className="text-[1.15rem] font-bold tracking-tight">Preflight</span>
          <p className="text-[0.83rem] text-white/45 m-0 leading-[1.6]">
            The reliability harness for teams that want to test agents before users do.
          </p>
        </motion.div>

        {cols.map((col) => (
          <motion.div
            key={col.title}
            variants={item}
            className="flex flex-col items-center"
          >
            <h5 className="text-[0.72rem] uppercase tracking-[0.14em] text-[--text-muted] font-medium m-0 mb-4.5">
              {col.title}
            </h5>

            <motion.ul
              className="list-none p-0 m-0 flex flex-col items-center gap-2.5"
              variants={container}
            >
              {col.links.map((link) => (
                <motion.li key={link.label} variants={item}>
                  <motion.a
                    href={link.href}
                    className="text-[0.85rem] text-white/60 hover:text-[--text] transition-colors"
                    whileHover={{ y: -1 }}
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.footer>

      <motion.div
        className="w-full max-w-[1600px] mx-auto px-10 pt-6 pb-10 flex justify-center items-center text-center text-[0.78rem] text-[--text-muted] max-[768px]:px-5 max-[768px]:pb-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-[768px]:leading-relaxed">
          © 2026 Preflight. All rights reserved.
        </div>
      </motion.div>
    </>
  );
}
