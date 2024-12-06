import { UserInfoAPIContext, UserInfoContextType } from "@/context/UserInfoContext";
import useLogout from "@/hooks/useLogout";
import { Avatar } from "flowbite-react";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillCrown, AiOutlineLogout } from "react-icons/ai";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data, loading, subscriptionData } = useContext<UserInfoContextType>(UserInfoAPIContext);


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

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link
          ref={trigger}
          // onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          href="#"
        >
          <span className="hidden text-right lg:flex lg:flex-col lg:gap-px">
            <span className="block text-sm font-medium text-black dark:text-white">
              {
                loading ? (
                  <div className="animate-pulse">
                    <div className="w-[75px] h-[15px] bg-slate-200 rounded-full dark:bg-slate-300"></div>
                  </div>
                ) : `${data.first_name} ${data.last_name}`
              }
            </span>
            <span className="block text-xs">
              {
                loading ? (
                  <div className="animate-pulse">
                    <div className="w-[100px] h-[12px] bg-slate-200 rounded-full dark:bg-slate-300"></div>
                  </div>
                )
                  : data.user
              }
            </span>
          </span>

          <span className="relative h-12 w-12 flex items-center justify-center rounded-full border border-stroke dark:border-strokedark">
            {
              loading ? (
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-slate-200 rounded-full dark:bg-slate-300"></div>
                </div>
              ) : (
                <React.Fragment>
                  <Avatar img={data.profile_picture} size="md" alt="Profile Picture" rounded placeholderInitials={data.first_name.charAt(0) + data.last_name.charAt(0)} />
                  {subscriptionData.plan === 'GOD_MODE' && (
                    <span className="absolute bottom-2 left-0 w-4 h-4 rounded-full" style={{
                      filter: 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 1))'
                    }}>
                      <AiFillCrown style={{ width: "16px", height: "16px", fill: "#f5e000" }} />
                    </span>
                  )}

                </React.Fragment>
              )
            }
          </span>
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        {/* <DropdownMenuItem>
          <Link
            href="/profile"
            className="flex items-center w-full gap-3.5 !text-sm font-medium duration-300 ease-in-out hover:text-blue-700 dark:hover:text-white lg:text-base"
          >
            <AiOutlineUser className='w-4.5 h-4.5 fill-current' />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href="/settings"
            className={`flex items-center w-full gap-3.5 !text-sm font-medium duration-300 ease-in-out hover:text-blue-700 dark:hover:text-white lg:text-base`}
          >
            <AiOutlineSetting className='w-4.5 h-4.5 fill-current' />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="flex items-center gap-3.5 !text-sm font-medium duration-300 ease-in-out lg:text-base cursor-pointer"
          onClick={logout}
        >
          <Link
            href="#"
            onClick={logout}
            className="flex items-center w-full gap-3.5 !text-sm font-medium duration-300 ease-in-out hover:text-blue-700 dark:hover:text-white lg:text-base"
          >
            <AiOutlineLogout className='w-4.5 h-4.5 fill-current' />
            Sair
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    // <div className="relative">
    //   <Link
    //     ref={trigger}
    //     onClick={() => setDropdownOpen(!dropdownOpen)}
    //     className="flex items-center gap-4"
    //     href="#"
    //   >
    //     <span className="hidden text-right lg:flex lg:flex-col lg:gap-px">
    //       <span className="block text-sm font-medium text-black dark:text-white">
    //         {
    //           loading ? (
    //             <div className="animate-pulse">
    //               <div className="w-[75px] h-[15px] bg-slate-200 rounded-full dark:bg-slate-300"></div>
    //             </div>
    //           ) : `${data.first_name} ${data.last_name}`
    //         }
    //       </span>
    //       <span className="block text-xs">
    //         {
    //           loading ? (
    //             <div className="animate-pulse">
    //               <div className="w-[100px] h-[12px] bg-slate-200 rounded-full dark:bg-slate-300"></div>
    //             </div>
    //           )
    //             : data.title
    //         }
    //       </span>
    //     </span>

    //     <span className="relative h-12 w-12 flex items-center justify-center rounded-full border border-stroke dark:border-strokedark">
    //       {
    //         loading ? (
    //           <div className="animate-pulse">
    //             <div className="w-12 h-12 bg-slate-200 rounded-full dark:bg-slate-300"></div>
    //           </div>
    //         ) : (
    //           <React.Fragment>
    //             <Avatar img={data.profile_picture} size="md" alt="Profile Picture" rounded placeholderInitials={data.first_name.charAt(0) + data.last_name.charAt(0)} />
    //             {subscriptionData.plan === 'GOD_MODE' && (
    //               <span className="absolute bottom-2 left-0 w-4 h-4 rounded-full" style={{
    //                 filter: 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 1))'
    //               }}>
    //                 <AiFillCrown style={{ width: "16px", height: "16px", fill: "#f5e000" }} />
    //               </span>
    //             )}

    //           </React.Fragment>
    //         )
    //       }
    //     </span>

    //   </Link>

    //   <div
    //     ref={dropdown}
    //     onFocus={() => setDropdownOpen(true)}
    //     onBlur={() => setDropdownOpen(false)}
    //     className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? "block" : "hidden"
    //       }`}
    //   >
    //     <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
    //       <li>
    //         <Link
    //           href="/profile"
    //           className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
    //         >
    //           <BiUser className='w-5.5 h-5.5 fill-current' />
    //           Perfil
    //         </Link>
    //       </li>
    //     </ul>
    //     <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" onClick={logout}>
    //       <BiLogOut className='w-5.5 h-5.5 fill-current' />
    //       Sair
    //     </button>
    //   </div>
    // </div>
  );
};

export default DropdownUser;
