"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { AiOutlineLoading } from "react-icons/ai";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
}

const variants = {
  default: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-[#cc4b4c] hover:bg-[#cc4b4c]/80 text-white",
  outlined:
    "bg-transparent border border-blue-700 text-blue-700 hover:border-blue-800 hover:text-blue-800 dark:border-snow dark:text-snow dark:hover:border-gray-200 dark:hover:text-gray-200",
  ghost: "bg-transparent border-transparent hover:bg-blue-50 dark:hover:bg-graydark/30 dark:border-transparent",
  success: "bg-green-500 hover:bg-green-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  info: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary:
    "bg-secondary hover:bg-secondary/70 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/70 transition-colors",
};

const sizes = {
  none: "",
  default: "px-4 py-2",
  sm: "px-3 py-1",
  lg: "px-6 py-3",
  icon: "w-10 h-10",
  "icon-sm": "w-8 h-8",
  "icon-lg": "w-12 h-12",
  "icon-xl": "w-14 h-14",
  "icon-2xl": "w-16 h-16",
  "icon-3xl": "w-20 h-20",
  "icon-4xl": "w-24 h-24",
};

export const Button: React.FC<SubmitButtonProps> = ({
  className,
  type = "button",
  children,
  variant = "default",
  size = "default",
  isLoading = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        `${variants[variant]} ${sizes[size]} relative flex items-center justify-center rounded-md transition-all duration-300 overflow-hidden`,

        className,
      )}
      disabled={isLoading}
      {...props}
    >
        <span 
        className={`
          py-1.5
          overflow-hidden 
          absolute 
          top-full 
          left-0 
          w-full 
          flex
          items-center 
          justify-center 
          transition-all 
          duration-300
          ${isLoading ? 'translate-y-[-114%]' : 'translate-y-0'}
        `}
      >
        <AiOutlineLoading className="h-5 w-5 text-current animate-spin" />
      </span>

      <div
        className={`
          transition-all
          duration-300
          flex
          items-center
          gap-2
          ${isLoading ? 'translate-y-full text-transparent' : 'translate-y-0'}
        `}
      >
        {children}
      </div>
    </button>
  );
};
