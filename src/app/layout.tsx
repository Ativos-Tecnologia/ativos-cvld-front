"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "@/css/nexa.css";
import "@/css/scrollbar.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { usePathname } from "next/navigation";
import { checkIsPublicRoute } from "@/functions/check-is-public-route";
import PrivateRoute from "@/components/PrivateRoute";
import { UserInfoProvider } from "@/context/UserInfoContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

  const queryClient = new QueryClient();


  return (
    <html lang="pt-br">
      <body suppressHydrationWarning={true} className="2xl:min-h-screen">
        <QueryClientProvider client={queryClient}>
          <div className="relative bg-[#f0f0f0] dark:bg-boxdark-2 dark:text-bodydark xl:min-h-screen">

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
            <Toaster />
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
