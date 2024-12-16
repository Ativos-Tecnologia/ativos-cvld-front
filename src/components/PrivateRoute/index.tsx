import { ReactNode, useCallback, useEffect, useState, useContext } from "react";
import { APP_ROUTES } from "@/constants/app-routes";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "@/utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import Loader from "@/components/common/Loader";
import UseMySwal from "@/hooks/useMySwal";
import { UserInfoAPIContext } from "@/context/UserInfoContext";

type PropsPrivateRouteProps = {
    children: ReactNode;
};

export default function PrivateRoute({ children }: PropsPrivateRouteProps) {
    const router = useRouter();
    const MySwal = UseMySwal();

    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);

    const { data: is_confirmed } = useContext(UserInfoAPIContext);

    

    const auth = useCallback(async () => {
        const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
        

        if (!token) {
            MySwal.fire({
                text: "Token expirado.",
                icon: "error",
                position: "bottom-end",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            })
            setIsUserAuthenticated(false);
            return;
        }

        if (!is_confirmed) {
            MySwal.fire({
                text: "Sua conta ainda não foi confirmada.",
                icon: "error",
                position: "bottom-end",
                toast: true,
                showConfirmButton: true
            })
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

    }, [MySwal, is_confirmed]);

    useEffect(() => {
        if (!localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`) || !localStorage.getItem(`ATIVOS_${REFRESH_TOKEN}`)) {
            window.location.href = APP_ROUTES.public.login.name;
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
            console.error(error);
            setIsUserAuthenticated(false);
            window.location.href = APP_ROUTES.public.login.name;
        }
    };

    if (isUserAuthenticated === null) {
        return <Loader />;
    }

    return (
        <>
            {!isUserAuthenticated && router.push(APP_ROUTES.public.login.name)}
            {isUserAuthenticated && children}
        </>
    )

}

