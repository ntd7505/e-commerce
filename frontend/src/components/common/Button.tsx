import React from "react";
import { Loader2 } from "lucide-react";
import { buttonVariants, type ButtonVariants } from "./buttonVariants";
import { clsx } from "../../utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  fullWidth,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={clsx(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
