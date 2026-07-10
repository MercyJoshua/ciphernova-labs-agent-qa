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
  // {
  //   title: "Resources",
  //   links: [
  //     { label: "Docs", href: "#faq" },
  //     { label: "API", href: "#method" },
  //     { label: "Examples", href: "#pricing" },
  //     { label: "Status", href: "#faq" },
  //   ],
  // },
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


export default function Footer() {
  return (
    <>
      <footer className="xero-footer-grid w-full max-w-[1600px] mx-auto px-10 pt-15 pb-10 grid gap-10 justify-items-center text-center max-[768px]:px-5 max-[768px]:pt-12.5 max-[768px]:pb-8">
        <div className="flex flex-col items-center gap-3.5 max-w-70 max-[980px]:col-span-2 max-[980px]:max-w-none max-[768px]:col-span-1 max-[768px]:max-w-[24rem]">
          <span className="text-[1.15rem] font-bold tracking-tight">Preflight</span>
          <p className="text-[0.83rem] text-white/45 m-0 leading-[1.6]">
            The reliability harness for teams that want to test agents before users do.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title} className="flex flex-col items-center">
            <h5 className="text-[0.72rem] uppercase tracking-[0.14em] text-[--text-muted] font-medium m-0 mb-4.5">
              {col.title}
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col items-center gap-2.5">
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
      <div className="w-full max-w-[1600px] mx-auto px-10 pt-6 pb-10 flex justify-center items-center text-center text-[0.78rem] text-[--text-muted] max-[768px]:px-5 max-[768px]:pb-8">
        <div className="max-[768px]:leading-relaxed">© 2026 Preflight. All rights reserved.</div>
      </div>
    </>
  );
}
