import { TaskTemplate, TaskCategory } from '@/types';
import { generateId } from './storage';

export const monthEndPhorestTemplates: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Day 1 Tasks
  {
    title: 'Online Bookings - UK',
    description: 'Process and reconcile UK online bookings for month end',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 1,
  },
  {
    title: 'Online Bookings - Ireland',
    description: 'Process and reconcile Irish online bookings for month end',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 1,
  },
  {
    title: 'Online Bookings - US',
    description: 'Process and reconcile US online bookings for month end',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 1,
  },
  {
    title: 'TSE Amortization',
    description: 'Calculate and process TSE amortization entries',
    category: 'month-end-phorest',
    priority: 'medium',
    dueDayOfMonth: 1,
  },
  {
    title: 'Fiskaltrust Amortization',
    description: 'Process Fiskaltrust amortization calculations',
    category: 'month-end-phorest',
    priority: 'medium',
    dueDayOfMonth: 1,
  },
  {
    title: '12 Month Subscription Amortization',
    description: 'Calculate and process 12-month subscription amortization',
    category: 'month-end-phorest',
    priority: 'medium',
    dueDayOfMonth: 1,
  },
  {
    title: 'Prepayment Run Batch 1',
    description: 'Execute first batch of prepayment processing',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 1,
  },
  {
    title: 'Fixed Assets',
    description: 'Review and update fixed assets register',
    category: 'month-end-phorest',
    priority: 'medium',
    dueDayOfMonth: 1,
  },
  {
    title: 'Stripe Invoice Reallocation',
    description: 'Reallocate Stripe invoices and reconcile payments',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 1,
  },

  // Day 2 Tasks
  {
    title: 'SMS Accrual DDI & Plan',
    description: 'Process SMS accruals for DDI and Plan services',
    category: 'month-end-phorest',
    priority: 'medium',
    dueDayOfMonth: 2,
  },
  {
    title: 'Subs Pro Rata Accrual',
    description: 'Calculate and process subscription pro rata accruals',
    category: 'month-end-phorest',
    priority: 'medium',
    dueDayOfMonth: 2,
  },
  {
    title: 'Prepayment Batch 2',
    description: 'Execute second batch of prepayment processing',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 2,
  },

  // Day 3 Tasks
  {
    title: 'Analysis for Month End Meeting',
    description: 'Prepare comprehensive analysis and reports for month end meeting',
    category: 'month-end-phorest',
    priority: 'urgent',
    dueDayOfMonth: 3,
  },

  // Day 4 Tasks
  {
    title: 'Action Points from Analysis',
    description: 'Review analysis results and create action points for follow-up',
    category: 'month-end-phorest',
    priority: 'high',
    dueDayOfMonth: 4,
  },
];

export const phorestMonthlyTemplates: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Debtors Reconciliation',
    description: 'Complete debtors reconciliation and review outstanding amounts',
    category: 'phorest-monthly',
    priority: 'high',
    dueDayOfMonth: 10,
  },
  {
    title: 'Fixed Assets Reconciliation',
    description: 'Reconcile fixed assets register and verify depreciation',
    category: 'phorest-monthly',
    priority: 'medium',
    dueDayOfMonth: 15,
  },
  {
    title: 'Receipts Processing',
    description: 'Process and reconcile all receipts for the month',
    category: 'phorest-monthly',
    priority: 'medium',
    dueDayOfMonth: 23,
  },
  {
    title: 'VAT Control Accounts',
    description: 'Review and reconcile VAT control accounts',
    category: 'phorest-monthly',
    priority: 'high',
    dueDayOfMonth: 10,
  },
  {
    title: 'Prepayment Control Accounts',
    description: 'Reconcile prepayment control accounts and verify balances',
    category: 'phorest-monthly',
    priority: 'medium',
    dueDayOfMonth: 8,
  },
  {
    title: 'German VAT Submission',
    description: 'Prepare and submit German VAT return (monthly)',
    category: 'phorest-monthly',
    priority: 'urgent',
    dueDayOfMonth: 7,
  },
];

// Note: For complex VAT schedules (Irish bi-monthly, UK/AUS quarterly), 
// we'll need to handle these separately as they don't fit the simple monthly template model
export const complexVATTasks = [
  {
    title: 'Irish VAT Submission',
    description: 'Bi-monthly Irish VAT submission (every 2 months on 21st)',
    schedule: 'bi-monthly', // Jan-Feb (Mar 21), Mar-Apr (May 21), etc.
    dueDay: 21,
  },
  {
    title: 'UK VAT Submission',
    description: 'Quarterly UK VAT submission (every 3 months on 1st)',
    schedule: 'quarterly', // Dec-Feb (Apr 1), Mar-May (Jun 1), etc.
    dueDay: 1,
  },
  {
    title: 'Australian VAT Submission',
    description: 'Quarterly Australian VAT submission (every 3 months on 1st)',
    schedule: 'quarterly', // Jan-Mar (Apr 1), Apr-Jun (Jul 1), etc.
    dueDay: 1,
  },
];

export const createTemplateWithTimestamp = (template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>): TaskTemplate => {
  const now = new Date().toISOString();
  return {
    ...template,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
};

export const getAllMonthEndTemplates = (): TaskTemplate[] => {
  return monthEndPhorestTemplates.map(createTemplateWithTimestamp);
};

export const getAllPhorestMonthlyTemplates = (): TaskTemplate[] => {
  return phorestMonthlyTemplates.map(createTemplateWithTimestamp);
};
