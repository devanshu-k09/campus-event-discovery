import { getUserProfile } from "@/app/actions/user";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    MapPin, 
    GraduationCap, 
    Calendar, 
    Mail, 
    Edit3,
    Trophy,
    Users,
    Activity
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getUserProfile() as any;

    if (!user) {
        redirect("/login");
    }

    let interests: string[] = [];
    if (Array.isArray(user.interests)) {
        interests = user.interests as string[];
    } else if (typeof user.interests === 'string') {
        const raw = user.interests.trim();
        if (raw.startsWith('[') && raw.endsWith(']')) {
            try {
                interests = JSON.parse(raw);
            } catch (e) {
                interests = raw.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
            }
        } else if (raw) {
            interests = raw.split(',').map((s: string) => s.trim());
        }
    }

    let purposes: string[] = [];
    if (Array.isArray(user.purpose)) {
        purposes = user.purpose as string[];
    } else if (typeof user.purpose === 'string') {
        const raw = (user.purpose as string).trim();
        if (raw.startsWith('[') && raw.endsWith(']')) {
            try {
                purposes = JSON.parse(raw);
            } catch (e) {}
        }
    }

    let preferredEventTypes: string[] = [];
    if (Array.isArray(user.preferredEventTypes)) {
        preferredEventTypes = user.preferredEventTypes as string[];
    } else if (typeof user.preferredEventTypes === 'string') {
        const raw = (user.preferredEventTypes as string).trim();
        if (raw.startsWith('[') && raw.endsWith(']')) {
            try {
                preferredEventTypes = JSON.parse(raw);
            } catch (e) {}
        }
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            
            <main className="pt-24 pb-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Profile Section */}
                    <div className="relative mb-8">
                        <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 rounded-3xl blur-3xl absolute -z-10 opacity-50" />
                        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                                <Link href="/profile/edit">
                                    <Button variant="outline" className="gap-2 rounded-xl">
                                        <Edit3 className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center md:text-left space-y-4">
                                    <div>
                                        <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
                                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                                        {user.userType && (
                                            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                                                {user.userType}
                                            </div>
                                        )}
                                        {(user.preferredCity || user.location) && (
                                            <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                {user.preferredCity || user.location}
                                            </div>
                                        )}
                                        {user.collegeName && (
                                            <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                                {user.collegeName}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground max-w-2xl leading-relaxed">
                                        {user.bio || "No bio added yet. Tell the campus community about yourself!"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Stats Sidebar */}
                        <div className="space-y-8">
                            <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-primary" />
                                        Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/10 rounded-xl">
                                                <Trophy className="h-5 w-5 text-yellow-500" />
                                            </div>
                                            <span className="text-sm font-medium">Points</span>
                                        </div>
                                        <span className="text-xl font-bold">{user.points}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                                <Calendar className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <span className="text-sm font-medium">Events Organized</span>
                                        </div>
                                        <span className="text-xl font-bold">{user._count.events}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/10 rounded-xl">
                                                <Users className="h-5 w-5 text-green-500" />
                                            </div>
                                            <span className="text-sm font-medium">Registrations</span>
                                        </div>
                                        <span className="text-xl font-bold">{user._count.registrations}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">Interests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {interests.length > 0 ? interests.map((interest: string) => (
                                            <Badge key={interest} variant="secondary" className="rounded-lg px-3 py-1 font-medium">
                                                {interest}
                                            </Badge>
                                        )) : (
                                            <p className="text-sm text-muted-foreground italic">No interests added yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {purposes.length > 0 && (
                                <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Purpose on CampusPulse</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {purposes.map((p: string) => (
                                                <Badge key={p} variant="secondary" className="rounded-lg px-3 py-1 font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                                    {p}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {preferredEventTypes.length > 0 && (
                                <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Preferred Event Types</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {preferredEventTypes.map((et: string) => (
                                                <Badge key={et} variant="secondary" className="rounded-lg px-3 py-1 font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                    {et}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl font-bold">Profile Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined As</span>
                                            <p className="font-medium text-lg">{user.userType || "Student"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role / Permission Group</span>
                                            <p className="font-medium text-lg capitalize">{user.role}</p>
                                        </div>

                                        {/* Dynamic userType fields */}
                                        {(!user.userType || user.userType === 'Student') && (
                                            <>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">College / University</span>
                                                    <p className="font-medium text-lg">{user.collegeName || "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year of Study</span>
                                                    <p className="font-medium text-lg">{user.year ? `${user.year} Year` : "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</span>
                                                    <p className="font-medium text-lg">{user.department || "Not specified"}</p>
                                                </div>
                                                {user.studentId && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student ID</span>
                                                        <p className="font-medium text-lg">{user.studentId}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {user.userType === 'Faculty / Staff' && (
                                            <>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization / College</span>
                                                    <p className="font-medium text-lg">{user.organizationName || "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</span>
                                                    <p className="font-medium text-lg">{user.department || "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Designation</span>
                                                    <p className="font-medium text-lg">{user.designation || "Not specified"}</p>
                                                </div>
                                                {user.employeeId && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employee ID</span>
                                                        <p className="font-medium text-lg">{user.employeeId}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {user.userType === 'Alumni' && (
                                            <>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">College / University</span>
                                                    <p className="font-medium text-lg">{user.collegeName || "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Graduation Year</span>
                                                    <p className="font-medium text-lg">{user.graduationYear || "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department / Course</span>
                                                    <p className="font-medium text-lg">{user.department || "Not specified"}</p>
                                                </div>
                                                {user.currentProfession && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Profession</span>
                                                        <p className="font-medium text-lg">{user.currentProfession}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {user.userType === 'Event Organizer' && (
                                            <>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization / Company</span>
                                                    <p className="font-medium text-lg">{user.organizationName || "Not specified"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organizer Type</span>
                                                    <p className="font-medium text-lg">{user.organizerType || "Not specified"}</p>
                                                </div>
                                                {user.officialEmail && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official Email</span>
                                                        <p className="font-medium text-lg">{user.officialEmail}</p>
                                                    </div>
                                                )}
                                                {user.websiteOrInstagram && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website / Instagram</span>
                                                        <p className="font-medium text-lg">{user.websiteOrInstagram}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {user.userType === 'Working Professional' && (
                                            <>
                                                {user.companyName && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company / Organization</span>
                                                        <p className="font-medium text-lg">{user.companyName}</p>
                                                    </div>
                                                )}
                                                {user.jobRole && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job Role</span>
                                                        <p className="font-medium text-lg">{user.jobRole}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred City</span>
                                            <p className="font-medium text-lg">{user.preferredCity || user.location || "Not specified"}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member Since</span>
                                            <p className="font-medium text-lg">{new Date(user.createdAt).getFullYear()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col items-center justify-center p-12 bg-secondary/20 rounded-3xl border border-dashed border-border text-center">
                                <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
                                    <Activity className="h-8 w-8 text-primary/40" />
                                </div>
                                <h3 className="text-lg font-bold">Recent Activity</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">
                                    Your recent event registrations and reviews will appear here.
                                </p>
                                <Link href="/dashboard" className="mt-6">
                                    <Button variant="link" className="text-primary font-bold">
                                        View Full History
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
