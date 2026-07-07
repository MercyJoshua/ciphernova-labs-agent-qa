const ExpediaSVG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[22px] h-[22px]">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path fill="#0a0a0f" d="M8 9h8v2H8zm0 4h6v2H8z" />
  </svg>
);
const AsanaSVG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[22px] h-[22px]">
    <circle cx="12" cy="7" r="4" fill="currentColor" />
    <circle cx="5" cy="16" r="3.5" fill="currentColor" />
    <circle cx="19" cy="16" r="3.5" fill="currentColor" />
  </svg>
);
const ZenefitsSVG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]">
    <polyline points="4,8 20,8" />
    <polyline points="8,12 16,12" />
    <polyline points="4,16 20,16" />
  </svg>
);
const HubSpotSVG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
    <circle cx="15.5" cy="8.5" r="2.5" fill="currentColor" />
    <circle cx="8.5" cy="8.5" r="2" />
    <path d="M8.5 10.5 v6 h7" />
    <circle cx="15.5" cy="16.5" r="1.5" fill="currentColor" />
  </svg>
);
const LoomSVG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="w-[22px] h-[22px]">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" />
    <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" />
  </svg>
);

export default function Brands() {
  return (
    <div className="flex gap-16 max-[768px]:gap-8 max-[480px]:gap-6 px-6 pt-8 pb-2.5 flex-wrap justify-center w-full max-w-[1600px] mx-auto mb-20">
      {[
        { Icon: ExpediaSVG, label: "Fireworks" },
        { Icon: AsanaSVG, label: "Gemma" },
        { Icon: ZenefitsSVG, label: "FastAPI" },
        { Icon: HubSpotSVG, label: null },
        { Icon: LoomSVG, label: "Next.js" },
      ].map(({ Icon, label }, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 text-white/35 text-[1.1rem] font-medium whitespace-nowrap"
        >
          <Icon />
          {i === 3 ? (
            <span>
              Docke
              <span className="inline-block w-1.5 h-1.5 bg-current rounded-full align-super mx-px" />r
            </span>
          ) : (
            <span>{label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
