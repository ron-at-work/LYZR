import LiveTelemetryPanel from "../../LiveTelemetryPanel";

export function ControlPlaneSection() {
  return (
    <section className="w-full bg-surface-canvas section-y control-plane-section" id="control-plane">
      <div className="max-w-[1120px] mx-auto page-pad">
        <div className="mb-6 md:mb-12 max-w-2xl">
          <h2 className="font-display display-h2 font-semibold text-text-primary">
            Every agent run, observed in real time.
          </h2>
          <p className="text-[15px] md:text-[16.5px] text-text-secondary mt-3 md:mt-4 leading-relaxed max-w-xl">
            Ingress, routing, and guardrails. One sovereign control plane across every framework and cloud.
          </p>
        </div>

        <div className="control-plane-panel">
          <LiveTelemetryPanel />
        </div>
      </div>
    </section>
  );
}
