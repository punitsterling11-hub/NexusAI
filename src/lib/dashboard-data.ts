import { Database, FileText, Workflow } from "lucide-react";

export const projects = [
  { name: "FXStatementAI", desc: "Process FX statements using AI", type: "Document AI", schedules: "3", active: "2 active", status: "Active", run: "Today, 10:36", success: 100, icon: FileText, tone: "violet" },
  { name: "InvoiceProcessor", desc: "Process and validate invoices", type: "Document AI", schedules: "2", active: "1 active", status: "Active", run: "Today, 09:30", success: 100, icon: Database, tone: "blue" },
  { name: "ReportGenerator", desc: "Generate weekly reports", type: "Text AI", schedules: "1", active: "1 active", status: "Paused", run: "Today, 07:10", success: 100, icon: FileText, tone: "amber" },
  { name: "DataEnrichment", desc: "Enrich and validate data", type: "Data AI", schedules: "1", active: "2 active", status: "Active", run: "Yesterday, 16:50", success: 100, icon: Database, tone: "cyan" },
  { name: "MailsBot", desc: "Send automated emails", type: "RPA + AI", schedules: "1", active: "1 active", status: "Active", run: "Yesterday, 06:30", success: 100, icon: Workflow, tone: "orange" },
];

export const schedules = [
  { project: "FXStatementAI", time: "08:30", recurrence: "Mon – Fri" },
  { project: "InvoiceProcessor", time: "09:00", recurrence: "Mon – Fri" },
  { project: "ReportGenerator", time: "09:30", recurrence: "Daily" },
  { project: "DataEnrichment", time: "11:00", recurrence: "Weekly" },
  { project: "MailsBot", time: "16:00", recurrence: "Weekly" },
];
