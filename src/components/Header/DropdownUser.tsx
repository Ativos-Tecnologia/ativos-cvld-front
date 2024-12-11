import { UserInfoAPIContext, UserInfoContextType } from "@/context/UserInfoContext";
import useLogout from "@/hooks/useLogout";
import { Avatar } from "flowbite-react";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillCrown, AiOutlineLogout, AiTwotoneCrown } from "react-icons/ai";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BiLogOut, BiUser } from "react-icons/bi";
import { Button } from "../Button";
import DynamicSkeleton from "../CrmUi/ui/DynamicSkeleton";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data, loading } = useContext<UserInfoContextType>(UserInfoAPIContext);


  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  const logout = useLogout()

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (

    <><DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link
          ref={trigger}
          // onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          href="#"
        >
          <span className="hidden text-right lg:flex lg:flex-col lg:gap-px">
            <span className="block text-sm font-medium text-black dark:text-white">
              {loading ? (
                <div className="animate-pulse">
                  <div className="w-[75px] h-[15px] bg-slate-200 rounded-full dark:bg-slate-300"></div>
                </div>
              ) : `${data.first_name} ${data.last_name}`}
            </span>
            <span className="block text-xs">
              {loading ? (
                <div className="animate-pulse">
                  <div className="w-[100px] h-[12px] bg-slate-200 rounded-full dark:bg-slate-300"></div>
                </div>
              )
                : data.user}
            </span>
          </span>
          <span className="relative h-12 w-12 flex items-center justify-center rounded-full border border-stroke dark:border-strokedark">
            {/* {loading ? (
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-full dark:bg-slate-300"></div>
              </div>
            ) : ( */}
              <React.Fragment>
                <DynamicSkeleton trigger={loading}>
                <Avatar img={data.profile_picture} className="rounded-full" size="md" alt="Profile Picture"  rounded placeholderInitials={data.first_name.charAt(0) + data.last_name.charAt(0)} />
                </DynamicSkeleton>
                {data.role === "ativos" && (
                  <AiTwotoneCrown className="absolute bottom-0 right-0 w-5 h-5 fill-current text-amber-500 dark:text-black-2" />
                )}

              </React.Fragment>
            {/* )} */}
          </span>
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuItem
          className="flex items-center gap-3.5 !text-sm font-medium duration-300 ease-in-out lg:text-base cursor-pointer"
          onClick={logout}
        >
          <Button
          variant="ghost" className="w-full [&>p]:flex [&>p]:justify-between [&>p]:w-full"
            onClick={logout}
          >
            <AiOutlineLogout className='w-4.5 h-4.5 fill-current' />
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div className="relative">
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          href="#"
        >
        </Link>
      </div>
    </>
  );
};

export default DropdownUser;
