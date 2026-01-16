import React from 'react'
import { FileText, Image as ImageIcon, File, Trash2, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface DocumentCardProps {
    document: {
        _id: Id<"Documents">;
        title: string;
        documentType: string;
        storageId: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: string;
    }
}

function DocumentCard({ document }: DocumentCardProps) {
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const fileUrl = useQuery(api.documents.getDocumentUrl, { storageId: document.storageId });

    const handleDelete = async () => {
        if (confirm("Delete this document?")) {
            await deleteDocument({ id: document._id });
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const getIcon = () => {
        if (document.mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
        if (document.mimeType === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
        return <File className="w-8 h-8 text-gray-500" />;
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                {getIcon()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate" title={document.title}>
                        {document.title}
                    </h4>
                    <Badge variant="outline" className="text-xs uppercase hidden sm:flex">
                        {document.documentType}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500 truncate">{document.fileName} • {formatSize(document.fileSize)}</p>
                <p className="text-xs text-gray-400 mt-1">Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {fileUrl && (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-500">
                            <Download className="w-4 h-4" />
                        </Button>
                    </a>
                )}
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default DocumentCard
