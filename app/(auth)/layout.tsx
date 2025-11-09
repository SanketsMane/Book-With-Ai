import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm border-b border-border'>
                <Link href="/" className='flex gap-2 items-center hover:opacity-80 transition-opacity'>
                    <Image src={'/logo-small.png'} alt='Book With Ai Logo' width={50} height={50} className='rounded-lg' />
                    <h2 className='font-bold text-2xl text-foreground'>Book With Ai</h2>
                </Link>
                <Link href="/" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                    ← Back to Home
                </Link>
            </div>
            
            {/* Content */}
            <div className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8'>
                {children}
            </div>
        </div>
    )
}