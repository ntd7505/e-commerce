import React, { useEffect, useState } from 'react';
import { getBrands } from '../../features/brands/adminBrandApi';
import type { BrandResponse } from '../../features/brands/adminBrandTypes';
import {
  Search, Save, PlusCircle, PenTool, Wand2, Calendar, Image as ImageIcon, X, RefreshCw, ChevronDown, Plus
} from 'lucide-react';
import { createProduct } from '../../features/adminProducts/adminProductApi';
import { toProductCreateRequest, type ProductCreateFormValues } from '../../features/adminProducts/adminProductMapper';

export default function AddProduct() {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState('');
  const [formValues, setFormValues] = useState<ProductCreateFormValues>({
    name: '',
    shortDescription: '',
    description: '',
    brandId: '',
    categoryId: '',
    variantName: 'Default',
    price: '',
    salePrice: '',
    stockQuantity: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadBrands() {
      try {
        const data = await getBrands();

        if (!ignore) {
          setBrands(data);
          setBrandsError('');
        }
      } catch (error) {
        console.error('Failed to load brands:', error);

        if (!ignore) {
          setBrandsError('Failed to load brands');
        }
      } finally {
        if (!ignore) {
          setBrandsLoading(false);
        }
      }
    }

    loadBrands();

    return () => {
      ignore = true;
    };
  }, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      const request = toProductCreateRequest(formValues);
      const response = await createProduct(request);
      alert(`Product created successfully: ${response.name}`);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-[22px] font-bold text-[#0B2113]">Add New Product</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search product for add"
              className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64 placeholder:text-gray-400 shadow-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="bg-[#3c9c64] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save to draft
          </button>
          <button className="bg-white border border-gray-200 text-gray-600 p-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Column */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">

          {/* Basic Details */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Details</h3>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={200}
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Short Description</label>
                <textarea
                  name="shortDescription"
                  maxLength={255}
                  value={formValues.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief summary of your product..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 focus:outline-none focus:border-emerald-500 min-h-[80px] resize-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Product Description</label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    className="w-full px-4 py-4 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 focus:outline-none focus:border-emerald-500 min-h-[140px] resize-none pb-12 leading-relaxed"
                  ></textarea>
                  <div className="absolute bottom-3 right-3 flex items-center gap-3 text-gray-400">
                    <button className="hover:text-emerald-600 transition-colors"><PenTool className="w-[18px] h-[18px]" /></button>
                    <button className="hover:text-emerald-600 transition-colors"><Wand2 className="w-[18px] h-[18px]" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Pricing</h3>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Product Price</label>
                <div className="flex bg-[#f8f9fa] border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input
                    type="text"
                    name="price"
                    value={formValues.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="flex-1 px-4 py-3 bg-transparent text-[13px] font-bold text-gray-900 focus:outline-none"
                  />
                  <button className="px-3 border-l border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors bg-white">
                    <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 h-auto rounded-[2px]" />
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Discounted Price <span className="text-gray-400 font-medium">(Optional)</span></label>
                  <div className="flex items-center bg-[#eef8f3] border border-emerald-100 rounded-lg overflow-hidden px-4 py-3">
                    <span className="font-bold text-gray-900 text-[13px] mr-2">$</span>
                    <input
                      type="text"
                      name="salePrice"
                      value={formValues.salePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="flex-1 bg-transparent text-[13px] font-bold text-gray-900 focus:outline-none"
                    />
                    <span className="font-bold text-gray-900 text-[13px]">Sale= <span className="font-extrabold">${formValues.salePrice || '0.00'}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Inventory</h3>

            <div className="mb-8">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Stock Quantity</label>
                <input
                  type="text"
                  name="stockQuantity"
                  value={formValues.stockQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-[#0B2113] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-auto pt-6 border-t border-gray-100 border-dashed">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Save to draft
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="bg-[#3c9c64] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">

          {/* Upload Product Image */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Upload Product Image</h3>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-3">Product Image</label>
                <div className="w-full aspect-video bg-[#f8f9fa] rounded-xl border border-gray-200 flex items-center justify-center relative p-6">
                  {formValues.imageUrl ? (
                    <img src={formValues.imageUrl} alt="Product Preview" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center gap-2">
                      <ImageIcon className="w-10 h-10" />
                      <span className="text-[12px]">No image selected</span>
                    </div>
                  )}

                  <button className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" /> Browse
                  </button>
                  <button className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formValues.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Categories</h3>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Product Categories</label>
                <div className="relative">
                  <select
                    name="categoryId"
                    value={formValues.categoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 focus:outline-none focus:border-emerald-500 appearance-none shadow-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="1">Electronics</option>
                    <option value="2">Smartphones</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900 font-bold pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Product Tag</label>
                <div className="relative">
                  <select
                    name="brandId"
                    value={formValues.brandId}
                    onChange={handleChange}
                    disabled={brandsLoading}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 focus:outline-none focus:border-emerald-500 appearance-none shadow-sm"
                  >
                    <option value="">
                      {brandsLoading ? 'Loading brands...' : 'Select Brand'}
                    </option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900 font-bold pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
