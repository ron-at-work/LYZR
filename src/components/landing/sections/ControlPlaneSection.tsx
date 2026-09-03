import LiveTelemetryPanel from "../../LiveTelemetryPanel";

export function ControlPlaneSection() {
  return (
    <section className="w-full bg-surface-canvas section-y" id="control-plane">
      <div className="max-w-[1120px] mx-auto page-pad">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <span className="text-[11.5px] font-mono text-primary uppercase tracking-[0.18em] font-semibold block mb-3">
            Live telemetry
          </span>
          <h2 className="font-display display-h2 font-medium text-text-primary">
            Every agent run, observed in real time.
          </h2>
          <p className="text-[15px] md:text-[16.5px] text-text-secondary mt-4 leading-relaxed max-w-xl">
            Ingress, routing, and guardrails - one sovereign control plane across every framework and cloud.
          </p>
        </div>

        <LiveTelemetryPanel />
      </div>
    </section>
  );
}
