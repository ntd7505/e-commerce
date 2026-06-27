import React from 'react';
import { ShieldCheck, RotateCcw, Rocket, Lock, Headset } from 'lucide-react';

const BenefitsBar = () => {
  return (
    <div className="bg-[var(--surface-2)] border-b border-[var(--border)]" data-purpose="benefits-bar">
      <div className="container-custom py-3 flex items-center justify-center gap-10 text-[11px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" /> 100% chính hãng
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[var(--color-primary)]" /> Đổi trả 30 ngày
        </div>
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[var(--color-primary)]" /> Giao hàng 2h
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--color-primary)]" /> Thanh toán bảo mật
        </div>
        <div className="flex items-center gap-2">
          <Headset className="w-4 h-4 text-[var(--color-primary)]" /> Hỗ trợ 24/7
        </div>
      </div>
    </div>
  );
};

export default BenefitsBar;
