import { useCart } from '../CartProvider';

import { useToast } from '../../../ui/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { parseApiError } from '../../../../utils/apiError';

export function useAddToCartAction() {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = async (productVariantId: number, quantity: number, productName: string) => {
    try {
      await addItem({ productVariantId, quantity });
      showToast(`Đã thêm ${quantity} × ${productName} vào giỏ hàng.`, 'success', {
        label: 'Xem giỏ hàng',
        onClick: () => navigate('/cart')
      });
    } catch (err) {
      const error = parseApiError(err);
      showToast(error.message || 'Không thể thêm vào giỏ hàng', 'error');
    }
  };

  return { handleAddToCart };
}
