"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { BiCalculator, BiChevronDown, BiGridAlt, BiUser } from "react-icons/bi";
import { CiViewBoard } from "react-icons/ci";
import { AiOutlineBars, AiOutlineDown, AiOutlinePlus } from "react-icons/ai";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { FiClipboard } from "react-icons/fi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

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
      className={`absolute left-0 top-0 z-10 flex h-screen w-62.5 flex-col overflow-y-hidden bg-blue-900 dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex justify-center gap-5 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={196}
            height={32}
            src={"/images/logo/celer-app-logo-text.svg"}
            alt="Logo"
            priority
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
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
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6 text-white">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold">
              MENU
            </h3>

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
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium hover:bg-blue-300/50 dark:hover:bg-meta-4 ${(pathname === "/" ||
                          pathname.includes("dashboard")) &&
                          "bg-blue-300/50 dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <BiGridAlt style={{ width: '22px', height: '22px' }} />
                        Dashboard
                        <AiOutlineDown className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 fill-current ${open && "rotate-180"}`} />
                      </Link>

                      {!window.location.href.includes('https://ativoscvld.vercel.app/') && (
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/"
                              className={`group relative flex items-center gap-2.5 px-4 py-2 font-medium rounded-md hover:bg-blue-300/50 dark:hover:bg-meta-4 ${pathname === "/" && "bg-blue-300/50 dark:bg-meta-4"
                                }`}
                            >
                              <BiCalculator />
                              <span>Calculadora</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/dashboard/wallet"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/dashboard/wallet" && "text-white"
                              }`}
                            >
                              Wallet
                            </Link>
                          </li>
                        </ul>
                      </div>
                      )}

                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === "/tasks" || pathname.includes("tasks")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out hover:bg-blue-300/50 dark:hover:bg-meta-4 ${(pathname === "/tasks" ||
                          pathname.includes("tasks")) &&
                          "bg-blue-300/50 dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <AiOutlineBars />
                        Tarefas
                        <AiOutlineDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition--all duration-300 ${open && "rotate-180"
                          }`} />
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      {!window.location.href.includes('https://ativoscvld.vercel.app/') && (

                        <div
                          className={`translate transform overflow-hidden ${!open && "hidden"
                            }`}
                        >
                          <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <Link
                                href="/tasks/task-list"
                                className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium hover:bg-blue-300/50 dark:hover:bg-meta-4 duration-300 ease-in-out ${pathname === "/tasks/task-list" && "bg-blue-300/50 dark:bg-meta-4 text-white"
                                  }`}
                              >
                                <FiClipboard />
                                Lista
                                {/* <span className="absolute right-4 block rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                                Pro
                              </span> */}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/tasks/task-kanban"
                                className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium hover:bg-blue-300/50 dark:hover:bg-meta-4 duration-300 ease-in-out ${pathname === "/tasks/task-kanban" &&
                                  "bg-blue-300/50 dark:bg-meta-4 text-white"
                                  } `}
                              >
                                <CiViewBoard />
                                Kanban
                                {/* <span className="absolute right-4 block rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                                Pro
                              </span> */}
                              </Link>
                            </li>
                            <li>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="group w-full relative flex items-center gap-1 rounded-md px-4 py-2 font-medium duration-300 ease-in-out hover:bg-blue-300/50 dark:hover:bg-meta-4">
                                    <AiOutlinePlus />
                                    Adicionar tarefa
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogTitle>
                                    Adicionar nova tarefa
                                  </DialogTitle>
                                  <div className="relative w-full max-w-180 rounded-sm border border-stroke bg-snow p-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8 xl:p-10">

                                    <form action="#">
                                      <div className="mb-5">
                                        <label
                                          htmlFor="taskTitle"
                                          className="mb-2.5 block font-medium text-black dark:text-white"
                                        >
                                          Task title
                                        </label>
                                        <input
                                          type="text"
                                          name="taskTitle"
                                          id="taskTitle"
                                          placeholder="Enter task title"
                                          className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                                        />
                                      </div>

                                      <div className="mb-5">
                                        <label
                                          htmlFor="taskDescription"
                                          className="mb-2.5 block font-medium text-black dark:text-white"
                                        >
                                          Task description
                                        </label>
                                        <textarea
                                          name="taskDescription"
                                          id="taskDescription"
                                          cols={30}
                                          rows={7}
                                          placeholder="Enter task description"
                                          className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                      </div>

                                      <div className="mb-5">
                                        <label
                                          htmlFor="taskList"
                                          className="mb-2.5 block font-medium text-black dark:text-white"
                                        >
                                          Task list
                                        </label>
                                        <div className="flex flex-col gap-3.5">
                                          <div className="flex items-center gap-2.5">
                                            <input
                                              type="text"
                                              name="taskList"
                                              id="taskList"
                                              placeholder="Enter list text"
                                              className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                                            />

                                            <button className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                                              <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <g clipPath="url(#clip0_75_12779)">
                                                  <path
                                                    d="M18.75 9.3125H10.7187V1.25C10.7187 0.875 10.4062 0.53125 10 0.53125C9.625 0.53125 9.28125 0.84375 9.28125 1.25V9.3125H1.25C0.875 9.3125 0.53125 9.625 0.53125 10.0312C0.53125 10.4062 0.84375 10.75 1.25 10.75H9.3125V18.75C9.3125 19.125 9.625 19.4687 10.0312 19.4687C10.4062 19.4687 10.75 19.1562 10.75 18.75V10.7187H18.75C19.125 10.7187 19.4687 10.4062 19.4687 10C19.4687 9.625 19.125 9.3125 18.75 9.3125Z"
                                                    fill=""
                                                  />
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_75_12779">
                                                    <rect width="20" height="20" fill="white" />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </button>
                                          </div>
                                          <div className="flex items-center gap-2.5">
                                            <input
                                              type="text"
                                              name="taskList"
                                              id="taskList"
                                              placeholder="Enter list text"
                                              className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                                            />

                                            <button className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                                              <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M18.4375 10.7187H1.5625C1.1875 10.7187 0.84375 10.4062 0.84375 10C0.84375 9.625 1.15625 9.28125 1.5625 9.28125H18.4375C18.8125 9.28125 19.1562 9.59375 19.1562 10C19.1562 10.375 18.8125 10.7187 18.4375 10.7187Z"
                                                  fill=""
                                                />
                                              </svg>
                                            </button>
                                            <button className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                                              <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <g clipPath="url(#clip0_75_12779)">
                                                  <path
                                                    d="M18.75 9.3125H10.7187V1.25C10.7187 0.875 10.4062 0.53125 10 0.53125C9.625 0.53125 9.28125 0.84375 9.28125 1.25V9.3125H1.25C0.875 9.3125 0.53125 9.625 0.53125 10.0312C0.53125 10.4062 0.84375 10.75 1.25 10.75H9.3125V18.75C9.3125 19.125 9.625 19.4687 10.0312 19.4687C10.4062 19.4687 10.75 19.1562 10.75 18.75V10.7187H18.75C19.125 10.7187 19.4687 10.4062 19.4687 10C19.4687 9.625 19.125 9.3125 18.75 9.3125Z"
                                                    fill=""
                                                  />
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_75_12779">
                                                    <rect width="20" height="20" fill="white" />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </button>
                                          </div>
                                          <div className="flex items-center gap-2.5">
                                            <input
                                              type="text"
                                              name="taskList"
                                              id="taskList"
                                              placeholder="Enter list text"
                                              className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                                            />

                                            <button className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                                              <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M18.4375 10.7187H1.5625C1.1875 10.7187 0.84375 10.4062 0.84375 10C0.84375 9.625 1.15625 9.28125 1.5625 9.28125H18.4375C18.8125 9.28125 19.1562 9.59375 19.1562 10C19.1562 10.375 18.8125 10.7187 18.4375 10.7187Z"
                                                  fill=""
                                                />
                                              </svg>
                                            </button>
                                            <button className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                                              <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <g clipPath="url(#clip0_75_12779)">
                                                  <path
                                                    d="M18.75 9.3125H10.7187V1.25C10.7187 0.875 10.4062 0.53125 10 0.53125C9.625 0.53125 9.28125 0.84375 9.28125 1.25V9.3125H1.25C0.875 9.3125 0.53125 9.625 0.53125 10.0312C0.53125 10.4062 0.84375 10.75 1.25 10.75H9.3125V18.75C9.3125 19.125 9.625 19.4687 10.0312 19.4687C10.4062 19.4687 10.75 19.1562 10.75 18.75V10.7187H18.75C19.125 10.7187 19.4687 10.4062 19.4687 10C19.4687 9.625 19.125 9.3125 18.75 9.3125Z"
                                                    fill=""
                                                  />
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_75_12779">
                                                    <rect width="20" height="20" fill="white" />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mb-5">
                                        <label
                                          htmlFor="taskImg"
                                          className="mb-2.5 block font-medium text-black dark:text-white"
                                        >
                                          Add image
                                        </label>
                                        <div>
                                          <div
                                            id="FileUpload"
                                            className="relative block w-full appearance-none rounded-sm border border-dashed border-stroke bg-white px-4 py-4 dark:border-strokedark dark:bg-boxdark sm:py-14"
                                          >
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none"

                                            />
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                              <span className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-stroke bg-primary/5 dark:border-strokedark">
                                                <svg
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 20 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <g clipPath="url(#clip0_75_12841)">
                                                    <path
                                                      d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 4.85663V14.1666H9.16667V4.85663L4.1075 9.91663L2.92917 8.73829L10 1.66663L17.0708 8.73746L15.8925 9.91579L10.8333 4.85829V4.85663Z"
                                                      fill="#3C50E0"
                                                    />
                                                  </g>
                                                  <defs>
                                                    <clipPath id="clip0_75_12841">
                                                      <rect width="20" height="20" fill="white" />
                                                    </clipPath>
                                                  </defs>
                                                </svg>
                                              </span>
                                              <p className="text-xs">
                                                <span className="text-primary">Click to upload</span> or
                                                drag and drop
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <Button className="w-full">
                                        <svg
                                          className="fill-current"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g clipPath="url(#clip0_60_9740)">
                                            <path
                                              d="M18.75 9.3125H10.7187V1.25C10.7187 0.875 10.4062 0.53125 10 0.53125C9.625 0.53125 9.28125 0.84375 9.28125 1.25V9.3125H1.25C0.875 9.3125 0.53125 9.625 0.53125 10.0312C0.53125 10.4062 0.84375 10.75 1.25 10.75H9.3125V18.75C9.3125 19.125 9.625 19.4687 10.0312 19.4687C10.4062 19.4687 10.75 19.1562 10.75 18.75V10.7187H18.75C19.125 10.7187 19.4687 10.4062 19.4687 10C19.4687 9.625 19.125 9.3125 18.75 9.3125Z"
                                              fill=""
                                            />
                                          </g>
                                          <defs>
                                            <clipPath id="clip0_60_9740">
                                              <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                          </defs>
                                        </svg>
                                        Adicionar
                                      </Button>
                                    </form>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </li>
                          </ul>
                        </div>
                      )}
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Calendar --> */}
              {/* <li>
                <Link
                  href="/gerenciador"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 10.9968V8.21245H12.5999V10.9968H9.64678ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.2499 4.24683H3.7124V4.83745C3.7124 5.17495 3.99365 5.48433 4.35928 5.48433C4.7249 5.48433 5.00615 5.20308 5.00615 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96865 4.24683 2.2499 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.2499C1.96865 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z"
                      fill=""
                    />
                  </svg>
                  Gerenciador Ativos
                </Link>
              </li> */}
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
