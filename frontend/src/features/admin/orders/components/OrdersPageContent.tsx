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
    case 'Delivered': return 'text-success';
    case 'Pending': return 'text-warning';
    case 'Shipped': return 'text-text';
    case 'Cancelled': return 'text-danger';
    default: return 'text-muted';
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
        <h2 className="text-2xl font-bold text-text">Order List</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-success/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-success transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Order
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border-strong text-text px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-surface transition-colors shadow-sm">
            More Action <MoreVertical className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Card 1 */}
        <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-text text-sm">Total Orders</h3>
            <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <p className="text-3xl font-bold text-text leading-none">1,240</p>
               <span className="text-success font-bold flex items-center text-xs pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 14.4%</span>
             </div>
             <p className="text-xs text-muted font-medium">Last 7 days</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-text text-sm">New Orders</h3>
            <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <p className="text-3xl font-bold text-text leading-none">240</p>
               <span className="text-success font-bold flex items-center text-xs pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 20%</span>
             </div>
             <p className="text-xs text-muted font-medium">Last 7 days</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-text text-sm">Completed Orders</h3>
            <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <p className="text-3xl font-bold text-text leading-none">960</p>
               <span className="text-success font-bold flex items-center text-xs pb-[3px]">85%</span>
             </div>
             <p className="text-xs text-muted font-medium">Last 7 days</p>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-text text-sm">Canceled Orders</h3>
            <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div>
             <div className="flex items-end gap-2 mb-2">
               <p className="text-3xl font-bold text-text leading-none">87</p>
               <span className="text-danger font-bold flex items-center text-xs pb-[3px]"><ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> 5%</span>
             </div>
             <p className="text-xs text-muted font-medium">Last 7 days</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-surface rounded-xl border border-border-strong shadow-sm flex flex-col">
         {/* Table Toolbar */}
         <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-4">
           {/* Tabs */}
           <div className="flex items-center gap-1 bg-surface p-1.5 rounded-lg border border-border shadow-inner">
              <button className="px-5 py-2 text-sm font-bold text-success bg-success-soft border border-success-soft/60 rounded-md shadow-sm">All order (240)</button>
              <button className="px-5 py-2 text-sm font-bold text-muted hover:text-text rounded-md transition-colors">Completed</button>
              <button className="px-5 py-2 text-sm font-bold text-muted hover:text-text rounded-md transition-colors">Pending</button>
              <button className="px-5 py-2 text-sm font-bold text-muted hover:text-text rounded-md transition-colors">Canceled</button>
           </div>
           
           {/* Actions */}
           <div className="flex items-center gap-3">
             <div className="relative">
                <input type="text" placeholder="Search order report" aria-label="Search order report" className="pl-4 pr-10 py-2.5 border border-border-strong rounded-lg text-sm outline-none focus:border-success focus:ring-1 focus:ring-success w-72 bg-surface/50 font-medium placeholder:text-muted placeholder:font-normal" />
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
             </div>
              <button aria-label="Filter" className="p-2.5 border border-border-strong rounded-lg text-muted hover:bg-surface hover:text-text transition-colors shadow-sm bg-surface"><Filter className="w-4 h-4" /></button>
              <button aria-label="Sort" className="p-2.5 border border-border-strong rounded-lg text-muted hover:bg-surface hover:text-text transition-colors shadow-sm bg-surface"><ArrowUpDown className="w-4 h-4" /></button>
              <button aria-label="More actions" className="p-2.5 border border-border-strong rounded-lg text-muted hover:bg-surface hover:text-text transition-colors shadow-sm bg-surface"><MoreHorizontal className="w-4 h-4" /></button>
           </div>
         </div>

         {/* Table */}
         <div className="px-5 py-4">
           <table className="w-full text-left text-sm">
             <thead>
               <tr className="bg-success-soft/60 text-success font-bold border-none">
                 <th className="px-4 py-4 rounded-l-lg font-bold text-sm whitespace-nowrap">No.</th>
                 <th className="px-4 py-4 font-bold text-sm w-32">Order Id</th>
                 <th className="px-4 py-4 font-bold text-sm w-64">Product</th>
                 <th className="px-4 py-4 font-bold text-sm">Date</th>
                 <th className="px-4 py-4 font-bold text-sm">Price</th>
                 <th className="px-4 py-4 font-bold text-sm">Payment</th>
                 <th className="px-4 py-4 rounded-r-lg font-bold text-sm">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {mockOrders.map((row, i) => (
                  <tr key={i} className="hover:bg-surface/50 transition-colors group">
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded text-success focus:ring-success border-border-strong accent-emerald-500" />
                        <span className="font-medium text-text">1</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-extrabold text-text text-sm">{row.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 cursor-pointer">
                        <div className="w-12 h-12 bg-surface border border-border rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                           <img src={row.image} alt={row.product} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="font-bold text-text text-sm leading-snug whitespace-pre-line group-hover:text-success transition-colors">{row.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted font-bold text-sm">{row.date}</td>
                    <td className="px-4 py-4 font-extrabold text-text text-sm">{row.price}</td>
                    <td className="px-4 py-4">
                       <span className={`text-sm font-extrabold flex items-center gap-2 ${row.payment === 'Paid' ? 'text-text' : 'text-text'}`}>
                         <span className={`w-2 h-2 rounded-full ${row.payment === 'Paid' ? 'bg-success' : 'bg-danger-soft0'}`}></span>
                         {row.payment}
                       </span>
                    </td>
                    <td className="px-4 py-4">
                       <span className={`text-sm font-extrabold flex items-center gap-2 ${getStatusStyle(row.status)}`}>
                         <div className={`p-1 rounded bg-opacity-10 ${row.status === 'Pending' ? 'bg-amber-100 text-warning' : row.status === 'Cancelled' ? 'bg-danger-soft text-danger' : row.status === 'Shipped' ? 'bg-surface-alt text-text' : 'bg-success-soft text-success'}`}>
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
         <div className="p-6 border-t border-border flex items-center justify-between">
           <button className="flex items-center gap-2 px-5 py-2.5 border border-border-strong rounded-lg text-sm font-bold text-text hover:bg-surface hover:text-text shadow-sm bg-surface transition-colors">
              <ArrowLeft className="w-4 h-4" /> Previous
           </button>
           
           <div className="flex items-center gap-2">
             <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-success-soft text-success font-extrabold text-sm shadow-sm">1</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-surface hover:bg-surface text-muted font-bold text-sm">2</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-surface hover:bg-surface text-muted font-bold text-sm">3</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-surface hover:bg-surface text-muted font-bold text-sm">4</button>
             <button className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-surface hover:bg-surface text-muted font-bold text-sm">5</button>
             <span className="text-muted px-1 tracking-widest font-bold">.....</span>
             <button className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-surface hover:bg-surface text-muted font-bold text-sm">24</button>
           </div>
           
           <button className="flex items-center gap-2 px-5 py-2.5 border border-border-strong rounded-lg text-sm font-bold text-text hover:bg-surface hover:text-text shadow-sm bg-surface transition-colors">
              Next <ArrowRight className="w-4 h-4" />
           </button>
         </div>
      </div>

    </div>
  );
}
