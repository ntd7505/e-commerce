import { MessageSquare } from "lucide-react";
import { AdminEmptyState } from "../../components/AdminEmptyState";

export default function ProductReviews() {
  return (
    <AdminEmptyState
      icon={MessageSquare}
      title="Product reviews are not available yet"
      description="Frontend route đã sẵn sàng, nhưng backend hiện chưa có review endpoints. Khi backend bổ sung reviews, page này nên hỗ trợ moderation, reply, hide/show và filter theo product."
    />
  );
}
