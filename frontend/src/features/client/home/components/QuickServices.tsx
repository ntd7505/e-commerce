import React from 'react';

const QuickServices = () => {
  const services = [
    { icon: 'fa-store', name: 'NexaMart Mall', colorClass: 'text-blue-600 bg-blue-100 group-hover:bg-blue-600' },
    { icon: 'fa-percent', name: 'Trả góp 0%', colorClass: 'text-orange-500 bg-orange-100 group-hover:bg-orange-500' },
    { icon: 'fa-bolt', name: 'Săn Deal Sốc', colorClass: 'text-red-500 bg-red-100 group-hover:bg-red-500' },
    { icon: 'fa-wallet', name: 'Thanh toán ví', colorClass: 'text-green-600 bg-green-100 group-hover:bg-green-600' },
    { icon: 'fa-globe', name: 'Đặt hàng quốc tế', colorClass: 'text-sky-500 bg-sky-100 group-hover:bg-sky-500' },
  ];

  return (
    <div className="container-custom mt-8" data-purpose="service-links">
      <div className="bg-white rounded-lg p-6 flex justify-between items-center shadow-sm">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center gap-3 cursor-pointer group hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 group-hover:text-white group-hover:shadow-lg ${service.colorClass}`}>
              <i className={`fa-solid ${service.icon}`}></i>
            </div>
            <span className="text-sm font-medium group-hover:text-nexa-blue transition-colors">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickServices;
