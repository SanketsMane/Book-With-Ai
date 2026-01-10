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
import { Home, Plane, Bell, Map, Bookmark, FileText } from 'lucide-react'

const menuOptions = [
    {
        icon: <Home className="w-5 h-5" />,
        path: '/'
    },
    {
        icon: <Plane className="w-5 h-5" />,
        path: '/flights'
    },
    {
        icon: <Bell className="w-5 h-5" />,
        path: '/price-alerts'
    },
    {
        icon: <Map className="w-5 h-5" />,
        path: '/explore'
    },
    {
        icon: <Bookmark className="w-5 h-5" />,
        path: '/my-trips'
    },
    {
        icon: <FileText className="w-5 h-5" />,
        path: '/create-new-trip'
    }
]

function Header() {

    //@ts-ignore
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

    const { user } = useUser();
    const path = usePathname();

    return (
        <>
            {/* Desktop & Tablet Header */}
            <div className='flex justify-between items-center p-3 px-6 shadow-sm border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
                {/* Logo  */}
                <div className='flex items-center gap-3'>
                    <Image src={'/logo-small.png'} alt='logo' width={40} height={40} className='rounded-lg' />
                    <h2 className='font-bold text-xl text-foreground'>Book With Ai</h2>
                </div>

                {/* Center Icon Navigation - Hidden on Mobile */}
                <div className='hidden md:flex items-center gap-6 md:gap-8'>
                    {menuOptions.map((menu, index) => (
                        <Link key={index} href={menu.path}>
                            <div className={`p-2 rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary 
                                ${path == menu.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                                {menu.icon}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className='flex gap-3 items-center'>
                    <ThemeToggle />

                    {!user ?
                        <div className='flex gap-3 items-center'>
                            <Link href='/sign-in'>
                                <Button variant='outline' size="sm">Sign In</Button>
                            </Link>
                            <Link href='/sign-up'>
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div> :
                        <div className='flex items-center gap-3'>
                            <UserButton />
                        </div>
                    }
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur z-50 md:hidden pb-safe'>
                <div className='flex justify-around items-center p-3'>
                    {menuOptions.map((menu, index) => (
                        <Link key={index} href={menu.path}>
                            <div className={`p-2 rounded-xl transition-all duration-200 
                                ${path == menu.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                                {menu.icon}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Header