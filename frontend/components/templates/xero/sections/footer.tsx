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
    title: "Resources",
    links: [
      { label: "Docs", href: "#faq" },
      { label: "API", href: "#method" },
      { label: "Examples", href: "#pricing" },
      { label: "Status", href: "#faq" },
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

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[--text-muted]">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.19a11 11 0 0 1 5.78 0c2.21-1.5 3.18-1.19 3.18-1.19.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[--text-muted]">
      <path d="M18 3h3l-7.5 8.6L22 21h-6.8l-5.3-6.5L3.8 21H1l8-9.2L1.5 3h7l4.8 5.9L18 3zm-1.2 16h1.9L7.3 5H5.3l11.5 14z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[--text-muted]">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.55v15.5H.22V8zm7.96 0h4.36v2.12h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.48 3.04 5.48 7v8.75h-4.55v-7.76c0-1.85-.03-4.23-2.58-4.23-2.58 0-2.98 2.02-2.98 4.1v7.89H8.18V8z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <footer className="xero-footer-grid w-full max-w-[1600px] mx-auto px-10 pt-[60px] pb-10 grid gap-10 max-[980px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:px-5 max-[768px]:pt-[50px] max-[768px]:pb-8">
        <div className="flex flex-col gap-3.5 max-w-[280px] max-[980px]:col-span-2 max-[980px]:max-w-none max-[768px]:col-span-1">
          <span className="text-[1.15rem] font-bold tracking-tight">Pre-Flight Check</span>
          <p className="text-[0.83rem] text-white/45 m-0 leading-[1.6]">
            The reliability harness for teams that want to test agents before users do.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h5 className="text-[0.72rem] uppercase tracking-[0.14em] text-[--text-muted] font-medium m-0 mb-[18px]">
              {col.title}
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[0.85rem] text-white/60 hover:text-[--text] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
      <div className="w-full max-w-[1600px] mx-auto px-10 pt-6 pb-10 flex justify-between items-center flex-wrap gap-3 text-[0.78rem] text-[--text-muted] max-[768px]:px-5 max-[768px]:pb-8">
        <div>© 2026 Pre-Flight Check. All rights reserved.</div>
        <div className="flex gap-3.5">
          {[
            { label: "GitHub", Icon: GitHubIcon },
            { label: "X", Icon: XIcon },
            { label: "LinkedIn", Icon: LinkedInIcon },
          ].map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-colors"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
