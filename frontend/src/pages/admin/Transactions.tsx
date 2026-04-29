import React from 'react';
import { 
  MoreVertical, Search, Filter, ArrowUpDown, MoreHorizontal, ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownRight, PlusCircle
} from 'lucide-react';

const mockTransactions = [
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete' },
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Complete' },
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete' },
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Complete' },
  { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Canceled' },
  { id: '#CUST001', name: 'Emily Davis', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending' },
  { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Canceled' },
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete' },
  { id: '#CUST001', name: 'Emily Davis', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending' },
  { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Canceled' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Complete': return 'text-emerald-500';
    case 'Canceled': return 'text-red-500';
    case 'Pending': return 'text-amber-500';
    default: return 'text-gray-500';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'Complete': return 'bg-emerald-500';
    case 'Canceled': return 'bg-red-500';
    case 'Pending': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

export default function Transactions() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[22px] font-bold text-gray-900">Transaction</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
         {/* Left Side: 4 Cards */}
         <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-[15px]">Total Revenue</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">$15,045</h2>
                   <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 14.4%</span>
                 </div>
                 <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-[15px]">Completed Transactions</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">3,150</h2>
                   <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 20%</span>
                 </div>
                 <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-[15px]">Pending Transactions</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">150</h2>
                   <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]">85%</span>
                 </div>
                 <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-[15px]">Failed Transactions</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">75</h2>
                   <span className="text-red-500 font-bold flex items-center text-[12px] pb-[3px]">15%</span>
                 </div>
                 <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
              </div>
            </div>
         </div>

         {/* Right Side: Payment Method */}
         <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Payment Method</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                 {/* Credit Card Graphic */}
                 <div className="w-64 h-36 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl p-4 text-white relative overflow-hidden shadow-md flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <span className="font-bold tracking-wider text-sm opacity-90">Finaci</span>
                      <div className="flex">
                         <div className="w-6 h-6 rounded-full bg-white/40 mix-blend-overlay"></div>
                         <div className="w-6 h-6 rounded-full bg-white/40 mix-blend-overlay -ml-3"></div>
                      </div>
                    </div>
                    
                    <div className="tracking-widest font-mono mb-4 text-lg relative z-10 text-white/90">
                      **** **** **** 2345
                    </div>
                    
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider opacity-70 mb-0.5">Card Holder name</p>
                        <p className="text-xs font-semibold">Noman Manzoor</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider opacity-70 mb-0.5 text-right">Expiry Date</p>
                        <p className="text-xs font-semibold text-right">02/30</p>
                      </div>
                    </div>
                 </div>
                 
                 {/* Right side stats */}
                 <div className="flex flex-col justify-center gap-3 py-2">
                    <p className="text-[13px] text-gray-500 font-medium">Status: <span className="text-emerald-500 font-bold ml-1">Active</span></p>
                    <p className="text-[13px] text-gray-500 font-medium">Transactions: <span className="text-gray-900 font-bold ml-1">1,250</span></p>
                    <p className="text-[13px] text-gray-500 font-medium">Revenue: <span className="text-gray-900 font-bold ml-1">$50,000</span></p>
                    <a href="#" className="text-[13px] text-blue-500 font-bold hover:underline mt-1">View Transactions</a>
                 </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                 <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors mr-3">
                   <PlusCircle className="w-4 h-4 text-gray-500" /> Add Card
                 </button>
                 <button className="px-5 py-2.5 border border-red-200 text-red-500 bg-red-50/50 rounded-lg text-[13px] font-bold hover:bg-red-50 transition-colors">
                   Deactivate
                 </button>
              </div>

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
               <input type="text" placeholder="Search payment history" className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-72 bg-gray-50/50 font-medium placeholder:text-gray-400 placeholder:font-normal" />
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
               <tr className="bg-[#eafdf3]/70 text-emerald-900 font-bold border-none">
                 <th className="px-6 py-4 rounded-l-lg font-bold text-[13px] whitespace-nowrap">Customer Id</th>
                 <th className="px-6 py-4 font-bold text-[13px]">Name</th>
                 <th className="px-6 py-4 font-bold text-[13px]">Date</th>
                 <th className="px-6 py-4 font-bold text-[13px]">Total</th>
                 <th className="px-6 py-4 font-bold text-[13px]">Method</th>
                 <th className="px-6 py-4 font-bold text-[13px]">Status</th>
                 <th className="px-6 py-4 rounded-r-lg font-bold text-[13px]">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white">
                {mockTransactions.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-extrabold text-gray-900 text-[13px]">{row.id}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{row.name}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-[13px]">{row.date}</td>
                    <td className="px-6 py-4 text-gray-900 font-extrabold text-[13px]">{row.total}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-[13px]">{row.method}</td>
                    <td className="px-6 py-4">
                       <span className={`text-[13px] font-bold flex items-center gap-2 ${getStatusStyle(row.status)}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(row.status)}`}></span>
                         {row.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <a href="#" className="text-[13px] font-bold text-blue-500 hover:text-blue-600 hover:underline">View Details</a>
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
