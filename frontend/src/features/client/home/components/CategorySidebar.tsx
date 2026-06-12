import React from 'react';

const CategorySidebar = () => {
  const categories = [
    { icon: 'fa-mobile-screen-button', name: 'Điện thoại - Máy tính bảng' },
    { icon: 'fa-laptop', name: 'Laptop - PC' },
    { icon: 'fa-headphones', name: 'Âm thanh & Phụ kiện' },
    { icon: 'fa-watch', name: 'Thiết bị đeo' },
    { icon: 'fa-camera', name: 'Camera - Quay phim' },
    { icon: 'fa-tv', name: 'TV & Giải trí gia đình' },
    { icon: 'fa-house-signal', name: 'Nhà thông minh' },
  ];

  return (
    <aside className="col-span-3 bg-white rounded-lg p-2 shadow-sm" data-purpose="category-sidebar">
      <ul className="text-sm">
        {categories.map((cat, index) => (
          <li key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 hover:text-nexa-blue rounded cursor-pointer group transition-colors">
            <div className="flex items-center gap-3">
              <i className={`fa-solid ${cat.icon} w-5 text-gray-500 group-hover:text-nexa-blue group-hover:scale-110 transition-all`}></i> 
              <span className="font-medium group-hover:font-semibold transition-all">{cat.name}</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-nexa-blue opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"></i>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
