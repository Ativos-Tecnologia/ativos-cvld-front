import Image from "next/image";
import React from "react";
import CRMTooltip from "../CrmUi/Tooltip";
import { Fade } from "react-awesome-reveal";
interface BreadcrumbProps {
  pageName: string;
  title?: string;
  iconPath?: string;
  customIcon?: React.ReactNode;
  altIcon?: string;
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
          <li>
            <p className="font-medium">
              Dashboard /
            </p>
          </li>
          <p className="font-medium text-primary">{pageName}</p>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
