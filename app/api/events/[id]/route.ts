import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/events/:id
 * Returns a single event by ID.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
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

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        price: Number(event.price),
        priceFormatted: `₹${Number(event.price).toFixed(2)}`,
        image: event.image.startsWith('http')
          ? event.image
          : `${baseUrl}${event.image}`,
        tags: event.tags as string[],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/:id
 * Updates an event. Validates ownership via JWT session.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    if (existing.organizerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden — you do not own this event' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.time !== undefined && { time: body.time }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.capacity !== undefined && {
          capacity: parseInt(body.capacity),
        }),
        ...(body.is_featured !== undefined && {
          isFeatured: body.is_featured,
        }),
        ...(body.status !== undefined && { status: body.status }),
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true, image: true },
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
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}
