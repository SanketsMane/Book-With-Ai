import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='w-full max-w-md'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back!</h1>
                <p className='text-gray-600'>Sign in to continue planning your amazing trips with AI</p>
            </div>
            <SignIn 
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-xl border-0 bg-white/80 backdrop-blur-sm",
                        headerTitle: "text-gray-900",
                        headerSubtitle: "text-gray-600",
                    }
                }}
            />
        </div>
    )
}