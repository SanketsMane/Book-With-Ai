"use client"
import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import { TripContextType, TripDetailContext } from '@/context/TripDetailContext';
import { TripInfo } from './create-new-trip/_components/ChatBox';
import { TooltipProvider } from '@/components/ui/tooltip';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const CreateUser = useMutation(api.user.CreateNewUser)
    const [userDetail, setUserDetail] = useState<any>();
    const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo | null>(null);

    const { user } = useUser();

    useEffect(() => {
        if (user) {
            CreateNewUser();
        } else {
            // Fallback: Create/Login as Guest if no Clerk user (for Dev/Demo when Auth is blocked)
            CreateGuestUser();
        }
    }, [user])

    const CreateNewUser = async () => {
        if (user) {
            try {
                // Save New User if Not Exist
                const result = await CreateUser({
                    email: user?.primaryEmailAddress?.emailAddress ?? '',
                    imageUrl: user?.imageUrl ?? '',
                    name: user?.fullName ?? ''
                });
                setUserDetail(result);
            } catch (e) {
                console.error("Error creating/syncing user:", e);
                // Optionally handle error state
            }
        }
    }

    const CreateGuestUser = async () => {
        try {
            const result = await CreateUser({
                email: 'guest@bookwithai.com',
                imageUrl: 'https://github.com/shadcn.png',
                name: 'Guest User'
            });
            setUserDetail(result);
            console.log("Logged in as Guest User");
        } catch (e) {
            console.error("Guest login failed:", e);
        }
    }

    return (
        <TooltipProvider>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <TripDetailContext.Provider value={{ tripDetailInfo, setTripDetailInfo }}>
                    <div className="min-h-screen bg-background text-foreground">
                        <Header />
                        {children}
                    </div>
                </TripDetailContext.Provider>
            </UserDetailContext.Provider>
        </TooltipProvider>
    )
}

export default Provider

export const useUserDetail = () => {
    return useContext(UserDetailContext);
}

export const useTripDetail = (): TripContextType | undefined => {
    return useContext(TripDetailContext)
}