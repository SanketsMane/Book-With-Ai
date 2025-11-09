import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='w-full max-w-md'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-foreground mb-2'>Join Book With Ai</h1>
                <p className='text-muted-foreground'>Create your account and start planning amazing trips</p>
            </div>
            <SignUp 
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-xl border border-border bg-card/80 backdrop-blur-sm",
                        headerTitle: "text-foreground",
                        headerSubtitle: "text-muted-foreground",
                        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                        formFieldInput: "bg-background border-border text-foreground",
                        formFieldLabel: "text-foreground",
                        identityPreviewText: "text-foreground",
                        identityPreviewEditButton: "text-primary",
                        footerActionText: "text-muted-foreground",
                        footerActionLink: "text-primary hover:text-primary/80",
                    }
                }}
            />
        </div>
    )
}