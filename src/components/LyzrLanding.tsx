'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import AgentStack from "./AgentStack";
import LiveTelemetryPanel from "./LiveTelemetryPanel";
import TrustSection from "./TrustSection";

const HERO_TICKER = [
  { label: "Agents at work today", value: "1,443" },
  { label: "Traces reviewed", value: "298,358" },
  { label: "Tokens governed", value: "12.4M" },
  { label: "Policy checks", value: "77,151" },
  { label: "PII blocks", value: "3,471" },
  { label: "Total AI actions", value: "4,662,208" },
] as const;

const TRUSTED_LOGOS = [
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

const TESTIMONIALS = [
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

const CASE_STUDIES = [
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

const ADLC_STAGES = [
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

const OPERATING_MODELS = [
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

const WHY_LYZR = [
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

const FOOTER_TOP = [
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

const FOOTER_BOTTOM = [
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

const FOOTER_LEGAL = [
  { label: "Privacy policy", href: "https://www.lyzr.ai/privacy-policy/" },
  { label: "Security", href: "https://security.lyzr.ai/" },
  { label: "Terms of Use", href: "https://www.lyzr.ai/legal/" },
] as const;

const KNOWLEDGE_RESOURCES = [
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

const KNOWLEDGE_TRUST_BADGES = [
  "SOC 2 TYPE II",
  "ISO 27001",
  "HIPAA READY",
  "GDPR COMPLIANT",
  "CCPA",
] as const;

const FOOTER_SOCIAL = [
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

const WORKFORCE_AGENTS = [
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

const NAV_EXT = { rel: "noopener noreferrer", target: "_blank" } as const;

type NavMenuId = "solutions" | "platform" | "partners" | "resources";

const NAV_SOLUTIONS = {
  industry: [
    { name: "Banking", sub: "Lending, onboarding, compliance", href: "https://www.lyzr.ai/banking-agents/", icon: "account_balance" },
    { name: "Insurance", sub: "Claims, underwriting, policy", href: "https://www.lyzr.ai/insurance-ai-agent-benjie/", icon: "health_and_safety" },
    { name: "Government", sub: "Secure public-sector AI", href: "https://www.lyzr.ai/government/", icon: "account_balance_wallet" },
    { name: "Healthcare", sub: "Patient & clinical workflows", href: "https://www.lyzr.ai/healthcare-agents/", icon: "local_hospital" },
    { name: "Fintech", sub: "Fraud, onboarding, payments", href: "https://www.lyzr.ai/fintech/", icon: "payments" },
    { name: "E-commerce", sub: "Discovery, support, conversion", href: "https://www.lyzr.ai/ecommerce-agents/", icon: "storefront" },
  ],
  function: [
    { name: "Revenue", sub: "Pipeline & sales agents", href: "https://www.lyzr.ai/jazon/", icon: "trending_up" },
    { name: "Marketing", sub: "Content, campaigns, demand", href: "https://www.lyzr.ai/skott/", icon: "campaign" },
    { name: "Customer Service", sub: "Resolution & deflection", href: "https://www.lyzr.ai/jeff/", icon: "support_agent" },
    { name: "Human Resources", sub: "Hiring, onboarding, people ops", href: "https://www.lyzr.ai/diane/", icon: "groups" },
    { name: "Procurement", sub: "Sourcing & contracts", href: "https://www.lyzr.ai/procurement/", icon: "shopping_cart" },
    { name: "Legal", sub: "Review & compliance", href: "https://www.lyzr.ai/legal-industry/", icon: "gavel" },
  ],
  team: [
    { name: "Compliance & Governance", sub: "Control plane, audit, RAI", href: "https://www.lyzr.ai/teams/compliance-teams/", icon: "verified_user" },
    { name: "AI & Automation", sub: "Build, evaluate, deploy", href: "https://www.lyzr.ai/teams/ai-and-automation-teams/", icon: "smart_toy" },
    { name: "Revenue & Sales", sub: "Pipeline intelligence", href: "https://www.lyzr.ai/teams/revenue-and-sales-team/", icon: "insights" },
    { name: "IT & Platform", sub: "Agent infrastructure", href: "https://www.lyzr.ai/teams/platform-teams/", icon: "dns" },
    { name: "Digital Transformation", sub: "Enterprise AI strategy", href: "https://www.lyzr.ai/teams/digital-transformation-teams/", icon: "transform" },
  ],
  role: [
    { name: "CIO", href: "https://www.lyzr.ai/roles/cio/" },
    { name: "CTO", href: "https://www.lyzr.ai/roles/cto/" },
    { name: "CEO", href: "https://www.lyzr.ai/roles/ceo/" },
    { name: "Managing Director", href: "https://www.lyzr.ai/roles/md/" },
    { name: "Head of AI", href: "https://www.lyzr.ai/roles/heads-of-ai/" },
  ],
} as const;

const NAV_PLATFORM = {
  products: [
    { name: "Agent Studio", sub: "Design, test, and ship production agents", href: "https://studio.lyzr.ai/", tag: null, icon: "architecture" },
    { name: "Architect", sub: "Plan agent systems before you build", href: "https://architect.new/", tag: null, icon: "account_tree" },
    { name: "Control Plane", sub: "Govern every agent across clouds", href: "https://www.lyzr.ai/control-plane/", tag: "New", icon: "tune" },
    { name: "Agentic OS", sub: "Enterprise operating system for agents", href: "https://www.lyzr.ai/agentic-os/", tag: "New", icon: "terminal" },
    { name: "Sovereign AI", sub: "Private, compliant, VPC-native AI", href: "https://www.lyzr.ai/sovereign-ai/", tag: "New", icon: "lock" },
    { name: "Lyzr Nitro", sub: "High-throughput inference runtime", href: null, tag: "Soon", icon: "bolt" },
    { name: "Lyzr Optimus", sub: "Autonomous optimization layer", href: null, tag: "Soon", icon: "auto_awesome" },
  ],
  modules: [
    { name: "Responsible AI", href: "https://www.lyzr.ai/responsible-ai-as-a-service/", icon: "shield" },
    { name: "Orchestration", href: "https://www.lyzr.ai/orchestration-as-a-service/", icon: "hub" },
    { name: "Agents as a Service", href: "https://www.lyzr.ai/agents-as-a-service/", icon: "rocket_launch" },
    { name: "Hallucination Manager", href: "https://www.lyzr.ai/hallucination-manager-as-a-service/", icon: "fact_check" },
    { name: "Knowledge Base", href: "https://www.lyzr.ai/knowledge-base-as-a-service/", icon: "menu_book" },
    { name: "Knowledge Graph", href: "https://www.lyzr.ai/knowledge-graph-as-a-service/", icon: "share" },
  ],
  openSource: [
    { name: "AI Agent Memory", href: "https://www.lyzr.ai/cognis/", tag: null },
    { name: "OpenGAP", href: "https://www.lyzr.ai/oss/opengap/", tag: "OSS" },
    { name: "GitAgent", href: "https://www.lyzr.ai/oss/gitagent/", tag: "OSS" },
    { name: "Docs & API", href: "https://docs.lyzr.ai/enterprise/get-started/intro", tag: null },
  ],
} as const;

const NAV_PARTNERS = {
  technology: [
    { name: "Amazon Web Services", href: "https://www.lyzr.ai/partners/aws/", logo: "/logos/aws.svg" },
    { name: "Google Cloud", href: "https://www.lyzr.ai/partners/google/", logo: "/logos/googlecloud.svg" },
    { name: "Microsoft Azure", href: "https://www.lyzr.ai/partners/microsoft/", logo: "/logos/azure.svg" },
    { name: "NVIDIA", href: null, logo: "/logos/nvidia.svg" },
  ],
  ecosystem: [
    { name: "Consulting Partners", sub: "GSI & SI co-build programs", href: "https://www.lyzr.ai/gsi-si/", icon: "handshake" },
    { name: "Reseller Partners", sub: "Co-sell and marketplace routes", href: "https://www.lyzr.ai/partners/", icon: "store" },
  ],
} as const;

const NAV_RESOURCES = {
  learn: [
    { name: "Blog", href: "https://www.lyzr.ai/blog/", icon: "article" },
    { name: "Playbooks", href: "https://www.lyzr.ai/playbook/", icon: "menu_book" },
    { name: "Templates", href: "https://www.lyzr.ai/templates/", icon: "dashboard_customize" },
    { name: "Courses", href: "https://university.lyzr.ai/", icon: "school" },
    { name: "Research", href: "https://www.lyzr.ai/research/", icon: "science" },
    { name: "Types of Agents", href: "https://www.lyzr.ai/agent-types-in-production/", icon: "category" },
  ],
  playbooks: [
    { name: "Agents to Production", href: "https://www.lyzr.ai/playbook/how-to-take-agents-to-production/" },
    { name: "Banking Dispute Management", href: "https://www.lyzr.ai/playbook/bfsi-guide-to-dispute-management/" },
    { name: "Field Guide for Analysts", href: "https://www.lyzr.ai/playbook/analyst-army-starter-pack/" },
    { name: "AI Sales Use Cases", href: "https://www.lyzr.ai/template/ai-sales-agents-use-cases/" },
    { name: "Insurance Use Cases", href: "https://www.lyzr.ai/template/insurance-ai-agents-use-cases/" },
    { name: "Architect Use Cases", href: "https://www.lyzr.ai/template/architect-agent-usecases/" },
  ],
  analyze: [
    { name: "Case Studies", href: "https://www.lyzr.ai/case-studies/", icon: "cases" },
    { name: "Comparisons", href: "https://www.lyzr.ai/comparison/", icon: "compare_arrows" },
    { name: "Assessments", href: "https://www.lyzr.ai/assessments/", icon: "assignment_turned_in" },
    { name: "State of AI Agents", href: "https://www.lyzr.ai/state-of-ai-agents/", icon: "monitoring" },
    { name: "Wall of Love", href: "https://www.lyzr.ai/wall-of-love/", icon: "favorite" },
    { name: "Analyst Recognition", href: "https://www.lyzr.ai/lyzr-analyst-recognition/", icon: "emoji_events" },
  ],
  connect: [
    { name: "Partner Program", href: "https://www.lyzr.ai/partners/" },
    { name: "Community", href: "https://www.lyzr.ai/community/" },
    { name: "Book a Demo", href: "https://www.lyzr.ai/book-demo/" },
  ],
  featured: [
    {
      label: "Founderpath",
      title: "Nathan Latka: Still Shocked Lyzr's Siva Beat Palantir",
      href: "https://www.lyzr.ai/blog/",
      tone: "volt" as const,
    },
    {
      label: "Yahoo Finance",
      title: "AI Agent Startup Just Let Its Agent Run Its $100M Fundraise",
      href: "https://www.lyzr.ai/blog/",
      tone: "ink" as const,
    },
  ],
} as const;

function NavChevron({ open }: { open?: boolean }) {
  return (
    <svg
      aria-hidden
      className={`ml-0.5 h-3 w-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180 opacity-80" : ""}`}
      fill="none"
      viewBox="0 0 12 12"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function NavExtArrow() {
  return (
    <svg
      aria-hidden
      className="h-2.5 w-2.5 shrink-0 text-ink-hint opacity-0 -translate-x-0.5 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-150"
      fill="none"
      viewBox="0 0 10 10"
    >
      <path d="M2 8L8 2M8 2H3M8 2v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

function NavIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="material-symbols-outlined text-[16px] leading-none text-ink-soft group-hover/link:text-ink transition-colors"
    >
      {name}
    </span>
  );
}

function NavDropLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-hint block mb-2.5 px-1.5">
      {children}
    </span>
  );
}

function NavTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-volt/70 text-ink leading-none">
      {children}
    </span>
  );
}

function NavMegaLink({
  name,
  sub,
  href,
  icon,
}: {
  name: string;
  sub?: string;
  href: string;
  icon?: string;
}) {
  return (
    <a className="nav-mega-link group/link" href={href} {...NAV_EXT}>
      {icon ? (
        <span className="nav-mega-icon">
          <NavIcon name={icon} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-ink leading-snug tracking-tight">{name}</span>
        {sub ? <span className="block text-[11.5px] text-ink-quiet leading-snug mt-0.5">{sub}</span> : null}
      </span>
      <NavExtArrow />
    </a>
  );
}

function NavSimpleLink({
  name,
  href,
  tag,
  icon,
}: {
  name: string;
  href: string;
  tag?: string | null;
  icon?: string;
}) {
  return (
    <a className="nav-mega-link group/link" href={href} {...NAV_EXT}>
      {icon ? (
        <span className="nav-mega-icon nav-mega-icon--sm">
          <NavIcon name={icon} />
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5 min-w-0 flex-1">
        <span className="text-[13px] font-medium text-ink tracking-tight">{name}</span>
        {tag ? <NavTag>{tag}</NavTag> : null}
      </span>
      <NavExtArrow />
    </a>
  );
}

function NavProductCard({
  name,
  sub,
  href,
  tag,
  icon,
}: {
  name: string;
  sub: string;
  href: string | null;
  tag?: string | null;
  icon: string;
}) {
  if (!href) {
    return (
      <div className="nav-product-card is-disabled" aria-disabled="true">
        <span className="nav-mega-icon">
          <NavIcon name={icon} />
        </span>
        <span className="min-w-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[13px] font-medium text-ink tracking-tight">{name}</span>
            {tag ? <NavTag>{tag}</NavTag> : null}
          </span>
          <span className="block text-[11.5px] text-ink-quiet leading-snug mt-0.5">{sub}</span>
        </span>
      </div>
    );
  }

  return (
    <a className="nav-product-card group/link" href={href} {...NAV_EXT}>
      <span className="nav-mega-icon">
        <NavIcon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-ink tracking-tight">{name}</span>
          {tag ? <NavTag>{tag}</NavTag> : null}
        </span>
        <span className="block text-[11.5px] text-ink-quiet leading-snug mt-0.5">{sub}</span>
      </span>
      <NavExtArrow />
    </a>
  );
}

function NavFooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="nav-mega-footer-link group/link" href={href} {...NAV_EXT}>
      <span>{children}</span>
      <svg aria-hidden className="h-3 w-3 transition-transform duration-150 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      </svg>
    </a>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      <span className="site-footer-heading">{title}</span>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a className="site-footer-link" href={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatAgentCount(n: number) {
  return n.toLocaleString("en-US");
}

function ArrowHint() {
  return (
    <span aria-hidden className="customer-arrow">
      <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.5 9.5 9.5 2.5M9.5 2.5H4.25M9.5 2.5V7.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    </span>
  );
}

function LogoTile({
  name,
  src,
  col,
  row,
  href,
}: {
  name: string;
  src: string;
  col: number;
  row: number;
  href?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="customer-tile group text-left"
      style={{ gridColumn: col, gridRow: row }}
    >
      <div className="relative h-full w-full">
        <div aria-hidden className="absolute inset-0 bg-white" />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-3 py-6 lg:px-4">
          {!failed ? (
            <img
              alt={name}
              className="customer-logo"
              loading="lazy"
              onError={() => setFailed(true)}
              src={src}
            />
          ) : (
            <span className="text-[14px] font-semibold text-text-primary/50 tracking-tight text-center">
              {name}
            </span>
          )}
          <ArrowHint />
        </div>
        {href ? (
          <a
            aria-label={`Read the ${name} customer story`}
            className="absolute inset-0 z-30 rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40"
            href={href}
          />
        ) : null}
      </div>
    </div>
  );
}

function CaseStudiesCarousel({ items }: { items: typeof CASE_STUDIES }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userHeld, setUserHeld] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const total = items.length;
  const paused = hovered || userHeld;

  const holdBriefly = () => {
    setUserHeld(true);
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setUserHeld(false), 1800);
  };

  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-case-card]"));
    if (!cards.length) return;
    const left = track.scrollLeft;
    let best = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft <= left + card.offsetWidth * 0.4) best = i;
    });
    setIndex(best);
  };

  const scrollTo = (next: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-case-card]");
    const clamped = ((next % total) + total) % total;
    const target = cards[clamped];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior });
    setIndex(clamped);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncIndex();
    track.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex);
    return () => {
      track.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (paused || total <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % total;
        const track = trackRef.current;
        if (track) {
          const cards = track.querySelectorAll<HTMLElement>("[data-case-card]");
          const target = cards[next];
          if (target) track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 4200);

    return () => window.clearInterval(id);
  }, [paused, total]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || e.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
    setUserHeld(true);
    track.setPointerCapture(e.pointerId);
    track.classList.add("is-dragging");
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;
    const delta = e.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;
    drag.active = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    syncIndex();
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setUserHeld(false), 900);
  };

  const pad = String(index + 1).padStart(2, "0");
  const padTotal = String(total).padStart(2, "0");

  return (
    <div
      className="case-studies-carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
      }}
    >
      <div className="case-studies-toolbar">
        <span className="font-mono text-[12px] tracking-widest text-text-muted" aria-live="polite">
          {pad} <span className="text-text-faint">/</span> {padTotal}
          <span className="ml-3 text-[11px] tracking-[0.08em] uppercase text-text-faint">
            {paused ? "Paused" : "Auto"}
          </span>
        </span>
        <div className="case-studies-controls">
          <button
            aria-label="Previous case study"
            className="case-studies-nav-btn"
            onClick={() => {
              holdBriefly();
              scrollTo(index - 1);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <button
            aria-label="Next case study"
            className="case-studies-nav-btn"
            onClick={() => {
              holdBriefly();
              scrollTo(index + 1);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div
        aria-label="Enterprise case studies"
        className="case-studies-track"
        ref={trackRef}
        role="region"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            holdBriefly();
            scrollTo(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            holdBriefly();
            scrollTo(index - 1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((card, i) => (
          <article
            className={`case-studies-card${i === index ? " is-active" : ""}`}
            data-case-card
            key={card.company}
          >
            <div>
              <div className="flex justify-between items-start gap-3 mb-5">
                <span className="text-[15px] font-semibold tracking-tight text-text-primary">
                  {card.company}
                </span>
                <span className="shrink-0 px-2 py-1 rounded-md bg-[#F3F3F3] text-[10px] font-medium uppercase tracking-[0.06em] text-[#555555]">
                  {card.badge}
                </span>
              </div>
              <p className="text-[14px] text-[#6B6B6B] italic leading-[1.65]">
                &ldquo;{card.quote}&rdquo;
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-[#EAEAEA] grid grid-cols-2 gap-4">
              {card.metrics.map((metric) => (
                <div key={metric.label}>
                  <span className="block text-[28px] font-semibold tracking-tight text-text-primary leading-none">
                    {metric.value}
                  </span>
                  <span className="block mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-[#9A9A9A]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TestimonialsCarousel({ items }: { items: typeof TESTIMONIALS }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = items.length;

  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-t-card]"));
    if (!cards.length) return;
    const left = track.scrollLeft;
    let best = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft <= left + card.offsetWidth * 0.35) best = i;
    });
    setIndex(best);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncIndex();
    track.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex);
    return () => {
      track.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, []);

  const scrollTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-t-card]");
    const clamped = Math.max(0, Math.min(total - 1, next));
    const target = cards[clamped];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    setIndex(clamped);
  };

  const pad = String(index + 1).padStart(2, "0");
  const padTotal = String(total).padStart(2, "0");

  return (
    <div className="testimonials-carousel">
      <div className="testimonials-toolbar">
        <span className="testimonials-count font-mono text-[12px] tracking-widest text-text-muted" aria-live="polite">
          {pad} <span className="text-text-faint">/</span> {padTotal}
        </span>
        <div className="testimonials-controls">
          <button
            aria-label="Previous testimonial"
            className="testimonials-nav-btn"
            disabled={index <= 0}
            onClick={() => scrollTo(index - 1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <button
            aria-label="Next testimonial"
            className="testimonials-nav-btn"
            disabled={index >= total - 1}
            onClick={() => scrollTo(index + 1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div
        aria-label="Customer testimonials"
        className="testimonials-track"
        ref={trackRef}
        role="region"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollTo(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollTo(index - 1);
          }
        }}
      >
        {items.map((t, i) => (
          <article
            className={`testimonials-panel${i === index ? " is-active" : ""}`}
            data-t-card
            key={`${t.company}-${t.role}`}
          >
            <div className="flex items-baseline gap-3 mb-space-24">
              <span className="testimonials-metric font-display text-[48px] md:text-[56px] leading-none tracking-[-0.04em] text-primary">
                {t.metric}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted max-w-[8.5rem] leading-snug">
                {t.metricLabel}
              </span>
            </div>
            <blockquote className="testimonials-quote font-display text-[20px] md:text-[22px] font-medium tracking-[-0.02em] text-text-primary leading-[1.3] pb-1 flex-1">
              “{t.quote}”
            </blockquote>
            <footer className="testimonials-footer mt-space-24 pt-space-16 flex items-center gap-3">
              <div className="testimonials-avatar" aria-hidden="true">
                {t.initials}
              </div>
              <div>
                <span className="text-[14px] font-semibold text-text-primary block">{t.role}</span>
                <span className="text-[12px] font-mono text-text-muted">{t.company}</span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

const PROD_GAP_HARD = [
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

function ProductionizationGap() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathSvgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.28 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!drawn) return;
    const svg = pathSvgRef.current;
    if (!svg) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setTimeout(() => {
      svg.querySelectorAll("animateMotion").forEach((node) => {
        const anim = node as SVGAnimateMotionElement;
        try {
          anim.beginElement();
        } catch {
          /* ignore */
        }
      });
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [drawn]);

  return (
    <section
      className={`prod-gap w-full border-y border-white/10${drawn ? " is-drawn" : ""}`}
      id="productionization"
      ref={sectionRef}
    >
      <div aria-hidden className="prod-gap-sky" />
      <div aria-hidden className="prod-gap-terrain">
        <svg className="prod-gap-terrain-svg" preserveAspectRatio="xMidYMax slice" viewBox="0 0 1600 900">
          <defs>
            <linearGradient id="pg-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="42%" stopColor="#141414" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="pg-far" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2a2a2a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#141414" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="pg-mid" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="pg-near" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#161616" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <radialGradient cx="50%" cy="62%" id="pg-mist" r="58%">
              <stop offset="0%" stopColor="rgb(255 255 255 / 0.05)" />
              <stop offset="55%" stopColor="rgb(255 255 255 / 0.02)" />
              <stop offset="100%" stopColor="rgb(0 0 0 / 0)" />
            </radialGradient>
          </defs>
          <rect fill="url(#pg-sky)" height="900" width="1600" />
          <path d="M0 430 C120 390 210 410 300 360 C420 290 510 330 620 280 C760 210 880 270 980 240 C1120 200 1240 250 1360 220 C1460 195 1540 230 1600 210 L1600 900 L0 900 Z" fill="url(#pg-far)" />
          <path d="M0 560 C140 500 250 540 360 470 C500 380 620 450 760 400 C900 350 1020 430 1160 390 C1300 350 1440 420 1600 380 L1600 900 L0 900 Z" fill="url(#pg-mid)" />
          <path d="M0 690 C180 640 320 700 480 650 C680 580 820 680 1000 640 C1180 600 1360 690 1600 650 L1600 900 L0 900 Z" fill="url(#pg-near)" />
          <ellipse cx="800" cy="620" fill="url(#pg-mist)" rx="720" ry="220" />
        </svg>
      </div>

      <div className="prod-gap-inner max-w-container-max mx-auto page-pad">
        <header className="prod-gap-header">
          <span className="prod-gap-kicker">— The Productionization Gap —</span>
          <h2 className="prod-gap-title">
            Your agent is built.{" "}
            <em className="font-editorial-italic">Now comes the hard part.</em>
          </h2>
          <p className="prod-gap-lede">
            Between a working prototype and a production agent lies a valley of death. Most projects never cross it. Lyzr builds the bridge.
          </p>
          <div className="prod-gap-stat" role="group" aria-label="Industry reality">
            <span className="prod-gap-stat-value">~70%</span>
            <span className="prod-gap-stat-copy">
              of enterprise AI pilots stall before production — not for model quality, but for everything around the model.
            </span>
          </div>
        </header>

        <div className="prod-gap-diagram" aria-label="Prototype to production journey">
          <svg
            aria-hidden
            className="prod-gap-path"
            fill="none"
            ref={pathSvgRef}
            viewBox="0 0 1200 360"
          >
            <defs>
              <linearGradient id="pg-bridge-glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(255 255 255 / 0)" />
                <stop offset="40%" stopColor="rgb(255 255 255 / 0.06)" />
                <stop offset="100%" stopColor="rgb(255 255 255 / 0)" />
              </linearGradient>
              <filter id="pg-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              className="prod-gap-valley-fill"
              d="M470 250 L492 272 L512 244 L534 286 L556 248 L578 298 L600 254 L622 304 L644 260 L666 288 L690 250 L690 340 L470 340 Z"
              fill="url(#pg-bridge-glow)"
            />

            <path
              className="prod-gap-path-safe prod-gap-draw prod-gap-draw--1"
              d="M80 72 C200 72, 260 72, 320 110 C390 156, 430 210, 470 250"
              pathLength={1}
              strokeLinecap="round"
              strokeWidth="3.25"
            />
            <path
              className="prod-gap-path-danger prod-gap-draw prod-gap-draw--2"
              d="M470 250 L492 272 L512 244 L534 286 L556 248 L578 298 L600 254 L622 304 L644 260 L666 288 L690 250"
              pathLength={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.25"
            />
            <path
              className="prod-gap-path-safe prod-gap-draw prod-gap-draw--3"
              d="M690 250 C730 210, 770 156, 840 110 C900 72, 960 72, 1120 72"
              pathLength={1}
              strokeLinecap="round"
              strokeWidth="3.25"
            />

            <path
              className="prod-gap-bridge prod-gap-draw prod-gap-draw--bridge"
              d="M470 250 C520 168, 640 168, 690 250"
              pathLength={1}
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              className="prod-gap-bridge-dash"
              d="M470 250 C520 168, 640 168, 690 250"
              pathLength={1}
              strokeDasharray="4 7"
              strokeLinecap="round"
              strokeWidth="1.25"
            />

            <path
              id="pg-traveler-path"
              d="M80 72 C200 72, 260 72, 320 110 C390 156, 430 210, 470 250 L492 272 L512 244 L534 286 L556 248 L578 298 L600 254 L622 304 L644 260 L666 288 L690 250 C730 210, 770 156, 840 110 C900 72, 960 72, 1120 72"
              fill="none"
              stroke="none"
            />

            <circle className="prod-gap-node prod-gap-node--start" cx="80" cy="72" r="7" />
            <circle className="prod-gap-node prod-gap-node--end" cx="1120" cy="72" r="7" />

            <g className="prod-gap-traveler">
              <circle fill="#f7f7f5" r="5.5">
                <animateMotion calcMode="linear" dur="5.5s" fill="freeze" begin="indefinite">
                  <mpath href="#pg-traveler-path" />
                </animateMotion>
              </circle>
              <circle fill="rgb(247 247 245 / 0.18)" r="11">
                <animateMotion calcMode="linear" dur="5.5s" fill="freeze" begin="indefinite">
                  <mpath href="#pg-traveler-path" />
                </animateMotion>
              </circle>
            </g>
          </svg>

          <div className="prod-gap-bridge-badge" aria-hidden>
            <span className="prod-gap-bridge-badge-label">Lyzr bridge</span>
          </div>

          <div className="prod-gap-death-callout">
            <span className="prod-gap-death-arrow" aria-hidden>
              ↓
            </span>
            <span className="prod-gap-death-label">Where most enterprise projects die</span>
          </div>

          <div className="prod-gap-tops">
            <div className="prod-gap-top prod-gap-top--start">
              <span className="prod-gap-col-eyebrow">Where you start</span>
              <h3 className="prod-gap-col-title">Prototype Ready</h3>
              <p className="prod-gap-col-meta">Agent built · LLM calls responding · Demo shipped</p>
            </div>
            <div className="prod-gap-top prod-gap-top--end">
              <span className="prod-gap-col-eyebrow">Where you need to be</span>
              <h3 className="prod-gap-col-title">Agent in Production</h3>
              <p className="prod-gap-col-meta">Monitored · Governed · Generating real ROI</p>
            </div>
          </div>

          <div className="prod-gap-bottoms">
            <div className="prod-gap-bottom prod-gap-bottom--easy">
              <span className="prod-gap-col-block-title">The Easy Part</span>
              <ul className="prod-gap-list">
                <li>Demo works in testing</li>
                <li>Stakeholders impressed</li>
                <li>Budget approved</li>
                <li>POC shipped quickly</li>
              </ul>
            </div>
            <div className="prod-gap-bottom prod-gap-bottom--hard">
              <div className="prod-gap-hard-head">
                <span className="prod-gap-col-block-title prod-gap-col-block-title--hard">The Hard Part</span>
                <span className="prod-gap-hard-hint">Hover to see how Lyzr closes each gap</span>
              </div>
              <ul className="prod-gap-reveals">
                {PROD_GAP_HARD.map((item) => (
                  <li className="prod-gap-reveal" key={item.problem} tabIndex={0}>
                    <span className="prod-gap-reveal-problem">{item.problem}</span>
                    <span className="prod-gap-reveal-fix">
                      <span className="prod-gap-reveal-fix-kicker">Lyzr closes it</span>
                      {item.fix}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="prod-gap-bottom prod-gap-bottom--ready">
              <span className="prod-gap-col-block-title">Production-Ready</span>
              <ul className="prod-gap-list">
                <li>Monitored &amp; observable 24/7</li>
                <li>Governed with full audit trail</li>
                <li>Simulation-tested at scale</li>
                <li>Model-agnostic &amp; resilient</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="prod-gap-bridge-cta">
          <p className="prod-gap-bridge-cta-copy">
            Most platforms stop at the demo.{" "}
            <em className="font-editorial-italic">Lyzr ships you across the valley.</em>
          </p>
          <a className="prod-gap-bridge-cta-btn" href="https://www.lyzr.ai/book-demo/" {...NAV_EXT}>
            Cross the gap with Lyzr
            <span className="material-symbols-outlined text-[16px]" aria-hidden>
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function LyzrLanding() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const [isDev, setIsDev] = useState(false);
  const [agentCount, setAgentCount] = useState(1240);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "done" | "error">("idle");
  const [navSolid, setNavSolid] = useState(false);
  const [openNav, setOpenNav] = useState<NavMenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<NavMenuId | null>(null);
  const [activeAdlc, setActiveAdlc] = useState<(typeof ADLC_STAGES)[number]["id"]>("design");
  const [activeModel, setActiveModel] = useState<(typeof OPERATING_MODELS)[number]["id"]>("foundation");
  const [activeWorkforce, setActiveWorkforce] = useState<(typeof WORKFORCE_AGENTS)[number]["id"]>("jeff");
  const [voiceDemoOn, setVoiceDemoOn] = useState(false);
  const navCloseTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const activeAgent = WORKFORCE_AGENTS.find((a) => a.id === activeWorkforce) ?? WORKFORCE_AGENTS[0];

  const closeMobileNav = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  const toggleMobileSection = (id: NavMenuId) => {
    setMobileSection((prev) => (prev === id ? null : id));
  };

  const stopAgentVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceDemoOn(false);
  };

  const playAgentVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (voiceDemoOn) {
      stopAgentVoice();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeAgent.voiceScript);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    utterance.onend = () => setVoiceDemoOn(false);
    utterance.onerror = () => setVoiceDemoOn(false);

    let started = false;
    const speak = () => {
      if (started) return;
      started = true;
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /en(-|_)?(US|GB|IN)?/i.test(v.lang) && /female|samantha|karen|moira|zira/i.test(v.name)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
        null;
      if (preferred) utterance.voice = preferred;
      setVoiceDemoOn(true);
      window.speechSynthesis.speak(utterance);
      window.setTimeout(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 40);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", speak, { once: true });
      window.setTimeout(speak, 300);
    } else {
      speak();
    }
  };

  const selectWorkforceAgent = (id: (typeof WORKFORCE_AGENTS)[number]["id"]) => {
    if (id !== activeWorkforce) stopAgentVoice();
    setActiveWorkforce(id);
  };

  const renderWorkforceFeatured = (variant: "desktop" | "mobile") => (
    <div
      className={`workforce-featured bg-surface-card workforce-featured--${variant}`}
      key={`${variant}-${activeAgent.id}`}
      id={variant === "mobile" ? `workforce-agent-${activeAgent.id}` : undefined}
    >
      {variant === "desktop" ? (
        <div className="workforce-portrait-wrap">
          <img
            alt={`${activeAgent.name} — Lyzr agent`}
            className="workforce-portrait"
            src={activeAgent.image}
            width={480}
            height={600}
            decoding="async"
          />
          {activeAgent.voice ? (
            <span className="workforce-portrait-live">
              <span className="workforce-voice-pill-dot" aria-hidden="true" />
              Voice
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="workforce-featured-body">
        <div className="workforce-featured-top">
          {variant === "desktop" ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[22px] font-semibold text-text-primary tracking-tight">{activeAgent.name}</h3>
                  {activeAgent.voice ? (
                    <span className="workforce-badge workforce-badge--voice">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                        graphic_eq
                      </span>
                      Voice ready
                    </span>
                  ) : (
                    <span className="workforce-badge">Text &amp; tools</span>
                  )}
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted mt-1 block">
                  {activeAgent.dept}
                </span>
              </div>
              <span className="workforce-featured-metric">{activeAgent.metric}</span>
            </div>
          ) : (
            <div className="workforce-expand-meta">
              {activeAgent.voice ? (
                <span className="workforce-badge workforce-badge--voice">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                    graphic_eq
                  </span>
                  Voice ready
                </span>
              ) : (
                <span className="workforce-badge">Text &amp; tools</span>
              )}
              <span className="workforce-featured-metric workforce-featured-metric--compact">{activeAgent.metric}</span>
            </div>
          )}
          <p className="text-[15px] text-text-secondary leading-relaxed mt-space-16 max-w-[48ch]">
            {activeAgent.blurb}
          </p>
        </div>

        {activeAgent.voice ? (
          <div className={`workforce-voice-panel${voiceDemoOn ? " is-live" : ""}`}>
            <div className="workforce-wave" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
            <div className="workforce-voice-meta">
              <p className="workforce-voice-line">{activeAgent.voiceLine}</p>
              <p className="workforce-voice-stack">
                {voiceDemoOn ? `Playing ${activeAgent.name}…` : "Tap play to hear this agent"}
              </p>
            </div>
            <button
              type="button"
              className={`workforce-mic${voiceDemoOn ? " is-on" : ""}`}
              aria-pressed={voiceDemoOn}
              aria-label={voiceDemoOn ? `Stop ${activeAgent.name}` : `Play ${activeAgent.name}`}
              onClick={playAgentVoice}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                {voiceDemoOn ? "stop" : "play_arrow"}
              </span>
              <span className="sr-only">
                {voiceDemoOn ? `Stop ${activeAgent.name}` : `Play ${activeAgent.name}`}
              </span>
            </button>
          </div>
        ) : (
          <div className={`workforce-voice-panel workforce-voice-panel--quiet${voiceDemoOn ? " is-live" : ""}`}>
            <button
              type="button"
              className={`workforce-mic workforce-mic--light${voiceDemoOn ? " is-on" : ""}`}
              onClick={playAgentVoice}
              aria-pressed={voiceDemoOn}
              aria-label={voiceDemoOn ? `Stop ${activeAgent.name}` : `Play ${activeAgent.name}`}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                {voiceDemoOn ? "stop" : "play_arrow"}
              </span>
            </button>
            <div>
              <p className="text-[13.5px] text-text-primary font-medium leading-snug">{activeAgent.voiceLine}</p>
              <p className="text-[12px] font-mono text-text-muted mt-1.5">
                {voiceDemoOn ? `Playing ${activeAgent.name}…` : "Preview intro · enable Voice Agent anytime in Studio"}
              </p>
            </div>
          </div>
        )}

        <div className="workforce-featured-foot">
          <div className="flex flex-wrap gap-2">
            {activeAgent.channels.map((ch) => (
              <span key={ch} className="workforce-channel">
                {ch}
              </span>
            ))}
          </div>
          <a className="workforce-cta" href={activeAgent.href} {...NAV_EXT}>
            Meet {activeAgent.name}
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              arrow_outward
            </span>
          </a>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    stopAgentVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stop prior agent audio when selection changes
  }, [activeWorkforce]);

  const openNavMenu = (id: NavMenuId) => {
    if (navCloseTimer.current != null) {
      window.clearTimeout(navCloseTimer.current);
      navCloseTimer.current = null;
    }
    setOpenNav(id);
  };

  const scheduleCloseNav = () => {
    if (navCloseTimer.current != null) window.clearTimeout(navCloseTimer.current);
    navCloseTimer.current = window.setTimeout(() => setOpenNav(null), 140);
  };

  useEffect(() => {
    return () => {
      if (navCloseTimer.current != null) window.clearTimeout(navCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > 72;
      setNavSolid((prev) => (prev === next ? prev : next));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const syncHeroOffset = () => {
      const header = headerRef.current;
      if (!header) return;
      const h = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--hero-offset", `${h + 16}px`);
    };
    syncHeroOffset();
    window.addEventListener("resize", syncHeroOffset);
    return () => window.removeEventListener("resize", syncHeroOffset);
  }, [bannerOpen, mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) closeMobileNav();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-nav-locked", mobileOpen);
    return () => document.body.classList.remove("is-nav-locked");
  }, [mobileOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    let targetX = 0.5;
    let targetY = 0.28;
    let currentX = targetX;
    let currentY = targetY;

    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetX = (event.clientX - rect.left) / rect.width;
      targetY = (event.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      hero.style.setProperty("--spot-x", `${(currentX * 100).toFixed(3)}%`);
      hero.style.setProperty("--spot-y", `${(currentY * 100).toFixed(3)}%`);
      frame = requestAnimationFrame(tick);
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const target = 1287;
    const start = 1240;
    const duration = 1800;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAgentCount(Math.round(start + (target - start) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const drift = window.setInterval(() => {
      setAgentCount((n) => n + (Math.random() > 0.55 ? 1 : 0));
    }, 2200);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(drift);
    };
  }, []);

  return (
    <div className="bg-surface-canvas font-sans text-text-primary antialiased selection:bg-primary selection:text-on-primary">

{/* 1. ANNOUNCEMENT + TASTE-STYLE FLOATING PILL NAV */}
<header className="fixed top-0 w-full z-50 pointer-events-none" ref={headerRef}>
{bannerOpen && (
<div className="pointer-events-auto relative bg-ink-banner site-announce text-center text-on-primary/90 tracking-tight">
<span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 pr-1">
<span className="site-announce-copy">New: Lyzr Control Plane — govern every agent across AWS, Azure, and LangChain.</span>
<span className="site-announce-copy-short">New: Lyzr Control Plane is live.</span>
<a className="font-medium text-on-primary underline underline-offset-2 hover:text-on-primary/70 transition-colors" href="#control-plane" onClick={closeMobileNav}>
          Learn more
        </a>
</span>
<button
  aria-label="Dismiss announcement"
  className="absolute right-2 top-1/2 -translate-y-1/2 text-on-primary/50 hover:text-on-primary transition-colors p-1.5"
  onClick={() => setBannerOpen(false)}
  type="button"
>
<span className="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
)}
<div className="pointer-events-none px-3 sm:px-5 pt-3 pb-2">
<div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3">
{/* Brand */}
<a
  aria-label="Lyzr home"
  className={`nav-chrome pointer-events-auto inline-flex items-center h-11 ${navSolid ? "is-solid px-3.5" : "px-1"}`}
  href="#"
  onClick={closeMobileNav}
>
<img
  alt=""
  className="h-7 w-auto"
  src="/lyzr-logo.png"
/>
</a>

{/* Nav + CTA */}
<div
  className={`nav-chrome pointer-events-auto hidden lg:flex items-center h-11 overflow-visible ${navSolid ? "is-solid pl-1 pr-1.5" : ""}`}
>
<nav className="hidden lg:flex items-center h-full px-1">
{/* Solutions */}
<div
  className={`nav-item relative h-full flex items-center${openNav === "solutions" ? " is-open" : ""}`}
  onMouseEnter={() => openNavMenu("solutions")}
  onMouseLeave={scheduleCloseNav}
>
<button
  aria-expanded={openNav === "solutions"}
  className={`nav-trigger${openNav === "solutions" ? " is-active" : ""}`}
  onClick={() => openNavMenu("solutions")}
  onFocus={() => openNavMenu("solutions")}
  type="button"
>
              Solutions
              <NavChevron open={openNav === "solutions"} />
</button>
<div className="nav-mega nav-mega--solutions" role="menu">
<div className="nav-mega-panel">
<div className="nav-mega-body">
<div className="nav-mega-cols">
<div>
<NavDropLabel>By Industry</NavDropLabel>
{NAV_SOLUTIONS.industry.map((item) => (
  <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
))}
</div>
<div>
<NavDropLabel>By Function</NavDropLabel>
{NAV_SOLUTIONS.function.map((item) => (
  <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
))}
</div>
<div>
<NavDropLabel>By Team</NavDropLabel>
{NAV_SOLUTIONS.team.map((item) => (
  <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
))}
</div>
</div>
<aside className="nav-mega-aside">
<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-hint">Spotlight</span>
<a className="nav-spotlight group/link" href="https://www.lyzr.ai/control-plane/" {...NAV_EXT}>
<span className="nav-spotlight-kicker">New</span>
<span className="nav-spotlight-title">Control Plane</span>
<span className="nav-spotlight-copy">Govern every agent across AWS, Azure, and LangChain — one policy layer.</span>
<span className="nav-spotlight-cta">
                    Explore Control Plane
                    <svg aria-hidden className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
<path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
</svg>
</span>
</a>
<div className="nav-role-row">
<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-hint shrink-0">By role</span>
<div className="flex flex-wrap gap-1.5">
{NAV_SOLUTIONS.role.map((item) => (
  <a className="nav-role-chip" href={item.href} key={item.name} {...NAV_EXT}>
    {item.name}
  </a>
))}
</div>
</div>
</aside>
</div>
<div className="nav-mega-footer">
<span className="text-[12.5px] text-ink-quiet">Agents shaped for your industry, function, and team.</span>
<NavFooterLink href="https://www.lyzr.ai/usecases/">View all solutions</NavFooterLink>
</div>
</div>
</div>
</div>

{/* Platform */}
<div
  className={`nav-item relative h-full flex items-center${openNav === "platform" ? " is-open" : ""}`}
  onMouseEnter={() => openNavMenu("platform")}
  onMouseLeave={scheduleCloseNav}
>
<button
  aria-expanded={openNav === "platform"}
  className={`nav-trigger${openNav === "platform" ? " is-active" : ""}`}
  onClick={() => openNavMenu("platform")}
  onFocus={() => openNavMenu("platform")}
  type="button"
>
              Platform
              <NavChevron open={openNav === "platform"} />
</button>
<div className="nav-mega nav-mega--platform" role="menu">
<div className="nav-mega-panel">
<div className="nav-mega-body nav-mega-body--platform">
<div>
<NavDropLabel>Products</NavDropLabel>
<div className="grid grid-cols-2 gap-1">
{NAV_PLATFORM.products.map((item) => (
  <NavProductCard
    key={item.name}
    href={item.href}
    icon={item.icon}
    name={item.name}
    sub={item.sub}
    tag={item.tag}
  />
))}
</div>
</div>
<div className="nav-mega-rail">
<div>
<NavDropLabel>Modules</NavDropLabel>
{NAV_PLATFORM.modules.map((item) => (
  <NavSimpleLink key={item.name} href={item.href} icon={item.icon} name={item.name} />
))}
</div>
<div className="mt-4 pt-4 border-t border-hairline">
<NavDropLabel>Open Source &amp; Dev</NavDropLabel>
{NAV_PLATFORM.openSource.map((item) => (
  <NavSimpleLink key={item.name} href={item.href} name={item.name} tag={item.tag} />
))}
</div>
</div>
</div>
<div className="nav-mega-footer">
<span className="text-[12.5px] text-ink-quiet">Build in Studio. Govern in Control Plane. Ship on Agentic OS.</span>
<NavFooterLink href="https://studio.lyzr.ai/">Open Agent Studio</NavFooterLink>
</div>
</div>
</div>
</div>

<a className="nav-trigger" href="https://www.lyzr.ai/customers/" {...NAV_EXT}>
              Customers
            </a>
<a className="nav-trigger" href="https://www.lyzr.ai/pricing/" {...NAV_EXT}>
              Pricing
            </a>

{/* Partners */}
<div
  className={`nav-item relative h-full flex items-center${openNav === "partners" ? " is-open" : ""}`}
  onMouseEnter={() => openNavMenu("partners")}
  onMouseLeave={scheduleCloseNav}
>
<button
  aria-expanded={openNav === "partners"}
  className={`nav-trigger${openNav === "partners" ? " is-active" : ""}`}
  onClick={() => openNavMenu("partners")}
  onFocus={() => openNavMenu("partners")}
  type="button"
>
              Partners
              <NavChevron open={openNav === "partners"} />
</button>
<div className="nav-mega nav-mega--partners" role="menu">
<div className="nav-mega-panel">
<div className="nav-mega-body nav-mega-body--partners">
<div>
<NavDropLabel>Technology</NavDropLabel>
<div className="grid grid-cols-2 gap-2">
{NAV_PARTNERS.technology.map((item) => {
  const inner = (
    <>
      <span className="nav-partner-logo">
        <img alt="" className="h-5 w-auto max-w-[72px] object-contain" src={item.logo} />
      </span>
      <span className="text-[12.5px] font-medium text-ink tracking-tight">{item.name}</span>
    </>
  );
  return item.href ? (
    <a className="nav-partner-tile group/link" href={item.href} key={item.name} {...NAV_EXT}>
      {inner}
    </a>
  ) : (
    <div aria-disabled="true" className="nav-partner-tile is-disabled" key={item.name}>
      {inner}
    </div>
  );
})}
</div>
</div>
<div>
<NavDropLabel>Ecosystem</NavDropLabel>
{NAV_PARTNERS.ecosystem.map((item) => (
  <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
))}
<a className="nav-spotlight nav-spotlight--compact group/link mt-3" href="https://www.lyzr.ai/partners/" {...NAV_EXT}>
<span className="nav-spotlight-title">Become a partner</span>
<span className="nav-spotlight-copy">Co-sell, co-build, and marketplace routes with Lyzr.</span>
<span className="nav-spotlight-cta">
                    Join the program
                    <svg aria-hidden className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
<path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
</svg>
</span>
</a>
</div>
</div>
</div>
</div>
</div>

{/* Resources */}
<div
  className={`nav-item relative h-full flex items-center${openNav === "resources" ? " is-open" : ""}`}
  onMouseEnter={() => openNavMenu("resources")}
  onMouseLeave={scheduleCloseNav}
>
<button
  aria-expanded={openNav === "resources"}
  className={`nav-trigger${openNav === "resources" ? " is-active" : ""}`}
  onClick={() => openNavMenu("resources")}
  onFocus={() => openNavMenu("resources")}
  type="button"
>
              Resources
              <NavChevron open={openNav === "resources"} />
</button>
<div className="nav-mega nav-mega--resources" role="menu">
<div className="nav-mega-panel">
<div className="nav-mega-body">
<div className="nav-mega-cols nav-mega-cols--3">
<div>
<NavDropLabel>Learn</NavDropLabel>
{NAV_RESOURCES.learn.map((item) => (
  <NavSimpleLink key={item.name} href={item.href} icon={item.icon} name={item.name} />
))}
</div>
<div>
<NavDropLabel>Playbooks &amp; Templates</NavDropLabel>
{NAV_RESOURCES.playbooks.map((item) => (
  <NavSimpleLink key={item.name} href={item.href} name={item.name} />
))}
</div>
<div>
<NavDropLabel>Analyze</NavDropLabel>
{NAV_RESOURCES.analyze.map((item) => (
  <NavSimpleLink key={item.name} href={item.href} icon={item.icon} name={item.name} />
))}
</div>
</div>
<aside className="nav-mega-aside">
<NavDropLabel>Featured</NavDropLabel>
<div className="flex flex-col gap-2">
{NAV_RESOURCES.featured.map((item) => (
  <a
    className={`nav-featured-card group/link${item.tone === "volt" ? " is-volt" : ""}`}
    href={item.href}
    key={item.title}
    {...NAV_EXT}
  >
    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{item.label}</span>
    <span className="mt-1.5 block text-[13px] font-medium text-ink leading-snug tracking-tight">{item.title}</span>
    <span className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-ink-soft">
                      Read story
                      <svg aria-hidden className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
<path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
</svg>
</span>
  </a>
))}
</div>
<div className="mt-3 pt-3 border-t border-hairline">
<NavDropLabel>Connect</NavDropLabel>
{NAV_RESOURCES.connect.map((item) => (
  <NavSimpleLink key={item.name} href={item.href} name={item.name} />
))}
</div>
</aside>
</div>
<div className="nav-mega-footer">
<span className="text-[12.5px] text-ink-quiet">Playbooks, assessments, and proof from production.</span>
<NavFooterLink href="https://www.lyzr.ai/blog/">Browse the blog</NavFooterLink>
</div>
</div>
</div>
</div>
</nav>
<div className="nr">
<a className="bsi" href="https://studio.lyzr.ai/" {...NAV_EXT}>
              Agent Studio
              <svg aria-hidden className="bsi-arrow" fill="none" height="12" viewBox="0 0 12 12" width="12">
<path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
</svg>
</a>
<a
  className="ml-0.5 inline-flex items-center gap-2 h-8 pl-3 pr-3.5 rounded-full btn-brand text-[13px] font-semibold active:scale-[0.98] transition-all"
  href="#get-started"
>
              Get started
            </a>
</div>
</div>

{/* Mobile / tablet actions */}
<div className="mobile-nav-actions pointer-events-auto flex lg:hidden items-center gap-2">
<a
  className="inline-flex items-center h-11 px-4 rounded-full btn-brand text-[13px] font-semibold shadow-mobile-cta"
  href="#get-started"
  onClick={closeMobileNav}
>
            Get started
          </a>
<button
  aria-controls="mobile-nav"
  aria-expanded={mobileOpen}
  aria-label={mobileOpen ? "Close menu" : "Open menu"}
  className="mobile-nav-btn"
  onClick={() => setMobileOpen((v) => !v)}
  type="button"
>
<span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              {mobileOpen ? "close" : "menu"}
            </span>
</button>
</div>
</div>
</div>

{mobileOpen ? (
<div className="mobile-nav pointer-events-auto" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site navigation">
<div className="mobile-nav-bar">
<a aria-label="Lyzr home" className="inline-flex items-center h-11 px-1" href="#" onClick={closeMobileNav}>
<img alt="" className="h-7 w-auto" src="/lyzr-logo.png" />
</a>
<button aria-label="Close menu" className="mobile-nav-btn" onClick={closeMobileNav} type="button">
<span className="material-symbols-outlined text-[22px]" aria-hidden="true">close</span>
</button>
</div>
<div className="mobile-nav-scroll">
<div className="mobile-nav-group">
<button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("solutions")} type="button">
                Solutions
                <NavChevron open={mobileSection === "solutions"} />
</button>
{mobileSection === "solutions" ? (
<div className="mobile-nav-group-panel">
{[...NAV_SOLUTIONS.industry, ...NAV_SOLUTIONS.function, ...NAV_SOLUTIONS.team].map((item) => (
  <a className="mobile-nav-sublink" href={item.href} key={`sol-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
    {item.name}
  </a>
))}
</div>
) : null}
</div>

<div className="mobile-nav-group">
<button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("platform")} type="button">
                Platform
                <NavChevron open={mobileSection === "platform"} />
</button>
{mobileSection === "platform" ? (
<div className="mobile-nav-group-panel">
{[...NAV_PLATFORM.products, ...NAV_PLATFORM.modules]
  .filter((item) => Boolean(item.href))
  .map((item) => (
  <a className="mobile-nav-sublink" href={item.href!} key={`plat-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
    {item.name}
  </a>
))}
</div>
) : null}
</div>

<a className="mobile-nav-link" href="https://www.lyzr.ai/customers/" onClick={closeMobileNav} {...NAV_EXT}>
              Customers
            </a>
<a className="mobile-nav-link" href="https://www.lyzr.ai/pricing/" onClick={closeMobileNav} {...NAV_EXT}>
              Pricing
            </a>

<div className="mobile-nav-group">
<button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("partners")} type="button">
                Partners
                <NavChevron open={mobileSection === "partners"} />
</button>
{mobileSection === "partners" ? (
<div className="mobile-nav-group-panel">
{NAV_PARTNERS.ecosystem.map((item) => (
  <a className="mobile-nav-sublink" href={item.href} key={`par-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
    {item.name}
  </a>
))}
</div>
) : null}
</div>

<div className="mobile-nav-group">
<button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("resources")} type="button">
                Resources
                <NavChevron open={mobileSection === "resources"} />
</button>
{mobileSection === "resources" ? (
<div className="mobile-nav-group-panel">
{[...NAV_RESOURCES.learn, ...NAV_RESOURCES.playbooks, ...NAV_RESOURCES.analyze].map((item) => (
  <a className="mobile-nav-sublink" href={item.href} key={`res-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
    {item.name}
  </a>
))}
</div>
) : null}
</div>

<div className="mobile-nav-cta-row">
<a className="mobile-nav-cta mobile-nav-cta--primary" href="#get-started" onClick={closeMobileNav}>
                Get started
              </a>
<a className="mobile-nav-cta mobile-nav-cta--ghost" href="https://studio.lyzr.ai/" onClick={closeMobileNav} {...NAV_EXT}>
                Open Agent Studio
              </a>
</div>
</div>
</div>
) : null}
</header>
<main className="w-full">
{/* 2. HERO — Ramp-style layout */}
<section className="hero-atmosphere relative w-full border-b border-hero-line" ref={heroRef}>
<div aria-hidden className="hero-atmosphere-glow pointer-events-none absolute inset-0" />
<div aria-hidden className="hero-cursor-spot pointer-events-none absolute inset-0" />
<div className="relative z-10 max-w-container-max mx-auto page-pad pb-5 md:pb-6 flex flex-col items-start text-left hero-offset">
<button
  aria-checked={isDev}
  className="hero-animate-1 mb-4 sm:mb-5 inline-flex items-center gap-3"
  onClick={() => setIsDev((v) => !v)}
  role="switch"
  type="button"
>
<span className={`dev-switch${isDev ? " is-on" : ""}`} aria-hidden>
<span className="dev-switch-thumb" />
</span>
<span className="text-[14px] font-medium tracking-tight text-ink-soft">I&apos;m a Developer</span>
</button>
{isDev ? (
<>
<p className="hero-animate-1 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.08em] text-primary mb-2">
          Agent infrastructure
</p>
<h1 className="hero-animate-1 font-display display-h1 font-semibold text-ink max-w-[18ch] mb-4 pb-0.5">
          The full stack for{" "}
<em className="font-editorial-italic text-[1.05em] leading-[1.1] text-ink">agent productionization.</em>
</h1>
<p className="hero-animate-2 text-[15px] sm:text-[16px] md:text-[18px] text-ink-muted max-w-[34rem] leading-relaxed">
          The control plane your enterprise AI operation has been missing. Agents on AWS, Azure, LangChain, or anywhere else, governed from one plane.
</p>
</>
) : (
<>
<p className="hero-animate-1 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
          Agents in production on Lyzr:{" "}
<span className="tabular-nums text-ink font-semibold">{formatAgentCount(agentCount)}</span>
</p>
<h1 className="hero-animate-1 font-display display-h1 font-semibold text-ink mb-4">
          <span className="block lg:whitespace-nowrap">Take your AI agents</span>
          <span className="block lg:whitespace-nowrap">to production, faster.</span>
</h1>
<p className="hero-animate-2 text-[15px] sm:text-[16px] md:text-[18px] text-ink-muted max-w-[34rem] leading-relaxed">
          Build, govern, and run agents on AWS, Azure, LangChain, or anywhere from one control plane.
</p>
</>
)}

<div className="hero-animate-2 mt-6 hero-actions">
  <a
    className="inline-flex items-center justify-center h-11 px-5 rounded-full btn-brand text-[13.5px] font-semibold tracking-tight shadow-sm active:scale-[0.98] transition-all"
    href="#get-started"
  >
            Get started
  </a>
  <a
    className="hero-cta-secondary inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full text-[13.5px] font-semibold tracking-tight text-ink"
    href="https://www.lyzr.ai/book-demo/"
    rel="noopener noreferrer"
    target="_blank"
  >
            Book a demo
    <svg aria-hidden className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 12 12">
      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  </a>
</div>

<div className="hero-animate-2 mt-5 flex flex-col gap-3">
<ul className="hero-proof flex flex-wrap items-center gap-x-0 gap-y-1.5 list-none p-0 m-0">
  {["SOC 2 Type II", "VPC-native", "BYOK encryption", "8-week SLA"].map((item, i) => (
    <li className="hero-proof-item flex items-center text-[12px] text-ink-soft" key={item}>
      {i > 0 ? <span aria-hidden className="hero-proof-dot" /> : null}
      <span className="inline-flex items-center gap-1.5">
        <svg aria-hidden className="h-3 w-3 text-primary shrink-0" fill="none" viewBox="0 0 12 12">
          <path d="M2.5 6.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </svg>
        {item}
      </span>
    </li>
  ))}
</ul>

<div className="flex flex-wrap items-center gap-2">
  {["AWS", "Azure", "GCP", "LangChain", "CrewAI"].map((stack) => (
    <span className="hero-stack-chip" key={stack}>
      {stack}
    </span>
  ))}
</div>
</div>
</div>

<div className="hero-animate-3 relative z-10 w-full max-w-[1100px] mx-auto page-pad mt-2 md:mt-3 pb-0">
<div className="relative w-full overflow-hidden rounded-t-xl border border-b-0 border-hero-frame bg-ink shadow-video aspect-[16/9]">
<video
  autoPlay
  className="absolute inset-0 h-full w-full object-cover object-top"
  loop
  muted
  playsInline
  preload="metadata"
>
<source src="https://www.lyzr.ai/wp-content/uploads/2026/05/One-Studio.-Infinite-Possibilities.mp4" type="video/mp4" />
</video>
<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hero-canvas/40 via-transparent to-black/20" />

<div className="pointer-events-none absolute top-3.5 left-3.5 sm:top-5 sm:left-5">
  <span className="hero-live-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
    <span aria-hidden className="hero-live-dot" />
            Studio live
  </span>
</div>

<div className="pointer-events-none absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-end justify-between gap-3">
  <div className="flex flex-wrap gap-1.5">
    {["Design", "Deploy", "Govern", "Observe"].map((stage) => (
      <span className="hero-stage-chip" key={stage}>
        {stage}
      </span>
    ))}
  </div>
  <span className="hero-stage-meta hidden sm:inline-flex text-[11px] font-medium uppercase tracking-[0.1em] text-white/70">
            Agent Lifecycle
  </span>
</div>
</div>
</div>

<div className="hero-animate-4 relative z-10 border-t border-hero-rule bg-surface-card/70 backdrop-blur-sm">
<div className="overflow-hidden py-3.5">
<div className="hero-ticker-track flex w-max gap-10 px-6">
{[...HERO_TICKER, ...HERO_TICKER].map((item, i) => (
<div className="flex items-center gap-2.5 shrink-0" key={`${item.label}-${i}`}>
<span className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-faint whitespace-nowrap">
                  {item.label}
</span>
<span className="text-[12px] font-semibold tabular-nums text-ink whitespace-nowrap">
                  {item.value}
</span>
</div>
))}
</div>
</div>
</div>
</section>

{/* 3. LIVE CONTROL PLANE TELEMETRY */}
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

{/* 4. ENTERPRISE LOGO GRID */}
<section className="w-full border-y border-border-crisp bg-surface-canvas py-space-48 md:py-space-64">
<div className="max-w-container-max mx-auto page-pad">
<div className="max-w-3xl mb-space-32">
<h2 className="font-display display-h2 font-medium text-text-primary">
            Governing autonomous agents at the world&apos;s most ambitious{" "}
<span className="font-semibold">enterprises and financial institutions.</span>
</h2>
<p className="text-[15px] md:text-[16px] text-text-secondary mt-space-12 leading-relaxed max-w-2xl">
            From global systems integrators to regulated banks and airlines — production-grade agent fleets run on Lyzr every day.
          </p>
<a className="inline-flex items-center gap-1 text-[14px] font-medium text-text-muted hover:text-text-primary transition-colors mt-space-16" href="#testimonials">
            Read customer stories
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div className="customer-grid">
{TRUSTED_LOGOS.map((logo) => (
<LogoTile
  col={logo.col}
  href={"href" in logo ? logo.href : undefined}
  key={logo.name}
  name={logo.name}
  row={logo.row}
  src={logo.src}
/>
))}
<div className="customer-featured group text-left">
<div className="relative h-full w-full min-h-[280px] lg:min-h-0">
<div className="absolute inset-0 bg-brand-ink" />
<div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 px-6 pb-6">
<p className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                Production outcome
              </p>
<p className="text-[44px] md:text-[52px] font-semibold leading-none tracking-tight text-white">
                95%
              </p>
<p className="text-[15px] text-white/70">POC-to-production conversion</p>
</div>
</div>
<span aria-hidden>
<ArrowHint />
</span>
<a
  aria-label="Read customer stories"
  className="absolute inset-0 z-30 rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
  href="#testimonials"
/>
</div>
</div>
</div>
</section>
{/* 5. WHAT WE ARE — FIVE REASONS */}
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
<AgentStack />
{/* 6. AGENT DEVELOPMENT LIFECYCLE (ADLC) - BENTO */}
<section className="w-full bg-brand-ink border-y border-border-crisp section-y">
<div className="max-w-container-max mx-auto page-pad">
<div className="max-w-3xl mb-space-48">
<span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">End-to-End Lifecycle</span>
<h2 className="font-display display-h2 font-medium text-text-primary">
            Lyzr covers everything across the{" "}
<span className="font-editorial-italic display-em text-primary">ADLC</span>{" "}
<span className="font-editorial-italic display-em text-text-secondary">cycle.</span>
</h2>
<p className="text-[16px] text-text-secondary mt-space-12 leading-relaxed">
            From initial logic blueprint to sovereign deployment and runtime governance, manage the entire Agent Development Lifecycle seamlessly.
          </p>
</div>
<div className="adlc-bento mb-space-32">
{ADLC_STAGES.map((stage) => {
              const isActive = activeAdlc === stage.id;
              return (
<button
  aria-pressed={isActive}
  className={`adlc-card adlc-card--${stage.id}${isActive ? " is-active" : ""}`}
  key={stage.id}
  onClick={() => setActiveAdlc(stage.id)}
  onFocus={() => setActiveAdlc(stage.id)}
  type="button"
>
<div className="adlc-card-beam" aria-hidden="true" />
<div className="adlc-card-inner bg-surface-card">
<div>
<div className="flex justify-between items-center mb-space-16">
<span className="adlc-card-stage text-[12px] font-mono font-bold text-primary">STAGE {stage.stage}</span>
<span className="adlc-card-icon material-symbols-outlined text-text-muted text-[20px]" aria-hidden="true">
                      {stage.icon}
                    </span>
</div>
<h3 className="text-[20px] md:text-[22px] font-semibold text-text-primary mb-2 tracking-[-0.02em] text-left">{stage.title}</h3>
<p className="text-[13.5px] text-text-secondary leading-relaxed mb-space-16 max-w-prose text-left">
                    {stage.description}
                  </p>
</div>
<div className="adlc-card-features pt-space-12 border-t border-border-subtle space-y-1.5 text-[12px] font-mono text-text-muted text-left">
{stage.features.map((feature) => (
<div className="adlc-card-feature" key={feature}>
<span className="adlc-card-feature-dot" aria-hidden="true" />
                      {feature}
</div>
))}
</div>
</div>
</button>
              );
            })}
</div>
{/* Framework Agnostic Ticker */}
<div className="adlc-frameworks w-full flex items-center justify-between flex-wrap gap-space-12 py-space-12 px-space-16 bg-surface-card border border-border-crisp rounded-xl text-[12px] font-mono">
<span className="font-medium text-text-primary">Framework Agnostic:</span>
<span className="text-text-secondary">LangChain</span>
<span className="text-text-faint" aria-hidden="true">•</span>
<span className="text-text-secondary">CrewAI</span>
<span className="text-text-faint" aria-hidden="true">•</span>
<span className="text-text-secondary">AutoGen</span>
<span className="text-text-faint" aria-hidden="true">•</span>
<span className="text-text-secondary">LlamaIndex</span>
<span className="text-text-faint" aria-hidden="true">•</span>
<span className="text-text-secondary">Custom Stacks</span>
<span className="text-text-faint" aria-hidden="true">•</span>
<span className="text-text-secondary">Any LLM Provider</span>
<span className="text-text-faint" aria-hidden="true">•</span>
<span className="text-text-secondary">Any Cloud VPC</span>
</div>
</div>
</section>
{/* 6. THREE WAYS ENTERPRISES USE THE PLATFORM */}
<section className="w-full max-w-container-max mx-auto page-pad section-y" id="operating-models">
<div className="text-center max-w-3xl mx-auto mb-space-48">
<span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Operating Models</span>
<h2 className="font-display display-h2 font-medium text-text-primary">
          Three ways enterprises <span className="font-editorial-italic text-primary display-em">use the platform.</span>
</h2>
<p className="text-[16px] text-text-secondary mt-space-12">
          The control plane is the foundation. From there, teams select the operational footprint matching their cloud boundary and team maturity.
        </p>
</div>
<div className="om-tabs" role="tablist" aria-label="Operating models">
{OPERATING_MODELS.map((model) => {
            const isActive = activeModel === model.id;
            return (
<button
  aria-controls={`om-panel-${model.id}`}
  aria-selected={isActive}
  className={`om-tab${isActive ? " is-active" : ""}`}
  id={`om-tab-${model.id}`}
  key={model.id}
  onClick={() => setActiveModel(model.id)}
  role="tab"
  type="button"
>
<span className="om-tab-num">{model.num}</span>
<span className="om-tab-label">{model.label}</span>
</button>
            );
          })}
</div>
<div className="om-grid">
{OPERATING_MODELS.map((model) => {
            const isActive = activeModel === model.id;
            return (
<button
  aria-pressed={isActive}
  className={`om-card${isActive ? " is-active" : ""}`}
  key={model.id}
  onClick={() => setActiveModel(model.id)}
  onFocus={() => setActiveModel(model.id)}
  onMouseEnter={() => setActiveModel(model.id)}
  type="button"
>
<div className="om-card-glow" aria-hidden="true" />
<div className="om-card-body">
<div>
<div className="flex justify-between items-center mb-space-24">
<span
  className={
                          model.badge === "warm"
                            ? "text-[11px] font-mono px-2 py-1 rounded bg-badge-warm-bg border border-badge-warm-border text-badge-warm-text font-medium"
                            : "text-[11px] font-mono px-2 py-1 rounded bg-surface-subtle border border-border-crisp text-text-secondary font-medium"
                        }
>
                        {model.num} {model.label}
</span>
<span className="om-card-icon material-symbols-outlined text-primary text-[24px]" aria-hidden="true">
                        {model.icon}
                      </span>
</div>
<h3 className="text-[22px] font-semibold text-text-primary mb-3 leading-snug text-left">
                      {model.title}{" "}
<span className="font-editorial-italic text-[28px]">{model.titleEm}</span>
</h3>
<p className="text-[14px] text-text-secondary leading-relaxed mb-space-24 text-left">
                      {model.description}
                    </p>
</div>
<div className="om-card-features space-y-2 pt-space-16 border-t border-border-subtle text-[13px] text-text-primary text-left">
{model.features.map((feature) => (
<div className="om-card-feature flex items-center gap-2" key={feature}>
<span className="material-symbols-outlined text-primary text-[18px]" aria-hidden="true">
                          check_circle
                        </span>
<span>{feature}</span>
</div>
))}
</div>
</div>
</button>
            );
          })}
</div>
{(() => {
          const selected = OPERATING_MODELS.find((m) => m.id === activeModel) ?? OPERATING_MODELS[0];
          return (
<div
  aria-labelledby={`om-tab-${selected.id}`}
  className="om-detail"
  id={`om-panel-${selected.id}`}
  key={selected.id}
  role="tabpanel"
>
<div className="om-detail-meta">
<span className="om-detail-kicker">Selected model</span>
<span className="om-detail-title">
                  {selected.num} · {selected.label}
                </span>
<p className="om-detail-best">{selected.bestFor}</p>
<p className="om-detail-footprint">{selected.footprint}</p>
</div>
<a className="om-detail-cta" href="#demo">
              {selected.cta}
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                arrow_forward
              </span>
</a>
</div>
          );
        })()}
</section>
{/* 8. THE PRODUCTIONIZATION GAP — valley of death */}
<ProductionizationGap />
{/* 9. EXECUTIVE TESTIMONIALS */}
<section className="testimonials-section w-full bg-brand-ink border-y border-border-crisp section-y" id="testimonials">
<div className="max-w-container-max mx-auto page-pad">
<div className="max-w-3xl mb-space-48">
<h2 className="font-display display-h2 font-medium text-text-primary pb-1">
Why they <span className="font-editorial-italic text-primary display-em">chose Lyzr.</span>
</h2>
<p className="text-[16px] text-text-secondary mt-space-12 leading-relaxed max-w-[42ch]">
Engineering and digital leaders shipping agents past the demo into production.
</p>
</div>
<TestimonialsCarousel items={TESTIMONIALS} />
</div>
</section>
{/* 9. DEEP CASE STUDIES & REAL ENTERPRISE PROOF */}
<section className="w-full bg-surface-subtle border-b border-border-crisp section-y overflow-hidden" id="customers">
<div className="max-w-container-max mx-auto page-pad">
<div className="flex flex-col mb-space-40 max-w-3xl">
<h2 className="font-display display-h2-lg font-medium text-text-primary">
            Agents running at scale.{" "}
<span className="font-editorial-italic">Not just tech demos.</span>
</h2>
<p className="text-[15px] text-text-secondary mt-space-16 leading-relaxed max-w-2xl">
            Verified production metrics realized across corporate venture capital, actuarial retirement advisory, commercial aviation, and fintech operations.
          </p>
</div>
<CaseStudiesCarousel items={CASE_STUDIES} />
</div>
</section>
<TrustSection />
{/* 10. FOUNDER'S VISION & OPERATING MANIFESTO */}
<section className="w-full max-w-container-max mx-auto page-pad section-y">
<div className="founder-panel w-full bg-text-primary text-on-primary rounded-2xl p-space-40 md:p-space-64 relative overflow-hidden shadow-xl border border-border-strong/30">
<div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
<img
  alt="Siva Surendira, Founder and CEO of Lyzr AI"
  className="w-28 h-28 rounded-2xl object-cover border border-primary/30 lg:col-span-4 lg:w-full lg:h-auto lg:aspect-square"
  src="/founders/siva-surendira.jpg"
/>
<div className="lg:col-span-8 lg:order-first">
<span className="text-[11px] font-mono text-on-primary/45 tracking-widest uppercase mb-space-16 block font-medium">Founder&apos;s Operating Manifesto</span>
<blockquote className="text-[24px] md:text-[34px] font-normal tracking-tight leading-[1.25] mb-space-32 text-on-primary">
            “Most agent platforms sell raw tools and leave enterprise teams to figure out the hardest parts. At Lyzr, we operate like{" "}
<span className="font-editorial-italic text-[1.15em] text-volt">Palantir for the agent era</span>
            : platform plus forward-deployed engineers, deep in your VPC, obsessed with taking you to production.”
          </blockquote>
<div>
<div className="text-[15px] font-semibold text-on-primary">Siva Surendira</div>
<div className="text-[13px] text-on-primary/55">Founder &amp; CEO, Lyzr AI</div>
</div>
</div>
</div>
</div>
</section>
{/* 11. PRE-BUILT AGENTS CATALOG — VOICE-READY WORKFORCE */}
<section className="workforce-section w-full bg-brand-ink border-y border-border-crisp section-y" id="catalog">
<div className="max-w-container-max mx-auto page-pad">
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-24 mb-space-40">
<div className="max-w-2xl">
<span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Turnkey Workforce</span>
<h2 className="font-display display-h2 font-medium text-text-primary">
              Ready-to-deploy{" "}
<span className="font-editorial-italic text-primary">autonomous agents.</span>
</h2>
<p className="text-[16px] text-text-secondary mt-space-12 max-w-[52ch]">
              Domain-trained coworkers for every function — chat, tools, and <em className="not-italic text-primary font-medium">live voice</em> with telephony in Agent Studio.
            </p>
</div>
<div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
<div className="workforce-voice-pill">
<span className="workforce-voice-pill-dot" aria-hidden="true" />
<span className="font-mono text-[11px] uppercase tracking-widest">Voice agents live in Studio</span>
</div>
<a className="text-[13px] font-medium text-primary hover:text-primary-dark inline-flex items-center gap-1" href="https://studio.lyzr.ai/" {...NAV_EXT}>
              View full agent registry <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
</a>
</div>
</div>

<div className="workforce-stage">
{/* Desktop: master–detail stage */}
{renderWorkforceFeatured("desktop")}

{/* Agent picker — mobile expands details under the selected row */}
<div className="workforce-rail" role="listbox" aria-label="Select an agent">
{WORKFORCE_AGENTS.map((agent) => {
              const selected = agent.id === activeWorkforce;
              return (
                <div
                  key={agent.id}
                  className={`workforce-rail-item${selected ? " is-active" : ""}`}
                >
<button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-controls={selected ? `workforce-agent-${agent.id}` : undefined}
                  className={`workforce-rail-card${selected ? " is-active" : ""}${agent.voice ? " has-voice" : ""}`}
                  onClick={() => selectWorkforceAgent(agent.id)}
                >
<span className="workforce-rail-thumb">
<img alt="" src={agent.image} width={64} height={64} decoding="async" />
</span>
<span className="workforce-rail-body">
<span className="workforce-rail-name">
{agent.name}
{agent.voice ? <span className="workforce-rail-eq" aria-hidden="true" /> : null}
</span>
<span className="workforce-rail-dept">{agent.dept}</span>
<span className="workforce-rail-metric">{agent.metric}</span>
</span>
<span className="workforce-rail-chevron material-symbols-outlined" aria-hidden="true">
{selected ? "expand_less" : "expand_more"}
</span>
</button>
{selected ? renderWorkforceFeatured("mobile") : null}
                </div>
              );
            })}
</div>
</div>

<div className="workforce-stack-bar">
<div className="workforce-stack-item">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">call</span>
<span>Telephony inbound &amp; outbound</span>
</div>
<div className="workforce-stack-item">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">hearing</span>
<span>Deepgram speech-to-text</span>
</div>
<div className="workforce-stack-item">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">record_voice_over</span>
<span>ElevenLabs natural TTS</span>
</div>
<div className="workforce-stack-item">
<span className="material-symbols-outlined text-[18px]" aria-hidden="true">toggle_on</span>
<span>One toggle in Agent Studio</span>
</div>
</div>
</div>
</section>
{/* 12. THREE ON-BOARDING PATHS */}
<section className="w-full max-w-container-max mx-auto page-pad section-y">
<div className="text-center max-w-3xl mx-auto mb-space-40 md:mb-space-64">
<span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Engagement Models</span>
<h2 className="font-display display-h2 font-medium text-text-primary">
          Three flexible paths to <span className="font-editorial-italic text-primary display-em">production.</span>
</h2>
<p className="text-[16px] text-text-secondary mt-space-12">
          Choose the right partnership velocity based on internal engineering capacity and strategic speed.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-24">
{/* Path 01 */}
<div className="path-card border border-border-crisp rounded-xl p-space-32 bg-surface-card flex flex-col justify-between shadow-sm">
<div>
<span className="text-[11px] font-mono text-text-muted uppercase">PATH 01</span>
<h3 className="text-[20px] font-semibold text-text-primary mt-2 mb-3">Platform + Your Team</h3>
<p className="text-[14px] text-text-secondary leading-relaxed mb-space-24">
              Your engineers build directly on Lyzr Agent Studio, Python SDK, and Control Plane. Full self-service with standard enterprise SLAs and technical documentation.
            </p>
</div>
<div className="pt-space-16 border-t border-border-subtle">
<span className="text-[12px] font-mono text-text-primary font-medium block mb-1">Ideal for:</span>
<span className="text-[13px] text-text-muted">Self-sufficient AI platform teams with internal infrastructure.</span>
</div>
</div>
{/* Path 02 */}
<div className="path-card border-2 border-primary rounded-xl p-space-32 bg-surface-card flex flex-col justify-between shadow-md relative">
<div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-mono font-bold tracking-wider uppercase">
            MOST POPULAR
          </div>
<div>
<span className="text-[11px] font-mono text-primary uppercase font-bold">PATH 02</span>
<h3 className="text-[20px] font-semibold text-text-primary mt-2 mb-3">Platform + Lyzr Engineers</h3>
<p className="text-[14px] text-text-secondary leading-relaxed mb-space-24">
              Forward-Deployed Engineers embed with your team to co-build your first 3 production agents. Guaranteed 8-week production SLA in your sovereign VPC.
            </p>
</div>
<div className="pt-space-16 border-t border-border-subtle">
<span className="text-[12px] font-mono text-text-primary font-medium block mb-1">Ideal for:</span>
<span className="text-[13px] text-text-muted">Enterprises needing accelerated speed-to-market without compliance roadblocks.</span>
</div>
</div>
{/* Path 03 */}
<div className="path-card border border-border-crisp rounded-xl p-space-32 bg-surface-card flex flex-col justify-between shadow-sm">
<div>
<span className="text-[11px] font-mono text-text-muted uppercase">PATH 03</span>
<h3 className="text-[20px] font-semibold text-text-primary mt-2 mb-3">Expert Partner Ecosystem</h3>
<p className="text-[14px] text-text-secondary leading-relaxed mb-space-24">
              Work with our certified Global Systems Integrator (GSI) and consultancy partners (Accenture, PwC, Wipro) who have certified practices on Lyzr architectures.
            </p>
</div>
<div className="pt-space-16 border-t border-border-subtle">
<span className="text-[12px] font-mono text-text-primary font-medium block mb-1">Ideal for:</span>
<span className="text-[13px] text-text-muted">Large transformational rollouts spanning multiple corporate subsidiaries.</span>
</div>
</div>
</div>
</section>
{/* 13. COMPREHENSIVE RESOURCES, TEMPLATES & COMMUNITY */}
<section className="kb-section w-full bg-brand-ink border-y border-border-crisp section-y scroll-mt-28" id="playbooks">
<div className="max-w-container-max mx-auto page-pad">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-16 mb-space-48">
<div className="min-w-0 max-w-3xl">
<span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Knowledge Base</span>
<h2 className="font-display display-h2 font-medium text-text-primary">
              Enterprise blueprints &amp;{" "}
<span className="font-editorial-italic text-primary display-em">production playbooks.</span>
</h2>
</div>
<div className="shrink-0">
<span className="text-[12px] font-mono text-text-muted">Updated weekly for platform engineers</span>
</div>
</div>
<div className="kb-grid">
{KNOWLEDGE_RESOURCES.map((resource) => (
<a
              className="kb-card group"
              href={resource.href}
              key={resource.title}
              {...NAV_EXT}
            >
<span className="kb-card-meta">{resource.meta}</span>
<h3 className="kb-card-title">{resource.title}</h3>
<p className="kb-card-body">{resource.body}</p>
<span className="kb-card-cta">
{resource.cta}
<svg aria-hidden className="kb-card-arrow" fill="none" viewBox="0 0 16 16">
<path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
</svg>
</span>
</a>
))}
</div>
<a
            className="kb-trust group"
            href="https://security.lyzr.ai/"
            {...NAV_EXT}
          >
<div className="kb-trust-copy">
<svg aria-hidden className="kb-trust-icon" fill="none" viewBox="0 0 24 24">
<path d="M12 3.5 5.5 6.25v4.4c0 4.35 2.85 8.25 6.5 9.85 3.65-1.6 6.5-5.5 6.5-9.85v-4.4L12 3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
<path d="m9.25 12 1.85 1.85L14.75 10.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
</svg>
<div className="min-w-0">
<span className="kb-trust-title">Enterprise Trust &amp; Continuous Security</span>
<span className="kb-trust-sub">Third-party verified compliance across every layer of the sovereign runtime.</span>
</div>
</div>
<div className="kb-trust-badges">
{KNOWLEDGE_TRUST_BADGES.map((badge) => (
<span className="kb-trust-badge" key={badge}>{badge}</span>
))}
</div>
</a>
</div>
</section>
{/* 14. RAMP-INSPIRED MINIMAL HIGH-CONVERSION FOOTER CTA */}
<section className="w-full max-w-container-max mx-auto page-pad section-y" id="get-started">
<div className="cta-panel bg-brand-ink border border-border-crisp rounded-3xl p-space-48 md:p-space-80 text-center flex flex-col items-center shadow-sm relative overflow-hidden">
<span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold mb-space-16">Deterministic Execution</span>
<h2 className="font-display display-cta font-medium text-text-primary max-w-3xl mb-space-24">
          8 weeks from concept to{" "}
<span className="font-editorial-italic text-primary display-em-cta">agents in production.</span>
</h2>
<p className="text-[15px] sm:text-[17px] text-text-secondary max-w-2xl mb-space-40 leading-relaxed font-normal">
          Bring your existing LLM weights, framework code, and compliance mandates. We will demonstrate the exact architecture to make it sovereign and live.
        </p>
{/* Precision Dual Action / Email Input Row */}
<div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 bg-surface-card border border-border-crisp p-1.5 rounded-xl shadow-sm">
<input className="w-full px-space-16 h-11 bg-transparent text-text-primary placeholder:text-text-faint text-[14px] focus:outline-none focus:ring-0 border-0" placeholder="name@company.com" type="email"/>
<button className="w-full sm:w-auto shrink-0 px-space-20 h-11 btn-brand text-[13.5px] font-medium rounded-lg transition-all shadow-sm" type="button">
            Get Started
          </button>
</div>
<span className="text-[12px] font-mono text-text-faint mt-space-16">No credit card required • Enterprise NDA executed on request • VPC Native</span>
</div>
</section>
</main>
<footer className="site-footer w-full">
<div aria-hidden className="site-footer-art">
<img alt="" src="/lyzr-footer-art.png" />
<div className="site-footer-art-fade" />
<span className="site-footer-art-trace" />
</div>
<div className="site-footer-inner max-w-container-max mx-auto page-pad pb-8">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 pb-14">
<div className="min-w-0">
<a className="inline-block mb-7" href="https://www.lyzr.ai/">
<img
  alt="Lyzr"
  className="h-9 w-auto brightness-0 invert"
  src="/lyzr-logo.png"
/>
</a>
<span className="site-footer-heading">Address</span>
<p className="text-[14px] leading-relaxed text-white/70 mb-7">
            525 Washington Blvd, 2410, Jersey City,<br />
            NJ 07310, USA
          </p>
<h6 className="text-[15px] font-semibold text-white mb-2">Join 24,647+ subscribers</h6>
<p className="text-[13.5px] leading-relaxed text-white/65 mb-4">
            We share stories around AI agents every 2 weeks. No spam.
          </p>
<form
  aria-label="Newsletter Form"
  className="flex flex-col gap-2.5"
  onSubmit={(event) => {
    event.preventDefault();
    if (!newsletterEmail.includes("@")) {
      setNewsletterState("error");
      return;
    }
    setNewsletterState("done");
  }}
>
<label className="sr-only" htmlFor="footer-email">Email</label>
<input
  className="site-footer-input"
  id="footer-email"
  name="email"
  onChange={(event) => {
    setNewsletterEmail(event.target.value);
    if (newsletterState !== "idle") setNewsletterState("idle");
  }}
  placeholder="Enter your email"
  required
  type="email"
  value={newsletterEmail}
/>
<button className="site-footer-subscribe" type="submit">
              {newsletterState === "done" ? "Subscribed" : "Subscribe"}
            </button>
{newsletterState === "error" ? (
<p className="text-[12px] text-accent-coral">Enter a valid work email.</p>
) : null}
</form>
</div>
{FOOTER_TOP.map((column) => (
<FooterColumn key={column.title} links={column.links} title={column.title} />
))}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 pb-14 border-t border-white/10 pt-14">
{FOOTER_BOTTOM.map((column) => (
<FooterColumn key={column.title} links={column.links} title={column.title} />
))}
</div>

<div className="flex flex-col md:grid md:grid-cols-3 items-center gap-5 border-t border-white/10 pt-6">
<ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
{FOOTER_LEGAL.map((item) => (
<li key={item.label}>
<a className="text-[13px] text-white/65 hover:text-white" href={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
</li>
))}
</ul>
<p className="text-[13px] text-white/65 text-center">LYZR © 2026. All rights reserved.</p>
<div className="flex items-center justify-center md:justify-end gap-2.5">
{FOOTER_SOCIAL.map((item) => (
<a
  aria-label={item.label}
  className="site-footer-social"
  href={item.href}
  key={item.label}
  rel="noreferrer"
  target="_blank"
>
<svg aria-hidden className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
<path d={item.path} />
</svg>
</a>
))}
</div>
</div>
</div>
</footer>

    </div>
  );
}
