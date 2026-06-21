import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return <p className="text-gray-500">Sản phẩm chưa có mô tả.</p>;
  }

  // Yêu cầu: Không sử dụng dangerouslySetInnerHTML cho description
  return (
    <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
      {description}
    </div>
  );
}
