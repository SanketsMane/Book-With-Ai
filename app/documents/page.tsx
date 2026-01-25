"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { FolderClosed, ShieldCheck, Loader2 } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import DocumentRow from './_components/DocumentRow'
import UploadDocumentArea from './_components/UploadDocumentArea'

function Documents() {
    const { user, isLoaded } = useUser();
    const documents = useQuery(api.documents.getDocuments,
        user ? {} : "skip" // Fetch all documents
    );

    return (
        <div className='min-h-screen bg-gray-50/50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-8 md:p-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-xl">
                                <FolderClosed className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Vault</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 pl-14">Securely store and manage your travel documents</p>
                    </div>

                    {/* Document List */}
                    <div className="space-y-4">
                        {!isLoaded || documents === undefined ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No documents yet. Upload one below to get started.
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <DocumentRow key={doc._id} document={doc} />
                            ))
                        )}
                    </div>

                    {/* Upload Area */}
                    <UploadDocumentArea />

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 justify-center text-sm text-gray-400 pt-8">
                        <ShieldCheck className="w-4 h-4" />
                        <span>End-to-end encrypted • Only you can access</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Documents
