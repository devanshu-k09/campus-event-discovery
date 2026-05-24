'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: FieldError;
    containerClassName?: string;
    rightElement?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, icon: Icon, error, className, containerClassName, rightElement, ...props }, ref) => {
        return (
            <div className={cn("space-y-2", containerClassName)}>
                <Label htmlFor={props.id || props.name} className={cn(error && "text-destructive")}>
                    {label}
                </Label>
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <Input
                        ref={ref}
                        className={cn(
                            Icon && "pl-10",
                            rightElement && "pr-10",
                            error && "border-destructive focus-visible:ring-destructive",
                            className
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-3 top-2.5 text-muted-foreground">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-destructive font-medium animate-pulse">
                        {error.message}
                    </p>
                )}
            </div>
        );
    }
);
FormInput.displayName = "FormInput";

export { FormInput };
