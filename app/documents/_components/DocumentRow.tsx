import React from 'react'
import { FileText, Image as ImageIcon, File, Trash2, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface DocumentRowProps {
    document: {
        _id: Id<"Documents">;
        title: string;
        documentType: string;
        storageId: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: string;
        verificationStatus?: string;
        documentDetails?: {
            expiryDate?: string;
        };
    }
}

function DocumentRow({ document }: DocumentRowProps) {
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const fileUrl = useQuery(api.documents.getDocumentUrl, { storageId: document.storageId });

    const handleDelete = async () => {
        if (confirm("Delete this document?")) {
            await deleteDocument({ id: document._id });
        }
    }

    const getIcon = () => {
        const colorClass =
            document.documentType === 'passport' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                document.documentType === 'visa' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';

        if (document.mimeType.startsWith('image/')) return <div className={`p-2 rounded-lg ${colorClass}`}><ImageIcon className="w-6 h-6" /></div>;
        return <div className={`p-2 rounded-lg ${colorClass}`}><FileText className="w-6 h-6" /></div>;
    }

    const getStatusBadge = () => {
        const status = document.verificationStatus || 'pending';

        if (status === 'verified') {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                </div>
            )
        }
        if (status === 'rejected') {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Rejected
                </div>
            )
        }
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                Pending
            </div>
        )
    }

    // Check expiry
    const isExpiringSoon = () => {
        if (!document.documentDetails?.expiryDate) return false;
        const expiry = new Date(document.documentDetails.expiryDate);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 90 && diffDays > 0; // Less than 3 months
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
                {getIcon()}
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {document.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                        {document.documentDetails?.expiryDate ?
                            `Expires: ${new Date(document.documentDetails.expiryDate).toLocaleDateString()}` :
                            `Uploaded: ${new Date(document.uploadedAt).toLocaleDateString()}`
                        }
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isExpiringSoon() && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium border border-red-100 dark:border-red-800">
                        Expiring Soon
                    </div>
                )}

                {getStatusBadge()}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {fileUrl && (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500">
                                <Download className="w-4 h-4" />
                            </Button>
                        </a>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DocumentRow
