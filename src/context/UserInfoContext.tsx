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
}


export interface UpdateUserProfile extends FormData {
    first_name: string;
    last_name: string;
    user: string;
    phone: string;
    profile_picture: string;
    title: string;
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
})


export const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {

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
        const fetchProfile = async () => {
            try {
                const response = await api.get("/api/profile/", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setData(response.data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
                console.error(error);
            }
        }
        fetchProfile();
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
        <UserInfoAPIContext.Provider value={{ data, loading, error, updateProfile }}>
            {children}
        </UserInfoAPIContext.Provider>
    );
};