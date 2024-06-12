export const APP_ROUTES = {
    private : {
        dashboard: {
            name: "/"
        },
        profile: {
            name: "/profile"
        },
    },
    public : {
        login: {
            name: "/auth/signin"
        },
        register: {
            name: "/auth/signup"
        },
        pricing: {
            name: '/pricing'
        },
        change_password: {
            name: '/change-password'
        }
    }
};