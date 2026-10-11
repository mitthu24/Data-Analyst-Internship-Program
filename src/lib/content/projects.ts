export interface Project {
  title: string;
  businessProblem: string;
  tools: string[];
  learningObjectives: string[];
  deliverables: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isPlannedExample: boolean;
  demoUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Excel Sales MIS Dashboard",
    businessProblem: "Management needs a single-page view of sales performance by region and product.",
    tools: ["Microsoft Excel", "Pivot Tables", "Charts"],
    learningObjectives: ["Pivot table design", "KPI card layout", "Target vs. achievement analysis"],
    deliverables: ["Interactive Excel dashboard file"],
    difficulty: "Beginner",
    isPlannedExample: true,
  },
  {
    title: "Power BI Business Performance Dashboard",
    businessProblem: "Leadership wants an interactive, refreshable dashboard instead of static Excel reports.",
    tools: ["Power BI Desktop", "DAX", "Power Query"],
    learningObjectives: ["Data modeling", "DAX measures", "Interactive report design"],
    deliverables: ["Power BI (.pbix) report"],
    difficulty: "Intermediate",
    isPlannedExample: true,
  },
  {
    title: "SQL Sales Analysis",
    businessProblem: "The business needs ranked, grouped, and trend-based answers directly from the database.",
    tools: ["SQL (PostgreSQL/MySQL)"],
    learningObjectives: ["Joins and aggregation", "Window functions", "Reporting views"],
    deliverables: ["A documented set of SQL queries and views"],
    difficulty: "Intermediate",
    isPlannedExample: true,
  },
  {
    title: "Excel Automated Reporting",
    businessProblem: "A recurring report is built manually every week, wasting hours of staff time.",
    tools: ["Excel VBA", "Office Scripts"],
    learningObjectives: ["Automation scripting basics", "Reducing repetitive manual work"],
    deliverables: ["A macro or script that automates the report"],
    difficulty: "Intermediate",
    isPlannedExample: true,
  },
  {
    title: "Google Sheets Automation",
    businessProblem: "A team needs a live, auto-updating report shared across collaborators.",
    tools: ["Google Sheets", "Google Apps Script"],
    learningObjectives: ["QUERY/FILTER/ARRAYFORMULA", "Apps Script triggers"],
    deliverables: ["An automated, shareable Google Sheet"],
    difficulty: "Beginner",
    isPlannedExample: true,
  },
  {
    title: "Live Web Dashboard",
    businessProblem: "Stakeholders want to view live metrics from a browser, not a downloaded file.",
    tools: ["Web dashboard framework", "Hosting platform"],
    learningObjectives: ["Connecting a data source", "Secure configuration", "Live deployment"],
    deliverables: ["A deployed, publicly viewable dashboard URL"],
    difficulty: "Advanced",
    isPlannedExample: true,
  },
  {
    title: "AI-Assisted Dashboard",
    businessProblem: "A dashboard needs to be built quickly with AI assistance, without sacrificing correctness.",
    tools: ["ChatGPT", "Claude Code", "GitHub", "Vercel"],
    learningObjectives: ["Prompting for code generation", "Reviewing AI-generated code", "Deploying to Vercel"],
    deliverables: ["A GitHub repository and a Vercel deployment"],
    difficulty: "Advanced",
    isPlannedExample: true,
  },
  {
    title: "Corporate Reporting Capstone",
    businessProblem: "Bringing every skill together into one portfolio-ready corporate reporting project.",
    tools: ["Excel", "Power BI", "SQL"],
    learningObjectives: ["End-to-end reporting workflow", "Stakeholder-ready presentation"],
    deliverables: ["A combined capstone report and presentation"],
    difficulty: "Advanced",
    isPlannedExample: true,
  },
];
