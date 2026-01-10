"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { FolderClosed } from 'lucide-react'

function Documents() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <FolderClosed className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Vault</h1>
                            <p className="text-gray-500 dark:text-gray-400">Securely store your passports, visas, and travel docs.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 h-64 flex items-center justify-center">
                        <span className="text-muted-foreground">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Documents
