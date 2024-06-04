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

export interface UserInfoContextType {
    data: UserInfo;
    loading: boolean;
    error: string | null;
    updateProfile: (id: string, data: any) => Promise<any>;
    firstLogin: boolean | null;
    setFirstLogin: (value: boolean | null) => void;
    subscriptionData: ISubscriptionInfo | null;
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

export type SubscriptionPlan = "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE"

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
    subscriptionData: null,
})


export const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {

    const [firstLogin, setFirstLogin] = useState<boolean | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<ISubscriptionInfo | null>(null);

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

    // const checkUserSubscription = async () => {
    //     try {
    //         const response = await api.get("/api/subscription/", {
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         return response.data;
    //     } catch (error: any) {
    //         console.error(error);
    //         return error
    //     }
    // }

    // const fetchProfile = async () => {
    //     try {
    //         const response = await api.get("/api/profile/", {
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         setData(response.data);
    //         // setLoading(false);
    //     } catch (error: any) {
    //         setError(error.message);
    //         setLoading(false);
    //         console.error(error);
    //     }
    // }


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [profileResult, subscriptionResult] = await Promise.all([api.get("/api/profile/"), api.get("/api/user/get-subscription-info/")]);

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

            setLoading(false);
        };

        fetchData();
    }, []);

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
        <UserInfoAPIContext.Provider value={{ data, loading, error, updateProfile, firstLogin, setFirstLogin, subscriptionData }}>
            {children}
        </UserInfoAPIContext.Provider>
    );
};