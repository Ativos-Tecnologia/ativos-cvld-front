export const APP_ROUTES = {
  private: {
    dashboard: {
      name: "/",
    },
    comercial: {
      name: "/comercial/resumo",
    },
    wallet: {
      name: "/dashboard/wallet",
    },
    marketplace: {
      name: "/dashboard/marketplace",
    },
    marketplaceItem: {
      name: "/dashboard/marketplace/:id",
    },
    broker: {
      name: "/dashboard/broker",
    },
    juridico: {
      name: "/dashboard/juridico",
    },
    juridicoCard: {
      name: "/dashboard/juridico/:id",
    },
    profile: {
      name: "/profile",
    },
    // settings: {
    //   name: "/settings",
    // },
  },
  public: {
    login: {
      name: "/auth/signin",
    },
    register: {
      name: "/auth/signup",
    },
    pricing: {
      name: "/pricing",
    },
    change_password: {
      name: "/change-password",
    },
    two_step_verification: {
      name: "/auth/two-step-verification",
    },
    automated_proposal: {
      name: "/automated-proposal",
    },
    recalculate_trf1: {
      name: "/retification",
    },
    wallet: {
      name: "/auth/signup/wallet",
    },
    terms_and_conditions: {
      name: "/termos-e-condicoes",
    },
    privacy_policy:{
      name: "/politica-de-privacidade",
    },
  },
};
    
