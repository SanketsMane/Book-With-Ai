"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTripDetail } from '../provider'
import { ThemeToggle } from '@/components/theme-toggle'
import NotificationCenter from '@/components/ui/notification-center'

const menuOptions = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Pricing',
        path: '/pricing'
    },
    {
        name: 'Contact us',
        path: '/contact-us'
    }
]

function Header() {

    //@ts-ignore
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

    const { user } = useUser();
    const path = usePathname();

    return (
        <div className='flex justify-between items-center p-4 shadow-md border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            {/* Logo  */}
            <div className='flex items-center gap-3'>
                <Image src={'/logo-small.png'} alt='logo' width={50} height={50} className='rounded-lg' />
                <h2 className='font-bold text-2xl text-foreground'>Book With Ai</h2>
            </div>
            {/* Menu Options  */}
            <div className='flex gap-8 items-center'>
                {menuOptions.map((menu, index) => (
                    <Link key={index} href={menu.path}>
                        <h2 className='text-lg hover:scale-105 transition-all hover:text-primary text-muted-foreground hover:text-primary'>{menu.name}</h2>
                    </Link>
                ))}
            </div>
            {/* Get Started Button & Theme Toggle */}
            <div className='flex gap-3 items-center'>
                <ThemeToggle />
                {user && <NotificationCenter />}
                {user && (
                    <Link href='/personalization'>
                        <Button variant='ghost' className='flex items-center gap-2'>
                            🧠 AI Assistant
                        </Button>
                    </Link>
                )}
                {!user ? 
                    <div className='flex gap-3 items-center'>
                        <Link href='/sign-in'>
                            <Button variant='outline'>Sign In</Button>
                        </Link>
                        <Link href='/sign-up'>
                            <Button>Get Started</Button>
                        </Link>
                    </div> :
                    path == '/create-new-trip' ?
                        <Link href={'/my-trips'}>
                            <Button>My Trips</Button>
                        </Link>
                        : <Link href={'/create-new-trip'}>
                            <Button onClick={() => setTripDetailInfo(null)}>Create New trip</Button>
                        </Link>
                }
                <UserButton />
            </div>
        </div>
    )
}

export default Header