"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "@/css/scrollbar.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { usePathname } from "next/navigation";
import { checkIsPublicRoute } from "@/functions/check-is-public-route";
import PrivateRoute from "@/components/PrivateRoute";
import { UserInfoProvider } from "@/context/UserInfoContext";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isPublicRoute = checkIsPublicRoute(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);




  return (
    <html lang="pt-br">
      <body suppressHydrationWarning={true}>
        <div className="bg-[#f0f0f0] dark:bg-boxdark-2 dark:text-bodydark">

          {
            !isPublicRoute ? (
              <UserInfoProvider>
                <PrivateRoute>
                    {children}
                </PrivateRoute>
              </UserInfoProvider>
            ) : (
              <>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {children}
                  </>
                )}
              </>
            )
          }
        </div>
      </body>
    </html>
  );
}
