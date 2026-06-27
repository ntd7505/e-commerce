export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | { [key: string]: unknown };

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const push = (val: ClassValue) => {
    if (!val) return;
    if (typeof val === "string" || typeof val === "number") {
      out.push(String(val));
    } else if (Array.isArray(val)) {
      val.forEach(push);
    } else if (typeof val === "object") {
      for (const key in val) {
        if (val[key]) out.push(key);
      }
    }
  };

  inputs.forEach(push);
  return out.join(" ");
}

export default cn;

export { cn as clsx };
