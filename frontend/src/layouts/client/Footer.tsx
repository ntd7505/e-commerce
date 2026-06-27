import React from 'react';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-7-6.1 7H1.7l8-9.2L1 2h7l4.8 6.4L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-12 text-sm text-gray-600">
      <div className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-gray-800 text-base mb-4">Về NexaMart</h4>
          <ul className="space-y-2">
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Giới thiệu NexaMart</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Tuyển dụng</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Chính sách bảo mật thanh toán</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Chính sách bảo mật thông tin cá nhân</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Bán hàng cùng NexaMart</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-base mb-4">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2">
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Hotline: <span className="font-bold text-gray-800">1900 6000</span> (1000 đ/phút)</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Các câu hỏi thường gặp</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Gửi yêu cầu hỗ trợ</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Hướng dẫn đặt hàng</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Phương thức vận chuyển</li>
            <li className="hover:text-nexa-blue cursor-pointer transition-colors">Chính sách đổi trả</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-base mb-4">Phương thức thanh toán</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-blue-800 text-xs text-center">
              VISA
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-orange-600 text-xs text-center">
              MasterCard
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-green-600 text-xs text-center">
              JCB
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-pink-500 text-xs text-center">
              MoMo
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-blue-500 text-xs text-center">
              ZaloPay
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-gray-700 text-xs text-center">
              COD
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-base mb-4">Kết nối với chúng tôi</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm" aria-label="Facebook">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm" aria-label="YouTube">
              <YoutubeIcon className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shadow-sm" aria-label="Twitter">
              <XIcon className="w-4 h-4" />
            </a>
          </div>

          <h4 className="font-bold text-gray-800 text-base mt-6 mb-4">Tải ứng dụng trên điện thoại</h4>
          <div className="flex gap-2">
            <div className="border border-gray-200 rounded p-2 flex gap-2 items-center cursor-pointer hover:border-nexa-blue transition-colors">
              <div className="text-[10px] text-left leading-tight">
                Tải trên <br/><span className="font-bold text-sm">App Store</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded p-2 flex gap-2 items-center cursor-pointer hover:border-nexa-blue transition-colors">
              <div className="text-[10px] text-left leading-tight">
                Tải trên <br/><span className="font-bold text-sm">Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>© 2026 - Bản quyền của Công ty TNHH NexaMart</p>
        <p className="mt-1">Địa chỉ: Tòa nhà ABC, Phường XYZ, Quận 1, TP.HCM. Email: support@nexamart.vn</p>
      </div>
    </footer>
  );
};

export default Footer;
