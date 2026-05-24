'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Play, Image as ImageIcon, Link as LinkIcon, Video, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaUploadSectionProps {
    onImageChange: (file: File | null) => void;
    onVideoChange: (data: { type: 'upload' | 'youtube' | 'vimeo' | null; file: File | null; link: string | null }) => void;
    initialImage?: string;
    initialVideo?: string;
    initialVideoType?: string;
}

export function MediaUploadSection({
    onImageChange,
    onVideoChange,
    initialImage,
    initialVideo,
    initialVideoType
}: MediaUploadSectionProps) {
    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
    
    // Video State
    const [videoType, setVideoType] = useState<'upload' | 'youtube' | 'vimeo' | null>(
        (initialVideoType as any) || null
    );
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoLink, setVideoLink] = useState<string>(
        videoType === 'youtube' || videoType === 'vimeo' ? initialVideo || '' : ''
    );
    const [videoPreview, setVideoPreview] = useState<string | null>(
        videoType === 'upload' ? initialVideo || null : null
    );

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Sync state with props (crucial for async data loading in Edit mode)
    useEffect(() => {
        if (initialImage) setImagePreview(initialImage);
    }, [initialImage]);

    useEffect(() => {
        if (initialVideo) {
            setVideoLink(initialVideoType === 'youtube' || initialVideoType === 'vimeo' ? initialVideo : '');
            if (initialVideoType === 'upload') setVideoPreview(initialVideo);
        }
        if (initialVideoType) setVideoType(initialVideoType as any);
    }, [initialVideo, initialVideoType]);

    // Handle Image Change
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            onImageChange(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        onImageChange(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    // Handle Video Change
    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit for local video
                alert('Video size must be less than 50MB');
                return;
            }
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setVideoType('upload');
            onVideoChange({ type: 'upload', file, link: null });
        }
    };

    const handleVideoLinkChange = (val: string) => {
        setVideoLink(val);
        let type: 'youtube' | 'vimeo' | null = null;
        if (val.includes('youtube.com') || val.includes('youtu.be')) type = 'youtube';
        else if (val.includes('vimeo.com')) type = 'vimeo';
        
        setVideoType(type);
        onVideoChange({ type, file: null, link: val });
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setVideoLink('');
        setVideoType(null);
        onVideoChange({ type: null, file: null, link: null });
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    // YouTube Embed Helper
    const getYoutubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&showinfo=0&modestbranding=1`;
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Cover Image Section */}
            <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-500" />
                    Cover Image <span className="text-red-500">*</span>
                </Label>
                
                <div 
                    onClick={() => !imagePreview && imageInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden
                        ${imagePreview ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={imageInputRef}
                        className="hidden" 
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageSelect}
                        name="image"
                    />

                    {imagePreview ? (
                        <div className="w-full h-full">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full max-h-[300px] object-cover rounded-lg shadow-sm"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); imageInputRef.current?.click(); }}
                                    className="bg-white/90 backdrop-blur-sm"
                                >
                                    Replace
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                                <Upload className="w-6 h-6 text-indigo-600" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-500">JPG, PNG or WebP (max. 5MB)</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Media Section */}
            <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-500" />
                    Event Trailer / Video (Optional)
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Video Upload Option */}
                    <div className="space-y-3">
                        <Label className="text-sm text-slate-600">Option 1: Upload Video File</Label>
                        <div 
                            onClick={() => !videoPreview && !videoLink && videoInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                                ${videoPreview ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                                ${(videoLink && !videoPreview) ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <input 
                                type="file" 
                                ref={videoInputRef}
                                className="hidden" 
                                accept="video/mp4,video/webm"
                                onChange={handleVideoSelect}
                                name="videoFile"
                            />
                            {videoPreview ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-indigo-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">Video selected</span>
                                    </div>
                                    <video src={videoPreview} className="hidden" />
                                    <Button variant="outline" size="sm" onClick={removeVideo}>Remove</Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="mx-auto w-8 h-8 text-slate-400" />
                                    <p className="text-xs font-medium">Click to upload video</p>
                                    <p className="text-[10px] text-slate-400">MP4 or WebM (max. 50MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Link Option */}
                    <div className="space-y-3">
                        <Label className="text-sm text-slate-600">Option 2: YouTube / Vimeo Link</Label>
                        <div className={`space-y-3 p-4 border rounded-xl ${(videoPreview) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Paste link here..." 
                                    className="pl-9"
                                    value={videoLink}
                                    onChange={(e) => handleVideoLinkChange(e.target.value)}
                                    disabled={!!videoPreview}
                                    name="videoLink"
                                />
                            </div>
                            <div className="flex gap-4 text-[11px] text-slate-400">
                                <div className="flex items-center gap-1"><Play className="w-3 h-3" /> youtube.com/...</div>
                                <div className="flex items-center gap-1"><Play className="w-3 h-3" /> vimeo.com/...</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden fields for server submission */}
                <input type="hidden" name="videoType" value={videoType || ''} />

                {/* Video Preview Modal-like Area */}
                <AnimatePresence>
                    {(videoPreview || (videoType && videoLink)) && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-4 p-4 bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Video Preview</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={removeVideo}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {videoPreview ? (
                                <video 
                                    controls 
                                    src={videoPreview} 
                                    className="w-full aspect-video rounded-lg shadow-lg border border-slate-800"
                                />
                            ) : videoType === 'youtube' && getYoutubeEmbedUrl(videoLink) ? (
                                <div className="space-y-4">
                                    <iframe 
                                        className="w-full aspect-video rounded-lg shadow-lg bg-black"
                                        src={getYoutubeEmbedUrl(videoLink)!}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <div className="flex items-center justify-between px-2">
                                        <p className="text-[10px] text-slate-500 italic">
                                            If video is unavailable, ensure "Allow embedding" is enabled in YouTube Studio.
                                        </p>
                                        <a 
                                            href={videoLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                                        >
                                            <Play className="w-3 h-3" /> Open on YouTube
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-slate-500 gap-2 italic text-sm">
                                    <AlertCircle className="w-6 h-6" />
                                    Enter a valid YouTube or Vimeo link to see preview
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
