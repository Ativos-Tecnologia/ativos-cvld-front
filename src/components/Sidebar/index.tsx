"use client";

import { DefaultLayoutContext } from "@/context/DefaultLayoutContext";
import { GeneralUIContext } from "@/context/GeneralUIContext";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import useColorMode from "@/hooks/useColorMode";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineDown, AiOutlineLoading } from "react-icons/ai";
import { BiCalculator, BiGridAlt, BiPlus } from "react-icons/bi";
import { FaBuildingUser } from "react-icons/fa6";
import { LuWallet2 } from "react-icons/lu";
import { TbShoppingCartUp } from "react-icons/tb";
import CapaDoBatman from "../CapaDoBatman";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

  const {
    theme,
    setTheme,
  } = useContext(GeneralUIContext);

  const { modalOpen, setModalOpen } = useContext(DefaultLayoutContext);

  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const [logoColorSrc, setLogoColorSrc] = useState<string>("");
  
  const { data: { product } } = useContext(UserInfoAPIContext);
  const [userApprovation, setUserApprovation] = useState<boolean | null>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  const fetchItems = async () => {
    const response = await api.post("api/notion-api/marketplace/available/?count/");

    if (response.status === 200) {
      return response.data
    } else {
      return 0
    }
  }

  const { data, isFetching } = useQuery({
    queryKey: ["marketplace_active_items"],
    refetchInterval: 60 * 1000, // sessenta segundos
    staleTime: 50 * 1000, // cinquenta segundos
    queryFn: fetchItems
  });

useEffect(() => {
  async function fetchUserApprovation() {
    try {
      const response = await api.get("/api/profile/");
      setUserApprovation(response.data.staff_approvation);
    } catch (e) {
      console.error(`Erro ao tentar verificar aprovação do usuário: ${e}`);
    }
  }

  fetchUserApprovation();
}, []);


  const [themeApplied] = useColorMode();


  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);


  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-10 flex h-screen w-62.5 flex-col overflow-y-hidden bg-white dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-200`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex justify-center gap-5 2xsm:px-2 lg:px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          {
            theme !== "light" ? (
              <div className="flex items-center gap-2">
                <Image
                  width={60}
                  height={32}
                  src="/images/logo/new-logo-dark.png"
                  alt="Logo"
                  priority
                />
                <Image
                  width={120}
                  height={32}
                  src="/images/logo/celer-app-text-logo-dark.svg"
                  alt="Logo"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Image
                  width={60}
                  height={32}
                  src="/images/logo/ativos_logo_at_default.png"
                  alt="Logo"
                  priority
                />
                <Image
                  width={120}
                  height={32}
                  src="/images/logo/celer-app-text-logo-light.svg"
                  alt="Logo"
                  priority
                />
              </div>
            )
          }
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className={`block lg:hidden ${theme === "light" ? "text-black-2" : "text-snow"}`}
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            {/* <h3 className="mb-4 ml-4 text-sm font-semibold">
              MENU
            </h3> */}

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:hover:bg-meta-4 ${
                          (pathname === "/" ||
                            pathname.includes("dashboard")) &&
                          "bg-blue-700/90 text-white dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <BiGridAlt style={{ width: "22px", height: "22px" }} />
                        Dashboard
                        <AiOutlineDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-all duration-300 ${open && "rotate-180"}`}
                        />
                      </Link>

                      <div
                        className={`translate transform overflow-hidden ${!open ? "max-h-0" : "max-h-550"} transition-all duration-200`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          {product !== "wallet" && (
                            <li>
                              <Link
                                href="/"
                                className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out  hover:bg-blue-400 hover:text-white dark:hover:bg-meta-4 ${
                                  pathname === "/" &&
                                  "bg-blue-700/70 text-white dark:bg-meta-4 dark:hover:bg-form-strokedark"
                                }`}
                              >
                                <BiCalculator />
                                <span>Calculadora</span>
                              </Link>
                            </li>
                          )}
                          {product !== "crm" && (
                            <>
                              <li
                                className={`${userApprovation === false ? "hidden" : null}`}
                              >
                                <Link
                                  href="/dashboard/wallet"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:hover:bg-meta-4 ${pathname === "/dashboard/wallet" && "bg-blue-700/70 text-white hover:bg-blue-800/50 dark:bg-meta-4 dark:hover:bg-form-strokedark"}`}
                                >
                                  <LuWallet2 />
                                  <span>Wallet</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/dashboard/marketplace"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:hover:bg-meta-4 ${pathname.includes("/dashboard/marketplace") && "bg-blue-700/70 text-white dark:bg-meta-4 dark:hover:bg-form-strokedark"}`}
                                >
                                  <TbShoppingCartUp />
                                  <span>PrecaShop</span>
                                  {/* counter */}
                                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-xs text-snow">
                                    {isFetching ? (
                                      <AiOutlineLoading className="animate-spin text-[10px]" />
                                    ) : (
                                      <>{data?.count || 0}</>
                                    )}
                                  </span>
                                </Link>
                              </li>
                              <CapaDoBatman
                                show={
                                  window.location.href.includes("dev-") ||
                                  window.location.href.includes("localhost:")
                                }
                              >
                                <li>
                                  <Link
                                    href="/dashboard/broker"
                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-blue-400 hover:text-white dark:hover:bg-meta-4 ${pathname === "/dashboard/wallet" && "bg-blue-700/70 text-white hover:bg-blue-800/50 dark:bg-meta-4 dark:hover:bg-form-strokedark"}`}
                                  >
                                    <FaBuildingUser />
                                    <span>Broker</span>
                                  </Link>
                                </li>
                              </CapaDoBatman>
                            </>
                          )}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Menu Item Dashboard --> */}
              {/* <--- new precatory button --> */}
              <Link
                href="#"
                onClickCapture={() => setModalOpen(!modalOpen)}
                className={`flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark2 hover:text-white duration-300 ease-in-out hover:bg-blue-400 dark:hover:bg-form-strokedark ${modalOpen &&
                  "bg-blue-700/90 dark:bg-meta-4 text-white"
                  }`}
                onClick={() => { }}
              >
                <BiPlus style={{ width: '22px', height: '22px' }} />
                <span>Novo Precatório</span>
              </Link>
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          {/* <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>


          </div> */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
