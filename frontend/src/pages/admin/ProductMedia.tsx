import { Image } from "lucide-react";
import { AdminEmptyState } from "../../components/AdminEmptyState";

export default function ProductMedia() {
  return (
    <AdminEmptyState
      icon={Image}
      title="Product media is managed inside product edit"
      description="Backend media endpoints hiện gắn với từng product. Upload, cập nhật thumbnail, sort order và xoá ảnh đã nằm trong màn Add/Edit Product để tránh sửa media thiếu ngữ cảnh sản phẩm."
    />
  );
}
