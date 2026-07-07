"use client";

import { useEffect, useRef } from "react";

function XeroLogo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" fill="white">
      <path
        d="M6 4 L14 4 L20 13 L26 4 L34 4 L24 18 L34 32 L26 32 L20 23 L18 26 L22 32 L14 32 L16 28 L12 22 L6 32 L-0 32 L10 18 L0 4 L6 4 Z M16 18 L20 24 L24 18 L20 12 Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Hero() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const nodeStackRef = useRef<HTMLDivElement>(null);
  const nodeXRef = useRef<HTMLDivElement>(null);
  const nodeShieldRef = useRef<HTMLDivElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pipeline = pipelineRef.current;
    const nodeStack = nodeStackRef.current;
    const nodeX = nodeXRef.current;
    const nodeShield = nodeShieldRef.current;
    const glowPath = glowPathRef.current;
    const corePath = corePathRef.current;
    const gradient = gradientRef.current;
    const splash = splashRef.current;
    if (!pipeline || !nodeStack || !nodeX || !nodeShield || !glowPath || !corePath || !gradient || !splash) return;

    let startX = 0, startY = 0, midX = 0, midY = 0, endX = 0, endY = 0;

    function computeGeometry() {
      const pRect = pipeline!.getBoundingClientRect();
      const sRect = nodeStack!.getBoundingClientRect();
      const xRect = nodeX!.getBoundingClientRect();
      const shRect = nodeShield!.getBoundingClientRect();
      startX = sRect.left + sRect.width / 2 - pRect.left;
      startY = sRect.top + sRect.height / 2 - pRect.top;
      midX = xRect.left + xRect.width / 2 - pRect.left;
      midY = xRect.top + xRect.height / 2 - pRect.top;
      endX = shRect.left + shRect.width / 2 - pRect.left;
      endY = shRect.top + shRect.height / 2 - pRect.top;
      const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;
      glowPath!.setAttribute("d", d);
      corePath!.setAttribute("d", d);
    }

    computeGeometry();
    window.addEventListener("resize", computeGeometry);

    let state: "p1" | "splash" | "p2" | "idle" = "p1";
    let lastStateChange = performance.now();
    let stackActive = false;
    let shieldActive = false;
    let rafId: number;

    function setGradient(percentage: number) {
      const halfWidth = 5;
      const center = percentage * 100;
      const totalDx = endX - startX;
      const x1 = startX + ((center - halfWidth) / 100) * totalDx;
      const x2 = startX + ((center + halfWidth) / 100) * totalDx;
      gradient!.setAttribute("x1", String(x1));
      gradient!.setAttribute("x2", String(x2));
      gradient!.setAttribute("y1", "0");
      gradient!.setAttribute("y2", "0");
    }

    function loop(t: number) {
      const elapsed = t - lastStateChange;
      if (state === "p1") {
        const p = Math.min(elapsed / 800, 1);
        setGradient(p * 0.5);
        if (p < 0.4 && !stackActive) {
          (nodeStack!.querySelector(".node-right-glow") as HTMLElement).style.opacity = "1";
          stackActive = true;
        } else if (p >= 0.4 && stackActive) {
          (nodeStack!.querySelector(".node-right-glow") as HTMLElement).style.opacity = "0";
          stackActive = false;
        }
        if (p >= 1) {
          state = "splash";
          lastStateChange = t;
          glowPath!.style.opacity = "0";
          corePath!.style.opacity = "0";
          splash!.classList.add("splash-animate");
        }
      } else if (state === "splash") {
        if (elapsed >= 800) {
          state = "p2";
          lastStateChange = t;
          splash!.classList.remove("splash-animate");
          glowPath!.style.opacity = "0.6";
          corePath!.style.opacity = "1";
        }
      } else if (state === "p2") {
        const p = Math.min(elapsed / 800, 1);
        const percentage = 0.5 + p * 0.5;
        setGradient(percentage);
        if (percentage > 0.6 && !shieldActive) {
          (nodeShield!.querySelector(".node-left-glow") as HTMLElement).style.opacity = "1";
          shieldActive = true;
        }
        if (p >= 1) {
          (nodeShield!.querySelector(".node-left-glow") as HTMLElement).style.opacity = "0";
          shieldActive = false;
          state = "idle";
          lastStateChange = t;
        }
      } else if (state === "idle") {
        if (elapsed >= 1000) {
          state = "p1";
          lastStateChange = t;
          setGradient(0);
        }
      }
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("resize", computeGeometry);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="xero-card w-full max-w-[1600px] mx-auto rounded-[20px] overflow-hidden relative flex flex-col items-center text-center px-10 pt-20 pb-[70px] min-h-[640px]">
      {/* Gradient arc */}
      <div className="xero-hero-arc absolute inset-0 pointer-events-none z-0" />

      {/* Grid */}
      <div className="xero-hero-grid absolute inset-0 pointer-events-none z-0" />

      {/* Icon pipeline */}
      <div
        ref={pipelineRef}
        className="relative flex items-center justify-center max-w-[700px] w-full mb-[52px] z-[1]"
      >
        <svg
          className="absolute inset-0 w-full h-full overflow-visible z-[2] pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="xero-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blurred" />
              <feComposite in="blurred" in2="SourceGraphic" operator="over" />
            </filter>
            <linearGradient
              id="xero-beam-gradient"
              gradientUnits="userSpaceOnUse"
              ref={gradientRef}
            >
              <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
              <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            ref={glowPathRef}
            stroke="url(#xero-beam-gradient)"
            strokeWidth="2"
            filter="url(#xero-glow)"
            fill="none"
            className="opacity-[0.6]"
          />
          <path
            ref={corePathRef}
            stroke="url(#xero-beam-gradient)"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>

        {/* Left node — stack */}
        <div
          ref={nodeStackRef}
          className="xero-node group relative w-[46px] h-[46px] rounded-full flex items-center justify-center z-[3] cursor-pointer transition-all duration-200"
        >
          {/* right glow (active via JS) */}
          <span
            className="xero-glow-right node-right-glow absolute pointer-events-none rounded-full opacity-0 transition-opacity duration-300 z-[4]"
          />
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 stroke-white/70 fill-none"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>

        {/* Left pipeline line */}
        <div className="xero-pipe-left w-[160px] max-[860px]:w-20 h-px" />

        {/* Center node */}
        <div className="relative flex items-center justify-center">
          <div
            ref={splashRef}
            className="xero-splash absolute w-[100px] h-[100px] rounded-full pointer-events-none opacity-0 scale-[0.4] z-[2]"
          />
          <div
            ref={nodeXRef}
            className="xero-node-lg relative w-16 h-16 rounded-full flex items-center justify-center z-[3]"
          >
            <XeroLogo size={28} />
          </div>
        </div>

        {/* Right pipeline line */}
        <div className="xero-pipe-right w-[160px] max-[860px]:w-20 h-px" />

        {/* Right node — shield */}
        <div
          ref={nodeShieldRef}
          className="xero-node relative w-[46px] h-[46px] rounded-full flex items-center justify-center z-[3] cursor-pointer transition-all duration-200"
        >
          {/* left glow (active via JS) */}
          <span
            className="xero-glow-left node-left-glow absolute pointer-events-none rounded-full opacity-0 transition-opacity duration-300 z-[4]"
          />
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 stroke-white/70 fill-none"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
      </div>

      {/* Hero text */}
      <div className="max-w-[620px] z-[1] relative">
        <h1 className="xero-section-title-lg font-light leading-[1.1] tracking-tight mb-3.5 m-0">
          Stress-test every agent
          <strong className="xero-gradient-text block font-normal mt-1">
            before it ships.
          </strong>
        </h1>
        <p
          className="text-[0.9rem] text-white/40 max-w-[440px] mx-auto mb-9 leading-[1.55]"
        >
          Run normal, edge-case, and adversarial conversations against any agent endpoint.
          <br />
          Get a reliability score, failure breakdown, and full transcripts in one pass.
        </p>
        <a
          href="/submit"
          className="inline-block bg-white text-[#0a0a0f] px-8 py-3 rounded-full font-semibold text-[0.9rem] transition-all hover:opacity-90 hover:-translate-y-px"
        >
          View workflow
        </a>
      </div>
    </section>
  );
}
