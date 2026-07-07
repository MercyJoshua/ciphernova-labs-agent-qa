const quotes = [
  {
    text: "We found a prompt injection path before launch and fixed it the same day. The report made the failure obvious.",
    name: "Priya Aravind",
    role: "Head of Platform, Atlas Assist",
    initials: "PA",
  },
  {
    text: "Parallel runs kept our feedback loop fast enough for CI, even on longer multi-turn agent tasks.",
    name: "Marcus Yi",
    role: "Principal Engineer, Northbeam AI",
    initials: "MY",
  },
  {
    text: "The reliability score gave our team one number to gate on, while the transcripts showed exactly what went wrong.",
    name: "Daniela Okafor",
    role: "Director of AI, Polara Labs",
    initials: "DO",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-10 py-[100px] max-[768px]:px-5 max-[768px]:py-[70px]">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/[0.03] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
          Team feedback
        </div>
        <h2 className="xero-section-title font-light leading-[1.1] tracking-tight m-0 max-w-[760px]">
          Teams that ship{" "}
          <strong className="xero-gradient-text font-normal">
            without guessing.
          </strong>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-2 max-[768px]:grid-cols-1">
        {quotes.map((q, i) => (
          <div
            key={i}
            className="xero-card relative rounded-[20px] p-7 flex flex-col"
          >
            <div className="xero-quote-mark text-[2.4rem] font-light leading-[0.6] mb-4 opacity-70">
              "
            </div>
            <p className="text-[0.95rem] text-white/85 leading-[1.6] mb-6 font-light tracking-[-0.005em] m-0 flex-1">
              {q.text}
            </p>
            <div className="flex items-center gap-3 mt-auto">
              <div className="xero-avatar w-[38px] h-[38px] rounded-full flex items-center justify-center text-[0.78rem] font-semibold text-white/70 shrink-0">
                {q.initials}
              </div>
              <div>
                <div className="text-[0.85rem] font-medium text-[--text]">{q.name}</div>
                <div className="text-[0.75rem] text-[--text-muted]">{q.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
