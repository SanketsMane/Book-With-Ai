"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { FolderClosed, Loader2, ShieldCheck } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import DocumentCard from './_components/DocumentCard'
import UploadDocumentModal from './_components/UploadDocumentModal'

function Documents() {
    const { user, isLoaded } = useUser();
    const documents = useQuery(api.documents.getDocuments,
        user ? { userId: user.id || "test_user_id" } : "skip"
    );

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-8 md:p-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <FolderClosed className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Vault</h1>
                                <p className="text-gray-500 dark:text-gray-400">Securely store your passports, visas, and travel docs.</p>
                            </div>
                        </div>
                        <UploadDocumentModal />
                    </div>

                    {/* Encryption Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">End-to-End Encryption</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">Your documents are encrypted and stored securely. Only you and people you explicitly share with can access them.</p>
                        </div>
                    </div>

                    {/* Content */}
                    {!isLoaded || documents === undefined ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <FolderClosed className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vault is empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Upload your essential travel documents for safe keeping and easy access.
                            </p>
                            <UploadDocumentModal />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {documents.map((doc) => (
                                <DocumentCard key={doc._id} document={doc} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Documents
