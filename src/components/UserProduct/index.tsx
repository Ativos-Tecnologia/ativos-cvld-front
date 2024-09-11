'use client'
import { APP_ROUTES } from '@/constants/app-routes';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import api from '@/utils/api';
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react';

export default function UserProduct({ children }: { children: React.ReactNode }) {

    const [isRestricted, setIsRestricted] = useState<boolean | null>(null);
    const router = useRouter();

    async function checkUserProduct(): Promise<string> {
        try {
            const response = await api.get("/api/profile/");

            return response.data.product;

        } catch (error) {
            throw new Error('Ocorreu um erro ao tentar buscar o produto do usuário')
            // return 'error';
        }
    }

    useEffect(() => {
        async function setRestriction() {
            const product = await checkUserProduct();
            if (product === 'wallet' && window.location.pathname === '/') {
                setIsRestricted(true);
            } else if (product === 'crm' && window.location.pathname === '/dashboard/wallet') {
                setIsRestricted(false)
            }
        }
        setRestriction();
    }, []);

    if (isRestricted === null) {
        return children
    }

    return (
        <>
            {isRestricted && router.push(APP_ROUTES.private.wallet.name)}
            {!isRestricted && router.push(APP_ROUTES.private.dashboard.name)}
        </>
    )
}
