export const NAV_EXT = { rel: "noopener noreferrer", target: "_blank" } as const;

export type NavMenuId = "solutions" | "platform" | "partners" | "resources";

export const NAV_SOLUTIONS = {
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

export const NAV_PLATFORM = {
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

export const NAV_PARTNERS = {
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

export const NAV_RESOURCES = {
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
