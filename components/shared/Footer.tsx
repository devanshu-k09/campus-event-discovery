import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Campus Events</h3>
                        <p className="text-sm text-muted-foreground">
                            Discover and organize amazing events on campus. Never miss out on the best college experiences.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/devanshukukade" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="mailto:supportplus24x7@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                                <Mail className="w-5 h-5" />
                            </a>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/events" className="hover:text-primary transition-colors">Browse Events</Link></li>
                            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link href="/calendar" className="hover:text-primary transition-colors">Calendar</Link></li>
                            <li><Link href="/organize" className="hover:text-primary transition-colors">Organize Event</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/guidelines" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
                            <li><Link href="/safety" className="hover:text-primary transition-colors">Safety</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to get updates on the latest campus events.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" type="email" />
                            <Button size="icon">
                                <Mail className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Campus Events. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
