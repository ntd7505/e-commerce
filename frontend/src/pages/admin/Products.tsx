import { useEffect, useState } from 'react';
import { getProducts } from '../../features/adminProducts/adminProductApi';
import type { ProductResponse } from '../../features/adminProducts/adminProductTypes';

export default function Products() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitialProducts() {
      try {
        const data = await getProducts();

        if (!ignore) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);

        if (!ignore) {
          setError('Không thể tải danh sách sản phẩm');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading && (
          <div className="p-6 text-center text-gray-500">Loading products...</div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="p-6 text-center text-gray-500">Chưa có sản phẩm nào.</div>
        )}

        {!loading && !error && products.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Slug</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{product.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">{product.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
