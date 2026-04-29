import React, { useState } from 'react';
import { 
  Search, Filter, Plus, ArrowLeft, ArrowRight, Edit, Trash2, PlusCircle, MoreHorizontal, Image as ImageIcon, X
} from 'lucide-react';

const mockBrands = [
  { id: 1, name: 'Apple', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=100' },
  { id: 2, name: 'Samsung', logoUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=100' },
  { id: 3, name: 'Sony', logoUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=100' },
  { id: 4, name: 'LG', logoUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=100' },
  { id: 5, name: 'Nike', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=100' },
];

export default function Brands() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[22px] font-bold text-gray-900">Brands</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600/90 text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Brand
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
         {/* Table Toolbar */}
         <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
           {/* Tabs */}
           <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-inner">
              <button className="px-5 py-2 text-[13px] font-bold text-emerald-800 bg-white border border-gray-200/60 rounded-md shadow-sm">All Brands</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Active</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Archived</button>
           </div>
           
           {/* Actions */}
           <div className="flex items-center gap-3">
             <div className="relative">
               <input type="text" placeholder="Search brands" className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-72 bg-gray-50/50 font-medium placeholder:text-gray-400 placeholder:font-normal" />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             </div>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><Filter className="w-4 h-4" /></button>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><MoreHorizontal className="w-4 h-4" /></button>
           </div>
         </div>

         {/* Table */}
         <div className="px-5 py-4">
           <table className="w-full text-left text-[14px]">
             <thead>
               <tr className="bg-emerald-50/60 text-emerald-900 font-bold border-none">
                 <th className="px-4 py-4 rounded-l-lg font-bold text-[13px] whitespace-nowrap w-16">
                   <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-emerald-500" />
                 </th>
                 <th className="px-4 py-4 font-bold text-[13px] w-24">No.</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Brand Details</th>
                 <th className="px-4 py-4 rounded-r-lg font-bold text-[13px] text-right w-32">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {mockBrands.map((row, i) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[13px]">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-emerald-500" />
                    </td>
                    <td className="px-4 py-4 text-[13px]">
                      <span className="font-extrabold text-gray-900">{i + 1}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4 cursor-pointer">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full p-2 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                           <img src={row.logoUrl} alt={row.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="font-bold text-gray-900 text-[14px] leading-snug whitespace-pre-line group-hover:text-emerald-600 transition-colors">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <button 
                           onClick={() => setShowModal(true)}
                           className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                         >
                           <Edit className="w-4 h-4" />
                         </button>
                         <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
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
             <span className="text-gray-400 px-1 tracking-widest font-bold">...</span>
             <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-[13px]">10</button>
           </div>
           
           <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm bg-white transition-colors">
              Next <ArrowRight className="w-4 h-4" />
           </button>
         </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-[16px] font-bold text-gray-900">Add / Edit Brand</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Brand Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Apple"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 focus:outline-none focus:border-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Logo URL <span className="text-red-500">*</span></label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#f8f9fa] border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 focus:outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-[13px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 text-[13px] font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                Save Brand
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
