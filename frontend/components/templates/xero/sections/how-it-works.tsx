const steps = [
  {
    n: "STEP 01",
    title: "Describe the agent",
    desc: "Submit the endpoint URL plus a short note about what the agent is meant to do.",
  },
  {
    n: "STEP 02",
    title: "Generate scenarios",
    desc: "Create normal, edge-case, ambiguity, prompt-injection, and attack-intent conversations.",
  },
  {
    n: "STEP 03",
    title: "Judge and aggregate",
    desc: "Score each transcript, roll it into one reliability number, and export the failure report.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-10 py-25 max-[768px]:px-5 max-[768px]:py-17.5">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
          How it works
        </div>
        <h2 className="xero-section-title font-light leading-[1.1] tracking-tight m-0">
          Three steps.{" "}
          <strong className="xero-gradient-text font-normal">
            One score.
          </strong>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-2 max-[768px]:grid-cols-1">
        {steps.map((s, i) => (
          <div
            key={i}
            className="xero-card relative rounded-[20px] p-7 pl-7.5 min-h-55 overflow-hidden max-[480px]:p-6 max-[480px]:pl-6"
          >
            {/* Glowing left spine */}
            <span className="xero-step-spine absolute left-0 top-6 bottom-6 w-0.5 rounded-full" />
            <div className="xero-mono font-mono text-[0.72rem] text-[--text-muted] tracking-[0.12em] mb-4.5">
              {s.n}
            </div>
            <h4 className="text-[1.05rem] font-medium m-0 mb-2">{s.title}</h4>
            <p className="text-[0.85rem] text-white/45 m-0 leading-[1.6]">{s.desc}</p>
            <span className="xero-step-glow absolute pointer-events-none rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
