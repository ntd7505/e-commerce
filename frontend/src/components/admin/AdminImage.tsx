import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

type AdminImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
};

const DUMMY_IMAGE_DOMAINS = ["example.com", "placeholder.com"];

function isDummyUrl(url?: string | null) {
    if (!url) return false;
    return DUMMY_IMAGE_DOMAINS.some((domain) => url.includes(domain));
}

function hasUsableSrc(src?: string | null) {
    return Boolean(src && src.trim());
}

function resolveImageSrc(src?: string | null) {
    const value = src?.trim();

    if (!value) {
        return "";
    }

    if (/^(https?:|data:|blob:)/i.test(value)) {
        return value;
    }

    if (value.startsWith("//")) {
        return `${window.location.protocol}${value}`;
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ?? "";

    if (!apiBaseUrl) {
        return value;
    }

    return `${apiBaseUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

function getFallbackText(value?: string | null) {
    const words = value
        ?.trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!words || words.length === 0) {
        return "";
    }

    return words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

export function AdminImage({
    src,
    alt,
    className = "h-full w-full object-cover",
    fallbackClassName = "h-full w-full",
    fallbackLabel,
}: AdminImageProps) {
    const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});
    const imageSrc = useMemo(() => resolveImageSrc(src), [src]);
    const fallbackText = getFallbackText(fallbackLabel ?? alt);
    const fallbackDisplay = fallbackText || (alt?.trim() ? alt.trim()[0].toUpperCase() : "");
    const isDummy = isDummyUrl(src);
    const failed = imageSrc ? (failedSrcs[imageSrc] ?? false) : true;

    if (!hasUsableSrc(imageSrc) || failed || isDummy) {
        return (
            <div
                className={`flex flex-col items-center justify-center gap-1 ${
                    isDummy ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                } ${fallbackClassName}`}
                title={isDummy ? "URL chứa example.com — cần upload ảnh thật" : undefined}
            >
                {isDummy ? (
                    <AlertTriangle className="h-5 w-5" />
                ) : (
                    <span className="text-xs font-extrabold leading-none">{fallbackDisplay}</span>
                )}
                {isDummy && (
                    <span className="text-[10px] font-bold leading-none">Upload ảnh</span>
                )}
            </div>
        );
  }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setFailedSrcs((prev) => ({ ...prev, [imageSrc]: true }))}
        />
  );
}
