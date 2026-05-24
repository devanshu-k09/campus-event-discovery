'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { updateUserProfile, changePassword, getActiveSessions, clearOtherSessions } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Save, X, Camera, UserCircle, AlertTriangle, Key, Smartphone, Monitor, BadgeCheck, GraduationCap, Building, Award, Calendar, Compass, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { CATEGORIES, COLLEGES, DEPARTMENTS, YEARS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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

const USER_TYPES = [
    'Student',
    'Faculty / Staff',
    'Alumni',
    'Event Organizer',
    'Guest / Visitor',
    'Working Professional'
];

interface EditProfileFormProps {
    user: {
        id: string;
        name: string | null;
        bio: string | null;
        location: string | null;
        collegeName: string | null;
        department: string | null;
        year: number | null;
        interests: any;
        image: string | null;
        userType?: string | null;
        studentId?: string | null;
        organizationName?: string | null;
        designation?: string | null;
        employeeId?: string | null;
        graduationYear?: number | null;
        currentProfession?: string | null;
        organizerType?: string | null;
        officialEmail?: string | null;
        websiteOrInstagram?: string | null;
        companyName?: string | null;
        jobRole?: string | null;
        preferredCity?: string | null;
        interestedCategories?: any;
        purpose?: any;
        preferredEventTypes?: any;
        profilePhoto?: string | null;
    };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
    const router = useRouter();
    const { data: session, update } = useSession();
    
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [interestInput, setInterestInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [activeSessions, setActiveSessions] = useState<any[]>([]);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isClearingSessions, setIsClearingSessions] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        collegeName: user.collegeName || '',
        department: user.department || '',
        year: user.year || 0,
        interests: Array.isArray(user.interests) 
            ? user.interests 
            : typeof user.interests === 'string' 
                ? JSON.parse(user.interests || '[]') 
                : [],
        image: user.image || null,
        userType: user.userType || 'Student',
        studentId: user.studentId || '',
        organizationName: user.organizationName || '',
        designation: user.designation || '',
        employeeId: user.employeeId || '',
        graduationYear: user.graduationYear || 0,
        currentProfession: user.currentProfession || '',
        organizerType: user.organizerType || '',
        officialEmail: user.officialEmail || '',
        websiteOrInstagram: user.websiteOrInstagram || '',
        companyName: user.companyName || '',
        jobRole: user.jobRole || '',
        preferredCity: user.preferredCity || '',
        interestedCategories: Array.isArray(user.interestedCategories)
            ? user.interestedCategories
            : typeof user.interestedCategories === 'string'
                ? JSON.parse(user.interestedCategories || '[]')
                : (Array.isArray(user.interests) ? user.interests : []),
        purpose: Array.isArray(user.purpose)
            ? user.purpose
            : typeof user.purpose === 'string'
                ? JSON.parse(user.purpose || '[]')
                : [],
        preferredEventTypes: Array.isArray(user.preferredEventTypes)
            ? user.preferredEventTypes
            : typeof user.preferredEventTypes === 'string'
                ? JSON.parse(user.preferredEventTypes || '[]')
                : [],
        profilePhoto: user.profilePhoto || user.image || null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Add validations
        if (!formData.userType) {
            toast.error("Please select what you are joining as.");
            return;
        }
        if (!formData.preferredCity) {
            toast.error("Preferred City is required.");
            return;
        }
        if (formData.interestedCategories.length === 0) {
            toast.error("Please select at least one Interested Category.");
            return;
        }
        if (formData.purpose.length === 0) {
            toast.error("Please select at least one Purpose.");
            return;
        }
        if (formData.preferredEventTypes.length === 0) {
            toast.error("Please select at least one Preferred Event Type.");
            return;
        }

        if (formData.userType === 'Student') {
            if (!formData.collegeName || !formData.collegeName.trim()) {
                toast.error("College Name is required for students.");
                return;
            }
            if (!formData.year) {
                toast.error("Year of study is required for students.");
                return;
            }
            if (!formData.department || !formData.department.trim()) {
                toast.error("Department is required for students.");
                return;
            }
        } else if (formData.userType === 'Faculty / Staff') {
            if (!formData.organizationName || !formData.organizationName.trim()) {
                toast.error("Organization / College Name is required for Faculty / Staff.");
                return;
            }
            if (!formData.designation || !formData.designation.trim()) {
                toast.error("Designation is required for Faculty / Staff.");
                return;
            }
        } else if (formData.userType === 'Alumni') {
            if (!formData.collegeName || !formData.collegeName.trim()) {
                toast.error("College / University Name is required for Alumni.");
                return;
            }
            if (!formData.graduationYear) {
                toast.error("Graduation Year is required for Alumni.");
                return;
            }
        } else if (formData.userType === 'Event Organizer') {
            if (!formData.organizationName || !formData.organizationName.trim()) {
                toast.error("Organization / Club / Company Name is required for Event Organizers.");
                return;
            }
            if (!formData.organizerType || !formData.organizerType.trim()) {
                toast.error("Organizer Type is required for Event Organizers.");
                return;
            }
        }

        setIsLoading(true);

        try {
            await updateUserProfile({
                ...formData,
                year: Number(formData.year),
                graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
                interests: formData.interestedCategories,
                image: formData.profilePhoto
            });
            toast.success('Profile updated successfully!');
            
            // Update session data
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                    image: formData.profilePhoto || formData.image
                }
            });

            router.push('/profile');
            router.refresh();
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteInput !== 'DELETE') return;
        setIsDeleting(true);

        try {
            const res = await fetch('/api/user/delete-account', { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete account');
            
            toast.success("Your account has been permanently deleted. We're sorry to see you go.");
            
            setIsModalOpen(false);
            
            // Sign out completely
            await signOut({ redirect: true, callbackUrl: '/' });
            
        } catch (error) {
            toast.error('Something went wrong during deletion.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        setIsChangingPassword(true);
        try {
            await changePassword({ current: passwordData.current, new: passwordData.new });
            toast.success("Password changed successfully!");
            setIsPasswordModalOpen(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleClearSessions = async () => {
        setIsClearingSessions(true);
        try {
            await clearOtherSessions();
            toast.success("Logged out of all other sessions.");
        } catch (error: any) {
            toast.error("Failed to clear sessions");
        } finally {
            setIsClearingSessions(false);
        }
    };

    const fetchSessions = async () => {
        const sessions = await getActiveSessions();
        setActiveSessions(sessions);
        setIsSessionsModalOpen(true);
    };

    const addInterest = () => {
        if (interestInput.trim() && !formData.interestedCategories.includes(interestInput.trim())) {
            setFormData(prev => ({
                ...prev,
                interestedCategories: [...prev.interestedCategories, interestInput.trim()],
                interests: [...prev.interestedCategories, interestInput.trim()]
            }));
            setInterestInput('');
        }
    };

    const removeInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interestedCategories: prev.interestedCategories.filter((i: string) => i !== interest),
            interests: prev.interestedCategories.filter((i: string) => i !== interest)
        }));
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
                setFormData(prev => ({ 
                    ...prev, 
                    image: reader.result as string,
                    profilePhoto: reader.result as string
                }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-12">
            {/* Form wrapping Personal Information */}
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
                    <p className="text-muted-foreground text-sm">Update your photo and personal details.</p>
                </div>

                {/* Profile Photo Section */}
                <div className="flex flex-col items-center justify-center p-6 bg-secondary/10 rounded-3xl border border-dashed border-border mb-8">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-secondary relative">
                            {formData.image ? (
                                <Image src={formData.image} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                    <UserCircle className="h-20 w-20" />
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <label 
                            htmlFor="avatar-input" 
                            className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        >
                            <Camera className="h-4 w-4" />
                            <input 
                                id="avatar-input" 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                        {formData.image && (
                            <button 
                                type="button" 
                                onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                className="text-[10px] text-red-500 font-bold uppercase mt-2 hover:underline"
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Basic Information & Personalization */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Your Name"
                                className="rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell us about yourself..."
                                className="rounded-xl min-h-[120px] resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location (Display)</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="e.g. Mumbai, India"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="h-px bg-border/50 my-4" />

                        <p className="text-sm font-bold text-primary uppercase tracking-widest">Preferences</p>

                        {/* Preferred City */}
                        <div className="space-y-2">
                            <Label htmlFor="preferredCity">Preferred City</Label>
                            <Select 
                                value={formData.preferredCity || ''} 
                                onValueChange={value => setFormData(prev => ({ ...prev, preferredCity: value }))}
                            >
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select your preferred city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CITIES.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Purpose on CampusPulse */}
                        <div className="space-y-2">
                            <Label>Purpose on CampusPulse</Label>
                            <div className="flex flex-wrap gap-2">
                                {PURPOSES.map((p) => {
                                    const isSelected = formData.purpose.includes(p);
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                                const newVal = isSelected
                                                    ? formData.purpose.filter((item: string) => item !== p)
                                                    : [...formData.purpose, p];
                                                setFormData(prev => ({ ...prev, purpose: newVal }));
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                                                isSelected
                                                    ? 'bg-primary border-primary text-white shadow-sm'
                                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-655 dark:text-slate-400 hover:border-primary/50'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interested Categories */}
                        <div className="space-y-2">
                            <Label>Interested Categories</Label>
                            <div className="flex flex-wrap gap-2">
                                {INTERESTS_LIST.map((ic) => {
                                    const isSelected = formData.interestedCategories.includes(ic);
                                    return (
                                        <button
                                            key={ic}
                                            type="button"
                                            onClick={() => {
                                                const newVal = isSelected
                                                    ? formData.interestedCategories.filter((item: string) => item !== ic)
                                                    : [...formData.interestedCategories, ic];
                                                setFormData(prev => ({ 
                                                    ...prev, 
                                                    interestedCategories: newVal,
                                                    interests: newVal 
                                                }));
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                                                isSelected
                                                    ? 'bg-primary border-primary text-white shadow-sm'
                                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-655 dark:text-slate-400 hover:border-primary/50'
                                            }`}
                                        >
                                            {ic}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Preferred Event Type */}
                        <div className="space-y-2">
                            <Label>Preferred Event Types</Label>
                            <div className="flex flex-wrap gap-2">
                                {EVENT_TYPES.map((et) => {
                                    const isSelected = formData.preferredEventTypes.includes(et);
                                    return (
                                        <button
                                            key={et}
                                            type="button"
                                            onClick={() => {
                                                const newVal = isSelected
                                                    ? formData.preferredEventTypes.filter((item: string) => item !== et)
                                                    : [...formData.preferredEventTypes, et];
                                                setFormData(prev => ({ ...prev, preferredEventTypes: newVal }));
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                                                isSelected
                                                    ? 'bg-primary border-primary text-white shadow-sm'
                                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-655 dark:text-slate-400 hover:border-primary/50'
                                            }`}
                                        >
                                            {et}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Identity Details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="userType">I am joining as</Label>
                            <Select 
                                value={formData.userType} 
                                onValueChange={value => setFormData(prev => ({ ...prev, userType: value }))}
                            >
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select who you are joining as" />
                                </SelectTrigger>
                                <SelectContent>
                                    {USER_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-5 rounded-2xl bg-secondary/10 border border-border/50 space-y-4">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest">{formData.userType} Information</p>

                            {formData.userType === 'Student' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="college">College / University</Label>
                                        <Select 
                                            value={formData.collegeName || ''} 
                                            onValueChange={value => setFormData(prev => ({ ...prev, collegeName: value }))}
                                        >
                                            <SelectTrigger className="rounded-xl bg-background">
                                                <SelectValue placeholder="Select your college" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COLLEGES.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Select 
                                                value={formData.department || ''} 
                                                onValueChange={value => setFormData(prev => ({ ...prev, department: value }))}
                                            >
                                                <SelectTrigger className="rounded-xl bg-background">
                                                    <SelectValue placeholder="Dept" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEPARTMENTS.map(d => (
                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year of Study</Label>
                                            <Select 
                                                value={formData.year.toString()} 
                                                onValueChange={value => setFormData(prev => ({ ...prev, year: parseInt(value) }))}
                                            >
                                                <SelectTrigger className="rounded-xl bg-background">
                                                    <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {YEARS.map(y => (
                                                        <SelectItem key={y.value} value={parseInt(y.value).toString() || y.value}>
                                                            {y.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="studentId">Student ID / Roll Number (Optional)</Label>
                                        <Input
                                            id="studentId"
                                            value={formData.studentId}
                                            onChange={e => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                                            placeholder="Enter your student ID"
                                            className="rounded-xl bg-background"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.userType === 'Faculty / Staff' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="organizationName">Organization / College Name</Label>
                                        <Input
                                            id="organizationName"
                                            value={formData.organizationName}
                                            onChange={e => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                                            placeholder="Enter college or organization"
                                            className="rounded-xl bg-background"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input
                                                id="department"
                                                value={formData.department}
                                                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                                placeholder="e.g. Physics, HR"
                                                className="rounded-xl bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="designation">Designation</Label>
                                            <Input
                                                id="designation"
                                                value={formData.designation}
                                                onChange={e => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                                                placeholder="e.g. Professor, Manager"
                                                className="rounded-xl bg-background"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                                        <Input
                                            id="employeeId"
                                            value={formData.employeeId}
                                            onChange={e => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                                            placeholder="Enter your employee ID"
                                            className="rounded-xl bg-background"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.userType === 'Alumni' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="collegeName">College / University Name</Label>
                                        <Input
                                            id="collegeName"
                                            value={formData.collegeName}
                                            onChange={e => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                                            placeholder="Enter graduated college"
                                            className="rounded-xl bg-background"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="graduationYear">Graduation Year</Label>
                                            <Input
                                                id="graduationYear"
                                                type="number"
                                                value={formData.graduationYear || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, graduationYear: parseInt(e.target.value) || 0 }))}
                                                placeholder="e.g. 2022"
                                                className="rounded-xl bg-background"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department / Course</Label>
                                            <Input
                                                id="department"
                                                value={formData.department}
                                                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                                placeholder="e.g. B.Tech CS"
                                                className="rounded-xl bg-background"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="currentProfession">Current Profession (Optional)</Label>
                                        <Input
                                            id="currentProfession"
                                            value={formData.currentProfession}
                                            onChange={e => setFormData(prev => ({ ...prev, currentProfession: e.target.value }))}
                                            placeholder="e.g. Software Engineer at Google"
                                            className="rounded-xl bg-background"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.userType === 'Event Organizer' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="organizationName">Organization / Club / Company</Label>
                                            <Input
                                                id="organizationName"
                                                value={formData.organizationName}
                                                onChange={e => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                                                placeholder="Organization name"
                                                className="rounded-xl bg-background"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="organizerType">Organizer Type</Label>
                                            <Select 
                                                value={formData.organizerType} 
                                                onValueChange={value => setFormData(prev => ({ ...prev, organizerType: value }))}
                                            >
                                                <SelectTrigger className="rounded-xl bg-background">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ORGANIZER_TYPES.map(ot => (
                                                        <SelectItem key={ot} value={ot}>{ot}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="officialEmail">Official Email (Optional)</Label>
                                            <Input
                                                id="officialEmail"
                                                type="email"
                                                value={formData.officialEmail}
                                                onChange={e => setFormData(prev => ({ ...prev, officialEmail: e.target.value }))}
                                                placeholder="org@example.com"
                                                className="rounded-xl bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="websiteOrInstagram">Website / Instagram (Optional)</Label>
                                            <Input
                                                id="websiteOrInstagram"
                                                value={formData.websiteOrInstagram}
                                                onChange={e => setFormData(prev => ({ ...prev, websiteOrInstagram: e.target.value }))}
                                                placeholder="instagram.com/club"
                                                className="rounded-xl bg-background"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.userType === 'Working Professional' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Company / Org (Optional)</Label>
                                            <Input
                                                id="companyName"
                                                value={formData.companyName}
                                                onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                                placeholder="e.g. Acme Corp"
                                                className="rounded-xl bg-background"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jobRole">Job Role (Optional)</Label>
                                            <Input
                                                id="jobRole"
                                                value={formData.jobRole}
                                                onChange={e => setFormData(prev => ({ ...prev, jobRole: e.target.value }))}
                                                placeholder="e.g. Product Manager"
                                                className="rounded-xl bg-background"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.userType === 'Guest / Visitor' && (
                                <div className="text-xs font-semibold text-muted-foreground p-4 text-center">
                                    No additional details required. Please select your preferences on the left side!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="rounded-xl gap-2 min-w-[120px]">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </form>

            <hr className="border-border" />

            {/* Security Section */}
            <section className="space-y-6">
                <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold tracking-tight">Security</h2>
                    <p className="text-muted-foreground text-sm">Manage your security preferences and active sessions.</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-2xl border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Key className="h-4 w-4 text-primary" /> Change Password
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Ensure your account is using a long, random password.</p>
                            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full rounded-xl">Update Password</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <DialogDescription>
                                            Update your password to keep your account secure.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handlePasswordChange} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input 
                                                id="current-password" 
                                                type="password" 
                                                value={passwordData.current}
                                                onChange={e => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                                required 
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input 
                                                id="new-password" 
                                                type="password" 
                                                value={passwordData.new}
                                                onChange={e => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                                required 
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input 
                                                id="confirm-password" 
                                                type="password" 
                                                value={passwordData.confirm}
                                                onChange={e => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                                required 
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={isChangingPassword} className="rounded-xl min-w-[120px]">
                                                {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-primary" /> Login Devices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Review devices that have recently logged into your account.</p>
                            <Dialog open={isSessionsModalOpen} onOpenChange={setIsSessionsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full rounded-xl" onClick={fetchSessions}>View Devices</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Active Sessions</DialogTitle>
                                        <DialogDescription>
                                            These are the devices currently logged into your account.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        {activeSessions.length === 0 ? (
                                            <p className="text-center text-muted-foreground text-sm py-8">No active sessions found.</p>
                                        ) : (
                                            activeSessions.map((s, i) => (
                                                <div key={s.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-border/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                            {i === 0 ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">{i === 0 ? 'Current Session' : `Session ${i + 1}`}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Expires: {new Date(s.expires).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    {i === 0 && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button className="w-full rounded-xl" onClick={() => setIsSessionsModalOpen(false)}>Done</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-primary" /> Active Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Log out of all other active browser sessions.</p>
                            <Button 
                                variant="outline" 
                                className="w-full rounded-xl" 
                                onClick={handleClearSessions}
                                disabled={isClearingSessions}
                            >
                                {isClearingSessions ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log Out Others'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Danger Zone Section */}
            <section className="space-y-6">
                <div className="border-b border-red-200 dark:border-red-900/30 pb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-500 flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6" /> Danger Zone
                    </h2>
                    <p className="text-muted-foreground text-sm">Irreversible and destructive actions.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl gap-4">
                    <div>
                        <h3 className="font-bold text-red-700 dark:text-red-400">Delete Account</h3>
                        <p className="text-sm text-red-600/80 dark:text-red-300/80 mt-1 max-w-xl">
                            Permanently remove your account and all associated data. This action cannot be undone.
                        </p>
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if(!open) setDeleteInput(''); }}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="rounded-xl whitespace-nowrap">
                                Delete My Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> Delete Your Account?
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <div className="pt-3 pb-2 space-y-3 text-sm text-muted-foreground">
                                        <p className="font-medium text-slate-900 dark:text-slate-200">
                                            This action is permanent and cannot be undone.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                            <li>Remove your profile</li>
                                            <li>Cancel your booked tickets</li>
                                            <li>Remove hosted events</li>
                                            <li>Delete saved drafts</li>
                                            <li>Remove collaboration access</li>
                                        </ul>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4 space-y-3">
                                <Label htmlFor="confirm-delete" className="text-sm font-medium">
                                    Please type <span className="font-bold select-none text-red-600">DELETE</span> to confirm.
                                </Label>
                                <Input
                                    id="confirm-delete"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    placeholder="Type DELETE"
                                    className="rounded-xl border-red-200 focus-visible:ring-red-500"
                                    autoComplete="off"
                                />
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDeleteAccount}
                                    disabled={deleteInput !== 'DELETE' || isDeleting}
                                    className="rounded-xl min-w-[140px]"
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Permanently Delete'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>
        </div>
    );
}
