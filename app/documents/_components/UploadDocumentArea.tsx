import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { Loader2, Upload, File as FileIcon, X } from 'lucide-react'
import { toast } from 'sonner'

function UploadDocumentArea() {
    const { user } = useUser();
    const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
    const createDocument = useMutation(api.documents.createDocument);

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('passport');
    const [expiryDate, setExpiryDate] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (!title) {
                // Formatting title: remove extension and capitalize
                const name = selectedFile.name.split('.')[0];
                setTitle(name.charAt(0).toUpperCase() + name.slice(1));
            }
        }
    }

    const handleUpload = async () => {
        if (!user || !file || !title) return;

        setLoading(true);
        try {
            // Step 1: Get upload URL
            const postUrl = await generateUploadUrl();
            console.log("Upload URL generated:", postUrl);

            if (!postUrl) {
                throw new Error("Failed to generate upload URL");
            }

            // Step 2: POST file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type || "application/octet-stream" },
                body: file,
            });

            if (!result.ok) {
                throw new Error(`Upload failed with status: ${result.status} ${result.statusText}`);
            }

            const { storageId } = await result.json();

            // Step 3: Create record
            await createDocument({
                storageId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type || "application/octet-stream",
                documentType: type,
                title: title,
                tags: [],
                isEncrypted: true,
                expiryDate: expiryDate || undefined, // Pass expiry date if set
            });

            toast.success("Document uploaded securely");

            // Reset form
            setTitle('');
            setFile(null);
            setType('passport');
            setExpiryDate('');
        } catch (error) {
            console.error("Failed to upload document:", error);
            toast.error("Upload failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 md:p-12 text-center transition-all hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 group">

            {!file ? (
                <div
                    className="flex flex-col items-center justify-center cursor-pointer space-y-4"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Documents</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Drag and drop or click to upload</p>
                    </div>
                    <Button variant="outline" className="mt-4 rounded-xl">Choose Files</Button>
                </div>
            ) : (
                <div className="max-w-md mx-auto space-y-6 text-left">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                            <FileIcon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Document Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My Passport" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="passport">Passport</option>
                                    <option value="visa">Visa</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="ticket">Ticket</option>
                                    <option value="booking">Hotel Booking</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Expiry Date (Optional)</Label>
                                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                            </div>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl"
                            onClick={handleUpload}
                            disabled={loading || !title}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                            Upload Securely
                        </Button>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
            />
        </div>
    )
}

export default UploadDocumentArea
