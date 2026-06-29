import React from 'react';
import type { ProductResponse } from '../../../../features/client/home/clientProductApi';

interface ProductDescriptionProps {
  product: ProductResponse;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const { description, descriptionBlocks, name, brand, category } = product;

  // Use active description blocks if available
  const activeBlocks = (descriptionBlocks || [])
    .filter((block) => block.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (activeBlocks.length > 0) {
    return (
      <div className="flex flex-col gap-10">
        {activeBlocks.map((block) => (
          <div key={block.id} className="flex flex-col gap-4">
            {(block.type === 'TEXT' || block.type === 'TEXT_IMAGE') && (
              <div className="prose max-w-none text-muted leading-relaxed">
                {block.title && <h3 className="text-xl font-bold text-text mb-3">{block.title}</h3>}
                {block.content && <div className="whitespace-pre-line">{block.content}</div>}
              </div>
            )}
            {(block.type === 'IMAGE' || block.type === 'TEXT_IMAGE') && block.imageUrl && (
              <div className="w-full">
                <img
                  src={block.imageUrl}
                  alt={block.altText || block.title || name}
                  className="w-full rounded-xl object-contain bg-surface border border-border"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Fallback to legacy description
  if (description && description.length > 50) {
    return (
      <div className="prose max-w-none text-muted leading-relaxed whitespace-pre-line">
        {description}
      </div>
    );
  }

  // Fallback content when description is too short or missing
  return (
    <div className="flex flex-col gap-8 text-sm text-muted leading-relaxed">
      <section>
        <h3 className="text-lg font-bold text-text mb-3">Đặc điểm nổi bật</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Thiết kế hiện đại, tinh tế phù hợp với xu hướng mới nhất.</li>
          <li>Chất liệu cao cấp, đảm bảo độ bền và an toàn khi sử dụng.</li>
          <li>Hiệu năng vượt trội trong tầm giá, đáp ứng tốt nhu cầu của bạn.</li>
          <li>Sản phẩm chính hãng {brand?.name ? `từ thương hiệu ${brand.name}` : '100%'}, nguồn gốc xuất xứ rõ ràng.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-text mb-3">Thông tin sản phẩm</h3>
        <p className="mb-2">
          <strong>{name}</strong> là một trong những sản phẩm nổi bật {category?.name ? `thuộc danh mục ${category.name}` : 'của chúng tôi'}. 
          Với sự chăm chút tỉ mỉ từ khâu thiết kế đến sản xuất, sản phẩm cam kết mang lại trải nghiệm tuyệt vời nhất cho người dùng.
        </p>
        <p>
          Bạn hoàn toàn có thể yên tâm về chất lượng cũng như dịch vụ hậu mãi đi kèm khi mua sắm tại NexaMart.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-text mb-3">Bộ sản phẩm gồm</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>01 x {name} nguyên seal.</li>
          <li>01 x Sách hướng dẫn sử dụng.</li>
          <li>01 x Phiếu bảo hành chính hãng.</li>
          <li>Phụ kiện đi kèm (nếu có).</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-text mb-3">Chính sách bảo hành</h3>
        <p>
          Bảo hành chính hãng uy tín. Đổi trả miễn phí trong vòng 30 ngày đầu tiên nếu có lỗi từ nhà sản xuất. 
          Vui lòng giữ lại bao bì và hóa đơn mua hàng để được hỗ trợ tốt nhất.
        </p>
      </section>
    </div>
  );
}
