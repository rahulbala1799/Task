import { NextResponse } from 'next/server';
import { db, templates, NewTemplate } from '@/lib/db';
import { generateId } from '@/lib/storage';

const businessTemplates: Omit<NewTemplate, 'createdAt' | 'updatedAt'>[] = [
  // Month End Phorest Templates
  { id: generateId(), title: 'Online Bookings - UK', description: 'Process and reconcile UK online bookings for month end', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 1 },
  { id: generateId(), title: 'Online Bookings - Ireland', description: 'Process and reconcile Irish online bookings for month end', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 1 },
  { id: generateId(), title: 'Online Bookings - US', description: 'Process and reconcile US online bookings for month end', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 1 },
  { id: generateId(), title: 'TSE Amortization', description: 'Calculate and process TSE amortization entries', category: 'month-end-phorest', priority: 'medium', dueDayOfMonth: 1 },
  { id: generateId(), title: 'Fiskaltrust Amortization', description: 'Process Fiskaltrust amortization calculations', category: 'month-end-phorest', priority: 'medium', dueDayOfMonth: 1 },
  { id: generateId(), title: '12 Month Subscription Amortization', description: 'Calculate and process 12-month subscription amortization', category: 'month-end-phorest', priority: 'medium', dueDayOfMonth: 1 },
  { id: generateId(), title: 'Prepayment Run Batch 1', description: 'Execute first batch of prepayment processing', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 1 },
  { id: generateId(), title: 'Fixed Assets', description: 'Review and update fixed assets register', category: 'month-end-phorest', priority: 'medium', dueDayOfMonth: 1 },
  { id: generateId(), title: 'Stripe Invoice Reallocation', description: 'Reallocate Stripe invoices and reconcile payments', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 1 },
  { id: generateId(), title: 'SMS Accrual DDI & Plan', description: 'Process SMS accruals for DDI and Plan services', category: 'month-end-phorest', priority: 'medium', dueDayOfMonth: 2 },
  { id: generateId(), title: 'Subs Pro Rata Accrual', description: 'Calculate and process subscription pro rata accruals', category: 'month-end-phorest', priority: 'medium', dueDayOfMonth: 2 },
  { id: generateId(), title: 'Prepayment Batch 2', description: 'Execute second batch of prepayment processing', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 2 },
  { id: generateId(), title: 'Analysis for Month End Meeting', description: 'Prepare comprehensive analysis and reports for month end meeting', category: 'month-end-phorest', priority: 'urgent', dueDayOfMonth: 3 },
  { id: generateId(), title: 'Action Points from Analysis', description: 'Review analysis results and create action points for follow-up', category: 'month-end-phorest', priority: 'high', dueDayOfMonth: 4 },

  // Phorest Monthly Templates
  { id: generateId(), title: 'Debtors Reconciliation', description: 'Complete debtors reconciliation and review outstanding amounts', category: 'phorest-monthly', priority: 'high', dueDayOfMonth: 10 },
  { id: generateId(), title: 'Fixed Assets Reconciliation', description: 'Reconcile fixed assets register and verify depreciation', category: 'phorest-monthly', priority: 'medium', dueDayOfMonth: 15 },
  { id: generateId(), title: 'Receipts Processing', description: 'Process and reconcile all receipts for the month', category: 'phorest-monthly', priority: 'medium', dueDayOfMonth: 23 },
  { id: generateId(), title: 'VAT Control Accounts', description: 'Review and reconcile VAT control accounts', category: 'phorest-monthly', priority: 'high', dueDayOfMonth: 10 },
  { id: generateId(), title: 'Prepayment Control Accounts', description: 'Reconcile prepayment control accounts and verify balances', category: 'phorest-monthly', priority: 'medium', dueDayOfMonth: 8 },
  { id: generateId(), title: 'German VAT Submission', description: 'Prepare and submit German VAT return (monthly)', category: 'phorest-monthly', priority: 'urgent', dueDayOfMonth: 7 },
];

export async function POST() {
  try {
    let seededCount = 0;

    for (const template of businessTemplates) {
      try {
        await db.insert(templates).values({
          ...template,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
        seededCount++;
      } catch (error) {
        console.warn('Failed to seed template:', template.title, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seededCount} business templates successfully`,
      count: seededCount,
    });
  } catch (error) {
    console.error('Template seeding error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed templates',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
