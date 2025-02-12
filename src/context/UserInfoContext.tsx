'use client';
import api from '@/utils/api';
import { createContext, useEffect, useState } from 'react';

export interface UserInfo {
    id?: number | string | null | undefined;
    first_name: string;
    last_name: string;
    user: string;
    phone: string;
    profile_picture: string;
    title: string;
    role: string;
    cpf_cnpj?: string | null | undefined;
    email: string;
    bio: string;
    workspace?: string | null | undefined;
    sub_role: string;
    product: string;
    staff_approvation?: boolean | null | undefined;
    is_confirmed: boolean;
}

export interface IUserBalance {
    id: number;
    available_credits: number;
}

export interface UserInfoContextType {
    data: UserInfo;
    loading: boolean;
    error: string | null;
    updateProfile: (id: string, data: any) => Promise<any>;
    firstLogin: boolean | null;
    setFirstLogin: (value: boolean | null) => void;
    credits: IUserBalance;
    setCredits: (value: IUserBalance) => void;
    updateProfilePicture: (id: string, data: FormData) => Promise<any>;
    removeProfilePicture: (id: string) => Promise<any>;
    updateUserInfo: (id: string, data: any) => Promise<any>;
}

export interface UpdateUserProfile extends FormData {
    first_name: string;
    last_name: string;
    user: string;
    phone: string;
    profile_picture: string;
    title: string;
}

export interface UpdateUser extends FormData {
    email: string;
    username: string;
    password: string;
}

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | 'GOD_MODE';

export interface ISubscriptionInfo {
    id: string;
    user: number;
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    start_date: string;
    end_date: string;
}

export const UserInfoAPIContext = createContext<UserInfoContextType>({
    data: {
        first_name: '',
        last_name: '',
        user: 'None',
        phone: '',
        profile_picture: '',
        title: '',
        role: '',
        cpf_cnpj: '',
        email: '',
        bio: '',
        sub_role: '',
        product: '',
        is_confirmed: false,
    },

    loading: true,
    error: null,
    updateProfile: async () => ({}),
    firstLogin: null,
    setFirstLogin: () => {},
    credits: {
        id: 0,
        available_credits: 0,
    },
    setCredits: () => {},
    updateProfilePicture: async () => ({}),
    removeProfilePicture: async () => ({}),
    updateUserInfo: async () => ({}),
});

export const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
    const [firstLogin, setFirstLogin] = useState<boolean | null>(null);

    const [credits, setCredits] = useState<IUserBalance>({
        id: 0,
        available_credits: 0,
    });

    const [data, setData] = useState<UserInfo>({
        first_name: '',
        last_name: '',
        user: '',
        phone: '',
        profile_picture: '',
        title: '',
        role: '',
        cpf_cnpj: '',
        email: '',
        bio: '',
        sub_role: '',
        product: '',
        is_confirmed: false,
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const profileResult = await api.get('/api/profile/');

            if (profileResult.status === 200) {
                setData(profileResult.data);
            } else {
                setError('Error fetching profile data');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const updateProfilePicture = async (id: string, data: FormData) => {
        setLoading(true);
        try {
            const response = await api.patch(`/api/profile/picture/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                const profileResult = await api.get('/api/profile/');
                if (profileResult.status === 200) {
                    setData(profileResult.data);
                } else {
                    setError('Error fetching profile data');
                }

                setLoading(false);
            }

            return response;
        } catch (error: any) {
            setError(error.message);
            console.error(error);
            return error;
        } finally {
            setLoading(false);
        }
    };

    const removeProfilePicture = async (id: string) => {
        setLoading(true);
        try {
            const response = await api.patch(`/api/profile/picture/delete/${id}/`);

            if (response.status === 200) {
                const profileResult = await api.get('/api/profile/');
                if (profileResult.status === 200) {
                    setData(profileResult.data);
                } else {
                    setError('Error fetching profile data');
                }

                setLoading(false);
            }

            return response;
        } catch (error: any) {
            setError(error.message);
            console.error(error);
            return error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (id: string, data: UpdateUserProfile) => {
        setLoading(true);
        try {
            const response = await api.patch(`/api/profile/update/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setData(response.data);
                setLoading(false);

                return response;
            }

            return response;
        } catch (error: any) {
            setError(error.message);
            console.error(error);
            return error;
        } finally {
            setLoading(false);
        }
    };

    const updateUserInfo = async (id: string, dataToUpdate: UpdateUser) => {
        setLoading(true);
        try {
            const response = await api.patch(`/api/user/update/${id}/`, dataToUpdate, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setData({
                    id: data.id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    title: data.title,
                    phone: data.phone,
                    bio: data.bio,
                    profile_picture: data.profile_picture,
                    role: data.role,
                    user: response.data.username,
                    email: response.data.email,
                    sub_role: data.sub_role,
                    product: data.product,
                    is_confirmed: data.is_confirmed,
                });

                setLoading(false);
                return response;
            }
        } catch (error: any) {
            setError(error.message);
            console.error(error);
            return error;
        }
    };

    return (
        <UserInfoAPIContext.Provider
            value={{
                data,
                loading,
                error,
                updateProfile,
                firstLogin,
                setFirstLogin,
                credits,
                setCredits,
                updateProfilePicture,
                removeProfilePicture,
                updateUserInfo,
            }}
        >
            {children}
        </UserInfoAPIContext.Provider>
    );
};
