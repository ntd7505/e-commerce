import { 
  MoreVertical, Search, Filter, ArrowUpDown, MoreHorizontal, 
  Plus, ArrowUpRight, ArrowDownRight, PackageCheck, Clock, PackageX, Truck, ArrowLeft, ArrowRight 
} from 'lucide-react';

const mockOrders = [
  { id: '#ORD0001', product: 'Wireless Bluetooth\nHeadphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered' },
  { id: '#ORD0001', product: "Men's T-Shirt", image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=100', date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Pending' },
  { id: '#ORD0001', product: "Men's Leather\nWallet", image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=100', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered' },
  { id: '#ORD0001', product: 'Memory Foam\nPillow', image: 'https://images.unsplash.com/photo-1584100936595-c0654b35a14f?q=80&w=100', date: '01-01-2025', price: '39.99', payment: 'Paid', status: 'Shipped' },
  { id: '#ORD0001', product: 'Adjustable\nDumbbells', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=100', date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Pending' },
  { id: '#ORD0001', product: 'Coffee Maker', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=100', date: '01-01-2025', price: '79.99', payment: 'Unpaid', status: 'Cancelled' },
  { id: '#ORD0001', product: 'Casual Baseball\nCap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=100', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered' },
  { id: '#ORD0001', product: 'Full HD Webcam', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=100', date: '01-01-2025', price: '39.99', payment: 'Paid', status: 'Delivered' },
  { id: '#ORD0001', product: 'Smart LED Color\nBulb', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=100', date: '01-01-2025', price: '79.99', payment: 'Unpaid', status: 'Delivered' },
  { id: '#ORD0001', product: "Men's T-Shirt", image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=100', date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Delivered' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Delivered': return 'text-emerald-500';
    case 'Pending': return 'text-amber-500';
    case 'Shipped': return 'text-gray-900';
    case 'Cancelled': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered': return <PackageCheck className="w-4 h-4" />;
    case 'Pending': return <Clock className="w-4 h-4" />;
    case 'Shipped': return <Truck className="w-4 h-4" />;
    case 'Cancelled': return <PackageX className="w-4 h-4" />;
    default: return null;
  }
};

export default function Orders() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold text-gray-900">Order List</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-emerald-600/90 text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Order
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
            More Action <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-900 text-[15px]">Total Orders</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">1,240</h2>
               <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 14.4%</span>
             </div>
             <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-900 text-[15px]">New Orders</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">240</h2>
               <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 20%</span>
             </div>
             <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-900 text-[15px]">Completed Orders</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">960</h2>
               <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]">85%</span>
             </div>
             <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-900 text-[15px]">Canceled Orders</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">87</h2>
               <span className="text-red-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> 5%</span>
             </div>
             <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
         {/* Table Toolbar */}
         <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
           {/* Tabs */}
           <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-inner">
              <button className="px-5 py-2 text-[13px] font-bold text-emerald-800 bg-[#e0f1e9] border border-emerald-200/60 rounded-md shadow-sm">All order (240)</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Completed</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Pending</button>
              <button className="px-5 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors">Canceled</button>
           </div>
           
           {/* Actions */}
           <div className="flex items-center gap-3">
             <div className="relative">
               <input type="text" placeholder="Search order report" className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-72 bg-gray-50/50 font-medium placeholder:text-gray-400 placeholder:font-normal" />
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             </div>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><Filter className="w-4 h-4" /></button>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><ArrowUpDown className="w-4 h-4" /></button>
             <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm bg-white"><MoreHorizontal className="w-4 h-4" /></button>
           </div>
         </div>

         {/* Table */}
         <div className="px-5 py-4">
           <table className="w-full text-left text-[14px]">
             <thead>
               <tr className="bg-emerald-50/60 text-emerald-900 font-bold border-none">
                 <th className="px-4 py-4 rounded-l-lg font-bold text-[13px] whitespace-nowrap">No.</th>
                 <th className="px-4 py-4 font-bold text-[13px] w-32">Order Id</th>
                 <th className="px-4 py-4 font-bold text-[13px] w-64">Product</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Date</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Price</th>
                 <th className="px-4 py-4 font-bold text-[13px]">Payment</th>
                 <th className="px-4 py-4 rounded-r-lg font-bold text-[13px]">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {mockOrders.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[13px]">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-emerald-500" />
                        <span className="font-medium text-gray-900">1</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-extrabold text-gray-900 text-[13px]">{row.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 cursor-pointer">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                           <img src={row.image} alt={row.product} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="font-bold text-gray-900 text-[13px] leading-snug whitespace-pre-line group-hover:text-emerald-600 transition-colors">{row.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 font-bold text-[13px]">{row.date}</td>
                    <td className="px-4 py-4 font-extrabold text-gray-900 text-[13px]">{row.price}</td>
                    <td className="px-4 py-4">
                       <span className={`text-[13px] font-extrabold flex items-center gap-2 ${row.payment === 'Paid' ? 'text-gray-900' : 'text-gray-900'}`}>
                         <span className={`w-2 h-2 rounded-full ${row.payment === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                         {row.payment}
                       </span>
                    </td>
                    <td className="px-4 py-4">
                       <span className={`text-[13px] font-extrabold flex items-center gap-2 ${getStatusStyle(row.status)}`}>
                         <div className={`p-1 rounded bg-opacity-10 ${row.status === 'Pending' ? 'bg-amber-100 text-amber-500' : row.status === 'Cancelled' ? 'bg-red-100 text-red-500' : row.status === 'Shipped' ? 'bg-gray-100 text-gray-800' : 'bg-emerald-100 text-emerald-500'}`}>
                           {getStatusIcon(row.status)}
                         </div>
                         {row.status}
                       </span>
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
