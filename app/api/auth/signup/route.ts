import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      collegeName,
      year,
      department,
      interests,
      image,
      userType,
      studentId,
      organizationName,
      designation,
      employeeId,
      graduationYear,
      currentProfession,
      organizerType,
      officialEmail,
      websiteOrInstagram,
      companyName,
      jobRole,
      preferredCity,
      interestedCategories,
      purpose,
      preferredEventTypes,
      profilePhoto,
    } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }

    // Role-specific and personalization validations if userType is provided (Step 3 onboarding)
    if (userType) {
      if (!preferredCity) {
        return NextResponse.json({ success: false, error: 'Preferred city is required' }, { status: 400 });
      }
      if (!purpose || !Array.isArray(purpose) || purpose.length === 0) {
        return NextResponse.json({ success: false, error: 'At least one purpose is required' }, { status: 400 });
      }
      if (!interestedCategories || !Array.isArray(interestedCategories) || interestedCategories.length === 0) {
        return NextResponse.json({ success: false, error: 'At least one interested category is required' }, { status: 400 });
      }
      if (!preferredEventTypes || !Array.isArray(preferredEventTypes) || preferredEventTypes.length === 0) {
        return NextResponse.json({ success: false, error: 'At least one preferred event type is required' }, { status: 400 });
      }

      if (userType === 'Student') {
        if (!collegeName) return NextResponse.json({ success: false, error: 'College Name is required for Students' }, { status: 400 });
        if (!year) return NextResponse.json({ success: false, error: 'Year is required for Students' }, { status: 400 });
        if (!department) return NextResponse.json({ success: false, error: 'Department is required for Students' }, { status: 400 });
      } else if (userType === 'Faculty / Staff') {
        if (!organizationName) return NextResponse.json({ success: false, error: 'Organization/College Name is required for Faculty / Staff' }, { status: 400 });
        if (!designation) return NextResponse.json({ success: false, error: 'Designation is required for Faculty / Staff' }, { status: 400 });
      } else if (userType === 'Alumni') {
        if (!collegeName) return NextResponse.json({ success: false, error: 'College Name is required for Alumni' }, { status: 400 });
        if (!graduationYear) return NextResponse.json({ success: false, error: 'Graduation Year is required for Alumni' }, { status: 400 });
      } else if (userType === 'Event Organizer') {
        if (!organizationName) return NextResponse.json({ success: false, error: 'Organization/Club/Company Name is required for Event Organizers' }, { status: 400 });
        if (!organizerType) return NextResponse.json({ success: false, error: 'Organizer Type is required for Event Organizers' }, { status: 400 });
      }
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Legacy year helper
    let parsedLegacyYear = null;
    if (year) {
      const parsed = parseInt(year);
      if (!isNaN(parsed)) {
        parsedLegacyYear = parsed;
      } else if (typeof year === 'string') {
        if (year.includes('1')) parsedLegacyYear = 1;
        else if (year.includes('2')) parsedLegacyYear = 2;
        else if (year.includes('3')) parsedLegacyYear = 3;
        else if (year.includes('4')) parsedLegacyYear = 4;
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        collegeName: collegeName || null,
        year: parsedLegacyYear,
        department: department || null,
        interests: interestedCategories || interests || [],
        image: profilePhoto || image || null,
        userType: userType || 'Student',
        studentId: studentId || null,
        organizationName: organizationName || null,
        designation: designation || null,
        employeeId: employeeId || null,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        currentProfession: currentProfession || null,
        organizerType: organizerType || null,
        officialEmail: officialEmail || null,
        websiteOrInstagram: websiteOrInstagram || null,
        companyName: companyName || null,
        jobRole: jobRole || null,
        preferredCity: preferredCity || null,
        interestedCategories: interestedCategories || interests || [],
        purpose: purpose || [],
        preferredEventTypes: preferredEventTypes || [],
        profilePhoto: profilePhoto || image || null,
        role: userType === 'Event Organizer' ? 'organizer' : 'student',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      { success: true, message: 'User created successfully', data: user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
