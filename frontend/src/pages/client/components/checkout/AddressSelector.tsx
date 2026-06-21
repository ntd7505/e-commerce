import React, { useEffect, useState } from 'react';
import { cartApi } from '../../../../features/client/cart/cartApi';
import type { AddressResponse, AddressRequest } from '../../../../features/client/cart/cartTypes';

interface AddressSelectorProps {
  selectedAddressId?: number;
  onSelect: (address: AddressResponse) => void;
}

export default function AddressSelector({ selectedAddressId, onSelect }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AddressRequest>({
    recipientName: '',
    phoneNumber: '',
    provinceName: '',
    districtName: '',
    wardName: '',
    fullAddress: '',
    addressType: 'HOME',
    isDefault: false
  });

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await cartApi.getAddresses();
      setAddresses(data);
      if (!selectedAddressId && data.length > 0) {
        // Auto select default or first
        const defaultAddr = data.find(a => a.isDefault) || data[0];
        onSelect(defaultAddr);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cartApi.createAddress(formData);
      setShowAddForm(false);
      await loadAddresses();
    } catch {
      alert('Không thể tạo địa chỉ mới');
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-blue-600"></i> Giao tới
        </h2>
        <button 
          onClick={() => setShowModal(true)}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          Thay đổi
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : selectedAddress ? (
        <div>
          <div className="font-bold text-gray-900 mb-1">
            {selectedAddress.recipientName} <span className="text-gray-300 mx-2">|</span> {selectedAddress.phoneNumber}
          </div>
          <div className="text-sm text-gray-600">
            {selectedAddress.fullAddress}, {selectedAddress.wardName}, {selectedAddress.districtName}, {selectedAddress.provinceName}
          </div>
          {selectedAddress.isDefault && (
            <div className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 w-fit px-2 py-1 rounded">Mặc định</div>
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          Chưa có địa chỉ giao hàng. <button onClick={() => { setShowModal(true); setShowAddForm(true); }} className="text-blue-600 font-bold hover:underline">Thêm địa chỉ</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{showAddForm ? 'Thêm địa chỉ mới' : 'Chọn địa chỉ giao hàng'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {showAddForm ? (
                <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Họ tên <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full border-gray-300 rounded-lg text-sm" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full border-gray-300 rounded-lg text-sm" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tỉnh/Thành <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full border-gray-300 rounded-lg text-sm" value={formData.provinceName} onChange={e => setFormData({...formData, provinceName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full border-gray-300 rounded-lg text-sm" value={formData.districtName} onChange={e => setFormData({...formData, districtName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phường/Xã <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full border-gray-300 rounded-lg text-sm" value={formData.wardName} onChange={e => setFormData({...formData, wardName: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                    <input required type="text" className="w-full border-gray-300 rounded-lg text-sm" value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-0" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                    <span className="text-sm">Đặt làm địa chỉ mặc định</span>
                  </label>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Trở lại</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Hoàn thành</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400'}`} onClick={() => { onSelect(addr); setShowModal(false); }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-900">
                          {addr.recipientName} <span className="text-gray-300 mx-2">|</span> {addr.phoneNumber}
                        </div>
                        {addr.isDefault && <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">Mặc định</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        {addr.fullAddress}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowAddForm(true)} className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-gray-300 rounded-xl text-blue-600 font-medium hover:bg-blue-50 transition-colors mt-2">
                    <i className="fa-solid fa-plus"></i> Thêm địa chỉ mới
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
