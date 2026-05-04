import { CreditCard } from "lucide-react";
import { AdminEmptyState } from "../../components/AdminEmptyState";

export default function Transactions() {
  return (
    <AdminEmptyState
      icon={CreditCard}
      title="Transactions need payment APIs"
      description="Frontend không còn hiển thị mock payment history. Khi backend expose transactions/payments, page này nên có reconciliation status, provider reference, amount, refund state và filters."
    />
  );
}
