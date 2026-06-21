import { useCart } from '../CartProvider';
import { useAuth } from '../../../auth/AuthProvider';
import { useToast } from '../../../ui/ToastProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseApiError } from '../../../../utils/apiError';

export function useAddToCartAction() {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async (productVariantId: number, quantity: number, productName: string) => {
    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

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
