# AGENTS.md — NexaMart Frontend

Tiêu chuẩn cho agent khi làm việc trong `frontend/`. Tuân thủ để giữ hệ thống nhất quán.

## Lệnh

| Mục đích | Lệnh |
|---|---|
| Dev server | `npm run dev` |
| Build production | `npm run build` (chạy `tsc -b` rồi `vite build`) |
| Lint | `npm run lint` (ESLint flat config) |
| Typecheck | `npx tsc -b --noEmit` |

**Bắt buộc** chạy `npm run lint` và `npx tsc -b --noEmit` trước khi kết thúc task. Build để xác nhận production compile được.

## Stack

- React 19 + TypeScript + Vite 5
- Tailwind CSS v4 (config qua `@theme` trong `src/index.css`, KHÔNG dùng `tailwind.config.js`)
- React Router v7 (`BrowserRouter`, layout routes trong `src/App.tsx`)
- `lucide-react` — thư viện icon **duy nhất**. Không dùng Font Awesome, không nhúng CDN icon.
- `recharts` cho biểu đồ admin.

## Design tokens

Định nghĩa trong `src/index.css` block `@theme`. Tailwind v4 tự sinh utility từ token (`--color-primary` → `bg-primary`/`text-primary`/`border-primary`).

| Token màu | Giá trị | Dùng cho |
|---|---|---|
| `primary` / `primary-hover` / `primary-soft` | #0066cc / #0052a3 / #e6f0ff | CTA, link, accent |
| `danger` / `danger-hover` / `danger-soft` | #ee4d2d / ... | Giá sale, xoá, lỗi |
| `success` / `success-soft` | #22c55e | Thành công, miễn phí ship |
| `warning` / `warning-soft` | #f59e0b | Cảnh báo |
| `canvas` / `surface` / `surface-alt` | #fff / #f5f7f8 / #f4f4f4 | Nền trang / thẻ / chip |
| `border` / `border-strong` | #e5e7eb / #d1d5db | Viền |
| `text` / `text-muted` / `text-subtle` | #111827 / #6b7280 / #9ca3af | Văn bản |

Radius: `radius-sm` 6 · `radius-md` 8 · `radius-lg` 12 · `radius-xl` 16 · `radius-2xl` 20 (utility `rounded-sm`...`rounded-2xl`).
Shadow: `shadow-sm` / `shadow-md` / `shadow-lg`.

**Token legacy** `nexa-blue`/`nexa-red`/`nexa-gray-bg`/`nexa-text-gray` vẫn giữ làm alias — code cũ dùng `text-nexa-blue`... vẫn chạy. Khi sửa file cũ, ưu tiên đổi sang token semantic (`text-primary`...).

### Quy tắc màu
- CTA chính: `bg-primary`. Hover: `bg-primary-hover`. Không tự chế `bg-blue-600` literal.
- Màu đỏ chỉ dùng cho sale/giá/xoá/lỗi (`danger`), không trang trí.
- Không dùng `text-black`/`bg-black` — dùng `text-text`/nền tối riêng nếu cần.

## Component dùng chung

Nằm trong `src/components/common/`. Import qua barrel `src/components/common` hoặc file trực tiếp.

- `Button` — variants: `primary | secondary | outline | ghost | danger | success`; sizes `sm | md | lg`; props `loading`, `leftIcon`, `rightIcon`, `fullWidth`. Dùng cho mọi nút.
- `buttonVariants({variant,size,fullWidth})` — trả className để áp cho `<Link>`/`<a>` khi cần link nhìn như nút.
- `Container` — max-width chuẩn (`default` 1280, `narrow` 960, `wide` 1440) + padding responsive. Dùng thay `max-w-[1280px]` ad-hoc.
- `Section` — spacing dọc (`none|sm|md|lg`) + tuỳ chọn `divider`.
- `Breadcrumb` — nhận `items: Crumb[]` (`{label, to?}`), render `ChevronRight` separator.
- `Badge` — variants `primary|danger|success|warning|neutral|outline`, size `sm|md`, tuỳ chọn `dot`.
- `LoadingState` / `ErrorState` / `EmptyState` (trong `States.tsx`).
- `Pagination`.

### Khi thêm component mới
- Đặt trong `src/components/common/` nếu dùng chung client+admin, hoặc `src/components/{client|admin}/` nếu riêng.
- Dùng token (`bg-primary`...), không hardcode hex.
- Export qua barrel `index.ts` nếu common.
- Viết kiểu TypeScript tường minh, không `any`.

## Icon

- Chỉ dùng `lucide-react`. Import named: `import { Search, ShoppingCart } from 'lucide-react'`.
- Spinner: `<Loader2 className="w-4 h-4 animate-spin" />`.
- Brand/social icon lucide không có (Facebook, Youtube, Twitter...) → dùng inline SVG (xem `src/layouts/client/Footer.tsx`).
- Không tải Font Awesome, không nhúng CDN icon vào `index.html`.

## Cấu trúc route

- Client: `/` (ClientLayout) — Home, products, account, cart, checkout.
- Admin: `/admin` (AdminLayout, được `RequireAdmin` bảo vệ) — dashboard, orders, products, ...
- Auth: `AuthProvider`, `RequireAuth`, `RequireAdmin` trong `src/features/auth/`.

## Lint / type

- ESLint flat config (`eslint.config.js`). Đã bật `eslint-plugin-react-hooks`, `react-refresh`.
- Khi tắt rule inline, ghi lý do: `// eslint-disable-next-line react-hooks/set-state-in-effect`.
- TypeScript strict. Không dùng `any` trừ khi có comment giải thích.

## Không được làm

- Không commit khi chưa chạy lint + typecheck.
- Không xoá token legacy `nexa-*` (code cũ còn dùng) trừ khi đã migrate hết.
- Không thêm thư viện icon mới.
- Không tự ý đổi scope — hỏi user nếu cần mở rộng ra ngoài Phase được giao.
