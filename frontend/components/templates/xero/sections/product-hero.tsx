"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion, type Variants } from "motion/react";

const heroContent = {
  badge: "AI Agent Reliability Platform",

  title: (
    <>
      AI agents,
      <br />
      tested before deployment.
    </>
  ),

  description:
    "Stress-test autonomous agents with adversarial scenarios, multi-turn simulations, and AI-powered evaluation.",

  inputLabel: "Agent endpoint",
  inputPlaceholder: "https://your-agent-api.com",

  features: [
    "Hallucination detection",
    "Tool-call validation",
    "Multi-turn testing",
    "Reliability scoring",
  ],
};

const shellVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const heroImageSrc = "/2.png";

export default function ProductHero() {
  const router = useRouter();
  const [agentUrl, setAgentUrl] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUrl = agentUrl.trim();
    const targetUrl = trimmedUrl
      ? `/submit?agentUrl=${encodeURIComponent(trimmedUrl)}`
      : "/submit";

    router.push(targetUrl);
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-5 pt-4 max-[768px]:px-3 max-[768px]:pt-3">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={shellVariants}
        className="
          relative 
          min-h-[clamp(34rem,78vh,52rem)]
          overflow-hidden
          rounded-[32px]
          bg-[radial-gradient(circle_at_top_left,_rgba(40,52,101,0.9),_rgba(15,18,33,0.98)_70%,_rgba(8,10,18,1))]
          text-white
          shadow-[0_28px_120px_rgba(0,0,0,0.42)]
        "
      >
        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src={heroImageSrc}
            alt="AI agent reliability inspection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute inset-0
              bg-[linear-gradient(90deg,rgba(8,10,18,0.9)_0%,rgba(8,10,18,0.72)_42%,rgba(8,10,18,0.2)_75%,rgba(8,10,18,0.35))]
            "
          />

          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_top_left,rgba(255,94,188,0.14),transparent_32%)]
            "
          />

          <div
            className="
              absolute right-0 top-0
              h-96 w-96
              rounded-full
              bg-[#6aa0ff]/20
              blur-3xl
            "
          />
        </div>

        {/* Content */}
        <div
          className="
            relative z-10
            flex min-h-[clamp(34rem,78vh,52rem)]
            items-end
            px-6 py-10
            md:px-10
            lg:px-14
            lg:py-14
          "
        >
          <motion.div
            variants={shellVariants}
            className="max-w-[38rem]"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border border-white/10
                bg-white/5
                px-4 py-2
                text-[0.7rem]
                font-medium
                uppercase
                tracking-[0.18em]
                text-white/65
                backdrop-blur-sm
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#ff5ebc]" />
              {heroContent.badge}
            </motion.div>


            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="
                mt-6
                text-[clamp(2.4rem,6vw,4.6rem)]
                font-medium
                leading-[0.95]
                tracking-[-0.055em]
                text-white
              "
            >
              {heroContent.title}
            </motion.h1>


            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="
                mt-5
                max-w-[32rem]
                text-[clamp(0.95rem,1.5vw,1.1rem)]
                leading-relaxed
                text-white/65
              "
            >
              {heroContent.description}
            </motion.p>


            {/* Endpoint Input */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="
                mt-8
                flex
                max-w-[34rem]
                items-center
                gap-3
                rounded-full
                border border-white/10
                bg-white/[0.06]
                p-2
                backdrop-blur-xl
                max-[640px]:rounded-[24px]
              "
            >
              <div
                className="
                  flex-1
                  rounded-full
                  border border-white/10
                  bg-black/20
                  px-5 py-3
                "
              >
                <p
                  className="
                    text-[0.65rem]
                    uppercase
                    tracking-[0.18em]
                    text-white/40
                  "
                >
                  {heroContent.inputLabel}
                </p>

                <input
                  value={agentUrl}
                  onChange={(event) => setAgentUrl(event.target.value)}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  aria-label={heroContent.inputLabel}
                  placeholder={heroContent.inputPlaceholder}
                  className="
                    mt-1
                    w-full
                    border-0
                    bg-transparent
                    text-sm
                    text-white/80
                    outline-none
                    placeholder:text-white/35
                  "
                />
              </div>

              <button
                type="submit"
                aria-label="Start testing agent"
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ff5ebc]
                  text-white
                  transition-transform
                  hover:-translate-y-0.5
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-none stroke-current"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </motion.form>


            {/* Feature Tags */}
            <motion.div
              variants={fadeUp}
              className="
                mt-5
                flex
                flex-wrap
                gap-3
              "
            >
              {heroContent.features.map((feature) => (
                <span
                  key={feature}
                  className="
                    rounded-full
                    border border-white/10
                    bg-white/[0.05]
                    px-4 py-2
                    text-xs
                    text-white/55
                    backdrop-blur-sm
                  "
                >
                  {feature}
                </span>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
