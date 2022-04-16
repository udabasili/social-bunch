import React, { ButtonHTMLAttributes, useRef } from "react";
import clsx from "clsx";
import { Loader } from "../Loaders";

const variants = {
  primary:
    "bg-[#1a6104] text-white hover:bg-gray-50:text-blue-600 border-blue-600",
  inverse: "bg-white text-blue-600 hover:bg-blue-600:text-white border-white",
  danger: "bg-red-600 text-white hover:bg-red-50:text-red-600 border-red-600",
  dark: "bg-black text-white hover:bg-black//30:text-white/30 border-black-600",

};

const sizes = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6 text-md",
  lg: "py-4 px-8 text-2xl",
};

type IconProps = |
    {
        startIcon?: undefined, endIcon?: undefined
    } |
    {
        startIcon: React.ReactElement, endIcon?: never
    } |
    {
        startIcon?: never, endIcon:  React.ReactElement
    }

type ButtonProps = {
  size: keyof typeof sizes;
  variant: keyof typeof variants;
  type: "button" | "submit";
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onClick?: (e: any) => void;
} & IconProps;

export const Button = (
  props: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const {
    type,
    variant,
    size,
    children,
    className,
    onClick = () => {},
    isLoading,
    startIcon,
    endIcon,
    ...otherProps
  } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      
      className={clsx(
        "flex justify-center font-bold font-display items-center border disabled:opacity-70 disabled:cursor-not-allowed rounded-md shadow-sm capitalize focus:outline-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...otherProps}
    >
      {isLoading && <Loader size="sm" className="text-current" />}
      {!isLoading && startIcon}
      <span className="mx-2">{children}</span>
      {!isLoading && endIcon}
    </button>
  );
};

