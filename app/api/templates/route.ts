import { NextRequest, NextResponse } from 'next/server';
import { db, templates, NewTemplate } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allTemplates = await db.select().from(templates).orderBy(templates.createdAt);
    return NextResponse.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTemplate: NewTemplate = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdTemplate] = await db.insert(templates).values(newTemplate).returning();
    return NextResponse.json(createdTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const [updatedTemplate] = await db
      .update(templates)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();

    if (!updatedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    await db.delete(templates).where(eq(templates.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
