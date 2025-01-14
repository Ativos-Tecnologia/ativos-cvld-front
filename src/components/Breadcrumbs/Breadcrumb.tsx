import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Fade } from "react-awesome-reveal";
import CRMTooltip from "../CrmUi/Tooltip";
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
      
      <div className="flex items-center w-fit">
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
        
        <h2 className={`flex w-fit text-[28px] font-semibold text-black dark:text-white ${title ? "visible" : "invisible"}`}>
        <Fade cascade damping={0.1} triggerOnce >
          {title}
        </Fade>
        </h2>
      </div>
    </div>
  );
};

export default Breadcrumb;
