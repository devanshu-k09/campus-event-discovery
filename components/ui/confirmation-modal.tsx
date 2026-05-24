'use client';

import { useState, useEffect } from 'react';
import { 
    AlertTriangle, 
    X, 
    Loader2 
} from 'lucide-react';
import { Button } from './button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    variant = 'danger'
}: ConfirmationModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setShouldRender(true);
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Confirmation error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onTransitionEnd={() => !isOpen && setShouldRender(false)}
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={!isProcessing ? onClose : undefined}
            />

            {/* Modal Content */}
            <div 
                className={`relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 transform transition-all duration-300 ${
                    isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
            >
                <button 
                    onClick={onClose}
                    disabled={isProcessing}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                        variant === 'danger' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' :
                        variant === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                    }`}>
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {title}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 h-12 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className={`flex-1 h-12 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                                variant === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' :
                                variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' :
                                'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
                            }`}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
