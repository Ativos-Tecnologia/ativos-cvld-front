"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import useColorMode from "@/hooks/useColorMode";
import { MainFooter } from "../Footer";
import { LiteFooter } from "../Footer/LiteFooter";

export default function UnloggedLayout({ children, }: { children: React.ReactNode }) {
  
  useEffect(() => {
    if (localStorage.getItem('ATIVOS_access') === "undefined") {
      localStorage.removeItem('ATIVOS_access');
      localStorage.removeItem('ATIVOS_refresh');
    }
  }, []);

  // // automatically will set the dark or light mode using the localStorage value
  // const [colorMode, setColorMode] = useColorMode();
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex items-center justify-center overflow-hidden xl:min-h-screen">
          <main className="flex-1 3xl:max-w-[85%] xl:h-screen 3xl:h-fit 3xl:rounded-md shadow-2 overflow-hidden">
            <div className="relative xl:h-[85%]">
              {children}
            </div>
        {
          (window.location.pathname === '/auth/signin' || window.location.pathname === '/auth/signup') && <LiteFooter />
        }
          </main>
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
