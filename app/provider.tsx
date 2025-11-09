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
        user && CreateNewUser();
    }, [user])


    const CreateNewUser = async () => {
        if (user) {
            // Save New User if Not Exist
            const result = await CreateUser({
                email: user?.primaryEmailAddress?.emailAddress ?? '',
                imageUrl: user?.imageUrl,
                name: user?.fullName ?? ''
            });
            setUserDetail(result);
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