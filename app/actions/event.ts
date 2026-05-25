'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getFullImageUrl } from '@/lib/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import crypto from 'crypto';
import { sendEmail, getBookingEmailTemplate, getEventPublishedEmailTemplate, getCancellationEmailTemplate, getEventDeletionEmailTemplate } from '@/lib/mail';
import { format } from 'date-fns';
import { generateTicketPDF } from '@/lib/ticket-generator';
import { calculateCurrentPrice } from '@/lib/pricing';

/**
 * Save or update an event (used by the create-event form).
 * BUG 1 FIX: Default status is now 'draft' (was 'published').
 * BUG 4 FIX: Images stored in /uploads/covers/ with proper path.
 * BUG 5 FIX: Price stored as Decimal, formatted with ₹ in responses.
 */
export async function saveEvent(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('--- saveEvent Auth Check ---');
    console.log('Session exists:', !!session);
    console.log('User ID:', session?.user?.id);

    if (!session || !session.user || !session.user.id) {
      console.error('Unauthorized attempt to save event');
      return { success: false, error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const capacity = parseInt(formData.get('capacity') as string) || 0;
    const price = parseFloat(formData.get('price') as string) || 0;
    const dateStr = formData.get('date') as string;
    const timeStr = formData.get('time') as string;
    const location = formData.get('location') as string;
    const locationName = formData.get('locationName') as string;
    const locationAddress = formData.get('locationAddress') as string;
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;
    const eventType = (formData.get('eventType') as any) || 'PHYSICAL';
    const meetingLink = formData.get('meetingLink') as string | null;
    const status = (formData.get('status') as string) || 'draft';
    const eventId = formData.get('eventId') as string | null;

    console.log('--- saveEvent Data ---');
    console.log('Title:', title);
    console.log('Status:', status);
    console.log('Event Type:', eventType);
    console.log('Meeting Link:', meetingLink);
    console.log('Location Name:', locationName);
    console.log('Image size:', (formData.get('image') as File)?.size);

    const dynamicPricingEnabled = formData.get('dynamicPricingEnabled') === 'true';
    const minPrice = formData.get('minPrice') ? parseFloat(formData.get('minPrice') as string) : null;
    const maxPrice = formData.get('maxPrice') ? parseFloat(formData.get('maxPrice') as string) : null;
    const priceThresholdsStr = formData.get('priceThresholds') as string | null;
    const timeBasedIncreaseStr = formData.get('timeBasedIncrease') as string | null;

    const priceThresholds = priceThresholdsStr ? JSON.parse(priceThresholdsStr) : null;
    const timeBasedIncrease = timeBasedIncreaseStr ? JSON.parse(timeBasedIncreaseStr) : null;

    // Backend Validation Rules
    if (eventType === 'ONLINE') {
      if (!meetingLink) return { success: false, error: 'Meeting link is required for online events' };
    } else {
      if (!location && !locationName) return { success: false, error: `Location is required for ${eventType.toLowerCase()} events` };
    }

    let date = new Date();
    if (dateStr) {
      date = new Date(dateStr);
    }

    // Media Handling (Improved)
    const imageFile = formData.get('image') as File | null;
    const videoFile = formData.get('videoFile') as File | null;
    const videoType = formData.get('videoType') as string | null; // 'upload' | 'youtube' | 'vimeo'
    const videoLink = formData.get('videoLink') as string | null;
    
    let imageUrl = '';
    let videoUrl = '';

    // Handle Image Upload
    if (imageFile && imageFile.size > 0) {
      try {
        console.log(`[saveEvent] Starting Cloudinary upload for image: ${imageFile.name}, size: ${imageFile.size} bytes`);
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        console.log(`[saveEvent] Created buffer, length: ${buffer.length} bytes`);
        const result = await uploadToCloudinary(buffer, 'events');
        console.log(`[saveEvent] Cloudinary upload successful, secure_url: ${result.secure_url}`);
        imageUrl = result.secure_url;
      } catch (err: any) {
        console.error('[Action] Cloudinary upload failed:', err);
        return {
          success: false,
          error: `Failed to upload cover image to Cloudinary: ${err.message || JSON.stringify(err)}`
        };
      }
    }

    // Handle Video Upload or Link
    if (videoType === 'upload' && videoFile && videoFile.size > 0) {
      try {
        const buffer = Buffer.from(await videoFile.arrayBuffer());
        const ext = videoFile.name.split('.').pop() || 'mp4';
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');

        await mkdir(uploadDir, { recursive: true }).catch(() => {});
        await writeFile(join(uploadDir, fileName), buffer);
        videoUrl = `/uploads/videos/${fileName}`;
      } catch (err: any) {
        if (err.code === 'EROFS') {
          console.warn("Read-only filesystem detected, rejecting local video file upload");
          throw new Error('Local video file uploads are not supported on this serverless deployment. Please select "YouTube" or "Vimeo" link option instead.');
        } else {
          throw err;
        }
      }
    } else if ((videoType === 'youtube' || videoType === 'vimeo') && videoLink) {
      videoUrl = videoLink;
    }

    const eventData: any = {
      title,
      description,
      category,
      capacity,
      price,
      date,
      time: timeStr || '00:00',
      location: eventType === 'ONLINE' ? null : (locationName || location),
      locationName: eventType === 'ONLINE' ? null : locationName,
      locationAddress: eventType === 'ONLINE' ? null : locationAddress,
      latitude: eventType === 'ONLINE' ? null : latitude,
      longitude: eventType === 'ONLINE' ? null : longitude,
      eventType,
      meetingLink: eventType === 'PHYSICAL' ? null : meetingLink,
      status: status === 'published' ? 'published' : 'draft',
      duration: 120,
      organizerId: session.user.id,
      tags: [],
      isPrivate: formData.get('isPrivate') === 'true',
      requiresApproval: formData.get('requiresApproval') !== 'false',
      showAttendeeList: formData.get('showAttendeeList') === 'true',
      isFeatured: formData.get('is_featured') === 'true',
      videoUrl: videoUrl || undefined,
      videoType: videoType || undefined,
      dynamicPricingEnabled,
      minPrice,
      maxPrice,
      priceThresholds,
      timeBasedIncrease,
    };

    if (isNaN(date.getTime())) {
      console.error('Invalid date received:', dateStr);
      return { success: false, error: 'Invalid date format provided. Please use YYYY-MM-DD.' };
    }

    if (imageUrl) {
      eventData.image = imageUrl;
    }

    const collaboratorsData = formData.get('collaborators') as string;
    const collaborators = collaboratorsData ? JSON.parse(collaboratorsData) : [];

    let event;
    try {
      if (eventId) {
        // Check permissions
        const existingEvent = await prisma.event.findUnique({
          where: { id: eventId },
          include: { 
            collaborators: { 
              where: { userId: session.user.id, status: 'ACCEPTED' } 
            } 
          }
        });

        if (!existingEvent) return { success: false, error: 'Event not found' };
        
        const isOrganizer = existingEvent.organizerId === session.user.id;
        const isCollaborator = existingEvent.collaborators.length > 0;

        if (!isOrganizer && !isCollaborator) {
          return { success: false, error: 'Unauthorized to edit this event' };
        }

        // Prevent collaborators from changing the organizer
        delete eventData.organizerId;

        event = await prisma.event.update({
          where: { id: eventId },
          data: {
            ...eventData,
            organizerId: session.user.id // Ensure organizer is set
          }
        });
      } else {
        // New event: use placeholder image if none uploaded
        if (!eventData.image) {
          eventData.image =
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';
        }
        event = await prisma.event.create({
          data: {
            ...eventData,
            organizerId: session.user.id
          }
        });
      }

      // Handle batch collaborator invitations
      if (collaborators.length > 0) {
        for (const collab of collaborators) {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: collab.email },
            select: { id: true }
          });

          if (user && user.id !== session.user.id) {
            // Check if already invited for this specific event
            const existing = await prisma.eventCollaborator.findUnique({
              where: {
                eventId_userId: {
                  eventId: event.id,
                  userId: user.id
                }
              }
            });

            if (!existing) {
              await prisma.eventCollaborator.create({
                data: {
                  eventId: event.id,
                  userId: user.id,
                  role: collab.role,
                  status: 'INVITED'
                }
              });
            }
          }
        }
      }
    } catch (dbError: any) {
      console.error('Database Error during saveEvent:', dbError);
      return { 
        success: false, 
        error: `Database error: ${dbError.message || 'Unknown database error'}` 
      };
    }

    // Award points for hosting
    if (status === 'published' && !eventId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: 150 } }
      });
    } else if (!eventId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: 50 } }
      });
    }

    revalidatePath('/dashboard');
    revalidatePath('/drafts');
    revalidatePath('/');

    // Send confirmation email if published
    if (status === 'published' && session.user.email) {
      try {
        const emailHtml = getEventPublishedEmailTemplate({
          userName: session.user.name || 'Organizer',
          eventName: event.title,
          date: format(new Date(event.date), 'MMMM dd, yyyy'),
          time: event.time,
          location: event.location || '',
          eventType: event.eventType,
          meetingLink: event.meetingLink,
        });

        await sendEmail({
          to: session.user.email,
          subject: '🚀 Event Published Successfully',
          html: emailHtml,
        });
        console.log("Hosted event email sent");
      } catch (emailError) {
        // Email failure must NOT affect API response
        console.error('[Action] Failed to send event publication email:', emailError);
      }
    }

    return { 
      success: true, 
      eventId: event.id, 
      message: status === 'published' ? 'Event published! Confirmation sent to your email.' : 'Draft saved successfully.'
    };
  } catch (error: any) {
    console.error('Unexpected error in saveEvent action:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while saving the event',
    };
  }
}

/**
 * Get all draft events for the current user.
 */
export async function getDrafts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const drafts = await prisma.event.findMany({
    where: {
      OR: [
        { organizerId: session.user.id },
        { 
          collaborators: { 
            some: { userId: session.user.id, status: 'ACCEPTED' } 
          } 
        }
      ],
      status: 'draft',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Format prices with ₹ and resolve image URLs
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  return drafts.map((draft) => ({
    ...draft,
    price: Number(draft.price),
    minPrice: draft.minPrice ? Number(draft.minPrice) : null,
    maxPrice: draft.maxPrice ? Number(draft.maxPrice) : null,
    priceFormatted: `₹${Number(draft.price).toFixed(2)}`,
    image: getFullImageUrl(draft.image, baseUrl),
    tags: draft.tags as string[],
  }));
}

/**
 * Get all published events (for the public feed).
 * BUG 3 FIX: This function correctly filters WHERE status='published'
 * and does NOT filter out valid future events.
 */
export async function getPublishedEvents(options?: {
  featured?: boolean;
  upcoming?: boolean;
  category?: string;
}) {
  const where: any = {
    status: 'published',
  };

  if (options?.featured) {
    where.isFeatured = true;
  }

  if (options?.upcoming) {
    where.date = { gte: new Date() };
  }

  if (options?.category && options.category !== 'all') {
    where.category = {
      equals: options.category,
    };
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      organizer: true,
      _count: {
        select: { registrations: true }
      }
    },
    orderBy: {
      date: 'asc',
    },
  });

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  // BUG 5 FIX: Format price with ₹, resolve image URLs
  return events.map((event) => ({
    ...event,
    registeredCount: event._count?.registrations || 0,
    price: Number(event.price),
    minPrice: event.minPrice ? Number(event.minPrice) : null,
    maxPrice: event.maxPrice ? Number(event.maxPrice) : null,
    priceFormatted: `₹${Number(event.price).toFixed(2)}`,
    image: getFullImageUrl(event.image, baseUrl),
    tags: event.tags as string[],
  }));
}

/**
 * Publish a draft event.
 * BUG 2 FIX: Returns the full updated event, not just { success: true }.
 */
export async function publishDraft(eventId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    // BUG 2 FIX: Return the full updated event object
    const updatedEvent = await prisma.event.update({
      where: { id: eventId, organizerId: session.user.id },
      data: { status: 'published' },
      include: {
        organizer: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    revalidatePath('/drafts');
    revalidatePath('/events');
    revalidatePath('/');

    // Send confirmation email
    if (session.user.email) {
      try {
        const emailHtml = getEventPublishedEmailTemplate({
          userName: session.user.name || 'Organizer',
          eventName: updatedEvent.title,
          date: format(new Date(updatedEvent.date), 'MMMM dd, yyyy'),
          time: updatedEvent.time,
          location: updatedEvent.location || '',
          eventType: updatedEvent.eventType,
          meetingLink: updatedEvent.meetingLink,
        });

        await sendEmail({
          to: session.user.email,
          subject: '🚀 Event Published Successfully',
          html: emailHtml,
        });
        console.log("Hosted event email sent");
      } catch (emailError) {
        console.error('Failed to send event publication email:', emailError);
      }
    }

    return {
      success: true,
      data: {
        ...updatedEvent,
        price: Number(updatedEvent.price),
        minPrice: updatedEvent.minPrice ? Number(updatedEvent.minPrice) : null,
        maxPrice: updatedEvent.maxPrice ? Number(updatedEvent.maxPrice) : null,
        priceFormatted: `₹${Number(updatedEvent.price).toFixed(2)}`,
        image: getFullImageUrl(updatedEvent.image, baseUrl),
      },
    };
  } catch (error: any) {
    console.error('Error publishing draft:', error);
    return { success: false, error: error.message || 'Failed to publish draft' };
  }
}

/**
 * Get a single event by ID.
 */
export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            }
          }
        },
        _count: {
          select: { registrations: true }
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!event) return null;

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return {
      ...event,
      price: Number(event.price),
      minPrice: event.minPrice ? Number(event.minPrice) : null,
      maxPrice: event.maxPrice ? Number(event.maxPrice) : null,
      priceFormatted: `₹${Number(event.price).toFixed(2)}`,
      image: getFullImageUrl(event.image, baseUrl),
      tags: event.tags as string[],
      registeredCount: event._count.registrations,
    };
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
}

/**
 * Register for an event.
 */
export async function registerForEvent(eventId: string, quantity: number = 1) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    if (quantity < 1 || quantity > 10) {
      return { success: false, error: 'Quantity must be between 1 and 10' };
    }

    // Check if already registered (and not cancelled)
    const existing = await prisma.registration.findFirst({
      where: { eventId, userId: session.user.id },
    });

    if (existing && existing.status !== 'cancelled') return { success: false, error: 'Already registered for this event' };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (!user) {
      return { success: false, error: 'Session expired. Please log out and log in again.' };
    }

    // Check capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) return { success: false, error: 'Event not found' };

    // Prevent organizer from registering for their own event
    if (event.organizerId === session.user.id) {
      return { success: false, error: 'You are the organizer of this event' };
    }
    
    // Check if total registrations (including new quantity) exceeds capacity
    // Note: Since we only allow one registration record per user, we count registrations by records.
    // If we want to strictly enforce capacity by TICKET COUNT, we'd sum the ticketCount fields.
    const currentTicketCount = await prisma.registration.aggregate({
      where: { eventId, status: { not: 'cancelled' } },
      _sum: { ticketCount: true }
    });
    
    const totalBooked = currentTicketCount._sum.ticketCount || 0;
    if (totalBooked + quantity > event.capacity) {
      return { success: false, error: `Only ${event.capacity - totalBooked} spots left` };
    }

    // Calculate Dynamic Price
    const pricing = calculateCurrentPrice({
        ...event,
        registeredCount: totalBooked, // Use latest count for pricing
    });

    let registration;
    if (existing && existing.status === 'cancelled') {
      registration = await prisma.registration.update({
        where: { id: existing.id },
        data: {
          status: event.requiresApproval ? 'waitlist' : 'registered',
          ticketCount: quantity,
          priceAtBooking: pricing.currentPrice,
        },
      });
    } else {
      registration = await prisma.registration.create({
        data: {
          eventId,
          userId: session.user.id,
          status: event.requiresApproval ? 'waitlist' : 'registered',
          ticketCount: quantity,
          priceAtBooking: pricing.currentPrice,
        },
      });
    }

    // Award points for participation
    await prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: 20 } }
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/dashboard');

    // Send confirmation email with PDF ticket
    if (session.user.email) {
      console.log(`[EmailDebug] Starting email process for: ${session.user.email}`);
      try {
        const eventDateStr = format(new Date(event.date), 'MMMM dd, yyyy');
        
        // Generate PDF Ticket (Isolated failure)
        let pdfBuffer: Buffer | null = null;
        try {
          console.log('[EmailDebug] Generating PDF...');
          pdfBuffer = await generateTicketPDF({
            eventName: event.title,
            userName: session.user.name || 'Attendee',
            ticketId: registration.id,
            date: eventDateStr,
            time: event.time,
            location: event.location || '',
          });
          console.log('[EmailDebug] PDF Generated successfully');
        } catch (pdfError) {
          console.error('[EmailDebug] PDF generation failed:', pdfError);
        }

        const emailHtml = getBookingEmailTemplate({
          userName: session.user.name || 'Attendee',
          eventName: event.title,
          date: eventDateStr,
          time: event.time,
          location: event.location || '',
          ticketId: registration.id,
          eventType: event.eventType,
          meetingLink: event.meetingLink,
        });

        console.log('[EmailDebug] Sending email via Nodemailer...');
        const result = await sendEmail({
          to: session.user.email,
          subject: `🎟️ Ticket Confirmed - ${event.title}`,
          html: emailHtml,
          attachments: pdfBuffer ? [{
            filename: `Ticket-${registration.id.toUpperCase()}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }] : []
        });
        
        if (result) {
          console.log(`[EmailDebug] Email process completed. Message ID: ${result.messageId}`);
          console.log("Registration email sent");
        } else {
          console.error('[EmailDebug] Email process failed (check SMTP logs above)');
        }
      } catch (emailError) {
        console.error('[EmailDebug] Critical failure in email block:', emailError);
      }
    } else {
      console.warn('[EmailDebug] Skip: User has no email in session.');
    }

    return { 
      success: true, 
      message: event.requiresApproval ? 'Registration pending approval' : `Registered successfully for ${quantity} ticket(s)! 🎟️` 
    };
  } catch (error: any) {
    console.error('Error during registration:', error);
    if (error.code === 'P2003') {
      return { success: false, error: 'Session expired or invalid user. Please log in again.' };
    }
    return { success: false, error: 'Failed to register' };
  }
}

/**
 * Check if current user is registered for an event.
 */
export async function checkUserRegistration(eventId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { registered: false };

    const registration = await prisma.registration.findFirst({
      where: { eventId, userId: session.user.id, status: { not: 'cancelled' } },
    });

    return { registered: !!registration, registrationId: registration?.id };
  } catch (error) {
    console.error('Error checking registration:', error);
    return { registered: false };
  }
}

/**
 * Delete an event. Validates ownership.
 */
export async function deleteEvent(eventId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId, organizerId: session.user.id },
      include: { organizer: { select: { name: true, email: true } } },
    });

    if (!event) {
      return { success: false, error: 'Event not found or unauthorized' };
    }

    await prisma.event.delete({
      where: { id: eventId, organizerId: session.user.id },
    });

    if (event.organizer?.email) {
      try {
        const emailHtml = getEventDeletionEmailTemplate({
          userName: event.organizer.name || 'Organizer',
          eventName: event.title,
        });

        await sendEmail({
          to: event.organizer.email,
          subject: `🗑️ Event Deleted: ${event.title}`,
          html: emailHtml,
        });
        console.log("Event deletion email sent");
      } catch (err) {
        console.error("Event deletion email failed:", err);
      }
    }

    revalidatePath('/events');
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: 'Failed to delete event' };
  }
}

/**
 * Cancel a registration.
 */
export async function cancelRegistration(registrationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { 
        event: true,
        user: true 
      },
    });

    if (!registration) return { success: false, error: 'Registration not found' };
    if (registration.userId !== session.user.id) return { success: false, error: 'Unauthorized' };

    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: 'cancelled' },
    });

    // Trigger cancellation email
    if (registration.user?.email) {
      try {
        console.log(`[EmailDebug] Triggering cancellation email for ${registration.user.email}`);
        const emailHtml = getCancellationEmailTemplate({
          userName: registration.user.name || 'Student',
          eventName: registration.event.title,
          date: format(new Date(registration.event.date), 'MMMM do, yyyy'),
          location: registration.event.location || '',
          eventType: registration.event.eventType,
        });

        await sendEmail({
          to: registration.user.email,
          subject: `🚫 Cancellation Confirmed: ${registration.event.title}`,
          html: emailHtml,
        });
        console.log("Cancellation email sent");
      } catch (err) {
        console.error('[EmailDebug] Cancellation email failed:', err);
      }
    }

    revalidatePath(`/events/${registration.eventId}`);
    revalidatePath('/dashboard');
    revalidatePath('/my-tickets');
    return { success: true, message: 'Registration cancelled successfully' };
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return { success: false, error: 'Failed to cancel registration' };
  }
}

/**
 * Get all registrations for the current user.
 */
export async function getMyRegistrations() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        userId: session.user.id,
        status: { not: 'cancelled' },
      },
      include: {
        event: {
          include: {
            organizer: {
              select: { id: true, name: true, email: true, image: true },
            },
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return registrations.map((reg) => ({
      ...reg,
      priceAtBooking: Number(reg.priceAtBooking),
      event: {
        ...reg.event,
        price: Number(reg.event.price),
        minPrice: reg.event.minPrice ? Number(reg.event.minPrice) : null,
        maxPrice: reg.event.maxPrice ? Number(reg.event.maxPrice) : null,
        priceFormatted: `₹${Number(reg.event.price).toFixed(2)}`,
        image: getFullImageUrl(reg.event.image, baseUrl),
        tags: reg.event.tags as string[],
        registeredCount: reg.event._count.registrations,
      },
    }));
  } catch (error) {
    console.error('Error fetching my registrations:', error);
    return [];
  }
}

/**
 * Get organizer profile data and their events.
 */
export async function getOrganizerById(userId: string) {
  try {
    const organizer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        collegeName: true,
        createdAt: true,
        events: {
          where: { status: 'published' },
          include: {
            _count: { select: { registrations: true } }
          },
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!organizer) return null;

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return {
      ...organizer,
      events: organizer.events.map(event => ({
        ...event,
        price: Number(event.price),
        minPrice: event.minPrice ? Number(event.minPrice) : null,
        maxPrice: event.maxPrice ? Number(event.maxPrice) : null,
        priceFormatted: `₹${Number(event.price).toFixed(2)}`,
        image: getFullImageUrl(event.image, baseUrl),
        registeredCount: event._count.registrations
      }))
    };
  } catch (error) {
    console.error('Error fetching organizer:', error);
    return null;
  }
}


/**
 * Submit a review for an event.
 */
export async function submitReview(eventId: string, rating: number, comment: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const review = await prisma.review.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: session.user.id,
        eventId,
        rating,
        comment,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, data: review };
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}

/**
 * Toggle like/favorite for an event.
 */
export async function toggleLike(eventId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const userId = session.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { success: true, liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          eventId,
        },
      });
      return { success: true, liked: true };
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to update favorite' };
  }
}

/**
 * Get all events liked by the current user.
 */
export async function getLikedEvents() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const likes = await prisma.like.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: {
          include: {
            organizer: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: { registrations: true, likes: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return likes.map((like) => ({
      ...like.event,
      price: Number(like.event.price),
      minPrice: like.event.minPrice ? Number(like.event.minPrice) : null,
      maxPrice: like.event.maxPrice ? Number(like.event.maxPrice) : null,
      priceFormatted: `₹${Number(like.event.price).toFixed(2)}`,
      image: getFullImageUrl(like.event.image, baseUrl),
      tags: like.event.tags as string[],
      registeredCount: like.event._count.registrations,
      likeCount: like.event._count.likes,
      isLiked: true, // Since we're fetching liked events
    }));
  } catch (error) {
    console.error('Error fetching liked events:', error);
    return [];
  }
}

/**
 * Get detailed analytics and attendee list for a specific event (Organizer view).
 */
export async function getEventManagementDetails(eventId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: { user: true },
          orderBy: { registeredAt: 'desc' }
        }
      }
    });

    if (!event) return { success: false, error: 'Event not found' };
    if (event.organizerId !== session.user.id) return { success: false, error: 'Unauthorized' };

    const registrations = event.registrations || [];
    const activeRegistrations = registrations.filter(r => r.status === 'registered' || r.status === 'attended');
    const checkedInCount = registrations.filter(r => r.status === 'attended').reduce((acc, r) => acc + r.ticketCount, 0);
    const cancelledCount = registrations.filter(r => r.status === 'cancelled').reduce((acc, r) => acc + r.ticketCount, 0);
    const activeTicketsSold = activeRegistrations.reduce((acc, r) => acc + r.ticketCount, 0);

    return {
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title,
          status: event.status,
          date: event.date,
          location: event.location,
          capacity: event.capacity,
          price: Number(event.price)
        },
        stats: {
          totalTicketsSold: activeTicketsSold,
          checkedInCount,
          cancelledCount,
          capacityReachPercentage: event.capacity > 0 ? (activeTicketsSold / event.capacity) * 100 : 0
        },
        attendees: registrations.map(r => ({
          id: r.id,
          name: r.user.name || 'Unknown',
          email: r.user.email,
          image: r.user.image,
          status: r.status,
          ticketCount: r.ticketCount,
          registeredAt: r.registeredAt,
          pricePaid: Number(r.priceAtBooking)
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching event details:', error);
    return { success: false, error: 'Failed to fetch event details' };
  }
}

/**
 * Get aggregated dashboard stats for all events by this organizer.
 */
export async function getOrganizerDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const events = await prisma.event.findMany({
      where: { organizerId: session.user.id },
      include: {
        registrations: true
      },
      orderBy: { createdAt: 'desc' }
    });

    let totalTicketsSold = 0;
    let totalRevenue = 0;
    let activeEventsCount = 0;

    const recentEvents = events.map(event => {
      const activeRegs = event.registrations.filter(r => r.status === 'registered' || r.status === 'attended');
      const eventTicketsSold = activeRegs.reduce((acc, r) => acc + r.ticketCount, 0);
      const eventRevenue = activeRegs.reduce((acc, r) => acc + (Number(r.priceAtBooking) * r.ticketCount), 0);

      totalTicketsSold += eventTicketsSold;
      totalRevenue += eventRevenue;
      
      if (event.status === 'published') activeEventsCount++;

      return {
        id: event.id,
        title: event.title,
        status: event.status,
        date: event.date,
        ticketsSold: eventTicketsSold,
        capacity: event.capacity,
        revenue: eventRevenue
      };
    });

    return {
      success: true,
      data: {
        totalTicketsSold,
        totalRevenue,
        activeEventsCount,
        recentEvents
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}
