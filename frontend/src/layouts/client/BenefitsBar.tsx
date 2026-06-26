import { useDefaultShippingAddressLabel } from '../../features/client/addresses/hooks/useDefaultShippingAddressLabel';

const BenefitsBar = () => {
  const deliveryLabel = useDefaultShippingAddressLabel();

  return (
    <div className="bg-white hidden md:block" data-purpose="benefits-bar">
      <div className="container-custom py-3 flex justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-location-dot text-nexa-blue"></i> Giao đến: <span className="font-bold text-black">{deliveryLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-circle-check text-nexa-blue"></i> 100% Chính hãng
        </div>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-rotate-left text-nexa-blue"></i> Đổi trả dễ dàng
        </div>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-truck text-nexa-blue"></i> Giao hàng 2h
        </div>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-shield-halved text-nexa-blue"></i> Thanh toán bảo mật
        </div>
      </div>
    </div>
  );
};

export default BenefitsBar;