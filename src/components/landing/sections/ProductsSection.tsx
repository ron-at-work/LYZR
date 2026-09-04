const PRODUCTS = [
  {
    name: "Agent Studio",
    forWho: "Builders",
    title: "Visual agents, real production APIs.",
    body: "Configure role, tools, knowledge, voice, and multi-agent flows. Every agent exposes an API. No glue code.",
    points: ["No-code + SDK", "SuperFlow orchestration", "Eval and versioning"],
  },
  {
    name: "Architect",
    forWho: "Product teams",
    title: "Plain English to a full agentic app.",
    body: "Describe the product. Architect generates frontend, agents, auth, and database so you can validate in minutes.",
    points: ["Text-to-app", "Uses Studio agents", "Stakeholder-ready UI"],
  },
  {
    name: "Control Plane",
    forWho: "CIO / Platform",
    title: "Govern every agent, any framework.",
    body: "Register LangChain, Bedrock, Azure, Agentforce, or Lyzr agents. One identity layer, one audit trail, one promotion path.",
    points: ["Framework-agnostic", "CI/CD for agents", "VPC + Okta ready"],
  },
] as const;

export function ProductsSection() {
  return (
    <section className="w-full bg-surface-subtle section-y border-b border-border-crisp" id="platform">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="max-w-2xl mb-10 md:mb-12">
          <h2 className="font-display display-h2 font-semibold text-text-primary">
            Three ways teams enter Lyzr.
          </h2>
          <p className="text-[16px] text-text-secondary mt-3 leading-relaxed max-w-[38rem]">
            Same foundation underneath. Pick the door that matches how your organization ships.
          </p>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <article className="product-card" key={product.name}>
              <span className="product-card-for">{product.forWho}</span>
              <h3 className="product-card-name font-display">{product.name}</h3>
              <p className="product-card-title">{product.title}</p>
              <p className="product-card-body">{product.body}</p>
              <ul className="product-card-points">
                {product.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
