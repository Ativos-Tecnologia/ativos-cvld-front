import Image from "next/image";
import React from "react";
import CRMTooltip from "../CrmUi/Tooltip";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  title?: string;
  iconPath?: string;
  customIcon?: React.ReactNode;
  altIcon?: string;
  animationTrigger?: boolean;
}
const Breadcrumb = ({ pageName, iconPath, customIcon, altIcon, title }: BreadcrumbProps) => {
  if (iconPath && customIcon) {
    throw new Error("Você não pode passar um ícone personalizado e um caminho de ícone ao mesmo tempo.");
  }
  const defaultAltIcon = "O ícone do Workspace";
  return (
    <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-boxdark p-5 rounded-md">
      
      <div className="flex items-center">
      <Fade cascade triggerOnce>
        <div className="mr-4">
        {
          iconPath ? (
            <Image
              src={`${iconPath}`}
              alt={altIcon || `${defaultAltIcon}`}
              width={32}
              height={32}
            />
          ) : <CRMTooltip text={altIcon ?? `${defaultAltIcon}`} placement="end">
              {customIcon}
            </CRMTooltip>
        }
        </div>
      </Fade>
        
        <h2 className={`flex w-full text-[28px] font-semibold text-black dark:text-white ${title ? "visible" : "invisible"}`}>
        <Fade cascade damping={0.1} triggerOnce >
          {title}
        </Fade>
        </h2>
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          
          <Link href={
            window.location.pathname.split("/")[1] === "juridico" ? "/juridico" : "/dashboard/juridico"
          } className="font-medium text-primary">{
            window.location.pathname.split("/")[window.location.pathname.split("/")?.length - 2] === "juridico" ? "Jurídico" : "Dashboard"
          }</Link>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
