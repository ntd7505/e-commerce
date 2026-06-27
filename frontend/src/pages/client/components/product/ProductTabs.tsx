import React, { useState } from 'react';

interface ProductTabsProps {
  totalReviews: number;
  descriptionNode: React.ReactNode;
  specsNode: React.ReactNode;
  reviewsNode: React.ReactNode;
}

export default function ProductTabs({
  totalReviews,
  descriptionNode,
  specsNode,
  reviewsNode
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const tabs = [
    { id: 'description', label: 'Mô tả sản phẩm' },
    { id: 'specs', label: 'Thông số kỹ thuật' },
    { id: 'reviews', label: `Đánh giá (${totalReviews})` }
  ] as const;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
      <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'description' | 'specs' | 'reviews')}
            className={`px-8 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6 lg:p-8">
        {activeTab === 'description' && descriptionNode}
        {activeTab === 'specs' && specsNode}
        {activeTab === 'reviews' && reviewsNode}
      </div>
    </div>
  );
}
