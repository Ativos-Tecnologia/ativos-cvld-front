import { ReactNode, useCallback, useEffect, useState } from "react";
import { APP_ROUTES } from "@/constants/app-routes";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { checkUserAuthenticated } from "@/functions/check-user-authenticated";
import { getStorageItem, setStorageItem } from "@/utils/localStorage";
import api from "@/utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import Loader from "@/components/common/Loader";



type PropsPrivateRouteProps = {
    children: ReactNode;
};

export default function PrivateRoute({ children }: PropsPrivateRouteProps) {
    const router = useRouter();

    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);

    // 22:11  Warning: The 'auth' function makes the dependencies of useEffect Hook (at line 43) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'auth' in its own useCallback() Hook.  react-hooks/exhaustive-deps

    const auth = useCallback(async () => {
        const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`)

        if (!token) {
            setIsUserAuthenticated(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp!;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsUserAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        auth();
    }, [auth]);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(`ATIVOS_${REFRESH_TOKEN}`);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });

            if (res.status === 200) {
                const { access } = res.data;
                localStorage.setItem(`ATIVOS_${ACCESS_TOKEN}`, access);
                setIsUserAuthenticated(true);
            } else {
                setIsUserAuthenticated(false);
            }
        } catch (error) {
            console.log(error);
            setIsUserAuthenticated(false);
        }
    };



    if (isUserAuthenticated === null) {
        return <Loader />;
    }

    // useEffect(() => {
    //     if (!isUserAuthenticated) {
    //         router.push(APP_ROUTES.public.login.name);
    //     }
    // }, [isUserAuthenticated, router]);

    return (
        <>
            {!isUserAuthenticated && router.push(APP_ROUTES.public.login.name)}
            {isUserAuthenticated && children}
        </>
    )

}

