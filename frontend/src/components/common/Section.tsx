import React from "react";
import { clsx } from "../../utils/cn";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  spacing?: "none" | "sm" | "md" | "lg";
  divider?: boolean;
};

const SPACING = {
  none: "py-0",
  sm: "py-6",
  md: "py-10",
  lg: "py-14",
};

export const Section: React.FC<SectionProps> = ({
  as: Tag = "section",
  spacing = "md",
  divider = false,
  className,
  children,
  ...rest
}) => {
  return (
    <Tag
      className={clsx(
        SPACING[spacing],
        divider && "border-t border-border",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Section;
