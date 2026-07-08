import Link from "next/link";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 shrink-0 mt-0.5 fill-none"
      stroke="var(--accent)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

const CODE_HTML = `<span class="tok-com">// spin up a pre-flight run in one call</span>
<span class="tok-key">import</span> { preflight } <span class="tok-key">from</span> <span class="tok-str">"@pre-flight/check"</span>;

<span class="tok-key">const</span> report = <span class="tok-key">await</span> <span class="tok-fn">preflight</span>({
  endpoint: <span class="tok-str">"https://agent.example.com/chat"</span>,
  description: <span class="tok-str">"Support agent for booking and refunds"</span>,
  scenarios: [<span class="tok-str">"normal"</span>, <span class="tok-str">"edge"</span>, <span class="tok-str">"prompt_injection"</span>],
  judge: <span class="tok-str">"gemma"</span>,
});

<span class="tok-com">// review the score, failure reasons, and transcripts</span>
<span class="tok-key">console</span>.<span class="tok-fn">log</span>(report.score, report.failures, report.transcripts);`;

export default function Showcase() {
  return (
    <section id="runs" className="w-full max-w-[1600px] mx-auto px-10 py-25 max-[768px]:px-5 max-[768px]:py-17.5">
      <div className="xero-card relative w-full rounded-[20px] overflow-hidden p-15 grid grid-cols-[1fr_1.1fr] gap-14 items-center max-[980px]:grid-cols-1 max-[980px]:gap-8 max-[768px]:p-8">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
            Developer workflow
          </div>
          <h3 className="xero-section-title-md font-light leading-[1.15] tracking-tight mt-4 mb-4">
            Point it at any agent,
            <br />
            <strong className="xero-gradient-text font-normal">
              keep your stack.
            </strong>
          </h3>
          <p className="text-[0.9rem] text-white/45 leading-[1.65] mb-7 max-w-110">
            One endpoint and a short description. Preflight runs the conversations, scores the transcripts, and shows you what broke.
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-3 mb-8">
            {[
              "Normal, edge-case, ambiguity, injection, and attack-intent scenarios",
              "Parallel runs across any HTTP agent endpoint",
              "Gemma scoring with reliability breakdowns and transcripts",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[0.88rem] text-white/70">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/submit"
            className="inline-block bg-white text-[#0a0a0f] px-8 py-3 rounded-full font-semibold text-[0.9rem] transition-all hover:opacity-90 hover:-translate-y-px"
          >
            See the workflow
          </Link>
        </div>

        {/* Code panel */}
        <div className="xero-code-panel relative rounded-[14px] overflow-hidden text-[0.78rem] leading-[1.7]">
          {/* gradient border overlay */}
          <span className="xero-code-border absolute pointer-events-none rounded-[14px]" />
          <div className="xero-code-tab-bar flex items-center gap-2 px-3.5 py-3">
            <span className="xero-code-dot w-2.75 h-2.75 rounded-full" />
            <span className="xero-code-dot w-2.75 h-2.75  rounded-full" />
            <span className="xero-code-dot w-2.75 h-2.75  rounded-full" />
            <span className="xero-code-tab ml-3.5 px-3 py-1 rounded-md text-[0.7rem] text-white/60">
              preflight.ts
            </span>
          </div>
          <pre
            className="p-[18px_22px_22px] text-white/75 whitespace-pre overflow-x-auto m-0"
            dangerouslySetInnerHTML={{ __html: CODE_HTML }}
          />
        </div>
      </div>
    </section>
  );
}
