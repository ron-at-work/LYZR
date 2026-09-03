export const HERO_TICKER = [
  { label: "Agents at work today", value: "1,443" },
  { label: "Traces reviewed", value: "298,358" },
  { label: "Tokens governed", value: "12.4M" },
  { label: "Policy checks", value: "77,151" },
  { label: "PII blocks", value: "3,471" },
  { label: "Total AI actions", value: "4,662,208" },
] as const;

export const TRUSTED_LOGOS = [
  { name: "Accenture", src: "/logos/accenture.svg", col: 1, row: 1, href: "#testimonials" },
  { name: "Hitachi", src: "/logos/hitachi.svg", col: 2, row: 1 },
  { name: "NVIDIA", src: "/logos/nvidia.svg", col: 3, row: 1 },
  { name: "Google Cloud", src: "/logos/googlecloud.svg", col: 4, row: 1, href: "#testimonials" },
  { name: "AWS", src: "/logos/aws.svg", col: 5, row: 1, href: "#testimonials" },
  { name: "Microsoft Azure", src: "/logos/azure.svg", col: 6, row: 1 },
  { name: "Salesforce", src: "/logos/salesforce.svg", col: 1, row: 2 },
  { name: "Okta", src: "/logos/okta.svg", col: 2, row: 2 },
  { name: "Microsoft", src: "/logos/microsoft.svg", col: 3, row: 2 },
  { name: "IBM", src: "/logos/ibm.svg", col: 4, row: 2 },
  { name: "Oracle", src: "/logos/oracle.svg", col: 5, row: 2 },
  { name: "SAP", src: "/logos/sap.svg", col: 6, row: 2 },
] as const;

export const TESTIMONIALS = [
  {
    metric: "95%",
    metricLabel: "POC-to-prod conversion",
    quote:
      "Lyzr was the only vendor that could articulate and then deliver what happens after the demo. Most platforms stop at the POC.",
    role: "VP of Technology",
    company: "Accenture Ventures",
    initials: "AV",
  },
  {
    metric: "95%",
    metricLabel: "Latency cut",
    quote:
      "We cut agent response time across markets. No other platform gave us the observability to trust agents in production.",
    role: "Chief Technology Officer",
    company: "Air Asia Move",
    initials: "AA",
  },
  {
    metric: "100%",
    metricLabel: "Audit compliance",
    quote:
      "They understood production-grade AI in a regulated environment. Compliance, auditability, and scale came with the ship.",
    role: "Head of Digital",
    company: "Willis Towers Watson",
    initials: "WT",
  },
  {
    metric: "4x",
    metricLabel: "Content velocity",
    quote:
      "Our Marketing AgentHub turns knowledge-base files into whitepapers and campaigns in hours instead of weeks.",
    role: "Head of Marketing Ops",
    company: "Hitachi",
    initials: "HM",
  },
  {
    metric: "100%",
    metricLabel: "Crypto log fidelity",
    quote:
      "PCI-DSS payment reconciliation agents process sensitive transactions with zero PII exposure to frontier models.",
    role: "Director of Engineering",
    company: "Firstsource",
    initials: "FS",
  },
  {
    metric: "24/7",
    metricLabel: "Autonomous ops",
    quote:
      "Disruption deflection and booking assistance now run with localized context routing, without adding headcount.",
    role: "VP of Product",
    company: "AirAsia Move",
    initials: "AP",
  },
  {
    metric: "1 Yr+",
    metricLabel: "Production uptime",
    quote:
      "The retirement advisor went live fully audited and has stayed steady for over a year in a regulated stack.",
    role: "Program Director",
    company: "WTW Retirement",
    initials: "WR",
  },
  {
    metric: "200+",
    metricLabel: "Active agents",
    quote:
      "AgenticOS automated deal sourcing, diligence, and memo drafting across our venture functions in real time.",
    role: "Managing Director",
    company: "Accenture Ventures",
    initials: "MD",
  },
  {
    metric: "0",
    metricLabel: "PII to frontier LLMs",
    quote:
      "We needed cryptographic audit trails and BYOK. Lyzr made that the default path, not a custom project.",
    role: "CISO",
    company: "Verifone",
    initials: "VF",
  },
  {
    metric: "8 wk",
    metricLabel: "To production",
    quote:
      "Forward-deployed engineers stayed inside our VPC until agents cleared security review and hit production.",
    role: "VP Engineering",
    company: "Enterprise BFSI",
    initials: "BE",
  },
] as const;

export const CASE_STUDIES = [
  {
    company: "Accenture Ventures",
    badge: "LIVE",
    quote:
      "AgenticOS running 200+ agents, automating 15+ VC functions including deal sourcing, due diligence, and investment memo drafting in real-time.",
    metrics: [
      { value: "200+", label: "Active Agents" },
      { value: "15+", label: "Automated Functions" },
    ],
  },
  {
    company: "Willis Towers Watson",
    badge: "REGULATED",
    quote:
      "Brought customers to WTW's intelligent retirement advisor. 100% compliant, fully audited, and running steadily in production for over a year.",
    metrics: [
      { value: "1 Yr+", label: "Production Uptime" },
      { value: "100%", label: "Audit Compliance" },
    ],
  },
  {
    company: "Hitachi",
    badge: "SCALED",
    quote:
      "Our Marketing AgentHub converts knowledge-base files into multi-format whitepapers, eBooks, and social campaigns in hours instead of weeks.",
    metrics: [
      { value: "4x", label: "Content Velocity" },
      { value: "72hr", label: "Turnaround Window" },
    ],
  },
  {
    company: "AirAsia Move",
    badge: "HIGH VOLUME",
    quote:
      "Transformed real-time traveler booking assistance and disruption deflection with instant localized context routing.",
    metrics: [
      { value: "95%", label: "Response Time Cut" },
      { value: "24/7", label: "Autonomous Ops" },
    ],
  },
  {
    company: "Firstsource & Verifone",
    badge: "FINTECH",
    quote:
      "PCI-DSS compliant payment reconciliation and enterprise BPO support agents processing sensitive transactions with 100% cryptographic log fidelity and zero PII exposure to frontier models.",
    metrics: [
      { value: "0 PII", label: "Leak Incidents" },
      { value: "100%", label: "Audit Trail Fidelity" },
    ],
  },
  {
    company: "Enterprise BFSI",
    badge: "SECURE",
    quote:
      "Forward-deployed engineers stayed inside our VPC until agents cleared security review and shipped to production in eight weeks.",
    metrics: [
      { value: "8 wk", label: "To Production" },
      { value: "100%", label: "VPC Isolation" },
    ],
  },
] as const;

export const ADLC_STAGES = [
  {
    id: "design",
    stage: "01",
    title: "Design",
    icon: "architecture",
    description:
      "Model deterministic decision flows, define agent personas, and blueprint dependencies before touching code.",
    features: [
      "Agent Canvas & Architect AI",
      "Visual Workflow Designer",
      "Blueprint Library (200+ specs)",
    ],
  },
  {
    id: "build",
    stage: "02",
    title: "Build",
    icon: "code",
    description:
      "Assemble high-performance agent nodes using lightweight micro-agents, modular memory blocks, and zero lock-in tools.",
    features: [
      "Agent Studio & Python SDK",
      "Cognis Memory + Vector RAG",
      "500+ Tool & API Integrations",
    ],
  },
  {
    id: "evaluate",
    stage: "03",
    title: "Evaluate",
    icon: "fact_check",
    description:
      "Stress-test agents against tens of thousands of adversarial queries and domain edge cases before live release.",
    features: [
      "Automated Simulation Engine",
      "Six Sigma Accuracy Scoring",
      "Pull Request Regression Tests",
    ],
  },
  {
    id: "deploy",
    stage: "04",
    title: "Deploy",
    icon: "rocket_launch",
    description:
      "Ship to your own private AWS, Azure, or GCP VPC with automated infrastructure provisioning and zero telemetry leakage.",
    features: [
      "AWS Bedrock Native Deploy",
      "One-Click VPC & Air-Gap Setup",
      "GitAgent CI/CD Pipelines",
    ],
  },
  {
    id: "observe",
    stage: "05",
    title: "Observe",
    icon: "monitoring",
    description:
      "End-to-end multi-agent execution tracing, token consumption diagnostics, and sub-second latency anomaly isolation.",
    features: [
      "OpenTelemetry Full Traces",
      "Real-time Hallucination Alerts",
      "Cost & Token Budget Capping",
    ],
  },
  {
    id: "govern",
    stage: "06",
    title: "Govern",
    icon: "gavel",
    description:
      "Enforce granular enterprise permissions, SSO sync, PII redaction rules, and immutable audit logs across all fleets.",
    features: [
      "Centralized Control Plane",
      "Enterprise RBAC & IdP Mapping",
      "Cryptographic Compliance Trail",
    ],
  },
] as const;

export const OPERATING_MODELS = [
  {
    id: "foundation",
    num: "01",
    label: "FOUNDATION",
    badge: "default" as const,
    icon: "shield",
    title: "Govern every agent with a",
    titleEm: "neutral control plane.",
    description:
      "Register agents built on any framework, add real-time policy enforcement, full telemetry, and token cost controls in under a week. Existing stacks stay untouched.",
    features: [
      "Unified Agent Registry & Inventory",
      "Dynamic Policy Enforcement Engine",
      "Granular Cost Controls & Token Capping",
    ],
    bestFor: "Platform & security teams starting agent governance",
    footprint: "Control plane only · Live in under a week",
    cta: "Start with Foundation",
  },
  {
    id: "operational",
    num: "02",
    label: "OPERATIONAL",
    badge: "warm" as const,
    icon: "account_tree",
    title: "Build the Agentic OS for",
    titleEm: "your entire function.",
    description:
      "A dedicated agent stack for HR, Marketing, BFSI, or Support. One unified environment where agents, cross-functional workflows, and shared memory compound value.",
    features: [
      "Visual Agent Studio & Workflow Mesh",
      "Cognis Memory & Knowledge Graph Fabric",
      "200+ Pre-built Industry Blueprints",
    ],
    bestFor: "Business units scaling agent fleets end-to-end",
    footprint: "Control plane + Agent OS · Weeks to compound value",
    cta: "Explore Operational",
  },
  {
    id: "regulated",
    num: "03",
    label: "REGULATED",
    badge: "default" as const,
    icon: "lock",
    title: "Sovereign AI for",
    titleEm: "strictly regulated sectors.",
    description:
      "Full-stack, air-gapped, and audit-ready. Built specifically for Tier-1 banks, defense contractors, and healthcare networks. Models and data never leave your boundary.",
    features: [
      "Air-Gapped Private VPC Deployment",
      "Bring-Your-Own-Keys (BYOK) Encryption",
      "SOC 2 Type II, HIPAA & ISO 27001 Certified",
    ],
    bestFor: "Banks, defense, and healthcare networks",
    footprint: "Air-gapped full stack · Data never leaves your boundary",
    cta: "Talk about Regulated",
  },
] as const;

export const WHY_LYZR = [
  {
    num: "01",
    category: "Durable Runtime",
    title: "SuperFlow: Durable Canvas",
    description:
      "MCP-native execution engine with guaranteed exactly-once delivery. Even if an underlying API fails mid-flow, SuperFlow state-saves and resumes automatically.",
    points: ["Model Context Protocol (MCP) native", "Zero lost state on network drop"],
    span: "featured" as const,
  },
  {
    num: "02",
    category: "Developer Rigor",
    title: "GitAgent & CI/CD Pipelines",
    description:
      "Treat agents like software code, not opaque black boxes. Every prompt, memory configuration, and tool definition lives in Git with branch reviews and one-command rollbacks.",
    points: ["Pull request semantic reviews", "Versioned agent deployment lineage"],
    span: "default" as const,
  },
  {
    num: "03",
    category: "Cost Efficiency",
    title: "ShadowLM Distillation",
    description:
      "Extract frontier intelligence from GPT-4o or Claude 3.5 into smaller, highly specialized 8B-70B models running privately in your VPC at up to 90% lower compute cost.",
    points: ["Dynamic traffic query arbitrage", "Zero vendor telemetry exposure"],
    span: "default" as const,
  },
  {
    num: "04",
    category: "Rapid Value",
    title: "200+ Pre-built Agents",
    description:
      "Start with battle-tested architectures rather than blank canvases. Production blueprints for financial risk modeling, compliance QA, SDR outreach, and employee operations.",
    points: ["Tested across Fortune 500 fleets", "Turnkey tool and database bindings"],
    span: "default" as const,
  },
  {
    num: "05",
    category: "Palantir-Grade Operating Model",
    title: "Forward-Deployed Engineers (FDEs)",
    description:
      "We don't hand you raw documentation and wish you luck. Senior Lyzr engineers embed alongside your team inside your private repository, solving cloud security reviews, compliance sign-offs, and edge-case testing until your agents are live in production.",
    points: ["Hands-on in your AWS/Azure VPC", "8-week production delivery SLA", "Enterprise NDA and code ownership"],
    span: "wide" as const,
  },
] as const;

export const FOOTER_TOP = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "https://www.lyzr.ai/about-us/" },
      { label: "Wall of Love", href: "https://www.lyzr.ai/wall-of-love/" },
      { label: "Pricing", href: "https://www.lyzr.ai/pricing/" },
      { label: "News", href: "https://www.lyzr.ai/resources/newsroom/" },
      { label: "Contact Us", href: "https://www.lyzr.ai/contact/" },
      { label: "Careers", href: "https://careers.lyzr.ai/" },
      { label: "Lyzr raises Series A", href: "https://www.lyzr.ai/blog/lyzr-raising-series-a/" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Banking", href: "https://www.lyzr.ai/banking-ai-agent-amadeo/" },
      { label: "Insurance", href: "https://www.lyzr.ai/insurance-ai-agent-benjie/" },
      { label: "Sales", href: "https://www.lyzr.ai/sales-agents/" },
      { label: "Marketing", href: "https://www.lyzr.ai/marketing-agents/" },
      { label: "HR", href: "https://www.lyzr.ai/hr-agents/" },
      { label: "Customer Service", href: "https://www.lyzr.ai/customer-service-agents/" },
      { label: "Financial Services", href: "https://www.lyzr.ai/financial-services-agents/" },
    ],
  },
  {
    title: "Agents",
    links: [
      { label: "Jazon - AI SDR", href: "https://www.lyzr.ai/jazon/" },
      { label: "Skott - AI Marketer", href: "https://www.lyzr.ai/skott/" },
      { label: "Dwight - AI RFP Scout", href: "https://www.lyzr.ai/dwight-ai-rfp-scout/" },
      { label: "Diane - AI HR agent", href: "https://www.lyzr.ai/diane/" },
      { label: "Kathy - AI Competitor Analyst", href: "https://www.lyzr.ai/kathy/" },
      { label: "Jeff - AI Support agent", href: "https://www.lyzr.ai/jeff/" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Agent studio", href: "https://studio.lyzr.ai/" },
      { label: "Responsible AI", href: "https://www.lyzr.ai/responsible-ai/" },
      { label: "OGI", href: "https://www.lyzr.ai/enterprise/" },
      { label: "Enterprise", href: "https://www.lyzr.ai/enterprise/" },
      { label: "AWS partnership", href: "https://www.lyzr.ai/partnership/aws/" },
    ],
  },
] as const;

export const FOOTER_BOTTOM = [
  {
    title: "Case Studies",
    links: [
      { label: "Leading HR tech innovator", href: "https://www.lyzr.ai/case-studies/leading-hr-tech-innovator/" },
      { label: "Leading energy provider", href: "https://www.lyzr.ai/case-studies/leading-energy-provider/" },
      { label: "Global IT giant", href: "https://www.lyzr.ai/case-studies/global-it-giant/" },
      { label: "HR & workforce leader", href: "https://www.lyzr.ai/case-studies/hr-workforce-leader/" },
      { label: "Customer service leader", href: "https://www.lyzr.ai/case-studies/customer-service-leader/" },
      { label: "Industrial manufacturing firm", href: "https://www.lyzr.ai/case-studies/industrial-manufacturing-firm/" },
    ],
  },
  {
    title: "Comparisons",
    links: [
      { label: "Lyzr vs Agentforce", href: "https://www.lyzr.ai/compare/lyzr-agent-studio-vs-agentforce/" },
      { label: "Lyzr vs Langgraph", href: "https://www.lyzr.ai/compare/lyzr-agent-studio-vs-langgraph/" },
      { label: "Lyzr vs Crewai", href: "https://www.lyzr.ai/compare/lyzr-agent-studio-vs-crewai/" },
      { label: "Lyzr vs Microsoft Copilot", href: "https://www.lyzr.ai/compare/lyzr-vs-microsoft-copilot/" },
      { label: "Lyzr vs Google AgentKit", href: "https://www.lyzr.ai/compare/lyzr-vs-agentkit/" },
      { label: "Lyzr vs n8n", href: "https://www.lyzr.ai/compare/lyzr-vs-n8n/" },
    ],
  },
  {
    title: "Templates",
    links: [
      { label: "100 Use Cases for CFOs", href: "https://www.lyzr.ai/template/100-use-cases-for-cfos/" },
      { label: "140+ Agentic Use Cases for Healthcare", href: "https://www.lyzr.ai/template/140-agentic-use-cases-for-healthcare/" },
      { label: "Customer Support Use Cases", href: "https://www.lyzr.ai/template/customer-support-use-cases/" },
      { label: "100+ Insurance Agent Use Cases", href: "https://www.lyzr.ai/template/insurance-ai-agents-use-cases/" },
      { label: "101 AI Use Cases", href: "https://www.lyzr.ai/template/101-ai-use-cases/" },
      { label: "12 AI Marketing Use Cases", href: "https://www.lyzr.ai/template/ai-marketing-agent-use-cases/" },
      { label: "AI Agents Use Cases for HR", href: "https://www.lyzr.ai/template/ai-agents-use-cases-for-hr/" },
      { label: "Banking Use Case", href: "https://www.lyzr.ai/template/banking-ai-use-cases/" },
      { label: "12 AI Sales Agents Use Cases", href: "https://www.lyzr.ai/template/ai-sales-agents-use-cases/" },
    ],
  },
  {
    title: "Playbooks",
    links: [
      { label: "HR Automation", href: "https://www.lyzr.ai/playbook/hr/" },
      { label: "Sales Automation", href: "https://www.lyzr.ai/playbook/sales/" },
      { label: "Banking Automation", href: "https://www.lyzr.ai/playbook/banking/" },
      { label: "Content Marketing", href: "https://www.lyzr.ai/playbook/content/" },
      { label: "GTM Marketing", href: "https://www.lyzr.ai/playbook/marketing/" },
      { label: "Agents to production", href: "https://www.lyzr.ai/playbook/how-to-take-agents-to-production/" },
      { label: "Performance Management", href: "https://www.lyzr.ai/playbook/performance-management/" },
      { label: "Fundraising Agent", href: "https://www.lyzr.ai/playbook/the-fundraising-agent/" },
      { label: "Agentforce Alternative", href: "https://www.lyzr.ai/playbook/agentforce-alternative/" },
      { label: "Procurement Automation", href: "https://www.lyzr.ai/playbook/the-strategic-procurement-automation-playbook/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "https://www.lyzr.ai/blog/" },
      { label: "Glossary", href: "https://www.lyzr.ai/glossaries/" },
      { label: "Webinars", href: "https://www.lyzr.ai/webinars/" },
      { label: "Courses", href: "https://university.lyzr.ai/" },
      { label: "Usecases", href: "https://www.lyzr.ai/usecases/" },
      { label: "Videos", href: "https://www.lyzr.ai/videos/" },
      { label: "State of AI Agents", href: "https://www.lyzr.ai/state-of-ai-agents/" },
      { label: "Agent Architect Cohort", href: "https://www.lyzr.ai/agent-architect-cohort/" },
      { label: "AI Readiness Assessment", href: "https://ai-readiness-assessment.lyzr.ai/" },
      { label: "Research", href: "https://www.lyzr.ai/research/" },
      { label: "Lyzr Analyst Recognition", href: "https://www.lyzr.ai/lyzr-analyst-recognition/" },
    ],
  },
] as const;

export const FOOTER_LEGAL = [
  { label: "Privacy policy", href: "https://www.lyzr.ai/privacy-policy/" },
  { label: "Security", href: "https://security.lyzr.ai/" },
  { label: "Terms of Use", href: "https://www.lyzr.ai/legal/" },
] as const;

export const KNOWLEDGE_RESOURCES = [
  {
    meta: "Playbook · 64 pages",
    title: "101 AI Agent Use Cases for Enterprise",
    body: "Complete architectural breakdowns and ROI formulas across 12 distinct industries.",
    cta: "Download PDF",
    href: "https://www.lyzr.ai/template/101-ai-use-cases/",
  },
  {
    meta: "Technical Guide",
    title: "Taking Agents to Production in 8 Weeks",
    body: "The step-by-step framework used by Lyzr FDEs to navigate enterprise infosec and VPC deployment.",
    cta: "Read Guide",
    href: "https://www.lyzr.ai/playbook/how-to-take-agents-to-production/",
  },
  {
    meta: "Annual Report",
    title: "State of Enterprise Autonomous Agents 2025",
    body: "Data compiled from 1,000+ active agents on latency, cost drift, and model routing benchmarks.",
    cta: "Access Report",
    href: "https://www.lyzr.ai/state-of-ai-agents/",
  },
] as const;

export const KNOWLEDGE_TRUST_BADGES = [
  "SOC 2 TYPE II",
  "ISO 27001",
  "HIPAA READY",
  "GDPR COMPLIANT",
  "CCPA",
] as const;

export const FOOTER_SOCIAL = [
  {
    label: "X",
    href: "https://x.com/lyzr__ai",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/lyzr-platform",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/humansoflyzr",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@LyzrAI",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
] as const;

export const WORKFORCE_AGENTS = [
  {
    id: "jeff",
    initial: "J",
    name: "Jeff",
    dept: "Customer Support",
    href: "https://www.lyzr.ai/jeff/",
    image: "/agents/jeff.webp",
    blurb:
      "Omnichannel care agent resolving Tier-1 and Tier-2 inquiries with tool rights for refunds, status updates, and safe escalation.",
    integration: "Zendesk & Salesforce Ready",
    metric: "78% Deflection",
    voice: true,
    voiceLine: "Inbound support lines answered in real time — telephony, chat, or mic.",
    voiceScript:
      "Hi, I'm Jeff, your Lyzr customer support agent. I resolve tier one and tier two tickets across chat, email, and voice — with safe tool access for refunds and status updates.",
    channels: ["Phone", "Chat", "Zendesk"],
  },
  {
    id: "jazon",
    initial: "J",
    name: "Jazon",
    dept: "Revenue & SDR",
    href: "https://www.lyzr.ai/jazon/",
    image: "/agents/jazon.webp",
    blurb:
      "Autonomous AI SDR that prospects accounts, researches lead triggers, writes contextualized sequences, and books qualified meetings.",
    integration: "CRM Native (HubSpot/SFDC)",
    metric: "9.2x Pipeline Lift",
    voice: true,
    voiceLine: "Outbound voice sequences with live objection handling on Twilio or Telnyx.",
    voiceScript:
      "Hey, I'm Jazon, Lyzr's revenue agent. I prospect accounts, research buying triggers, run personalized outreach, and book qualified meetings straight into your CRM.",
    channels: ["Phone", "Email", "CRM"],
  },
  {
    id: "diane",
    initial: "D",
    name: "Diane",
    dept: "HR & Talent",
    href: "https://www.lyzr.ai/diane/",
    image: "/agents/diane.webp",
    blurb:
      "Employee lifecycle agent managing onboarding, policy questions, leave approvals, and compliance verification across the org.",
    integration: "Workday & Slack Integrated",
    metric: "Zero Ticket Backlog",
    voice: true,
    voiceLine: "People-ops voice desk for policy, leave, and onboarding — always on.",
    voiceScript:
      "Hello, I'm Diane, your Lyzr HR agent. I handle onboarding, policy questions, leave approvals, and compliance checks across Workday and Slack.",
    channels: ["Phone", "Slack", "Workday"],
  },
  {
    id: "skott",
    initial: "S",
    name: "Skott",
    dept: "Marketing",
    href: "https://www.lyzr.ai/skott/",
    image: "/agents/skott.webp",
    blurb:
      "Inbound marketing agent turning brand knowledge bases into SEO articles, technical case studies, and multi-channel campaigns.",
    integration: "Brand Voice Adherence",
    metric: "4x Content Cadence",
    voice: false,
    voiceLine: "Text and campaign orchestration across every owned channel.",
    voiceScript:
      "I'm Skott, Lyzr's marketing agent. I turn your brand knowledge into SEO articles, case studies, and coordinated multi-channel campaigns.",
    channels: ["CMS", "Email", "Social"],
  },
  {
    id: "dwight",
    initial: "D",
    name: "Dwight",
    dept: "RFP & Sales Ops",
    href: "https://www.lyzr.ai/dwight-ai-rfp-scout/",
    image: "/agents/dwight.webp",
    blurb:
      "RFP discovery and response agent that scans 100-page tenders, pulls verified compliance answers, and compiles complete bids.",
    integration: "Vector Knowledge Grounded",
    metric: "80% Time Saved",
    voice: false,
    voiceLine: "Document-grounded bid assembly with full citation trails.",
    voiceScript:
      "I'm Dwight, Lyzr's RFP agent. I scan complex tenders, pull verified compliance answers, and compile complete bids with full citations.",
    channels: ["Docs", "CRM", "SharePoint"],
  },
  {
    id: "kathy",
    initial: "K",
    name: "Kathy",
    dept: "Market Intel",
    href: "https://www.lyzr.ai/kathy/",
    image: "/agents/kathy.webp",
    blurb:
      "24/7 competitor and product intelligence agent monitoring filings, pricing changes, job postings, and release updates.",
    integration: "Automated Briefings",
    metric: "Daily Synthesis",
    voice: false,
    voiceLine: "Always-on signal monitoring with executive-ready briefings.",
    voiceScript:
      "I'm Kathy, Lyzr's market intelligence agent. I monitor competitors around the clock and deliver daily executive briefings you can act on.",
    channels: ["Web", "Filings", "Slack"],
  },
] as const;

export const PROD_GAP_HARD = [
  {
    problem: "No monitoring or observability",
    fix: "Live traces, evals & agent telemetry",
  },
  {
    problem: "Missing governance & control plane",
    fix: "Policy, PII & audit in one plane",
  },
  {
    problem: "No internal champion or ownership",
    fix: "Forward-deployed engineers beside you",
  },
  {
    problem: "Reliability harnesses missing",
    fix: "Simulation, failover & resilience built-in",
  },
] as const;

export type Testimonial = (typeof TESTIMONIALS)[number];
export type CaseStudy = (typeof CASE_STUDIES)[number];
export type AdlcStageId = (typeof ADLC_STAGES)[number]["id"];
export type OperatingModelId = (typeof OPERATING_MODELS)[number]["id"];
export type WorkforceAgentId = (typeof WORKFORCE_AGENTS)[number]["id"];
