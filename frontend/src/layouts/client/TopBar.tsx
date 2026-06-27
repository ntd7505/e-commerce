import React from 'react';

const TopBar = () => {
  return (
    <div className="bg-[var(--color-primary)] text-white/90 h-8 flex items-center justify-center text-xs" data-purpose="top-announcement">
      Freeship từ 499K · Giảm thêm 5% cho đơn từ 5 triệu — nhập mã <span className="font-medium text-white ml-1">NEXA5</span>
    </div>
  );
};

export default TopBar;
