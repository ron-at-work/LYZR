import { WHY_LYZR } from "../data";

export function WhyLyzrSection() {
  return (
    <section className="why-lyzr w-full bg-brand-ink border-y border-border-crisp section-y" id="why-lyzr">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="why-lyzr-header">
          <div className="why-lyzr-header-copy">
            <h2 className="font-display display-h2 font-semibold text-text-primary pb-1 max-w-[18ch]">
              The third way to ship enterprise agents.
            </h2>
            <p className="text-[16px] md:text-[17px] text-text-secondary mt-space-16 leading-relaxed max-w-[38rem]">
              Open-source flexibility with managed-platform security, inside your environment. A durable control plane, Git-native agent ops, and engineers who stay until agents are live.
            </p>
          </div>
          <div className="why-lyzr-thesis" aria-label="Lyzr in three lines">
            <div className="why-lyzr-thesis-item">
              <span className="why-lyzr-thesis-label">Platform</span>
              <span className="why-lyzr-thesis-text">Control plane that governs every agent fleet</span>
            </div>
            <div className="why-lyzr-thesis-item">
              <span className="why-lyzr-thesis-label">Discipline</span>
              <span className="why-lyzr-thesis-text">Durable runtime, Git rigor, cost control</span>
            </div>
            <div className="why-lyzr-thesis-item">
              <span className="why-lyzr-thesis-label">People</span>
              <span className="why-lyzr-thesis-text">FDEs embedded until agents are live</span>
            </div>
          </div>
        </div>
        <div className="why-lyzr-grid">
          {WHY_LYZR.map((reason) => (
            <article
              className={`why-lyzr-card why-lyzr-card--${reason.span} bg-surface-card`}
              key={reason.num}
            >
              <div className="why-lyzr-card-body">
                <h3 className="why-lyzr-card-title">{reason.title}</h3>
                <p className="why-lyzr-card-desc">{reason.description}</p>
                <ul className="why-lyzr-card-points">
                  {reason.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
