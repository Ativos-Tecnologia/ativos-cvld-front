"use client";
import { APP_ROUTES } from "@/constants/app-routes";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const routeAccessMap: Record<"crm" | "wallet" | "global", string[]> = {
  crm: [
    APP_ROUTES.private.broker.name,
    APP_ROUTES.private.profile.name,
  ],
  wallet: [
    APP_ROUTES.private.wallet.name,
    APP_ROUTES.private.marketplace.name,
    APP_ROUTES.private.marketplaceItem.name,
    APP_ROUTES.private.profile.name,
  ],
  global: Object.values(APP_ROUTES.private).map((route) => route.name)
};

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    data: { product, role, sub_role },
  } = useContext(UserInfoAPIContext) as {
    data: { product: "crm" | "wallet" | "global";
    role: "ativos";
    sub_role: "juridico" };
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const devRouteGuard = (currentPath:string, fallbackPath:string = APP_ROUTES.private.dashboard.name) => {
      if (window.location.href.includes(
        "https://ativoscvld.vercel.app/",
      ) && currentPath.includes("juridico")) {
        return router.push(fallbackPath);
      }
    };

    const currentPath = window.location.pathname;
    devRouteGuard(currentPath);

    const privateRoutes = Object.values(APP_ROUTES.private).map(
      (route) => route.name,
    );

    if (privateRoutes.includes(currentPath)) {
      const allowedRoutes = routeAccessMap[product] || [];
      if (!allowedRoutes.includes(currentPath)) {
        if (product === "crm") {
          router.push("/dashboard/broker");
        } else if (product === "wallet") {
          router.push("/dashboard/wallet");
        }
      }
    }
    setIsLoading(false);
  }, [product, router]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
