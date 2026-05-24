'use client';

import Link from 'next/link';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/app/actions/user';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    User as UserIcon, 
    LayoutDashboard, 
    LogOut, 
    Settings,
    Calendar,
    Shield
} from 'lucide-react';

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'image' | 'email'> & { role?: string };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
    const [userImage, setUserImage] = useState<string | null>(user.image || null);

    useEffect(() => {
        if (!user.image) {
            getUserProfile().then(profile => {
                if (profile?.image) {
                    setUserImage(profile.image);
                }
            });
        }
    }, [user.image]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors group">
                    <Avatar className="h-8 w-8 border border-border group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={userImage || ''} alt={user.name || 'User avatar'} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start mr-2">
                        <span className="text-sm font-semibold leading-none">{user.name}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 mt-1">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-bold">{user.name}</p>}
                        {user.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                {user.role === 'admin' && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/admin/users" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 focus:text-indigo-700 dark:focus:text-indigo-300">
                            <Shield className="h-4 w-4" />
                            <span className="font-bold">Admin Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>My Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/my-events" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>My Registrations</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile/edit" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={(event) => {
                        event.preventDefault();
                        signOut({
                            callbackUrl: `${window.location.origin}/`,
                        });
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
