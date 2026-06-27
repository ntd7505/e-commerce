---
version: 1.0
name: NexaMart Design System
description: |
  Hệ thống design cho NexaMart — sàn TMĐT điện tử tiêu dùng Việt Nam. Phong cách TMDT: dày đặc, tối ưu chuyển đổi,
  màu xanh primary dẫn dắt CTA, đỏ danger dành riêng cho giá sale/xoá/lỗi. Token hoá toàn bộ màu/radius/shadow.
  Mục tiêu: nhất quán giữa client & admin, dễ maintain, dễ mở rộng.
---

## Overview

NexaMart là sàn thương mại điện tử đa hạng mục (điện tử, điện thoại, laptop, phụ kiện). Giao diện theo phong cách
TMDT Việt Nam: layout 2 cột (sidebar danh mục + nội dung chính), product card grid dày, Flash Sale nổi bật,
giá sale tín hiệu mạnh bằng màu đỏ. Toàn bộ chrome dùng nền trắng/xám nhạt (`canvas`/`surface`), CTA xanh
`primary`, màu đỏ `danger` chỉ cho sale/giá/xoá/lỗi.

**Nguyên tắc cốt lõi:**
- Mọi màu đi qua token `--color-*` trong `src/index.css` `@theme`. Không hardcode hex ngoài token.
- CTA chính luôn `bg-primary` (xanh). Không có 2 CTA primary cùng xuất hiện trong 1 fold.
- Màu đỏ `danger` dành riêng cho giá sale, nút xoá, trạng thái lỗi — không trang trí.
- Icon duy nhất `lucide-react`. Brand/social icon dùng inline SVG (xem Footer).
- Component dùng chung nằm trong `src/components/common/`, truy cập qua barrel `index.ts`.

## Colors

Định nghĩa trong `src/index.css` block `@theme`. Tailwind v4 tự sinh utility: `--color-primary` → `bg-primary`/`text-primary`/`border-primary`.

### Brand & Accent
| Token | Hex | Dùng cho |
|---|---|---|
| `primary` | #0066cc | CTA chính, link, accent, active state |
| `primary-hover` | #0052a3 | Hover CTA |
| `primary-soft` | #e6f0ff | Nền nhẹ primary (badge, highlight, selected row) |
| `danger` | #ee4d2d | Giá sale, % off, nút xoá, lỗi |
| `danger-hover` | #d43f21 | Hover danger |
| `danger-soft` | #fdeee9 | Nền nhẹ danger |
| `success` | #22c55e | Thành công, in-stock, miễn phí ship |
| `success-soft` | #eafbef | Nền nhẹ success |
| `warning` | #f59e0b | Cảnh báo, sắp hết hàng |
| `warning-soft` | #fef3e2 | Nền nhẹ warning |

### Surface & Text
| Token | Hex | Dùng cho |
|---|---|---|
| `canvas` | #ffffff | Nền thẻ, nền trang sáng |
| `surface` | #f5f7f8 | Nền page, vùng giữa các thẻ |
| `surface-alt` | #f4f4f4 | Chip, secondary button, swatch bg |
| `border` | #e5e7eb | Viền mặc định |
| `border-strong` | #d1d5db | Viền input, outline button |
| `text` | #111827 | Văn bản chính |
| `text-muted` | #6b7280 | Văn bản phụ, label |
| `text-subtle` | #9ca3af | Văn bản yếu nhất, placeholder |

### Legacy alias (giữ để code cũ không vỡ)
`nexa-blue` = `primary` · `nexa-red` = `danger` · `nexa-gray-bg` = `surface` · `nexa-text-gray` = `text-muted`.
Khi sửa file cũ, ưu tiên đổi sang token semantic.

## Typography

- Font: **Inter** (load qua Google Fonts trong `index.html`), weights 400/500/600/700.
- Body mặc định `text-text` (hoặc `text-text-muted` cho phụ). Không dùng `text-black`/`text-gray-900` literal khi có token tương đương.
- Tiêu đề section: `text-xl`/`text-2xl font-bold`.
- Giá sale: `text-danger font-bold`. Giá gốc gạch: `text-text-subtle line-through`.

## Radius & Shadow

| Token radius | Giá trị | Utility | Dùng cho |
|---|---|---|---|
| `sm` | 6px | `rounded-sm` | Chip nhỏ, badge |
| `md` | 8px | `rounded-md` | Input, nút nhỏ, dropdown |
| `lg` | 12px | `rounded-lg` | Card, nút, panel |
| `xl` | 16px | `rounded-xl` | Card lớn, modal section |
| `2xl` | 20px | `rounded-2xl` | Summary card, hero |

| Token shadow | Dùng cho |
|---|---|
| `shadow-sm` | Card mặc định, dropdown |
| `shadow-md` | Card hover, sticky panel |
| `shadow-lg` | Modal, popover |

## Components (dùng chung — `src/components/common/`)

### Button
Variants: `primary | secondary | outline | ghost | danger | success`. Sizes: `sm | md | lg`. Props: `loading` (tự hiện spinner), `leftIcon`, `rightIcon`, `fullWidth`.

```tsx
<Button variant="primary" size="lg" loading={submitting} onClick={...}>Đặt hàng</Button>
```

Link nhìn như nút — dùng `buttonVariants`:
```tsx
<Link to="/checkout" className={buttonVariants({ variant: 'primary', fullWidth: true })}>Mua hàng</Link>
```

### Container
Max-width chuẩn + padding responsive.
- `size="default"` (1280) — layout client chính.
- `size="narrow"` (960) — article/form.
- `size="wide"` (1440) — admin dashboard.

```tsx
<Container>...</Container>
```

### Section
Spacing dọc + tuỳ chọn divider.
```tsx
<Section spacing="lg" divider>...</Section>
```

### Breadcrumb
Nhận `items: Crumb[]` (`{label, to?}`), separator `ChevronRight`.
```tsx
<Breadcrumb items={[{label:'Trang chủ', to:'/'}, {label:'Sản phẩm', to:'/products'}, {label: product.name}]} />
```

### Badge
Variants: `primary | danger | success | warning | neutral | outline`. Size `sm | md`. Tuỳ chọn `dot`.

### States & Pagination
`LoadingState`, `ErrorState` (có `onRetry`), `EmptyState` (trong `States.tsx`). `Pagination` (0-indexed page).

## Layout

### Client
- `ClientLayout` = TopBar (announcement) → Header (logo + search + nav + cart) → BenefitsBar → Outlet → Footer.
- Home: 2 cột — `CategorySidebar` (sticky, `hidden lg:block`) + nội dung (Hero, QuickServices, FlashSale, Recommended).
- Product List: breadcrumb + filter bar ngang (category/brand/price/sort dropdown) + grid 2/3/4/5 cột + pagination.
- Product Detail: breadcrumb + 3 cột (gallery + info + purchase panel) + tabs + related.
- Cart: 2 cột (item list + summary sticky).
- Checkout: 2 cột (address + items + coupon + payment | summary).

### Admin
- `AdminLayout` (sidebar + topbar), được `RequireAdmin` bảo vệ. Component riêng trong `src/components/admin/` (`AdminBadge`, `AdminStatCard`, `AdminSpinner`, `AdminSkeletonTable`, `AdminEmptyState`, `AdminImage`, `AdminAlert`, `AdminErrorBoundary`).

## Responsive

| Breakpoint | Hành vi |
|---|---|
| < 640px (mobile) | 1 cột, sidebar ẩn, grid 2 cột sản phẩm, search thu gọn |
| 640–1023px (tablet) | grid 3 cột, BenefitsBar hiện |
| ≥ 1024px (desktop) | full 2 cột home, sidebar sticky, grid 4–5 cột |

**Khoảng trống đã biết (xử lý Phase 2+):**
- Header chưa có hamburger/drawer trên mobile — nav danh mục mất trên màn hẹp.
- `CategorySidebar` `hidden lg:block` chưa có fallback mobile.
- Container width chưa thống nhất (Home `container-custom` 1280, ProductDetail `max-w-[1200px]`, Cart `max-w-[1280px]`).
- Một số file cũ vẫn dùng `bg-blue-600`/`text-gray-*` literal thay vì token — cần migrate dần.

## Icon policy

- Thư viện duy nhất: `lucide-react`. Import named.
- Spinner: `<Loader2 className="w-4 h-4 animate-spin" />`.
- Brand icon (Facebook/YouTube/X/Apple/Google Play) lucide không có → inline SVG (mẫu tại `src/layouts/client/Footer.tsx`).
- Không nhúng CDN icon vào `index.html`.

## Do / Don't

### Do
- Dùng token `bg-primary`/`text-text`/`border-border`... thay hex literal.
- Dùng `Button` + `buttonVariants` cho mọi nút.
- Dùng `Container` thay `max-w-[1280px]` ad-hoc.
- Giá sale: `text-danger font-bold` + giá gốc `text-text-subtle line-through`.
- Card: `rounded-lg` + `shadow-sm`, hover lên `shadow-md` (không lift).

### Don't
- Không dùng `bg-blue-600`/`bg-red-500`/`text-black` literal.
- Không tự chế radius mới (`rounded-[13px]`...) — dùng scale `sm`/`md`/`lg`/`xl`/`2xl`.
- Không thêm thư viện icon mới (Font Awesome, Heroicons...).
- Không dùng màu đỏ cho trang trí — chỉ sale/xoá/lỗi.
- Không commit khi chưa chạy `npm run lint` + `npx tsc -b --noEmit`.

## Trạng thái Phase 1 (foundation)

✅ Token hoá màu/radius/shadow trong `index.css`.
✅ Component dùng chung: `Button`, `Container`, `Section`, `Breadcrumb`, `Badge` + barrel.
✅ Bỏ Font Awesome CDN, migrate toàn bộ icon sang `lucide-react` (16 file).
✅ `AGENTS.md` ghi qui ước.
⏳ Phase 2: chuẩn hoá layout, Header mobile, migrate hex literal → token.
⏳ Phase 3: refactor ProductCard/PDP/Cart theo design system.
⏳ Phase 4: audit admin + a11y.
