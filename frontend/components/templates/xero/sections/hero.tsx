"use client";

import HeroPipeline from "../../mini-components/hero-pipeline";

export default function Hero() {
  return (
    <section className="xero-card w-full max-w-[1600px] mx-auto rounded-[20px] overflow-hidden relative flex flex-col items-center text-center px-10 pt-20 pb-17.5 min-h-160 max-[640px]:px-5 max-[640px]:pt-14 max-[640px]:pb-16 max-[640px]:min-h-0">
      {/* Gradient arc */}
      <div className="xero-hero-arc absolute inset-0 pointer-events-none z-0" />

      {/* Grid */}
      <div className="xero-hero-grid absolute inset-0 pointer-events-none z-0" />

      <HeroPipeline />

      {/* Hero text */}
      <div className="max-w-155 z-1 relative">
        <h1 className="xero-section-title-lg font-light leading-[1.1] tracking-tight mb-3.5 m-0">
          Stress-test every agent
          <strong className="xero-gradient-text block font-normal mt-1">
            before it ships.
          </strong>
        </h1>
        <p className="text-[0.9rem] text-white/40 max-w-110 mx-auto mb-9 leading-[1.55] max-[640px]:mb-7">
          Run normal, edge-case, and adversarial conversations against any agent endpoint.
        </p>
        <a
          href="/submit"
          className="inline-flex items-center justify-center bg-white text-[#0a0a0f] px-8 py-3 rounded-full font-semibold text-[0.9rem] transition-all hover:opacity-90 hover:-translate-y-px max-[640px]:w-full max-[640px]:max-w-60"
        >
          Preflight Check
        </a>
      </div>
    </section>
  );
}
