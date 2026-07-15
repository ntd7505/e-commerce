import React from 'react';
import type { ProductResponse } from '../../../../features/client/home/clientProductApi';

interface ProductDescriptionProps {
  product: ProductResponse;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const { description, descriptionBlocks, name } = product;

  // Use active description blocks if available
  const activeBlocks = (descriptionBlocks || [])
    .filter((block) => block.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  let content;

  if (activeBlocks.length > 0) {
    content = (
      <div className="flex flex-col gap-8">
        {activeBlocks.map((block) => (
          <div key={block.id} className="flex flex-col gap-2">
            {(block.type === 'TEXT' || block.type === 'TEXT_IMAGE') && (
              <div className="prose max-w-none text-muted leading-relaxed">
                {block.title && <h3 className="text-xl font-bold text-text mb-2">{block.title}</h3>}
                {block.content && <div className="whitespace-pre-line mb-4">{block.content}</div>}
              </div>
            )}
            {(block.type === 'IMAGE' || block.type === 'TEXT_IMAGE') && block.imageUrl && (
              <div className="w-full mt-2 mb-4">
                <img
                  src={block.imageUrl}
                  alt={block.altText || block.title || name}
                  className="w-full rounded-2xl object-cover border border-border"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } else if (description && description.length > 0) {
    content = (
      <div className="prose max-w-none text-muted leading-relaxed whitespace-pre-line">
        {description}
      </div>
    );
  } else {
    // Fallback content when description is too short or missing
    content = (
      <div className="flex flex-col items-center justify-center py-10 text-center border border-border border-dashed rounded-2xl bg-surface/50">
        <p className="text-muted text-sm">Đang cập nhật nội dung.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[90%] md:max-w-[800px] mx-auto px-4 md:px-0">
      {content}
    </div>
  );
}
