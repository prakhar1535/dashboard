import { cn } from "@/lib/utils";
import { createElement } from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "default" | "muted" | "destructive";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
}

const Heading = ({
  level = 1,
  variant = "default",
  size = "base",
  className,
  children,
  ...props
}: HeadingProps) => {
  const tag = `h${level}` as const;

  const variants = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    destructive: "text-destructive",
  };

  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  return createElement(
    tag,
    {
      className: cn(
        "font-semibold tracking-tight",
        variants[variant],
        sizes[size],
        className
      ),
      ...props,
    },
    children
  );
};

export { Heading };
