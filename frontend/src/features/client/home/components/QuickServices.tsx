import { Store, Percent, Zap, Wallet, Globe, type LucideIcon } from 'lucide-react';
import React from 'react';

const QuickServices = () => {
  const services: { icon: LucideIcon; name: string }[] = [
    { icon: Store, name: 'NexaMart Mall' },
    { icon: Percent, name: 'Trả góp 0%' },
    { icon: Zap, name: 'Săn deal sốc' },
    { icon: Wallet, name: 'Thanh toán ví' },
    { icon: Globe, name: 'Đặt quốc tế' },
  ];

  return (
    <div className="w-full" data-purpose="service-links">
      <div className="bg-[var(--surface-2)] border-[0.5px] border-[var(--border)] rounded-[10px] py-4">
        <div className="grid grid-cols-5 gap-0">
          {services.map(({ icon: Icon, name }, index) => (
            <div key={index} className="flex flex-col items-center gap-3 cursor-pointer group transition-colors hover:bg-[var(--surface-1)] py-2 mx-2 rounded-[8px]">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--surface-1)] text-[var(--color-primary)] border-[0.5px] border-[var(--border)] group-hover:border-[var(--color-primary)] transition-colors shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs md:text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-colors text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickServices;
