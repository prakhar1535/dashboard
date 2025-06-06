import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon: Icon,
      iconPosition = "left",
      loading,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ShadcnButton
        className={cn(className)}
        variant={variant}
        size={size}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <Icon className="w-4 h-4 mr-2" />
            )}
            {children}
            {Icon && iconPosition === "right" && (
              <Icon className="w-4 h-4 ml-2" />
            )}
          </>
        )}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
