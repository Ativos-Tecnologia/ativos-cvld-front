"use client";
import { APP_ROUTES } from "@/constants/app-routes";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const routeAccessMap: Record<"crm" | "wallet" | "global", string[]> = {
  crm: [
    APP_ROUTES.private.broker.name,
    APP_ROUTES.private.profile.name,
    APP_ROUTES.private.settings.name,
  ],
  wallet: [
    APP_ROUTES.private.wallet.name,
    APP_ROUTES.private.marketplace.name,
    APP_ROUTES.private.marketplaceItem.name,
    APP_ROUTES.private.profile.name,
    APP_ROUTES.private.settings.name,
  ],
  global: Object.values(APP_ROUTES.private).map((route) => route.name),
};

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    data: { product },
  } = useContext(UserInfoAPIContext) as {
    data: { product: "crm" | "wallet" | "global" };
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
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
