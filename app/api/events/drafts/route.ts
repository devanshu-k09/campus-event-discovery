import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getFullImageUrl } from '@/lib/utils';

/**
 * GET /api/events/drafts
 * Protected route — returns only the authenticated user's draft events.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — JWT required' },
        { status: 401 }
      );
    }

    const drafts = await prisma.event.findMany({
      where: {
        organizerId: session.user.id,
        status: 'draft',
      },
      orderBy: { updatedAt: 'desc' },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const formatted = drafts.map((draft) => ({
      ...draft,
      price: Number(draft.price),
      priceFormatted: `₹${Number(draft.price).toFixed(2)}`,
      image: getFullImageUrl(draft.image, baseUrl),
      tags: draft.tags as string[],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
