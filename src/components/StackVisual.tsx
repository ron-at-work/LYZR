"use client";

type VisualId = "01" | "02" | "03" | "04" | "05" | "06" | "07";

export default function StackVisual({ id }: { id: VisualId }) {
  switch (id) {
    case "01":
      return <ConnectVisual />;
    case "02":
      return <LlmVisual />;
    case "03":
      return <SimulateVisual />;
    case "04":
      return <ObserveVisual />;
    case "05":
      return <GuardVisual />;
    case "06":
      return <GovernVisual />;
    case "07":
      return <AuditVisual />;
    default:
      return null;
  }
}

function ConnectVisual() {
  const nodes = [
    { label: "AWS Bedrock", x: 12, y: 18 },
    { label: "Azure AI", x: 72, y: 14 },
    { label: "LangChain", x: 8, y: 68 },
    { label: "CrewAI", x: 74, y: 64, hideSm: true },
    { label: "On-prem", x: 40, y: 82, hideSm: true },
  ];

  return (
    <div className="sv sv-connect">
      <div className="sv-connect-grid" />
      <svg aria-hidden className="sv-connect-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((n) => (
          <line key={n.label} x1="50" y1="48" x2={n.x + 8} y2={n.y + 6} />
        ))}
      </svg>
      <div className="sv-connect-hub">
        <span className="sv-connect-hub-icon" />
        <span>Control Plane</span>
      </div>
      {nodes.map((n) => (
        <div
          className="sv-connect-node"
          data-hide-sm={n.hideSm ? "" : undefined}
          key={n.label}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}

function LlmVisual() {
  const models = [
    { name: "GPT-4o", lat: "182ms", active: true },
    { name: "Claude 3.5", lat: "214ms", active: false },
    { name: "Gemini 1.5", lat: "198ms", active: false },
    { name: "Llama 3.1", lat: "156ms", active: false },
  ];

  return (
    <div className="sv sv-llm">
      <div className="sv-window">
        <div className="sv-window-bar">
          <span />
          <span />
          <span />
          <em>AI Router</em>
        </div>
        <div className="sv-llm-body">
          <div className="sv-llm-request">
            <span className="sv-pill">route</span>
            <code>agent.run → best_model()</code>
          </div>
          <div className="sv-llm-list">
            {models.map((m) => (
              <div className={`sv-llm-row${m.active ? " is-active" : ""}`} key={m.name}>
                <span className="sv-llm-dot" />
                <span className="sv-llm-name">{m.name}</span>
                <span className="sv-llm-lat">{m.lat}</span>
                {m.active ? <span className="sv-llm-badge">Selected</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulateVisual() {
  return (
    <div className="sv sv-sim">
      <div className="sv-sim-score">
        <div className="sv-sim-ring">
          <strong>98.4</strong>
          <span>Reliability</span>
        </div>
      </div>
      <div className="sv-sim-panel">
        <div className="sv-sim-head">
          <span>Scenario suite</span>
          <span className="sv-pill sv-pill-ok">Passed</span>
        </div>
        {[
          { name: "Adversarial prompts", n: "12.4k", ok: true },
          { name: "Tool failure paths", n: "3.1k", ok: true },
          { name: "PII edge cases", n: "890", ok: true },
          { name: "Latency budget", n: "p95 < 420ms", ok: true },
        ].map((row) => (
          <div className="sv-sim-row" key={row.name}>
            <span className="sv-check" />
            <span>{row.name}</span>
            <em>{row.n}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObserveVisual() {
  const spans = [
    { label: "ingress", w: 88, tone: "a" },
    { label: "policy", w: 62, tone: "b" },
    { label: "llm.chat", w: 74, tone: "c" },
    { label: "tool:crm", w: 48, tone: "b" },
    { label: "response", w: 56, tone: "a" },
  ];

  return (
    <div className="sv sv-obs">
      <div className="sv-window">
        <div className="sv-window-bar">
          <span />
          <span />
          <span />
          <em>Trace · run_8f2a</em>
        </div>
        <div className="sv-obs-metrics">
          <div>
            <small>Latency</small>
            <strong>312ms</strong>
          </div>
          <div>
            <small>Tokens</small>
            <strong>1,842</strong>
          </div>
          <div>
            <small>Cost</small>
            <strong>$0.014</strong>
          </div>
        </div>
        <div className="sv-obs-spans">
          {spans.map((s) => (
            <div className="sv-obs-span" key={s.label}>
              <span>{s.label}</span>
              <i className={`tone-${s.tone}`} style={{ width: `${s.w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuardVisual() {
  return (
    <div className="sv sv-guard">
      <div className="sv-guard-card">
        <div className="sv-guard-shield">
          <span>AI Safety</span>
          <strong>Live</strong>
        </div>
        <ul className="sv-guard-list">
          {[
            { t: "Block hallucinations", s: "blocked" },
            { t: "Mask PII (SSN, email)", s: "masked" },
            { t: "Toxicity filter", s: "clear" },
            { t: "Prompt injection", s: "blocked" },
          ].map((item) => (
            <li key={item.t}>
              <span className={`sv-guard-status is-${item.s}`}>{item.s}</span>
              <span>{item.t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sv-guard-float">
        <span>Risk score</span>
        <strong>0.08</strong>
      </div>
    </div>
  );
}

function GovernVisual() {
  const roles = [
    {
      role: "Admin",
      perms: [
        { label: "Manage users", ok: true },
        { label: "Edit policy", ok: true },
        { label: "View reports", ok: true },
      ],
    },
    {
      role: "Editor",
      perms: [
        { label: "Edit content", ok: true },
        { label: "View reports", ok: true },
        { label: "Manage users", ok: false },
      ],
    },
    {
      role: "Viewer",
      perms: [
        { label: "View content", ok: true },
        { label: "View reports", ok: true },
        { label: "Edit content", ok: false },
      ],
    },
  ];

  return (
    <div className="sv sv-gov">
      <div className="sv-gov-top">
        <span className="sv-pill">SSO · Okta</span>
        <span className="sv-gov-lock">Runtime RBAC</span>
      </div>
      <div className="sv-gov-grid">
        {roles.map((r) => (
          <div className="sv-gov-card" key={r.role}>
            <header>
              <span className="sv-gov-avatar">{r.role[0]}</span>
              <div>
                <strong>{r.role}</strong>
                <small>Role</small>
              </div>
            </header>
            <ul>
              {r.perms.map((p) => (
                <li className={p.ok ? "is-ok" : "is-deny"} key={p.label}>
                  <i />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditVisual() {
  const rows = [
    { t: "14:02:11", e: "User login", ok: true },
    { t: "14:02:18", e: "Policy evaluate", ok: true },
    { t: "14:02:19", e: "Tool: export", ok: true },
    { t: "14:02:21", e: "Approval granted", ok: true },
    { t: "14:02:24", e: "Audit package", ok: true },
  ];

  return (
    <div className="sv sv-audit">
      <div className="sv-window">
        <div className="sv-window-bar">
          <span />
          <span />
          <span />
          <em>Audit Trail</em>
        </div>
        <div className="sv-audit-body">
          {rows.map((r) => (
            <div className="sv-audit-row" key={r.t + r.e}>
              <span className="sv-audit-time">{r.t}</span>
              <span className="sv-audit-event">{r.e}</span>
              <span className="sv-check" />
            </div>
          ))}
        </div>
      </div>
      <div className="sv-audit-seal">
        <strong>Verified</strong>
        <span>Immutable log</span>
      </div>
      <div className="sv-audit-badges">
        <span>SOC 2</span>
        <span>HIPAA</span>
        <span>GDPR</span>
      </div>
    </div>
  );
}
