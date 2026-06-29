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
      <div className="bg-surface border border-border rounded-2xl py-6 shadow-sm shadow-primary/5">
        <div className="grid grid-cols-5 gap-0">
          {services.map(({ icon: Icon, name }, index) => (
            <div key={index} className="flex flex-col items-center gap-3 cursor-pointer group transition-colors hover:bg-primary-soft/30 py-3 mx-2 rounded-xl">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary-soft text-primary border border-primary/20 group-hover:border-primary transition-all shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs md:text-sm font-medium text-muted group-hover:text-primary transition-colors text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickServices;
