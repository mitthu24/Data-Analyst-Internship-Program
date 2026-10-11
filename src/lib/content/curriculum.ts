export type SessionModule =
  | "Advanced Excel"
  | "Power BI"
  | "SQL"
  | "Automation & Deployment"
  | "AI & Web Dashboards"
  | "Corporate Readiness"
  | "Corporate Expert Mentoring";

export interface CurriculumSession {
  classNumber: number;
  module: SessionModule;
  title: string;
  durationMinutes: number;
  topics: string[];
  practicalExample: string;
  handsOnExercise: string;
  learningOutcome: string;
  deliverable: string;
  tools: string[];
  mentor?: { name: string; title: string };
  /** The two capstone mentor sessions whose mentor/topic the founder can still assign. */
  founderEditable?: boolean;
}

export const curriculum: CurriculumSession[] = [
  {
    classNumber: 1,
    module: "Advanced Excel",
    title: "Corporate Excel Foundations",
    durationMinutes: 90,
    topics: ["Tables", "Formatting", "Sorting", "Filters", "Data cleaning", "Data validation", "Structured datasets"],
    practicalExample: "Cleaning and structuring a raw sales register into a usable Excel Table for reporting.",
    handsOnExercise: "Convert a messy sample dataset into a formatted, validated Excel Table with filters.",
    learningOutcome: "Confidently prepare raw corporate data for analysis using clean, structured tables.",
    deliverable: "A cleaned and validated Excel Table from a raw dataset.",
    tools: ["Microsoft Excel"],
  },
  {
    classNumber: 2,
    module: "Advanced Excel",
    title: "Advanced Excel Formulas",
    durationMinutes: 90,
    topics: ["SUMIFS", "COUNTIFS", "IF", "IFS", "IFERROR", "Text functions", "Date functions", "Logical formulas"],
    practicalExample: "Building conditional summaries for a multi-region sales sheet.",
    handsOnExercise: "Write SUMIFS/COUNTIFS formulas to summarize a sample sales dataset by region and product.",
    learningOutcome: "Apply logical and conditional formulas to summarize and validate business data.",
    deliverable: "A formula-driven summary sheet with conditional calculations.",
    tools: ["Microsoft Excel"],
  },
  {
    classNumber: 3,
    module: "Advanced Excel",
    title: "Lookup Functions",
    durationMinutes: 90,
    topics: ["VLOOKUP", "XLOOKUP", "INDEX-MATCH", "Dynamic arrays", "Multi-condition lookups"],
    practicalExample: "Matching employee IDs across payroll and attendance sheets.",
    handsOnExercise: "Use XLOOKUP and INDEX-MATCH to merge data from two related sample sheets.",
    learningOutcome: "Reliably cross-reference data across multiple sheets without manual copy-paste.",
    deliverable: "A merged dataset built using lookup formulas.",
    tools: ["Microsoft Excel"],
  },
  {
    classNumber: 4,
    module: "Advanced Excel",
    title: "Pivot Tables and MIS Reporting",
    durationMinutes: 90,
    topics: ["Pivot tables", "Pivot charts", "Slicers", "Sales reports", "Employee reports", "Variance analysis"],
    practicalExample: "Summarizing monthly sales performance by product and region for management review.",
    handsOnExercise: "Build a pivot table and pivot chart from a sample sales dataset with slicers.",
    learningOutcome: "Turn raw transactional data into summarized MIS reports management can act on.",
    deliverable: "A pivot-table-based MIS report with slicers.",
    tools: ["Microsoft Excel"],
  },
  {
    classNumber: 5,
    module: "Advanced Excel",
    title: "Interactive Excel Dashboard",
    durationMinutes: 90,
    topics: ["KPI cards", "Charts", "Target achievement", "Slicers", "Business insights", "Management-ready reporting"],
    practicalExample: "Designing a one-page sales performance dashboard for a business review meeting.",
    handsOnExercise: "Assemble KPI cards and interactive charts into a single-page Excel dashboard.",
    learningOutcome: "Design a clean, interactive dashboard that communicates business performance at a glance.",
    deliverable: "A complete interactive Excel Sales MIS Dashboard.",
    tools: ["Microsoft Excel"],
  },
  {
    classNumber: 6,
    module: "Power BI",
    title: "Power BI Fundamentals and Data Import",
    durationMinutes: 90,
    topics: ["Power BI interface", "Data import", "Connecting to sample data sources", "Report canvas basics"],
    practicalExample: "Importing a sample business dataset into Power BI for the first time.",
    handsOnExercise: "Connect Power BI to a sample Excel/CSV dataset and explore the report canvas.",
    learningOutcome: "Understand the Power BI workflow from data import to report building.",
    deliverable: "A Power BI file (.pbix) with an imported sample dataset.",
    tools: ["Power BI Desktop"],
  },
  {
    classNumber: 7,
    module: "Power BI",
    title: "Power Query, Data Cleaning, Merge, Append, and Transformation",
    durationMinutes: 90,
    topics: ["Power Query Editor", "Data cleaning", "Merge queries", "Append queries", "Data transformation"],
    practicalExample: "Combining sales data from multiple monthly files into one clean table.",
    handsOnExercise: "Use Power Query to clean and merge two sample data sources.",
    learningOutcome: "Prepare messy, multi-source data for reliable analysis using Power Query.",
    deliverable: "A transformed and merged query ready for modeling.",
    tools: ["Power BI Desktop", "Power Query"],
  },
  {
    classNumber: 8,
    module: "Power BI",
    title: "Data Modeling, Relationships, Star Schema, and DAX Fundamentals",
    durationMinutes: 90,
    topics: ["Data modeling", "Table relationships", "Star schema", "DAX fundamentals"],
    practicalExample: "Modeling a sales fact table against product and date dimension tables.",
    handsOnExercise: "Build relationships between sample fact and dimension tables and write basic DAX measures.",
    learningOutcome: "Structure a data model correctly before building dashboards on top of it.",
    deliverable: "A working star-schema data model with basic DAX measures.",
    tools: ["Power BI Desktop", "DAX"],
  },
  {
    classNumber: 9,
    module: "Power BI",
    title: "Interactive Dashboards, Measures, KPIs, and Business Analysis",
    durationMinutes: 90,
    topics: ["Interactive dashboards", "DAX measures", "KPI visuals", "Business analysis"],
    practicalExample: "Building a business performance dashboard with sales, target, and variance KPIs.",
    handsOnExercise: "Create an interactive Power BI dashboard with KPI cards and cross-filtering visuals.",
    learningOutcome: "Translate business questions into interactive Power BI visuals and KPIs.",
    deliverable: "A Power BI Business Performance Dashboard.",
    tools: ["Power BI Desktop", "DAX"],
  },
  {
    classNumber: 10,
    module: "Power BI",
    title: "Publishing, Sharing, Refresh, and Dashboard Presentation",
    durationMinutes: 90,
    topics: [
      "Publishing to Power BI Service",
      "Sharing reports",
      "Data refresh",
      "Dashboard presentation",
      "Licensing and service limitations",
    ],
    practicalExample: "Presenting a finished dashboard to a mock stakeholder audience.",
    handsOnExercise: "Publish the sample dashboard to Power BI Service and walk through refresh options.",
    learningOutcome:
      "Understand how to publish, share, and present Power BI dashboards, including Power BI's licensing tiers and service limitations.",
    deliverable: "A published Power BI report with a presentation walkthrough.",
    tools: ["Power BI Service"],
  },
  {
    classNumber: 11,
    module: "SQL",
    title: "Databases, Tables, SELECT, WHERE, ORDER BY, and NULL Values",
    durationMinutes: 90,
    topics: ["Databases and tables", "SELECT", "WHERE", "ORDER BY", "Handling NULL values"],
    practicalExample: "Querying a sample customer database to find active accounts.",
    handsOnExercise: "Write SELECT queries with WHERE and ORDER BY on a sample database.",
    learningOutcome: "Read and filter relational data confidently using core SQL syntax.",
    deliverable: "A set of working SELECT queries against a sample database.",
    tools: ["SQL (PostgreSQL/MySQL)"],
  },
  {
    classNumber: 12,
    module: "SQL",
    title: "Aggregations, GROUP BY, HAVING, CASE WHEN, and Business Metrics",
    durationMinutes: 90,
    topics: ["Aggregate functions", "GROUP BY", "HAVING", "CASE WHEN", "Business metrics"],
    practicalExample: "Calculating total and average sales per region from a transactions table.",
    handsOnExercise: "Write grouped and conditional queries to produce business metrics from sample data.",
    learningOutcome: "Summarize transactional data into business metrics using SQL aggregation.",
    deliverable: "A SQL report of grouped business metrics.",
    tools: ["SQL (PostgreSQL/MySQL)"],
  },
  {
    classNumber: 13,
    module: "SQL",
    title: "INNER JOIN, LEFT JOIN, Multi-table Queries, and Duplicate Prevention",
    durationMinutes: 90,
    topics: ["INNER JOIN", "LEFT JOIN", "Multi-table queries", "Duplicate prevention"],
    practicalExample: "Joining orders and customers tables to analyze purchase behavior.",
    handsOnExercise: "Write JOIN queries across sample multi-table data and check for duplicate rows.",
    learningOutcome: "Combine data across multiple related tables accurately and without duplication.",
    deliverable: "A set of multi-table JOIN queries with verified row counts.",
    tools: ["SQL (PostgreSQL/MySQL)"],
  },
  {
    classNumber: 14,
    module: "SQL",
    title: "Subqueries, CTEs, Window Functions, Ranking, and Running Totals",
    durationMinutes: 90,
    topics: ["Subqueries", "Common Table Expressions (CTEs)", "Window functions", "Ranking", "Running totals"],
    practicalExample: "Ranking top-performing products per region and calculating running sales totals.",
    handsOnExercise: "Write CTE and window function queries to rank and total sample sales data.",
    learningOutcome: "Use advanced SQL techniques to answer ranking and cumulative-total business questions.",
    deliverable: "A set of CTE and window-function-based analytical queries.",
    tools: ["SQL (PostgreSQL/MySQL)"],
  },
  {
    classNumber: 15,
    module: "SQL",
    title: "Reporting Queries, Views, Indexing Fundamentals, and Interview Practice",
    durationMinutes: 90,
    topics: ["Reporting queries", "Views", "Indexing fundamentals", "SQL interview practice"],
    practicalExample: "Building a reusable sales summary view for a reporting dashboard.",
    handsOnExercise: "Create a SQL view for a recurring report and practice common SQL interview questions.",
    learningOutcome: "Package reusable SQL reporting logic and prepare for SQL-based interview rounds.",
    deliverable: "A reusable SQL view plus a personal interview-practice question set.",
    tools: ["SQL (PostgreSQL/MySQL)"],
  },
  {
    classNumber: 16,
    module: "Automation & Deployment",
    title: "Excel Automation using VBA and Office Scripts",
    durationMinutes: 90,
    topics: ["Excel automation", "VBA fundamentals", "Office Scripts", "Suitable automation workflows"],
    practicalExample: "Automating a repetitive monthly report formatting task.",
    handsOnExercise: "Record and adapt a macro or Office Script to automate a sample repetitive Excel task.",
    learningOutcome: "Reduce repetitive manual Excel work through basic automation scripting.",
    deliverable: "A working macro or Office Script that automates a sample task.",
    tools: ["Excel VBA", "Office Scripts"],
  },
  {
    classNumber: 17,
    module: "Automation & Deployment",
    title: "Google Sheets Automation",
    durationMinutes: 90,
    topics: ["QUERY", "FILTER", "ARRAYFORMULA", "Google Apps Script", "Triggers"],
    practicalExample: "Auto-generating a filtered weekly report from a live Google Sheet.",
    handsOnExercise: "Build QUERY/FILTER/ARRAYFORMULA logic and a basic Apps Script trigger on sample sheet data.",
    learningOutcome: "Automate recurring reporting tasks directly inside Google Sheets.",
    deliverable: "An automated Google Sheet with formulas and a working Apps Script trigger.",
    tools: ["Google Sheets", "Google Apps Script"],
  },
  {
    classNumber: 18,
    module: "Automation & Deployment",
    title: "Build and Live Deploy a Dynamic Web Dashboard",
    durationMinutes: 90,
    topics: ["Dynamic web dashboards", "Connecting a suitable data source", "Secure configuration", "Live deployment"],
    practicalExample: "Deploying a simple sales dashboard that reads from a sample data source.",
    handsOnExercise: "Connect a sample dataset to a dashboard template and deploy it live with secure configuration.",
    learningOutcome: "Understand the end-to-end path from a data source to a securely deployed live dashboard.",
    deliverable: "A live-deployed, data-connected web dashboard.",
    tools: ["Web dashboard framework", "Hosting platform"],
  },
  {
    classNumber: 19,
    module: "AI & Web Dashboards",
    title: "ChatGPT for Data Analysis",
    durationMinutes: 90,
    topics: ["ChatGPT for data analysis", "Formula generation", "SQL/DAX assistance", "Writing requirements", "Debugging"],
    practicalExample: "Using ChatGPT to draft a complex SQL query from a plain-language business requirement.",
    handsOnExercise: "Use ChatGPT to generate and debug a formula, SQL query, or DAX measure for a sample task.",
    learningOutcome:
      "Use AI assistants productively for data analysis work while critically checking their output rather than trusting it blindly.",
    deliverable: "An AI-assisted formula/query solved and verified against the correct expected result.",
    tools: ["ChatGPT"],
  },
  {
    classNumber: 20,
    module: "AI & Web Dashboards",
    title: "Claude Code for Building a Functional Web Dashboard",
    durationMinutes: 90,
    topics: [
      "Claude Code for dashboard building",
      "Connecting sample data",
      "Reviewing AI-generated code",
      "Using GitHub",
      "Deploying to Vercel",
    ],
    practicalExample: "Building and deploying a small dashboard with AI assistance, then reviewing the generated code line by line.",
    handsOnExercise: "Use Claude Code to scaffold a small dashboard, connect sample data, commit to GitHub, and deploy to Vercel.",
    learningOutcome:
      "Use AI coding tools to build and deploy a functional dashboard, while understanding that AI-generated code must still be reviewed for correctness and security before trusting it.",
    deliverable: "A dashboard project pushed to GitHub and deployed to Vercel.",
    tools: ["Claude Code", "GitHub", "Vercel"],
  },
  {
    classNumber: 21,
    module: "Corporate Readiness",
    title: "Corporate Working and Career Preparation",
    durationMinutes: 90,
    topics: [
      "Corporate reporting cycles",
      "Business KPIs",
      "Stakeholder communication",
      "Professional behaviour",
      "Portfolio presentation",
      "Resume projects",
      "Interview preparation",
    ],
    practicalExample: "Presenting your internship project portfolio the way you would to a hiring manager.",
    handsOnExercise: "Prepare a one-page portfolio summary and rehearse explaining one project end-to-end.",
    learningOutcome: "Present your work, communicate with stakeholders, and prepare for interviews like a working analyst.",
    deliverable: "A resume-ready project portfolio summary.",
    tools: ["Resume/portfolio templates"],
  },
  {
    classNumber: 22,
    module: "Corporate Expert Mentoring",
    title: "HR and Recruitment Insights",
    durationMinutes: 90,
    topics: ["Recruitment process insights", "What hiring managers look for", "Resume and interview expectations"],
    practicalExample: "A recruiter's view of what makes a data analyst resume stand out.",
    handsOnExercise: "Get your resume reviewed live against real recruitment criteria.",
    learningOutcome: "Understand hiring expectations directly from a corporate HR practitioner.",
    deliverable: "Personalized resume feedback notes.",
    tools: [],
    mentor: { name: "Aditya Singh", title: "Senior HR, TVS" },
  },
  {
    classNumber: 23,
    module: "Corporate Expert Mentoring",
    title: "Marketing Analytics and Business Performance",
    durationMinutes: 90,
    topics: ["Marketing analytics", "Business performance measurement", "Reporting to leadership"],
    practicalExample: "How a marketing team tracks campaign performance and reports it upward.",
    handsOnExercise: "Map a sample marketing funnel to the metrics a HOD would actually track.",
    learningOutcome: "See how analytics is used operationally inside a real marketing function.",
    deliverable: "A notes summary of marketing KPIs discussed in the session.",
    tools: [],
    mentor: { name: "Pankaj Chauhan", title: "Marketing HOD, Advance Ply" },
  },
  {
    classNumber: 24,
    module: "Corporate Expert Mentoring",
    title: "Business Analytics and Corporate Reporting",
    durationMinutes: 90,
    topics: ["Business analytics practices", "Corporate reporting standards"],
    practicalExample: "To be shared by the assigned mentor ahead of the session.",
    handsOnExercise: "To be shared by the assigned mentor ahead of the session.",
    learningOutcome: "Gain a working analyst's perspective on business analytics and corporate reporting.",
    deliverable: "Session notes shared after the class.",
    tools: [],
    mentor: { name: "Mentor to be assigned", title: "Business Analytics & Corporate Reporting" },
    founderEditable: true,
  },
  {
    classNumber: 25,
    module: "Corporate Expert Mentoring",
    title: "Specialization-Specific Career Masterclass",
    durationMinutes: 90,
    topics: ["Career paths by specialization", "Specialization-specific guidance"],
    practicalExample: "To be shared by the assigned mentor ahead of the session.",
    handsOnExercise: "To be shared by the assigned mentor ahead of the session.",
    learningOutcome: "Connect your specific MBA/academic specialization to a realistic analytics career path.",
    deliverable: "A personalized career-path note for your specialization.",
    tools: [],
    mentor: { name: "Mentor to be assigned", title: "Specialization-Specific Career Masterclass" },
    founderEditable: true,
  },
];

export const curriculumSummary = {
  totalSessions: curriculum.length,
  minutesPerSession: 90,
  totalHours: (curriculum.length * 90) / 60,
};

export const modules: SessionModule[] = [
  "Advanced Excel",
  "Power BI",
  "SQL",
  "Automation & Deployment",
  "AI & Web Dashboards",
  "Corporate Readiness",
  "Corporate Expert Mentoring",
];

const DB_MODULE_TO_LABEL: Record<string, SessionModule> = {
  EXCEL: "Advanced Excel",
  POWER_BI: "Power BI",
  SQL: "SQL",
  AUTOMATION: "Automation & Deployment",
  AI_AND_WEB: "AI & Web Dashboards",
  CORPORATE: "Corporate Readiness",
  MENTOR: "Corporate Expert Mentoring",
};

/**
 * Published curriculum for public pages, read from Postgres and falling
 * back to the static `curriculum` array above whenever the database is
 * unconfigured, unreachable, or has no published rows yet — the public
 * site always renders a correct 25-session curriculum either way.
 */
export async function getCurriculum(): Promise<CurriculumSession[]> {
  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return curriculum;
  try {
    const rows = await prisma.curriculumSession.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: { trainer: true },
    });
    if (rows.length === 0) return curriculum;
    return rows.map((r) => ({
      classNumber: r.classNumber,
      module: DB_MODULE_TO_LABEL[r.module] ?? "Advanced Excel",
      title: r.title,
      durationMinutes: r.durationMinutes,
      topics: r.topics,
      practicalExample: r.practicalExample,
      handsOnExercise: r.handsOnExercise,
      learningOutcome: r.learningOutcome,
      deliverable: r.deliverable,
      tools: r.tools,
      mentor: r.trainer
        ? { name: r.trainer.name, title: r.trainer.role }
        : r.mentorName
          ? { name: r.mentorName, title: r.mentorTitle ?? "" }
          : undefined,
      founderEditable: r.isEditableByFounder,
    }));
  } catch {
    return curriculum;
  }
}
