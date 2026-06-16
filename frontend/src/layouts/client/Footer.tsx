import React from 'react';

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
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors">
              <i className="fa-brands fa-cc-visa text-2xl text-blue-800"></i>
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors">
              <i className="fa-brands fa-cc-mastercard text-2xl text-orange-600"></i>
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors">
              <i className="fa-brands fa-cc-jcb text-2xl text-green-600"></i>
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-pink-500">
              MoMo
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-blue-500 text-xs text-center">
              ZaloPay
            </div>
            <div className="border border-gray-200 rounded h-10 flex items-center justify-center p-1 bg-gray-50 hover:border-nexa-blue cursor-pointer transition-colors font-bold text-gray-700">
              COD
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-base mb-4">Kết nối với chúng tôi</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f text-lg"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm" aria-label="YouTube">
              <i className="fa-brands fa-youtube text-lg"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shadow-sm" aria-label="Twitter">
              <i className="fa-brands fa-twitter text-lg"></i>
            </a>
          </div>

          <h4 className="font-bold text-gray-800 text-base mt-6 mb-4">Tải ứng dụng trên điện thoại</h4>
          <div className="flex gap-2">
            <div className="border border-gray-200 rounded p-2 flex gap-2 items-center cursor-pointer hover:border-nexa-blue transition-colors">
              <i className="fa-brands fa-apple text-2xl"></i>
              <div className="text-[10px] text-left leading-tight">
                Tải trên <br/><span className="font-bold text-sm">App Store</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded p-2 flex gap-2 items-center cursor-pointer hover:border-nexa-blue transition-colors">
              <i className="fa-brands fa-google-play text-2xl"></i>
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
