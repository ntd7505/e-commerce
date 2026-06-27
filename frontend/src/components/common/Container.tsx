import React from "react";
import { clsx } from "../../utils/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  size?: "default" | "narrow" | "wide";
};

const SIZE = {
  narrow: "max-w-[960px]",
  default: "max-w-[1280px]",
  wide: "max-w-[1440px]",
};

export const Container: React.FC<ContainerProps> = ({
  as: Tag = "div",
  size = "default",
  className,
  ...rest
}) => {
  return (
    <Tag
      className={clsx(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        SIZE[size],
        className,
      )}
      {...rest}
    />
  );
};

export default Container;
