import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

/**
 * GET /api/events
 * Returns published events.
 * Query params:
 *   ?featured=true  → only featured events
 *   ?upcoming=true  → only events with date >= now
 *   ?category=Tech  → filter by category
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const upcoming = searchParams.get('upcoming');
    const category = searchParams.get('category');

    const where: any = {
      status: 'published',
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (upcoming === 'true') {
      where.date = { gte: new Date() };
    }

    if (category) {
      where.category = category;
    }

    const events = await prisma.event.findMany({
      where,
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
      orderBy: { date: 'asc' },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const formatted = events.map((event) => ({
      ...event,
      price: Number(event.price),
      priceFormatted: `₹${Number(event.price).toFixed(2)}`,
      image: event.image.startsWith('http')
        ? event.image
        : `${baseUrl}${event.image}`,
      tags: event.tags as string[],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Creates a new event (defaults to draft).
 * Handles multipart/form-data with cover image upload.
 * Requires authentication.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const capacity = parseInt(formData.get('capacity') as string) || 0;
    const price = parseFloat(formData.get('price') as string) || 0;
    const dateStr = formData.get('date') as string;
    const timeStr = formData.get('time') as string;
    const location = formData.get('location') as string;
    const status = (formData.get('status') as string) || 'draft';
    const isFeatured = formData.get('is_featured') === 'true';

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    let date = new Date();
    if (dateStr) {
      date = new Date(dateStr);
    }

    // Handle cover image upload
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'covers');

      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);
      imageUrl = `/uploads/covers/${fileName}`;
    }

    if (!imageUrl) {
      imageUrl =
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        category: category || 'Other',
        capacity,
        price,
        date,
        time: timeStr || '00:00',
        duration: 120,
        location: location || '',
        image: imageUrl,
        status: status === 'published' ? 'published' : 'draft',
        isFeatured,
        isPrivate: formData.get('isPrivate') === 'true',
        requiresApproval: formData.get('requiresApproval') !== 'false',
        showAttendeeList: formData.get('showAttendeeList') === 'true',
        organizerId: session.user.id,
        tags: [],
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return NextResponse.json(
      {
        success: true,
        data: {
          ...event,
          price: Number(event.price),
          priceFormatted: `₹${Number(event.price).toFixed(2)}`,
          image: event.image.startsWith('http')
            ? event.image
            : `${baseUrl}${event.image}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
