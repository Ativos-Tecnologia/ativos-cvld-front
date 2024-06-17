import { ReactNode, useCallback, useEffect, useState, useContext } from "react";
import { APP_ROUTES } from "@/constants/app-routes";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "@/utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import Loader from "@/components/common/Loader";
import { UserInfoAPIContext } from "@/context/UserInfoContext";

type PropsPrivateRouteProps = {
    children: ReactNode;
};

export default function PrivateRoute({ children }: PropsPrivateRouteProps) {
    const router = useRouter();
    const { setFirstLogin, firstLogin } = useContext(UserInfoAPIContext);

    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        if (!localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`) || !localStorage.getItem(`ATIVOS_${REFRESH_TOKEN}`)) {
            window.location.href = APP_ROUTES.public.login.name;
        }
    }, []);

    // const checkIsUserFirstLogin = async (): Promise<boolean> => {
    //     try {
    //         const response = await api.get("/api/check-first-login/");
    //         if (response.data[0].is_first_login === true) {
    //             setFirstLogin(true);
    //             return true;
    //         }

    //         setFirstLogin(false);
    //         return false;
    //     } catch (error) {
    //         console.error(error);
    //         return false;
    //     }
    // }

    // useEffect(() => {
    //     checkIsUserFirstLogin().then((res) => {
    //         setFirstLogin(res);
    //     });
    // }, [firstLogin]);

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
            window.location.href = APP_ROUTES.public.login.name; // Em caso de erro, redireciona para a tela de login. Ainda em beta e pendente de validação.
        }
    };

    if (isUserAuthenticated === null) {
        return <Loader />;
    }

    return (
        <>
            {!isUserAuthenticated && router.push(APP_ROUTES.public.login.name)}
            {isUserAuthenticated && children}
            {isUserAuthenticated && firstLogin && router.push(APP_ROUTES.private.profile.name)}
        </>
    )

}

