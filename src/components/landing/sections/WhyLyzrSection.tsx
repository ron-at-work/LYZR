import { WHY_LYZR } from "../data";

export function WhyLyzrSection() {
  return (
    <section className="why-lyzr w-full bg-brand-ink border-y border-border-crisp section-y" id="why-lyzr">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="why-lyzr-header">
          <div className="why-lyzr-header-copy">
            <span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">
              What we are
            </span>
            <h2 className="font-display display-h2 font-medium text-text-primary pb-1">
              Five reasons enterprises &amp; developers{" "}
              <span className="font-editorial-italic text-primary display-em leading-[1.1]">
                choose Lyzr.
              </span>
            </h2>
            <p className="text-[16px] md:text-[17px] text-text-secondary mt-space-16 leading-relaxed max-w-[40rem]">
              Lyzr is the agent production stack — a durable control plane, Git-native agent ops, and forward-deployed engineers who ship inside your VPC. Not a toolbox you figure out alone.
            </p>
          </div>
          <div className="why-lyzr-thesis" aria-label="Lyzr in three lines">
            <div className="why-lyzr-thesis-item">
              <span className="why-lyzr-thesis-num">01</span>
              <span className="why-lyzr-thesis-label">Platform</span>
              <span className="why-lyzr-thesis-text">Control plane that governs every agent fleet</span>
            </div>
            <div className="why-lyzr-thesis-item">
              <span className="why-lyzr-thesis-num">02</span>
              <span className="why-lyzr-thesis-label">Discipline</span>
              <span className="why-lyzr-thesis-text">Durable runtime, Git rigor, cost control</span>
            </div>
            <div className="why-lyzr-thesis-item">
              <span className="why-lyzr-thesis-num">03</span>
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
              <span className="why-lyzr-card-num" aria-hidden="true">
                {reason.num}
              </span>
              <div className="why-lyzr-card-body">
                <span className="why-lyzr-card-kicker">
                  {reason.num} / {reason.category}
                </span>
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
