import { getUserProfile } from "@/app/actions/user";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { EditProfileForm } from "@/components/dashboard/EditProfileForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
    const user = await getUserProfile(false);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            
            <main className="pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Update your profile information and manage your campus identity.
                        </p>
                    </div>

                    <Card className="rounded-3xl border-border/50 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>
                                This information will be displayed on your public profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditProfileForm user={user as any} />
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
