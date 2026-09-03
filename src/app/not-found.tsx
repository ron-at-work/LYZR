import Link from "next/link";

const ESCAPES = [
  { href: "/", label: "Home", hint: "Back to the landing plane" },
  { href: "/#control-plane", label: "Control Plane", hint: "Live telemetry" },
  { href: "/#catalog", label: "Agent catalog", hint: "Ready-to-deploy workforce" },
  { href: "https://studio.lyzr.ai/", label: "Agent Studio", hint: "Build & ship", external: true },
] as const;

export default function NotFound() {
  return (
    <main className="nf-page">
      <div className="nf-glow" aria-hidden="true" />
      <div className="nf-grid" aria-hidden="true" />

      <header className="nf-top page-pad">
        <Link className="nf-brand" href="/" aria-label="Lyzr home">
          <img alt="" className="nf-brand-mark" height={28} src="/lyzr-logo.png" width={72} />
        </Link>
        <span className="nf-status">
          <span className="nf-status-dot" aria-hidden="true" />
          control-plane · route miss
        </span>
      </header>

      <div className="nf-body page-pad">
        <p className="nf-kicker">Error 404</p>

        <div className="nf-display" aria-hidden="true">
          <span className="nf-display-num">4</span>
          <span className="nf-display-gap">
            <span className="nf-orbit" />
            <span className="nf-orbit nf-orbit--lag" />
          </span>
          <span className="nf-display-num">4</span>
        </div>

        <h1 className="nf-title font-display">
          This route isn&apos;t on the{" "}
          <em className="font-editorial-italic nf-title-em">control plane.</em>
        </h1>

        <p className="nf-lede">
          The path you requested is not registered. Agents, playbooks, and production surfaces still are —
          pick a known destination below.
        </p>

        <div className="nf-actions">
          <Link className="nf-cta-primary btn-brand" href="/">
            Return home
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
          <a
            className="nf-cta-secondary"
            href="https://www.lyzr.ai/book-demo/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Book a demo
          </a>
        </div>

        <ul className="nf-escapes">
          {ESCAPES.map((item) => {
            const external = "external" in item && item.external;
            const inner = (
              <>
                <span className="nf-escape-label">{item.label}</span>
                <span className="nf-escape-hint">{item.hint}</span>
                <span className="material-symbols-outlined nf-escape-arrow" aria-hidden="true">
                  {external ? "arrow_outward" : "arrow_forward"}
                </span>
              </>
            );

            return (
              <li key={item.href}>
                {external ? (
                  <a className="nf-escape" href={item.href} rel="noopener noreferrer" target="_blank">
                    {inner}
                  </a>
                ) : (
                  <Link className="nf-escape" href={item.href}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <p className="nf-trace font-mono" aria-hidden="true">
          <span>TRACE</span>
          <span className="nf-trace-sep">·</span>
          <span>gateway.reject</span>
          <span className="nf-trace-sep">·</span>
          <span>route≠registry</span>
          <span className="nf-trace-sep">·</span>
          <span>0 agents routed</span>
        </p>
      </div>
    </main>
  );
}
