---
name: NexaMart Design System
description: |
  Design system cho NexaMart — sàn TMĐT điện tử tiêu dùng Việt Nam.
  Register: Product. Creative North Star: "The Efficiency Engine."
  Màu Trust Blue dẫn CTA, Alert Red cho sale/lỗi, Confirm Green cho thành công.
  Hệ thống phẳng nhẹ (subtle elevation), component refined & restrained.
version: 2.0
generated: 2026-06-28
colors:
  trust-blue: "#2563eb"
  trust-blue-deep: "#1d4ed8"
  trust-blue-mist: "#e6f0ff"
  alert-red: "#ef4444"
  alert-red-deep: "#dc2626"
  alert-red-mist: "#fdeee9"
  confirm-green: "#22c55e"
  confirm-green-mist: "#eafbef"
  caution-amber: "#f59e0b"
  caution-amber-mist: "#fef3e2"
  page-canvas: "#f5f7f8"
  card-white: "#ffffff"
  chip-gray: "#ffffff"
  border-light: "#e5e7eb"
  border: "#d1d5db"
  ink: "#111827"
  ink-secondary: "#4b5563"
  ink-muted: "#6b7280"
  hero-navy: "#0f1b35"
  navy-accent: "#1e3a8a"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.trust-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 28px"
    size: "44px"
  button-primary-hover:
    backgroundColor: "{colors.trust-blue-deep}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "{colors.chip-gray}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 28px"
  button-outline:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 28px"
  button-danger:
    backgroundColor: "{colors.alert-red}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 28px"
  badge-primary:
    backgroundColor: "{colors.trust-blue-mist}"
    textColor: "{colors.trust-blue}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
    padding: "4px 10px"
  badge-danger:
    backgroundColor: "{colors.alert-red-mist}"
    textColor: "{colors.alert-red}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
  chip:
    backgroundColor: "{colors.chip-gray}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: NexaMart

## 1. Overview

**Creative North Star: "The Efficiency Engine"**

NexaMart là một cỗ máy tối ưu chuyển đổi — mỗi pixel, mỗi token, mỗi khoảng trắng đều phục vụ một mục đích: giúp người Việt tìm và mua thiết bị điện tử nhanh nhất có thể. Không màu mè, không khoảng trắng phí phạm, không hiệu ứng thừa. Sự tinh tế nằm ở những gì bị lược bỏ, không phải những gì được thêm vào.

Hệ thống vận hành trên nguyên tắc **dense but legible**: mật độ thông tin cao của TMĐT nhưng được tổ chức chặt chẽ bởi một hệ thống phân cấp thị giác rõ ràng. Màu sắc đóng vai trò tín hiệu — Trust Blue dẫn dắt hành động, Alert Red cảnh báo khẩn cấp và giá sale, Confirm Green xác nhận thành công. Mọi màu khác là neutral, lùi về sau để tín hiệu nổi bật.

Từ PRODUCT.md: *"Tin cậy, hiệu quả, dễ tiếp cận"* — ba từ này định hình mọi quyết định thị giác. Từ Tiki.vn, hệ thống kế thừa tín hiệu tin cậy mạnh (giá rõ ràng, cam kết giao hàng) và trang sản phẩm sạch. Từ anti-reference, hệ thống tránh xa: dark-mode tech tools, casino/gamified quá đà, sparse minimal luxury, SaaS landing page template.

**Key Characteristics:**
- Token-driven: mọi giá trị thị giác đi qua `@theme` trong `src/index.css`, không hardcode hex
- Phân cấp màu sắc: 1 accent chính + semantic colors, neutral lùi sau
- Phẳng nhẹ: border phân lớp, shadow rất nhẹ chỉ ở trạng thái nổi (hover/focus/modal)
- Component restrained: transition mượt, active scale nhẹ, không bounce/elastic
- Font Inter duy nhất, 4 weights. Không pha trộn font
- Icon: `lucide-react` độc quyền; brand icon dùng inline SVG

## 2. Colors: The Signal Palette

Màu sắc trong NexaMart không trang trí — chúng là tín hiệu. Một hệ thống 4 vai trò: **Trust Blue** cho hành động, **Alert Red** cho khẩn cấp/giá sale, **Confirm Green** cho thành công, và **Caution Amber** cho cảnh báo. Phần còn lại là neutral — canvas, surface, border, ink — tồn tại để tín hiệu nổi bật.

### Primary
- **Trust Blue** (#2563eb): CTA chính, link, trạng thái active, accent. Xuất hiện trên ≤10% diện tích mỗi màn hình. Độ hiếm của nó chính là sức mạnh.
- **Trust Blue Deep** (#1d4ed8): Hover/active của CTA chính. Đậm hơn 1 bậc, giữ nguyên hue.
- **Trust Blue Mist** (#e6f0ff): Nền nhẹ cho badge primary, row được chọn, highlight. Không dùng làm nền section.

### Semantic
- **Alert Red** (#ef4444): Giá sale, % off, nút xoá, trạng thái lỗi, badge hết hàng. **Tuyệt đối không dùng để trang trí.**
- **Alert Red Deep** (#dc2626): Hover/active của danger. Chỉ dùng cho interactive element.
- **Alert Red Mist** (#fdeee9): Nền nhẹ danger — badge, alert box.
- **Confirm Green** (#22c55e): Thành công, in-stock, miễn phí ship, trạng thái hoàn tất.
- **Confirm Green Mist** (#eafbef): Nền nhẹ success.
- **Caution Amber** (#f59e0b): Cảnh báo, sắp hết hàng, low stock.
- **Caution Amber Mist** (#fef3e2): Nền nhẹ warning.

### Neutral
- **Page Canvas** (#f5f7f8): Nền trang chính. Xám cực nhạt, tint lạnh rất nhẹ, tạo độ tương phản vừa đủ với card trắng.
- **Card White** (#ffffff): Nền card, panel, modal. Luôn nằm trên canvas.
- **Chip Gray** (#ffffff): Nền chip, secondary button, filter tag. Hiện tại bằng card white; giữ token riêng để dễ đổi sau.
- **Border Light** (#e5e7eb): Viền mặc định cho card, divider, separator.
- **Border** (#d1d5db): Viền rõ hơn cho input, outline button, fieldset.
- **Ink** (#111827): Văn bản chính. Gần đen, không phải đen thuần. Tương phản ~16.5:1 trên nền trắng.
- **Ink Secondary** (#4b5563): Văn bản phụ, label, description. Tương phản ~7.1:1 trên nền trắng.
- **Ink Muted** (#6b7280): Văn bản yếu, placeholder, icon không active. Tương phản ~5.4:1 trên nền trắng — đạt AA.
- **Hero Navy** (#0f1b35): Nền hero section, banner tối. Chỉ dùng với text trắng.
- **Navy Accent** (#1e3a8a): Accent phụ cho hero, badge, hoặc element trong vùng tối.

### Named Rules
**The One Accent Rule.** Trust Blue xuất hiện trên ≤10% diện tích mỗi màn hình. Không có 2 CTA primary trong cùng một fold. Chỉ một hành động chính mỗi viewport.

**The Red Means Money Rule.** Alert Red *chỉ* dùng cho: giá sale, % giảm, nút xoá, trạng thái lỗi, và thông báo khẩn. Không bao giờ dùng làm màu nhấn, màu nền section, hay màu trang trí. Vi phạm = mất niềm tin người dùng.

**The No-Black Rule.** Không dùng `#000000` hay `text-black`/`bg-black` trong toàn bộ hệ thống. Văn bản tối nhất là Ink (#111827). Nền tối nhất dành riêng cho hero/banner.

## 3. Typography

**Font:** Inter (Google Fonts, weights 400/500/600/700)
**Fallback:** ui-sans-serif, system-ui, sans-serif

**Character:** Inter là geometric sans chức năng — trung tính, dễ đọc, hoạt động tốt ở mọi kích cỡ. Không phô trương, không có personality riêng để cạnh tranh với nội dung sản phẩm. Một font duy nhất, 4 weights, không pha trộn.

### Hierarchy
- **Display** (700, clamp(1.5rem, 4vw, 2.5rem), 1.15): Tiêu đề hero, section heading chính. Dùng `text-wrap: balance`. Letter-spacing -0.02em.
- **Headline** (600, 1.25rem/1.75rem, 1.3): Tiêu đề section phụ, tiêu đề card lớn. Letter-spacing -0.01em.
- **Title** (600, 1rem, 1.4): Tiêu đề card sản phẩm, tiêu đề widget, tên danh mục.
- **Body** (400, 0.875rem, 1.6): Văn bản chính — mô tả sản phẩm, nội dung, thông tin. Dòng dài tối đa 65-75ch.
- **Label** (500, 0.75rem, 1): Badge, chip, tag, meta text, giá ký hiệu. Letter-spacing +0.01em để tăng độ rõ ở kích thước nhỏ.

### Named Rules
**The Single Font Rule.** Một font cho toàn bộ hệ thống. Không pha serif cho "sang", không mono cho "tech". Inter ở 4 weights là đủ. Sự nhất quán là sức mạnh.

**The Price Signal Rule.** Giá sale: Label weight Bold (700), Alert Red, không gạch ngang. Giá gốc: Body weight, Ink Muted, line-through. Con số là tín hiệu chính — không để kiểu chữ làm nhiễu.

## 4. Elevation

NexaMart sử dụng hệ thống elevation lai: **phẳng ở trạng thái nghỉ, shadow cực nhẹ khi nổi lên**. Card, panel, và section dùng border để phân lớp với canvas ở trạng thái mặc định. Shadow chỉ xuất hiện khi element nổi lên khỏi luồng thông thường: hover, focus, dropdown, modal.

**Hiện trạng CSS:** shadow token trong `@theme` đang là `none`. **Cần cập nhật** để khớp với hệ thống elevation mô tả dưới đây.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: none`): Card ở trạng thái nghỉ. Border (`border-light`) làm nhiệm vụ phân lớp.
- **Card Hover** (`box-shadow: 0 1px 4px 0 rgba(0,0,0,0.06)`): Card khi hover — nổi nhẹ, gần như không thấy.
- **Sticky Panel** (`box-shadow: 0 1px 3px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)`): Header sticky, sidebar, summary panel khi scroll.
- **Modal / Dropdown** (`box-shadow: 0 4px 16px rgba(0,0,0,0.08)`): Modal, popover, dropdown menu. Đủ sâu để tách khỏi page.

### Named Rules
**The Flat-By-Default Rule.** Mọi surface phẳng ở trạng thái nghỉ. Shadow là tín hiệu của trạng thái (hover, focus, elevation), không phải trang trí. Một card không nên có shadow khi không được hover.

**The No-Ghost-Card Rule.** Không kết hợp `border: 1px solid` với `box-shadow` blur ≥8px trên cùng một element. Chọn border (cho card nghỉ) hoặc shadow (cho element nổi). Không bao giờ cả hai.

## 5. Components

### Buttons
Dùng chung `Button` component từ `src/components/common/Button.tsx`. Variants: `primary | secondary | outline | ghost | danger | success`. Sizes: `sm | md | lg`. Props: `loading`, `leftIcon`, `rightIcon`, `fullWidth`.

- **Shape:** Rounded-lg (10px). Nút full-rounded chỉ dành cho icon-only hoặc pill tag.
- **Primary:** Trust Blue background, text trắng, font-semibold. Hover → Trust Blue Deep. Focus → ring-2 primary/40 + ring-offset-1. Active → scale(0.98). Loading → spinner Loader2 thay leftIcon.
- **Secondary:** Chip Gray background, Ink text, border Border. Hover → nền Border.
- **Outline:** Card White background, Ink text, border Border Strong. Hover → nền Page Canvas.
- **Ghost:** Transparent, Ink text. Hover → nền Page Canvas. Không border, không shadow.
- **Danger:** Alert Red background, text trắng. Chỉ dùng cho hành động huỷ/xoá.
- **Success:** Confirm Green background, text trắng. Dùng cho hoàn tất đơn, xác nhận.

**Sizes:** sm (36px cao, text-sm) / md (44px cao, text-sm — default) / lg (52px cao, text-base).

Link nhìn như nút: dùng `buttonVariants()` trả về className, áp cho `<Link>`.

### Badges
`Badge` component. Variants: `primary | danger | success | warning | neutral | outline`. Size `sm | md`. Prop `dot` hiển thị chấm tròn bên trái.

- **Shape:** Rounded-full (pill). Không có góc vuông.
- **Style:** Soft background + matching text. Nền mist, chữ solid. Không border trừ variant `outline`.
- **Dot:** Chấm tròn 6px (h-1.5 w-1.5), cùng màu variant. Luôn nằm bên trái text.
- **Sizes:** sm (11px text, padding 4px 8px) / md (12px text, padding 4px 10px — default).

### Cards
Card sản phẩm, panel, widget — xây dựng với pattern `bg-surface rounded-lg border border-border`.

- **Corner Style:** Rounded-lg (10px). Không bao giờ vượt quá xl (12px). Không dùng 24px+ cho card.
- **Background:** Card White (#ffffff). Luôn nằm trên Page Canvas.
- **Border:** Border Light (#e5e7eb) ở trạng thái nghỉ. Không đổi màu border khi hover — chỉ thêm shadow.
- **Internal Padding:** 16px (p-4). Card đặc biệt (summary, hero card) có thể dùng 20-24px.

### Inputs
Input text, select, textarea.

- **Style:** Card White background, border Border (#d1d5db), rounded-md (8px).
- **Height:** 40px (h-10) cho input thông thường. Search bar: 40px.
- **Placeholder:** Ink Muted (#6b7280). Không dùng màu nhạt hơn — phải đạt ≥4.5:1 contrast.
- **Focus:** Border chuyển sang Trust Blue, ring-1 Trust Blue/30. Không dùng glow rộng.
- **Error:** Border Alert Red, text Alert Red cho message. Icon AlertCircle kèm message.
- **Disabled:** Opacity 50%, cursor not-allowed, không đổi background.

### Navigation
- **Breadcrumb:** Text-sm Ink Muted, separator ChevronRight (12px, Ink Subtle). Item cuối Ink, font-medium. Hover link → Trust Blue.
- **Pagination:** Nút 40x40px, rounded-lg. Trang hiện tại: Trust Blue background, text trắng. Trang khác: border Border Light, Ink text, hover nền Page Canvas. Nút prev/next: ghost style, disabled opacity 50%.
- **Header Nav:** Text Ink Secondary, hover Ink. Active: Trust Blue, font-semibold. Mobile: chưa có hamburger drawer (Phase 2).

### Chips / Tags
- **Style:** Rounded-full, Chip Gray background, Ink Muted text. Padding 4px 12px. Font label (12px).
- **Active/Selected:** Trust Blue Mist background, Trust Blue text.
- **Dismissible:** Icon X 14px bên phải, hover Alert Red.

### States (Loading / Error / Empty)
- **Loading:** Spinner Loader2 animate-spin (32px), Ink Muted text bên dưới.
- **Error:** Icon AlertCircle (48px, Alert Red), message Ink Secondary, nút "Thử lại" Outline style.
- **Empty:** Icon Inbox (32px, Ink Muted) trong vòng tròn 64px Card White, border dashed Border Light. Title Ink, description Ink Secondary.

## 6. Do's and Don'ts

### Do:
- **Do** dùng token Tailwind (`bg-primary`, `text-text`, `border-border`) — không hardcode hex hay `bg-blue-600`.
- **Do** dùng `Button` component và `buttonVariants()` cho mọi nút và link-như-nút.
- **Do** dùng `Container` (default 1280px / narrow 960px / wide 1440px) thay `max-w-[1280px]` ad-hoc.
- **Do** để giá sale là `text-danger font-bold`, giá gốc là `text-text-muted line-through`.
- **Do** đặt shadow cực nhẹ (blur ≤4px cho hover, ≤16px cho modal). Không shadow mặc định trên card nghỉ.
- **Do** dùng `rounded-lg` (10px) cho card, `rounded-md` (8px) cho input, `rounded-full` cho badge/chip.
- **Do** giữ `text-wrap: balance` cho heading, max-width 65-75ch cho body text.
- **Do** dùng `lucide-react` cho mọi icon; inline SVG cho brand icon (Facebook, YouTube, Zalo...).

### Don't:
- **Don't** dùng `bg-blue-600`, `bg-red-500`, `text-black`, `text-gray-900`, hay bất kỳ màu literal nào ngoài token.
- **Don't** dùng Alert Red cho bất kỳ mục đích nào ngoài giá sale, nút xoá, và trạng thái lỗi.
- **Don't** kết hợp `border: 1px solid` với `box-shadow` blur ≥8px trên cùng một element.
- **Don't** dùng `border-radius` ≥20px cho card. Card tối đa `rounded-xl` (12px).
- **Don't** dùng `border-left` hoặc `border-right` dày hơn 1px làm accent màu. Dùng background tint hoặc leading icon thay thế.
- **Don't** thêm thư viện icon mới (Font Awesome, Heroicons, Material Icons...). Chỉ `lucide-react`.
- **Don't** dùng dark-mode aesthetic, terminal UI, hoặc neon/glassmorphism cho bất kỳ surface nào. (Từ PRODUCT.md anti-reference: "Dark-mode tech tools.")
- **Don't** dùng casino-style gamification: vòng quay may mắn, popup đếm ngược giả, hiệu ứng flash liên tục.
- **Don't** để text placeholder nhạt hơn Ink Muted (#6b7280). Placeholder cần contrast ≥4.5:1 như body text.
- **Don't** dùng `uppercase` cho label tiếng Việt. Tiếng Việt không có chữ hoa đầu câu như tiếng Anh.
