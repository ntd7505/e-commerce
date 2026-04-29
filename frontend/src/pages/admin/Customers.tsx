import React from 'react';
import { 
  MoreVertical, ArrowUpRight, MessageSquare, Trash2, ArrowLeft, ArrowRight 
} from 'lucide-react';

const mockCustomers = [
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST001', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, spend: '250.00', status: 'Inactive' },
  { id: '#CUST001', name: 'Emily Davis', phone: '+1234567890', orderCount: 30, spend: '4,600.00', status: 'VIP' },
  { id: '#CUST001', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, spend: '250.00', status: 'Inactive' },
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST001', name: 'Emily Davis', phone: '+1234567890', orderCount: 30, spend: '4,600.00', status: 'VIP' },
  { id: '#CUST001', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, spend: '250.00', status: 'Inactive' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Active': return 'text-emerald-500';
    case 'Inactive': return 'text-red-500';
    case 'VIP': return 'text-amber-500';
    default: return 'text-gray-500';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-500';
    case 'Inactive': return 'bg-red-500';
    case 'VIP': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

export default function Customers() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-bold text-gray-900">Customers</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Column - 3 Cards */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-[15px]">Total Customers</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
               <div className="flex items-end gap-2 mb-2">
                 <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">11,040</h2>
                 <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 14.4%</span>
               </div>
               <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-[15px]">New Customers</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
               <div className="flex items-end gap-2 mb-2">
                 <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">2,370</h2>
                 <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 20%</span>
               </div>
               <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-[15px]">Visitor</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
               <div className="flex items-end gap-2 mb-2">
                 <h2 className="text-[32px] font-extrabold text-gray-900 leading-none">250k</h2>
                 <span className="text-emerald-500 font-bold flex items-center text-[12px] pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 20%</span>
               </div>
               <p className="text-[12px] text-gray-400 font-medium">Last 7 days</p>
            </div>
          </div>

        </div>
        
        {/* Right Column - Customer Overview Chart */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900 text-lg">Customer Overview</h3>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-50 rounded-full p-1 border border-gray-200">
                 <button className="text-[13px] font-bold px-4 py-1.5 rounded-full bg-white text-emerald-600 shadow-sm border border-emerald-100">This week</button>
                 <button className="text-[13px] font-medium px-4 py-1.5 text-gray-500 hover:text-gray-700">Last week</button>
              </div>
              <button className="text-gray-400 hover:text-gray-600 pl-1"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">25k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Active Customers</p>
                <div className="h-1 bg-emerald-500 mt-4 w-full rounded-sm"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">5.6k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Repeat Customers</p>
                <div className="h-px bg-gray-200 mt-4 w-full"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">250k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Shop Visitor</p>
                <div className="h-px bg-gray-200 mt-4 w-full"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">5.5%</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Conversion Rate</p>
                <div className="h-px bg-gray-200 mt-4 w-full"></div>
              </div>
          </div>
          
          {/* Chart SVG */}
          <div className="h-[250px] mt-4 relative w-full flex items-end pb-8 px-2 flex-1">
             {/* Vertical grid lines & labels */}
             <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] text-gray-400 pb-10 font-medium">
               <span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0k</span>
             </div>
             
             <div className="absolute inset-0 ml-10 border-b border-gray-100 h-full pb-10 flex items-end">
                <div className="w-full h-full relative">
                   {/* Horizontal grid lines */}
                   <div className="absolute inset-0 flex flex-col justify-between">
                      {[...Array(6)].map((_, i) => (
                         <div key={i} className="w-full h-[1px] bg-gray-50"></div>
                      ))}
                   </div>
                   <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,70 C5,70 10,70 15,40 C20,20 25,20 35,20 C45,20 50,45 55,45 C60,45 65,10 75,10 C85,10 90,50 95,50 C98,50 100,25 100,25 L100,100 L0,100 Z" fill="rgba(16, 185, 129, 0.1)"></path>
                      <path d="M0,70 C5,70 10,70 15,40 C20,20 25,20 35,20 C45,20 50,45 55,45 C60,45 65,10 75,10 C85,10 90,50 95,50 C98,50 100,25 100,25" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                   </svg>
                   {/* Tooltip matching Wednesday peak visually x=65 y=10 */}
                   <div className="absolute left-[65%] top-[10%] transform -translate-x-1/2 -translate-y-[120%] bg-[#b9e5d1] text-emerald-900 border border-emerald-300 px-4 py-2 rounded-lg shadow-sm flex flex-col items-center z-10">
                     <span className="text-[10px] font-bold">Thursday</span>
                     <span className="text-sm font-extrabold leading-none mt-1">25,409</span>
                     <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#b9e5d1] border-b border-r border-emerald-300 rotate-45"></div>
                   </div>
                   <div className="absolute left-[65%] top-[10%] bottom-0 w-[1.5px] bg-emerald-300 border-dashed border-l border-emerald-400 h-full -z-10 opacity-70 border-spacing-2"></div>
                   <div className="absolute left-[65%] top-[10%] w-3 h-3 bg-white border-[3px] border-emerald-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
                </div>
             </div>

             {/* Horizontal X axis labels */}
             <div className="absolute bottom-2 left-10 right-0 flex justify-between text-[11px] text-gray-400 font-medium">
               <span>Sun</span><span>Mon</span><span>Tue</span><span className="text-gray-900 font-bold">Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
             </div>
          </div>

        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
         {/* Table */}
         <div className="overflow-x-auto rounded-t-xl">
           <table className="w-full text-left text-[14px]">
             <thead>
               <tr className="bg-[#eafdf3]/70 text-emerald-900 border-none">
                 <th className="px-6 py-4 font-bold text-[13px] w-32 border-none">Customer Id</th>
                 <th className="px-6 py-4 font-bold text-[13px] border-none">Name</th>
                 <th className="px-6 py-4 font-bold text-[13px] border-none">Phone</th>
                 <th className="px-6 py-4 font-bold text-[13px] border-none">Order Count</th>
                 <th className="px-6 py-4 font-bold text-[13px] border-none">Total Spend</th>
                 <th className="px-6 py-4 font-bold text-[13px] border-none">Status</th>
                 <th className="px-6 py-4 font-bold text-[13px] border-none">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white">
                {mockCustomers.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-extrabold text-gray-900 text-[13px]">{row.id}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{row.name}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{row.phone}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{row.orderCount}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{row.spend}</td>
                    <td className="px-6 py-4">
                       <span className={`text-[13px] font-medium flex items-center gap-2 ${getStatusStyle(row.status)}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(row.status)}`}></span>
                         {row.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <button className="text-gray-400 hover:text-emerald-500 transition-colors"><MessageSquare className="w-4 h-4" /></button>
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
