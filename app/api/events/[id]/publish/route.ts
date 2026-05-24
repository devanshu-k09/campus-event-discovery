import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * PUT /api/events/:id/publish
 * Changes an event's status from 'draft' → 'published'.
 * Validates that the event belongs to the authenticated user.
 * Returns the full updated event object (BUG 2 fix).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — JWT required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find the event and verify ownership
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.organizerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden — you do not own this event' },
        { status: 403 }
      );
    }

    if (event.status === 'published') {
      return NextResponse.json(
        { success: false, error: 'Event is already published' },
        { status: 400 }
      );
    }

    // BUG 2 FIX: Return the full updated event, not just { success: true }
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { status: 'published' },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      data: {
        ...updatedEvent,
        price: Number(updatedEvent.price),
        priceFormatted: `₹${Number(updatedEvent.price).toFixed(2)}`,
        image: updatedEvent.image.startsWith('http')
          ? updatedEvent.image
          : `${baseUrl}${updatedEvent.image}`,
        tags: updatedEvent.tags as string[],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to publish event' },
      { status: 500 }
    );
  }
}
