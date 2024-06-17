"use client";
import { createContext, use, useEffect, useState } from "react";
import api from "@/utils/api";

export interface UserInfo {
    0: {
        id?: number | string | null;
        first_name: string;
        last_name: string;
        user: string;
        phone: string;
        profile_picture: string;
        title: string;
    };
}

export interface IUserBalance {
    id: number,
    available_credits: number
}

export interface UserInfoContextType {
    data: UserInfo;
    loading: boolean;
    error: string | null;
    updateProfile: (id: string, data: any) => Promise<any>;
    firstLogin: boolean | null;
    setFirstLogin: (value: boolean | null) => void;
    subscriptionData: ISubscriptionInfo;
    credits: IUserBalance;
    setCredits: (value: IUserBalance) => void;
    updateProfilePicture: (id: string, data: FormData) => Promise<any>;
}


export interface UpdateUserProfile extends FormData {
    first_name: string;
    last_name: string;
    user: string;
    phone: string;
    profile_picture: string;
    title: string;
}

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED"

export type SubscriptionPlan = "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE" | "GOD_MODE"

export interface ISubscriptionInfo {
    0 : {
        id: string;
    user: number;
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    start_date: string;
    end_date: string;
    }

}

export const UserInfoAPIContext = createContext<UserInfoContextType>({
    data: {
        0: {first_name: "",
        last_name: "",
        user: "",
        phone: "",
        profile_picture: "",
        title: "",
    },
    },

    loading: true,
    error: null,
    updateProfile: async () => ({}),
    firstLogin: null,
    setFirstLogin: () => {},
    subscriptionData: {
        0: {
            id: "",
            user: 0,
            status: "PENDING",
            plan: "FREE",
            start_date: "",
            end_date: "",
        }
    },
    credits: {
        id: 0,
        available_credits: 0
    },
    setCredits: () => {},
    updateProfilePicture: async () => ({}),
})


export const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {

    const [firstLogin, setFirstLogin] = useState<boolean | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<ISubscriptionInfo>({
        0: {
            id: "",
            user: 0,
            status: "PENDING",
            plan: "FREE",
            start_date: "",
            end_date: "",
        }
    });

    const [credits, setCredits] = useState<IUserBalance>({
        id: 0,
        available_credits: 0
    });

    const [data, setData] = useState<UserInfo>({
        0: {
        first_name: "",
        last_name: "",
        user: "",
        phone: "",
        profile_picture: "",
        title: "",
    },
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [profileResult, subscriptionResult, creditsResult] = await Promise.all([api.get("/api/profile/"), api.get("/api/user/get-subscription-info/"), api.get('/api/user/get-balance/')]);

            if (profileResult.status === 200) {
                setData(profileResult.data);
            } else {
                setError("Error fetching profile data");
            }

            if (subscriptionResult.status === 200) {
                setSubscriptionData(subscriptionResult.data);
            } else {
                setError("Error fetching subscription data");
            }

            if (creditsResult.status === 200) {
                setCredits(creditsResult.data);
            } else {
                setError("Error fetching credits data");
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
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                const profileResult = await api.get("/api/profile/");
                if (profileResult.status === 200) {
                    setData(profileResult.data);
                } else {
                    setError("Error fetching profile data");
                }

                setLoading(false);
            }

                return response
        }
        catch (error: any) {
            setError(error.message);
            console.error(error);
            return error
        } finally {
            setLoading(false);
        }
    }

    const updateProfile = async (id: string, data: UpdateUserProfile) => {
        setLoading(true);
        try {
            const response = await api.patch(`/api/profile/update/${id}/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                setData([response.data]);
                setLoading(false);

                return response
            }


            return response
        } catch (error: any) {
            setError(error.message);
            console.error(error);
            return error
        } finally {
            setLoading(false);
        }
    }

    return (
        <UserInfoAPIContext.Provider value={{ data, loading, error, updateProfile, firstLogin, setFirstLogin, subscriptionData, credits, setCredits, updateProfilePicture }}>
            {children}
        </UserInfoAPIContext.Provider>
    );
};