"use client";
import React, { useState, useContext, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import RouteGuard from "../RouteGuard";
import { TableNotionProvider } from "@/context/NotionTableContext";
import { GeneralUIProvider } from "@/context/GeneralUIContext";
import { DefaultLayoutProvider } from "@/context/DefaultLayoutContext";
import NewForm from "../Modals/NewForm";
import CapaDoBatman from "../CapaDoBatman";

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
      <DefaultLayoutProvider>
        <GeneralUIProvider>
          <div className="flex h-screen overflow-hidden">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <TableNotionProvider>
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </TableNotionProvider>
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              {/* <!-- ===== Header Start ===== --> */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              {/* <!-- ===== Header End ===== --> */}

              {/* <!-- ===== Main Content Start ===== --> */}
              <main className="w-full">
                <div className="mx-auto max-w-screen-2xl p-4 md:px-2 md:py-6 xl:p-6 2xl:p-10">
                  <RouteGuard>{children}</RouteGuard>
                </div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
              <CapaDoBatman
                show={
                  !window.location.href.includes(
                    "https://ativoscvld.vercel.app/",
                  ) && showAlert
                }
              >
                <div className="sticky bottom-0 z-9 w-full px-5 py-3 text-center text-white">
                  <Alert
                    color="warning"
                    icon={HiInformationCircle}
                    className="mb-0 transition-all duration-300"
                    onDismiss={() => {
                      setStyleRelated({ opacity: 0 });
                      setTimeout(() => {
                        setShowAlert(false);
                      }, 300);
                    }}
                    style={styleRelated}
                  >
                    Você está usando uma versão em desenvolvimento!
                  </Alert>
                </div>
              </CapaDoBatman>
            </div>
            <NewForm />
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
        </GeneralUIProvider>
      </DefaultLayoutProvider>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
