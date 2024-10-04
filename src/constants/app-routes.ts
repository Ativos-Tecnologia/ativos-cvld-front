export const APP_ROUTES = {
    private : {
        dashboard: {
            name: "/"
        },
        wallet: {
            name: "/dashboard/wallet"
        },
        profile: {
            name: "/profile"
        },
        settings: {
            name: "/settings"
        }
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
        },
        two_step_verification: {
            name: '/auth/two-step-verification'
        },
        automated_proposal: {
            name: "/automated-proposal"
        },
        recalculate_trf1: {
            name: "/retification"
        }
    }
};