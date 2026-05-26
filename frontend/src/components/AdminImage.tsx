import { Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AdminImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
};

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
    const [failed, setFailed] = useState(false);
    const imageSrc = useMemo(() => resolveImageSrc(src), [src]);
    const fallbackText = getFallbackText(fallbackLabel ?? alt);

    useEffect(() => {
        setFailed(false);
    }, [imageSrc]);

    if (!hasUsableSrc(imageSrc) || failed) {
        return (
            <div className={`flex items-center justify-center bg-emerald-50 text-emerald-700 ${fallbackClassName}`}>
                {fallbackText ? (
                    <span className="text-xs font-extrabold leading-none">{fallbackText}</span>
                ) : (
                    <ImageIcon className="h-6 w-6" />
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
            onError={() => setFailed(true)}
        />
  );
}
