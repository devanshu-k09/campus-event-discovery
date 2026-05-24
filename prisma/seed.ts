import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationtoken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // ─── Create Users ──────────────────────────────────────────

  const student = await prisma.user.create({
    data: {
      name: 'Arjun Sharma',
      email: 'arjun.sharma@college.edu',
      password: hashedPassword,
      collegeName: 'Mumbai University',
      year: 3,
      department: 'Computer Science',
      interests: JSON.parse('["Tech", "Sports", "Career"]'),
      points: 450,
      role: 'student',
    },
  });

  const organizer = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      password: hashedPassword,
      collegeName: 'Mumbai University',
      year: 4,
      department: 'Event Management',
      interests: JSON.parse('["Cultural", "Social", "Workshop"]'),
      points: 1200,
      role: 'organizer',
    },
  });

  // ─── Create Events ─────────────────────────────────────────

  // Event 1: Published + Featured (price in ₹)
  await prisma.event.create({
    data: {
      title: 'AI & Machine Learning Workshop',
      description:
        'A comprehensive workshop on the fundamentals of AI and ML with hands-on projects using Python and TensorFlow. Learn from industry experts and build your first neural network.',
      image:
        'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1632&auto=format&fit=crop',
      category: 'Tech',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: '10:00',
      duration: 240,
      location: 'Computer Lab 3, Watson Block',
      coordinates: '19.0760,72.8777',
      price: 499.0,
      capacity: 60,
      tags: JSON.parse('["AI", "ML", "Python", "Workshop"]'),
      popularityScore: 92,
      viewCount: 1250,
      status: 'published',
      isFeatured: true,
      isPrivate: false,
      requiresApproval: false,
      showAttendeeList: true,
      organizerId: organizer.id,
    },
  });

  // Event 2: Published, not featured, free event
  await prisma.event.create({
    data: {
      title: 'Annual Sports Day 2026',
      description:
        'Join us for a day of competitive sports, team spirit, and fun. Events include cricket, football, athletics, and more. Prizes for top performers.',
      image:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470&auto=format&fit=crop',
      category: 'Sports',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      time: '08:00',
      duration: 480,
      location: 'Main College Ground',
      coordinates: '19.0720,72.8750',
      price: 0.0,
      capacity: 500,
      tags: JSON.parse('["Sports", "Competition", "Fun"]'),
      popularityScore: 98,
      viewCount: 3400,
      status: 'published',
      isFeatured: false,
      isPrivate: false,
      requiresApproval: false,
      showAttendeeList: true,
      organizerId: organizer.id,
    },
  });

  // Event 3: Draft event (student's draft)
  await prisma.event.create({
    data: {
      title: 'Startup Pitch Competition',
      description:
        'Pitch your startup idea to a panel of investors and industry experts. Win cash prizes and mentorship opportunities worth ₹50,000.',
      image:
        'https://images.unsplash.com/photo-1559136555-930b7a4754a4?q=80&w=1632&auto=format&fit=crop',
      category: 'Career',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      time: '14:00',
      duration: 240,
      location: 'Auditorium Hall A',
      coordinates: '19.0740,72.8720',
      price: 200.0,
      capacity: 100,
      tags: JSON.parse('["Startup", "Business", "Pitch", "Entrepreneurship"]'),
      popularityScore: 0,
      viewCount: 0,
      status: 'draft',
      isFeatured: false,
      isPrivate: false,
      requiresApproval: true,
      showAttendeeList: false,
      organizerId: student.id,
    },
  });

  // Event 4: Published + Featured, paid event (₹)
  await prisma.event.create({
    data: {
      title: 'Cultural Night: Festival of Colors',
      description:
        'Celebrate the vibrant culture with dance, music, and colors. A night to remember with DJ and live performances by renowned artists.',
      image:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop',
      category: 'Cultural',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      time: '18:00',
      duration: 300,
      location: 'Open Air Amphitheatre',
      coordinates: '19.0800,72.8800',
      price: 350.0,
      capacity: 400,
      tags: JSON.parse('["Dance", "Music", "Festival", "Party"]'),
      popularityScore: 95,
      viewCount: 2800,
      status: 'published',
      isFeatured: true,
      isPrivate: false,
      requiresApproval: false,
      showAttendeeList: true,
      organizerId: organizer.id,
    },
  });

  console.log('✅ Seed data inserted successfully');
  console.log(`   Users:  ${student.name} (student), ${organizer.name} (organizer)`);
  console.log('   Events: 3 published (2 featured), 1 draft');
  console.log('   Prices: ₹0, ₹200, ₹350, ₹499');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
