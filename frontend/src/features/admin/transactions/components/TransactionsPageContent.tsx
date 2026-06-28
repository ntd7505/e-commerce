import { 
  MoreVertical, Search, Filter, ArrowUpDown, MoreHorizontal, ArrowLeft, ArrowRight, ArrowUpRight, PlusCircle
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
    case 'Complete': return 'text-success';
    case 'Canceled': return 'text-danger';
    case 'Pending': return 'text-warning';
    default: return 'text-muted';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'Complete': return 'bg-success';
    case 'Canceled': return 'bg-danger-soft0';
    case 'Pending': return 'bg-warning-soft0';
    default: return 'bg-surface0';
  }
};

export default function Transactions() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text">Transaction</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
         {/* Left Side: 4 Cards */}
         <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-text text-sm">Total Revenue</h3>
                <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <p className="text-3xl font-bold text-text leading-none">$15,045</p>
                   <span className="text-success font-bold flex items-center text-xs pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 14.4%</span>
                 </div>
                 <p className="text-xs text-muted font-medium">Last 7 days</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-text text-sm">Completed Transactions</h3>
                <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <p className="text-3xl font-bold text-text leading-none">3,150</p>
                   <span className="text-success font-bold flex items-center text-xs pb-[3px]"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 20%</span>
                 </div>
                 <p className="text-xs text-muted font-medium">Last 7 days</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-text text-sm">Pending Transactions</h3>
                <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <p className="text-3xl font-bold text-text leading-none">150</p>
                   <span className="text-success font-bold flex items-center text-xs pb-[3px]">85%</span>
                 </div>
                 <p className="text-xs text-muted font-medium">Last 7 days</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-surface p-6 rounded-xl border border-border-strong shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-text text-sm">Failed Transactions</h3>
                <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div>
                 <div className="flex items-end gap-2 mb-2">
                   <p className="text-3xl font-bold text-text leading-none">75</p>
                   <span className="text-danger font-bold flex items-center text-xs pb-[3px]">15%</span>
                 </div>
                 <p className="text-xs text-muted font-medium">Last 7 days</p>
              </div>
            </div>
         </div>

         {/* Right Side: Payment Method */}
         <div className="w-full lg:w-1/3 bg-surface p-6 rounded-xl border border-border-strong shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-text text-lg">Payment Method</h3>
              <button className="text-muted hover:text-muted"><MoreVertical className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                 {/* Credit Card Graphic */}
                 <div className="w-64 h-36 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl p-4 text-white relative overflow-hidden shadow-md flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-surface/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-success/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <span className="font-bold tracking-wider text-sm opacity-90">Finaci</span>
                      <div className="flex">
                         <div className="w-6 h-6 rounded-full bg-surface/40 mix-blend-overlay"></div>
                         <div className="w-6 h-6 rounded-full bg-surface/40 mix-blend-overlay -ml-3"></div>
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
                    <p className="text-sm text-muted font-medium">Status: <span className="text-success font-bold ml-1">Active</span></p>
                    <p className="text-sm text-muted font-medium">Transactions: <span className="text-text font-bold ml-1">1,250</span></p>
                    <p className="text-sm text-muted font-medium">Revenue: <span className="text-text font-bold ml-1">$50,000</span></p>
                    <a href="#" className="text-sm text-primary font-bold hover:underline mt-1">View Transactions</a>
                 </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                 <button className="flex-1 flex items-center justify-center gap-2 border border-border-strong text-text py-2.5 rounded-lg text-sm font-bold hover:bg-surface transition-colors mr-3">
                   <PlusCircle className="w-4 h-4 text-muted" /> Add Card
                 </button>
                 <button className="px-5 py-2.5 border border-danger-soft text-danger bg-danger-soft/50 rounded-lg text-sm font-bold hover:bg-danger-soft transition-colors">
                   Deactivate
                 </button>
              </div>

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
                <input type="text" placeholder="Search payment history" aria-label="Search payment history" className="pl-4 pr-10 py-2.5 border border-border-strong rounded-lg text-sm outline-none focus:border-success focus:ring-1 focus:ring-success w-72 bg-surface/50 font-medium placeholder:text-muted placeholder:font-normal" />
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
               <tr className="bg-success-soft/70 text-success font-bold border-none">
                 <th className="px-6 py-4 rounded-l-lg font-bold text-sm whitespace-nowrap">Customer Id</th>
                 <th className="px-6 py-4 font-bold text-sm">Name</th>
                 <th className="px-6 py-4 font-bold text-sm">Date</th>
                 <th className="px-6 py-4 font-bold text-sm">Total</th>
                 <th className="px-6 py-4 font-bold text-sm">Method</th>
                 <th className="px-6 py-4 font-bold text-sm">Status</th>
                 <th className="px-6 py-4 rounded-r-lg font-bold text-sm">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border bg-surface">
                {mockTransactions.map((row, i) => (
                  <tr key={i} className="hover:bg-surface/50 transition-colors group">
                    <td className="px-6 py-4 font-extrabold text-text text-sm">{row.id}</td>
                    <td className="px-6 py-4 text-text font-medium text-sm">{row.name}</td>
                    <td className="px-6 py-4 text-text font-bold text-sm">{row.date}</td>
                    <td className="px-6 py-4 text-text font-extrabold text-sm">{row.total}</td>
                    <td className="px-6 py-4 text-text font-bold text-sm">{row.method}</td>
                    <td className="px-6 py-4">
                       <span className={`text-sm font-bold flex items-center gap-2 ${getStatusStyle(row.status)}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(row.status)}`}></span>
                         {row.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <a href="#" className="text-sm font-bold text-primary hover:text-primary hover:underline">View Details</a>
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
