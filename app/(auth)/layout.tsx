import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='bg-background min-h-screen'>
            <div className='flex items-center justify-center pt-20'>
                {children}
            </div>
        </div>
    )
}