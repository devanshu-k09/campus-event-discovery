'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, ArrowLeft, ArrowRight,
    Music, Trophy, Laptop, Heart, Briefcase, UserCircle, Upload,
    Palette, Users, Gamepad2, Sprout, Hammer, Globe, BadgeCheck, GraduationCap, Flame,
    Award, Compass, Calendar, Building, HelpCircle, CheckCircle
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// --- Schemas ---
const step1Schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, { message: "You must accept the terms" }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const step2Schema = z.object({
    interests: z.array(z.string()).min(3, 'Select at least 3 interests'),
});

const step3Schema = z.object({
    userType: z.string().min(1, 'Please select who you are joining as'),
    preferredCity: z.string().min(1, 'Please select your preferred city'),
    purpose: z.array(z.string()).min(1, 'Please select at least 1 purpose'),
    interestedCategories: z.array(z.string()).min(1, 'Please select at least 1 category'),
    preferredEventTypes: z.array(z.string()).min(1, 'Please select at least 1 event type'),
    
    // Student
    college: z.string().optional(),
    year: z.string().optional(),
    department: z.string().optional(),
    studentId: z.string().optional(),

    // Faculty/Staff
    organizationName: z.string().optional(),
    designation: z.string().optional(),
    employeeId: z.string().optional(),

    // Alumni
    graduationYear: z.string().optional(),
    currentProfession: z.string().optional(),

    // Event Organizer
    organizerType: z.string().optional(),
    officialEmail: z.string().optional(),
    websiteOrInstagram: z.string().optional(),

    // Working Professional
    companyName: z.string().optional(),
    jobRole: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.userType === 'Student') {
        if (!data.college || data.college.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'College Name is required',
                path: ['college'],
            });
        }
        if (!data.year || data.year.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Year is required',
                path: ['year'],
            });
        }
        if (!data.department || data.department.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Department is required',
                path: ['department'],
            });
        }
    } else if (data.userType === 'Faculty / Staff') {
        if (!data.organizationName || data.organizationName.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Organization/College Name is required',
                path: ['organizationName'],
            });
        }
        if (!data.designation || data.designation.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Designation is required',
                path: ['designation'],
            });
        }
    } else if (data.userType === 'Alumni') {
        if (!data.college || data.college.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'College Name is required',
                path: ['college'],
            });
        }
        if (!data.graduationYear || data.graduationYear.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Graduation Year is required',
                path: ['graduationYear'],
            });
        }
    } else if (data.userType === 'Event Organizer') {
        if (!data.organizationName || data.organizationName.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Organization/Club/Company Name is required',
                path: ['organizationName'],
            });
        }
        if (!data.organizerType || data.organizerType.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Organizer Type is required',
                path: ['organizerType'],
            });
        }
    }
});

const signupSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type SignupFormData = z.infer<typeof signupSchema>;

// --- Constants ---
import { CATEGORIES, COLLEGES, DEPARTMENTS } from '@/lib/constants';

const CITIES = ['Amravati', 'Nagpur', 'Pune', 'Mumbai', 'Online', 'Other'];

const PURPOSES = [
    'Discover events',
    'Book tickets',
    'Host events',
    'Join communities',
    'Network with people',
    'Volunteer',
    'Learn new skills',
    'Promote my event'
];

const INTERESTS_LIST = [
    'Music',
    'Workshops',
    'Sports',
    'Tech',
    'Art & Design',
    'Food',
    'Networking',
    'Cultural',
    'Gaming',
    'Career',
    'Hackathons',
    'Competitions'
];

const EVENT_TYPES = [
    'Free Events',
    'Paid Events',
    'Online Events',
    'Offline Events',
    'College Events',
    'Public Events',
    'Workshops',
    'Competitions',
    'Meetups',
    'Concerts',
    'Sports Events',
    'Hackathons',
    'Cultural Events'
];

const ORGANIZER_TYPES = [
    'College Club',
    'Independent Organizer',
    'Startup / Company',
    'NGO / Community',
    'Cultural Group',
    'Sports Group',
    'Other'
];

const USER_ROLES = [
    { value: 'Student', label: 'Student', icon: GraduationCap, description: 'College / university student' },
    { value: 'Faculty / Staff', label: 'Faculty / Staff', icon: Building, description: 'Academic staff / faculty' },
    { value: 'Alumni', label: 'Alumni', icon: Award, description: 'Graduate / former student' },
    { value: 'Event Organizer', label: 'Event Organizer', icon: Calendar, description: 'Club, NGO, company, or team' },
    { value: 'Guest / Visitor', label: 'Guest / Visitor', icon: Compass, description: 'General attendee or guest' },
    { value: 'Working Professional', label: 'Working Professional', icon: Briefcase, description: 'Industry professional' }
];

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        trigger,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            interests: [],
            acceptTerms: false,
            userType: 'Student',
            preferredCity: '',
            purpose: [],
            interestedCategories: [],
            preferredEventTypes: [],
            college: '',
            year: '',
            department: '',
            studentId: '',
            organizationName: '',
            designation: '',
            employeeId: '',
            graduationYear: '',
            currentProfession: '',
            organizerType: '',
            officialEmail: '',
            websiteOrInstagram: '',
            companyName: '',
            jobRole: '',
        }
    });

    const formData = watch();

    const handleNext = async () => {
        let isValid = false;
        if (step === 1) {
            const result = await trigger(['name', 'email', 'password', 'confirmPassword', 'acceptTerms']);
            isValid = result;
        } else if (step === 2) {
            const result = await trigger(['interests']);
            isValid = result;
            if (isValid) {
                setValue('interestedCategories', watch('interests'));
            }
        }

        if (isValid) {
            setStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setStep(prev => prev - 1);
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    collegeName: data.college,
                    year: data.year,
                    department: data.department,
                    interests: data.interests,
                    image: previewImage,
                    userType: data.userType,
                    studentId: data.studentId,
                    organizationName: data.organizationName,
                    designation: data.designation,
                    employeeId: data.employeeId,
                    graduationYear: data.graduationYear,
                    currentProfession: data.currentProfession,
                    organizerType: data.organizerType,
                    officialEmail: data.officialEmail,
                    websiteOrInstagram: data.websiteOrInstagram,
                    companyName: data.companyName,
                    jobRole: data.jobRole,
                    preferredCity: data.preferredCity,
                    interestedCategories: data.interestedCategories,
                    purpose: data.purpose,
                    preferredEventTypes: data.preferredEventTypes,
                    profilePhoto: previewImage
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Signup failed');
            }

            setIsSuccess(true);
            toast.success("Account created successfully!");

            // Auto-login after signup
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInResult?.ok) {
                router.push('/events');
                router.refresh();
            } else {
                // If signin fails, redirect to login page
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadstart = () => setIsUploading(true);
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Hydration Fix: Ensure client-only rendering for motion components ---
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-6 max-w-md w-full"
                >
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold">You're all set!</h2>
                    <p className="text-muted-foreground">Redirecting you to discover amazing events...</p>
                    <div className="w-full bg-muted rounded-full h-1 mt-8 overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex bg-[#f6f6f8] dark:bg-[#101122] font-display">

            {/* LEFT SIDE - Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:p-24 bg-white dark:bg-[#101122] relative z-10 h-screen overflow-hidden">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-12 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <ArrowRight className="w-6 h-6 rotate-180 hidden" /> {/* Placeholder for logic if needed */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">CampusPulse</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                        <span className="text-primary">0{step}</span> / 03
                    </div>
                </div>

                {/* Stepper Desktop */}
                <div className="hidden md:flex gap-8 mb-12 shrink-0">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step > 1 ? 'bg-primary/10 text-primary border-primary/20' : step === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            {step > 1 ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">1</span>}
                        </div>
                        <span className={`text-sm font-semibold ${step === 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Basic Info</span>
                    </div>
                    <div className="h-px w-8 bg-slate-200 dark:bg-slate-800 self-center"></div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step > 2 ? 'bg-primary/10 text-primary border-primary/20' : step === 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            {step > 2 ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">2</span>}
                        </div>
                        <span className={`text-sm font-semibold ${step === 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Interests</span>
                    </div>
                    <div className="h-px w-8 bg-slate-200 dark:bg-slate-800 self-center"></div>

                    {/* Step 3 */}
                    <div className={`flex items-center gap-3 ${step < 3 ? 'opacity-40' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === 3 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            <span className="text-sm font-bold">3</span>
                        </div>
                        <span className={`text-sm font-semibold ${step === 3 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Verification</span>
                    </div>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-1 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="mb-6">
                                    <h1 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Create your account</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Start your journey with us today.</p>
                                </div>

                                <div className="space-y-4">
                                    <FormInput
                                        label="Full Name"
                                        placeholder="John Doe"
                                        icon={User}
                                        error={errors.name}
                                        {...register('name')}
                                    />
                                    <FormInput
                                        label="Email Address"
                                        type="email"
                                        placeholder="student@college.edu"
                                        icon={Mail}
                                        error={errors.email}
                                        {...register('email')}
                                    />

                                    <div className="space-y-2">
                                        <FormInput
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            icon={Lock}
                                            error={errors.password}
                                            rightElement={
                                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            }
                                            {...register('password')}
                                        />
                                        <PasswordStrength password={formData.password} />
                                    </div>

                                    <FormInput
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Repeat password"
                                        icon={Lock}
                                        error={errors.confirmPassword}
                                        {...register('confirmPassword')}
                                    />

                                    <div className="flex items-top space-x-2 pt-2">
                                        <Controller
                                            name="acceptTerms"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    id="terms"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            )}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
                                            >
                                                I accept the terms and conditions
                                            </label>
                                            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                            >
                                <div className="mb-10">
                                    <h1 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Tailor your feed.</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Select at least <span className="text-primary font-bold">3 interests</span> to help us find the best events for you.</p>
                                </div>

                                <Controller
                                    name="interests"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                                            {CATEGORIES.map((cat) => {
                                                const isSelected = field.value?.includes(cat.id);
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const newVal = isSelected
                                                                ? field.value.filter(c => c !== cat.id)
                                                                : [...field.value, cat.id];
                                                            field.onChange(newVal);
                                                        }}
                                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all group ${isSelected
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
                                                            }`}
                                                    >
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isSelected
                                                            ? 'bg-primary text-white'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                                            }`}>
                                                            <cat.icon className="w-6 h-6" />
                                                        </div>
                                                        <span className={`font-semibold transition-colors ${isSelected
                                                            ? 'text-slate-900 dark:text-white font-bold'
                                                            : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                                                            }`}>
                                                            {cat.label}
                                                        </span>
                                                        <div className={`mt-2 transition-opacity ${isSelected ? 'text-primary opacity-100' : 'opacity-0'}`}>
                                                            {isSelected ? <BadgeCheck className="w-5 h-5" /> : <div className="w-5 h-5" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                />
                                {errors.interests && <p className="text-center text-destructive font-medium mt-[-2rem] mb-4">{errors.interests.message}</p>}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8 pb-12"
                            >
                                <div className="mb-6">
                                    <h1 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Profile Setup</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Personalize your profile to unlock event personalization.</p>
                                </div>

                                {/* I am joining as... */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">I am joining as</label>
                                    <Controller
                                        name="userType"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {USER_ROLES.map((role) => {
                                                    const isSelected = field.value === role.value;
                                                    const Icon = role.icon;
                                                    return (
                                                        <button
                                                            key={role.value}
                                                            type="button"
                                                            onClick={() => {
                                                                field.onChange(role.value);
                                                            }}
                                                            className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                                                                isSelected
                                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-2 ring-primary/20'
                                                                    : 'border-slate-200 dark:border-slate-850 hover:border-primary/50 bg-white dark:bg-slate-900/50'
                                                            }`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                                isSelected ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                            }`}>
                                                                <Icon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{role.label}</p>
                                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{role.description}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    />
                                    {errors.userType && <p className="text-xs text-destructive mt-1">{errors.userType.message}</p>}
                                </div>

                                {/* Dynamic Fields based on userType */}
                                <AnimatePresence mode="wait">
                                    {formData.userType && (
                                        <motion.div
                                            key={formData.userType}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-105 dark:border-slate-800/50"
                                        >
                                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{formData.userType} Information</p>
                                            
                                            {formData.userType === 'Student' && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-650 dark:text-slate-400">Select College / University</label>
                                                        <Controller
                                                            name="college"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger className={errors.college ? "border-destructive" : ""}>
                                                                        <SelectValue placeholder="Select your college" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.college && <p className="text-xs text-destructive">{errors.college.message}</p>}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-650 dark:text-slate-400">Year</label>
                                                            <Controller
                                                                name="year"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger className={errors.year ? "border-destructive" : ""}>
                                                                            <SelectValue placeholder="Year" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1st">1st Year</SelectItem>
                                                                            <SelectItem value="2nd">2nd Year</SelectItem>
                                                                            <SelectItem value="3rd">3rd Year</SelectItem>
                                                                            <SelectItem value="4th">4th Year</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-650 dark:text-slate-400">Department</label>
                                                            <Controller
                                                                name="department"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                                                                            <SelectValue placeholder="Dept" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-650 dark:text-slate-400">Student ID / Roll Number (Optional)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your student ID"
                                                            {...register('studentId')}
                                                            className="w-full bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {formData.userType === 'Faculty / Staff' && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Organization / College Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter college or organization"
                                                            {...register('organizationName')}
                                                            className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                        />
                                                        {errors.organizationName && <p className="text-xs text-destructive">{errors.organizationName.message}</p>}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Department</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Physics, HR"
                                                                {...register('department')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Designation</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Professor, Manager"
                                                                {...register('designation')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                            {errors.designation && <p className="text-xs text-destructive">{errors.designation.message}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Employee ID (Optional)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your employee ID"
                                                            {...register('employeeId')}
                                                            className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {formData.userType === 'Alumni' && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-655 dark:text-slate-400">College / University Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter graduated college"
                                                            {...register('college')}
                                                            className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                        />
                                                        {errors.college && <p className="text-xs text-destructive">{errors.college.message}</p>}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Graduation Year</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. 2022"
                                                                {...register('graduationYear')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                            {errors.graduationYear && <p className="text-xs text-destructive">{errors.graduationYear.message}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Department / Course</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. B.Tech CS, Mechanical"
                                                                {...register('department')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Current Profession (Optional)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Software Engineer at Google"
                                                            {...register('currentProfession')}
                                                            className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {formData.userType === 'Event Organizer' && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Organization / Club / Company</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Organization name"
                                                                {...register('organizationName')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                            {errors.organizationName && <p className="text-xs text-destructive">{errors.organizationName.message}</p>}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Organizer Type</label>
                                                            <Controller
                                                                name="organizerType"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger className={errors.organizerType ? "border-destructive" : ""}>
                                                                            <SelectValue placeholder="Type" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {ORGANIZER_TYPES.map(ot => <SelectItem key={ot} value={ot}>{ot}</SelectItem>)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.organizerType && <p className="text-xs text-destructive">{errors.organizerType.message}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Official Email (Optional)</label>
                                                            <input
                                                                type="email"
                                                                placeholder="org@example.com"
                                                                {...register('officialEmail')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Website / Instagram (Optional)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="instagram.com/club"
                                                                {...register('websiteOrInstagram')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {formData.userType === 'Working Professional' && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Company / Org (Optional)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Acme Corp"
                                                                {...register('companyName')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-655 dark:text-slate-400">Job Role (Optional)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Product Manager"
                                                                {...register('jobRole')}
                                                                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {formData.userType === 'Guest / Visitor' && (
                                                <div className="text-xs font-semibold text-slate-400 p-2 text-center">
                                                    No additional details required. Please select your preferences below!
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Common Personalization Fields */}
                                <div className="space-y-6 pt-2">
                                    <div className="h-px bg-slate-100 dark:bg-slate-800" />
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Personalization Preferences</p>

                                    {/* 1. Preferred City */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred City</label>
                                        <Controller
                                            name="preferredCity"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className={errors.preferredCity ? "border-destructive" : ""}>
                                                        <SelectValue placeholder="Select your preferred city" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.preferredCity && <p className="text-xs text-destructive">{errors.preferredCity.message}</p>}
                                    </div>

                                    {/* 2. Purpose on CampusPulse */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Purpose on CampusPulse</label>
                                        <Controller
                                            name="purpose"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-wrap gap-2">
                                                    {PURPOSES.map((p) => {
                                                        const isSelected = field.value?.includes(p);
                                                        return (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentVal = field.value || [];
                                                                    const newVal = isSelected
                                                                        ? currentVal.filter(item => item !== p)
                                                                        : [...currentVal, p];
                                                                    field.onChange(newVal);
                                                                }}
                                                                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                                                                    isSelected
                                                                        ? 'bg-primary border-primary text-white shadow-sm'
                                                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-650 dark:text-slate-400 hover:border-primary/50'
                                                                }`}
                                                            >
                                                                {p}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                        {errors.purpose && <p className="text-xs text-destructive">{errors.purpose.message}</p>}
                                    </div>

                                    {/* 3. Interested Categories */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interested Categories</label>
                                        <Controller
                                            name="interestedCategories"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-wrap gap-2">
                                                    {INTERESTS_LIST.map((ic) => {
                                                        const isSelected = field.value?.includes(ic);
                                                        return (
                                                            <button
                                                                key={ic}
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentVal = field.value || [];
                                                                    const newVal = isSelected
                                                                        ? currentVal.filter(item => item !== ic)
                                                                        : [...currentVal, ic];
                                                                    field.onChange(newVal);
                                                                }}
                                                                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                                                                    isSelected
                                                                        ? 'bg-primary border-primary text-white shadow-sm'
                                                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-650 dark:text-slate-400 hover:border-primary/50'
                                                                }`}
                                                            >
                                                                {ic}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                        {errors.interestedCategories && <p className="text-xs text-destructive">{errors.interestedCategories.message}</p>}
                                    </div>

                                    {/* 4. Preferred Event Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Event Type</label>
                                        <Controller
                                            name="preferredEventTypes"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-wrap gap-2">
                                                    {EVENT_TYPES.map((et) => {
                                                        const isSelected = field.value?.includes(et);
                                                        return (
                                                            <button
                                                                key={et}
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentVal = field.value || [];
                                                                    const newVal = isSelected
                                                                        ? currentVal.filter(item => item !== et)
                                                                        : [...currentVal, et];
                                                                    field.onChange(newVal);
                                                                }}
                                                                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                                                                    isSelected
                                                                        ? 'bg-primary border-primary text-white shadow-sm'
                                                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-650 dark:text-slate-400 hover:border-primary/50'
                                                                }`}
                                                            >
                                                                {et}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                        {errors.preferredEventTypes && <p className="text-xs text-destructive">{errors.preferredEventTypes.message}</p>}
                                    </div>
                                </div>

                                {/* Profile Photo Upload */}
                                <div className="space-y-2 pt-4">
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 mb-6" />
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden relative">
                                            {previewImage ? (
                                                <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                            ) : (
                                                <UserCircle className="w-8 h-8 text-slate-400" />
                                            )}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                id="avatar-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <Button
                                                variant="outline"
                                                type="button"
                                                className="text-slate-600 dark:text-slate-400"
                                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                            >
                                                <Upload className="w-4 h-4 mr-2" /> {previewImage ? 'Change' : 'Upload'}
                                            </Button>
                                            {previewImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewImage(null)}
                                                    className="text-[10px] text-red-500 font-bold uppercase hover:underline text-left"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800 mt-auto shrink-0">
                    <button
                        onClick={handlePrev}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${step === 1 ? 'text-slate-300 cursor-not-allowed hidden' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {step === 3 ? (
                        <Button
                            className="px-10 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Finish"}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-6">
                            {step === 2 && (
                                <span className="text-sm font-medium text-slate-400">
                                    <span className="text-primary font-bold">{formData.interests?.length || 0}</span> of 3 selected
                                </span>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={step === 2 && (formData.interests?.length || 0) < 3}
                                className={`px-10 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${step === 2 && (formData.interests?.length || 0) < 3
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25'
                                    }`}
                            >
                                Next Step
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT SIDE - Visuals */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12 transition-colors duration-500">
                {/* Decorative Background Patterns */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
                    />
                    <motion.div
                        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/4 translate-y-1/4"
                    />
                </div>

                <div className="relative z-10 w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="visual1"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center text-white"
                            >
                                <h2 className="text-4xl font-bold mb-6">Join the Community</h2>
                                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                                    Connect with thousands of students, discover amazing events, and showcase your achievements.
                                </p>
                                {/* Floating Cards for Step 1 */}
                                <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-lg mx-auto">
                                    <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl">
                                        <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                                            <Globe className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-xl">500+</h3>
                                        <p className="text-sm opacity-80">Events Hosted</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl">
                                        <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                                            <Users className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-xl">10k+</h3>
                                        <p className="text-sm opacity-80">Active Students</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="visual2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative"
                            >
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                            <Music className="w-12 h-12" />
                                        </div>
                                        <div className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                            <GraduationCap className="w-12 h-12" />
                                        </div>
                                        <div className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                            <Flame className="w-12 h-12" />
                                        </div>
                                        <div className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                            <Gamepad2 className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <div className="mt-12 text-center text-white">
                                        <h2 className="text-3xl font-extrabold mb-4">Discover Amazing Events</h2>
                                        <p className="text-white/80 text-lg">Join thousands of students and never miss out on campus life again.</p>
                                    </div>

                                    {/* Floating Interaction Cards Step 2 */}
                                    {/* Top Right Card */}
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="absolute -top-8 -right-8 w-48 bg-white dark:bg-[#101122] p-4 rounded-xl shadow-xl flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <BadgeCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Upcoming</p>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Tech Mixer '24</p>
                                        </div>
                                    </motion.div>

                                    {/* Bottom Left Card */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute -bottom-8 -left-8 w-56 bg-white dark:bg-[#101122] p-4 rounded-xl shadow-xl"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#101122] relative overflow-hidden bg-slate-200">
                                                        <Image src={`https://i.pravatar.cc/100?img=${i + 5}`} alt="User" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">+12 Joined</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-3/4"></div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="visual3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center text-white"
                            >
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                    <UserCircle className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-bold mb-6">Personalize your CampusPulse experience.</h2>
                                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                                    Tell us who you are so we can show better events.
                                </p>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}
