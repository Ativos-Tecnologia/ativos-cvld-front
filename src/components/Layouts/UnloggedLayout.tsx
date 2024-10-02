"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import useColorMode from "@/hooks/useColorMode";
import { MainFooter } from "../Footer";
import { LiteFooter } from "../Footer/LiteFooter";

export default function UnloggedLayout({ children, }: { children: React.ReactNode }) {
  if (localStorage.getItem('ATIVOS_access') === undefined) {
    localStorage.removeItem('ATIVOS_access');
    localStorage.removeItem('ATIVOS_refresh');
  }

  // automatically will set the dark or light mode using the localStorage value
  const [colorMode, setColorMode] = useColorMode();
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex overflow-hidden 2xl:min-h-screen">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden 2xl:justify-center">
          {/* <!-- ===== Header Start ===== --> */}
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          {/* put p-4 md:p-6 2xl:p-10 on the children principal container */}
          <main>
            <div className="relative mx-auto overflow-hidden">
              {children}
            </div>
        {
          window.location.pathname === '/auth/signin' || window.location.pathname === '/auth/signup' ? <LiteFooter /> : <MainFooter />
        }
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
