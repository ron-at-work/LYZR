import { AgentWorkflowVisual } from "../motion/AgentWorkflowVisual";

export function WorkflowSection() {
  return (
    <section className="w-full bg-surface-canvas section-y border-b border-border-crisp" id="workflow">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="max-w-2xl mb-8 md:mb-10">
          <h2 className="font-display display-h2 font-semibold text-text-primary">
            The agent lifecycle, on one platform.
          </h2>
          <p className="text-[16px] text-text-secondary mt-3 leading-relaxed max-w-[40rem]">
            Most tools stop at a demo. Lyzr covers the full path from idea to governed production: Architect, Studio, simulation, deployment, and the control plane.
          </p>
        </div>
        <AgentWorkflowVisual />
      </div>
    </section>
  );
}
