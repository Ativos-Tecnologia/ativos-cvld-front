export interface TenantSignInPageProps {
    showLoginForm: boolean;
    setShowLoginForm: (show: boolean) => void;
    loading: boolean;
    handleRedirect: () => void;
    loginError: string;
    errors: any;
    register: any;
    handleSubmit: any;
    onSubmit: any;
    setHide: any;
    hide: any;
    loadingStates: string[];
    reqStatus: 'failure' | 'success' | null;
    setLoading: any;
    setOpenModal: any;
    openModal: boolean;
}
