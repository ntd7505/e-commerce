import React from 'react';
import { 
  MoreVertical, Search, Filter, Plus, ArrowLeft, ArrowRight, ChevronRight, Edit, Trash2, PlusCircle, MoreHorizontal
} from 'lucide-react';

const mockCategories = [
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=100' },
  { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=100' },
  { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=100' },
  { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=100' },
  { name: 'Sports & Outdoors', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=100' },
  { name: 'Toys & Games', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=100' },
  { name: 'Health & Fitness', img: 'https://images.unsplash.com/photo-1540420773420-336677a5101f?q=80&w=100' },
  { name: 'Books', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100' },
];

const mockProducts = [
  { id: 1, product: 'Wireless Bluetooth\nHeadphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100', date: '01-01-2025', order: 25 },
  { id: 2, product: "Men's T-Shirt", image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=100', date: '01-01-2025', order: 20 },
  { id: 3, product: "Men's Leather\nWallet", image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=100', date: '01-01-2025', order: 35 },
  { id: 4, product: 'Memory Foam\nPillow', image: 'https://images.unsplash.com/photo-1584100936595-c0654b35a14f?q=80&w=100', date: '01-01-2025', order: 40 },
  { id: 5, product: 'Coffee Maker', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=100', date: '01-01-2025', order: 45 },
  { id: 6, product: 'Casual Baseball\nCap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=100', date: '01-01-2025', order: 55 },
  { id: 7, product: 'Full HD Webcam', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=100', date: '01-01-2025', order: 20 },
  { id: 8, product: 'Smart LED Color\nBulb', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=100', date: '01-01-2025', order: 16 },
  { id: 9, product: "Men's T-Shirt", image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=100', date: '01-01-2025', order: 10 },
  { id: 10, product: "Men's Leather\nWallet", image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=100', date: '01-01-2025', order: 35 },
];

export default function Categories() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[22px] font-bold text-gray-900">Categories</h2>
      </div>

      {/* Discover Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Discover</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-emerald-600/90 text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
              More Action <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pr-12">
             {mockCategories.map((cat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-4 hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                     <img src={cat.img} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                  </div>
                  <span className="font-bold text-gray-900 text-[14px] leading-tight pr-2">{cat.name}</span>
                </div>
             ))}
          </div>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-emerald-600 hover:border-emerald-500 transition-colors z-10">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
         {/* Table Toolbar */}
         <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
           {/* Tabs */}
           <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-inner">
              <button className="px-5 py-2 text-[13px] font-bold text-emerald-800 bg-white border border-gray-200/60 rounded-md shadow-sm">All Product (145)</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Featured Products</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">On Sale</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Out of Stock</button>
           </div>
           
           {/* Actions */}
           <div className="flex items-center gap-3">
             <div className="relative">
               <input type="text" placeholder="Search your product" className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-72 bg-gray-50/50 font-medium placeholder:text-gray-400 placeholder:font-normal" />
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             </div>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><Filter className="w-4 h-4" /></button>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><Plus className="w-4 h-4" /></button>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><MoreHorizontal className="w-4 h-4" /></button>
           </div>
         </div>

         {/* Table */}
         <div className="px-5 py-4">
           <table className="w-full text-left text-[14px]">
             <thead>
               <tr className="bg-emerald-50/60 text-emerald-900 font-bold border-none">
                 <th className="px-4 py-4 rounded-l-lg font-bold text-[13px] whitespace-nowrap">No.</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Product</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Created Date</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Order</th>
                 <th className="px-4 py-4 rounded-r-lg font-bold text-[13px]">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {mockProducts.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[13px]">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-emerald-500" />
                        <span className="font-extrabold text-gray-900">1</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4 cursor-pointer">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                           <img src={row.image} alt={row.product} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="font-bold text-gray-900 text-[13px] leading-snug whitespace-pre-line group-hover:text-emerald-600 transition-colors">{row.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-bold text-[13px]">{row.date}</td>
                    <td className="px-4 py-4 font-bold text-gray-900 text-[13px]">{row.order}</td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-3">
                         <button className="text-gray-400 hover:text-emerald-600 transition-colors"><Edit className="w-4 h-4" /></button>
                         <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                ))}
             </tbody>
           </table>
         </div>

         {/* Pagination */}
         <div className="p-6 border-t border-gray-100 flex items-center justify-between">
           <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm bg-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Previous
           </button>
           
           <div className="flex items-center gap-2">
             <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#b5e0ce] text-emerald-900 font-extrabold text-[13px] shadow-sm">1</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-[13px]">2</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-[13px]">3</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-[13px]">4</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-[13px]">5</button>
             <span className="text-gray-400 px-1 tracking-widest font-bold">.....</span>
             <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-[13px]">24</button>
           </div>
           
           <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm bg-white transition-colors">
              Next <ArrowRight className="w-4 h-4" />
           </button>
         </div>
      </div>

    </div>
  );
}
