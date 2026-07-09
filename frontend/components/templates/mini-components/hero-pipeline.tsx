"use client";

import { useEffect, useRef } from "react";
import ShieldCheckIcon from "../icons/shield-check-icon";
import StackIcon from "../icons/stack-icon";
import XeroLogo from "../icons/xero-logo";

export default function HeroPipeline() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const nodeStackRef = useRef<HTMLDivElement>(null);
  const nodeXRef = useRef<HTMLDivElement>(null);
  const nodeShieldRef = useRef<HTMLDivElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pipeline = pipelineRef.current!;
    const nodeStack = nodeStackRef.current!;
    const nodeX = nodeXRef.current!;
    const nodeShield = nodeShieldRef.current!;
    const glowPath = glowPathRef.current!;
    const corePath = corePathRef.current!;
    const gradient = gradientRef.current!;
    const splash = splashRef.current!;

    let startX = 0;
    let startY = 0;
    let midX = 0;
    let midY = 0;
    let endX = 0;
    let endY = 0;

    function computeGeometry() {
      const pRect = pipeline.getBoundingClientRect();
      const sRect = nodeStack.getBoundingClientRect();
      const xRect = nodeX.getBoundingClientRect();
      const shRect = nodeShield.getBoundingClientRect();

      startX = sRect.left + sRect.width / 2 - pRect.left;
      startY = sRect.top + sRect.height / 2 - pRect.top;
      midX = xRect.left + xRect.width / 2 - pRect.left;
      midY = xRect.top + xRect.height / 2 - pRect.top;
      endX = shRect.left + shRect.width / 2 - pRect.left;
      endY = shRect.top + shRect.height / 2 - pRect.top;

      const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;
      glowPath.setAttribute("d", d);
      corePath.setAttribute("d", d);
    }

    computeGeometry();
    window.addEventListener("resize", computeGeometry);

    let state: "p1" | "splash" | "p2" | "idle" = "p1";
    let lastStateChange = performance.now();
    let stackActive = false;
    let shieldActive = false;
    let rafId = 0;

    function setGradient(percentage: number) {
      const halfWidth = 5;
      const center = percentage * 100;
      const totalDx = endX - startX;
      const x1 = startX + ((center - halfWidth) / 100) * totalDx;
      const x2 = startX + ((center + halfWidth) / 100) * totalDx;

      gradient.setAttribute("x1", String(x1));
      gradient.setAttribute("x2", String(x2));
      gradient.setAttribute("y1", "0");
      gradient.setAttribute("y2", "0");
    }

    function loop(t: number) {
      const elapsed = t - lastStateChange;

      if (state === "p1") {
        const p = Math.min(elapsed / 800, 1);
        setGradient(p * 0.5);

        const stackGlow = nodeStack.querySelector(".node-right-glow") as HTMLElement | null;
        if (p < 0.4 && !stackActive) {
          if (stackGlow) {
            stackGlow.style.opacity = "1";
          }
          stackActive = true;
        } else if (p >= 0.4 && stackActive) {
          if (stackGlow) {
            stackGlow.style.opacity = "0";
          }
          stackActive = false;
        }

        if (p >= 1) {
          state = "splash";
          lastStateChange = t;
          glowPath.style.opacity = "0";
          corePath.style.opacity = "0";
          splash.classList.add("splash-animate");
        }
      } else if (state === "splash") {
        if (elapsed >= 800) {
          state = "p2";
          lastStateChange = t;
          splash.classList.remove("splash-animate");
          glowPath.style.opacity = "0.6";
          corePath.style.opacity = "1";
        }
      } else if (state === "p2") {
        const p = Math.min(elapsed / 800, 1);
        const percentage = 0.5 + p * 0.5;
        setGradient(percentage);

        const shieldGlow = nodeShield.querySelector(".node-left-glow") as HTMLElement | null;
        if (percentage > 0.6 && !shieldActive) {
          if (shieldGlow) {
            shieldGlow.style.opacity = "1";
          }
          shieldActive = true;
        }

        if (p >= 1) {
          if (shieldGlow) {
            shieldGlow.style.opacity = "0";
          }
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

      rafId = window.requestAnimationFrame(loop);
    }

    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", computeGeometry);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={pipelineRef} className="relative flex items-center justify-center max-w-175 w-full mb-13 z-1 max-[640px]:mb-8">
      <svg
        className="absolute inset-0 w-full h-full overflow-visible z-2 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="xero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="over" />
          </filter>
          <linearGradient id="xero-beam-gradient" gradientUnits="userSpaceOnUse" ref={gradientRef}>
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

      <div
        ref={nodeStackRef}
        className="xero-node group relative w-11.5 h-11.5 rounded-full flex items-center justify-center z-3 cursor-pointer transition-all duration-200 max-[640px]:w-8 max-[640px]:h-8"
      >
        <span className="xero-glow-right node-right-glow absolute pointer-events-none rounded-full opacity-0 transition-opacity duration-300 z-4" />
        <StackIcon className="w-5 h-5 stroke-white/70 fill-none" />
      </div>

      <div className="xero-pipe-left w-40 max-[860px]:w-20 max-[640px]:w-8 h-px" />

      <div className="relative flex items-center justify-center">
        <div
          ref={splashRef}
          className="xero-splash absolute w-25 h-25 rounded-full pointer-events-none opacity-0 scale-[0.4] z-2 max-[640px]:w-18 max-[640px]:h-18"
        />
        <div
          ref={nodeXRef}
          className="xero-node-lg relative w-16 h-16 rounded-full flex items-center justify-center z-3 max-[640px]:w-12 max-[640px]:h-12"
        >
          <div className="max-[640px]:scale-75">
            <XeroLogo size={28} />
          </div>
        </div>
      </div>

      <div className="xero-pipe-right w-40 max-[860px]:w-20 max-[640px]:w-8 h-px" />

      <div
        ref={nodeShieldRef}
        className="xero-node relative w-11.5 h-11.5 rounded-full flex items-center justify-center z-3 cursor-pointer transition-all duration-200 max-[640px]:w-8 max-[640px]:h-8"
      >
        <span className="xero-glow-left node-left-glow absolute pointer-events-none rounded-full opacity-0 transition-opacity duration-300 z-4" />
        <ShieldCheckIcon className="w-5 h-5 stroke-white/70 fill-none" />
      </div>
    </div>
  );
}
