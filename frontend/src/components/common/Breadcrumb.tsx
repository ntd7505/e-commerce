import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { clsx } from "../../utils/cn";

export interface Crumb {
  label: string;
  to?: string;
}

type BreadcrumbProps = {
  items: Crumb[];
  className?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx(
        "flex flex-wrap items-center gap-1.5 text-sm text-text-muted",
        className,
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  isLast && "text-text font-medium line-clamp-1",
                )}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-text-subtle shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
