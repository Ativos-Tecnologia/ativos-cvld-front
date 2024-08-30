"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { UserInfoProvider } from "@/context/UserInfoContext";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [styleRelated, setStyleRelated] = useState({ opacity: 1 });
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="w-full">
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          {!window.location.href.includes('https://ativoscvld.vercel.app/') && (
            showAlert && (
              <div className="sticky w-full bottom-0 z-9 py-3 px-5 text-white text-center">
            <Alert color="warning" icon={HiInformationCircle} className="mb-0 transition-all duration-300" onDismiss={() => {
              setStyleRelated({ opacity: 0 });
              setTimeout(() => {
                setShowAlert(false);
              }, 300);
            }} style={
              styleRelated
            }>
                Você está usando uma versão em desenvolvimento!
              </Alert>
            </div>
          )
          )}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
