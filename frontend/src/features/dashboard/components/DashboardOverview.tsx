import { MoreVertical, ArrowUpRight, ArrowDownRight, Filter, Search, Plus, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Total Sales</h3>
              <p className="text-[13px] text-gray-400 mt-0.5">Last 7 days</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="flex items-end gap-3 mb-6 mt-6">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-none">$350K</h2>
            <div className="text-[13px] font-medium text-gray-600 flex items-center pb-1">
              Sales <span className="text-emerald-500 font-bold flex items-center ml-1"><ArrowUpRight className="w-3 h-3 mr-0.5" /> 10.4%</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-[13px] text-gray-500">Previous 7days <span className="text-blue-500 font-semibold">($235)</span></p>
            <button className="text-[13px] text-blue-600 border border-blue-200 hover:bg-blue-50 px-5 py-1.5 rounded-full transition-colors font-semibold">Details</button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Total Orders</h3>
              <p className="text-[13px] text-gray-400 mt-0.5">Last 7 days</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="flex items-end gap-3 mb-6 mt-6">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-none">10.7K</h2>
            <div className="text-[13px] font-medium text-gray-600 flex items-center pb-1">
              order <span className="text-emerald-500 font-bold flex items-center ml-1"><ArrowUpRight className="w-3 h-3 mr-0.5" /> 14.4%</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-[13px] text-gray-500">Previous 7days <span className="text-blue-500 font-semibold">(7.6k)</span></p>
            <button className="text-[13px] text-blue-600 border border-blue-200 hover:bg-blue-50 px-5 py-1.5 rounded-full transition-colors font-semibold">Details</button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Pending & Canceled</h3>
              <p className="text-[13px] text-gray-400 mt-0.5">Last 7 days</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="flex items-start gap-8 mb-6 mt-2 flex-1">
            <div>
              <p className="text-[13px] font-medium text-gray-500 mb-1">Pending</p>
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-extrabold text-gray-900 leading-none">509</h2>
                <span className="text-emerald-500 text-[11px] pb-1 font-bold">user 204</span>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mt-1"></div>
            <div>
              <p className="text-[13px] font-medium text-gray-500 mb-1">Canceled</p>
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-extrabold text-red-500 leading-none">94</h2>
                <span className="text-red-500 flex items-center text-[11px] pb-1 font-bold"><ArrowDownRight className="w-3 h-3 mr-0.5" /> 14.4%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-auto">
            <button className="text-[13px] text-blue-600 border border-blue-200 hover:bg-blue-50 px-5 py-1.5 rounded-full transition-colors font-semibold">Details</button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left col 8, Right col 4 */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Report for this week */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-900 text-lg">Report for this week</h3>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-50 rounded-full p-1 border border-gray-200">
                   <button className="text-[13px] font-bold px-4 py-1.5 rounded-full bg-white text-emerald-600 shadow-sm border border-emerald-100">This week</button>
                   <button className="text-[13px] font-medium px-4 py-1.5 text-gray-500 hover:text-gray-700">Last week</button>
                </div>
                <button className="text-gray-400 hover:text-gray-600 pl-1"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">52k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Customers</p>
                <div className="h-1 bg-emerald-500 mt-3 w-full rounded-sm"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">3.5k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Total Products</p>
                <div className="h-1 bg-gray-100 mt-3 w-full rounded-sm"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">2.5k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Stock Products</p>
                <div className="h-1 bg-gray-100 mt-3 w-full rounded-sm"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">0.5k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Out of Stock</p>
                <div className="h-1 bg-gray-100 mt-3 w-full rounded-sm"></div>
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-gray-900">250k</h4>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Revenue</p>
                <div className="h-1 bg-gray-100 mt-3 w-full rounded-sm"></div>
              </div>
            </div>
            
            {/* Chart Placeholder matching image */}
            <div className="h-[280px] mt-6 relative w-full flex items-end pb-6 px-2">
               {/* Vertical grid lines & labels */}
               <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] text-gray-400 pb-8 font-medium">
                 <span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0k</span>
               </div>
               
               {/* Decorative chart SVG path imitating the area chart */}
               <div className="absolute inset-0 ml-10 border-b border-gray-100 h-full pb-8 flex items-end">
                  <div className="w-full h-full relative">
                     {/* Horizontal grid lines */}
                     <div className="absolute inset-0 flex flex-col justify-between">
                        {[...Array(6)].map((_, i) => (
                           <div key={i} className="w-full h-px bg-gray-50"></div>
                        ))}
                     </div>
                     <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,85 C10,85 15,45 25,45 C35,45 40,30 50,30 C60,30 65,70 75,70 C85,70 90,50 100,50 L100,100 L0,100 Z" fill="rgba(16, 185, 129, 0.1)"></path>
                        <path d="M0,85 C10,85 15,45 25,45 C35,45 40,30 50,30 C60,30 65,70 75,70 C85,70 90,50 100,50" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                     </svg>
                     <div className="absolute left-[50%] top-[30%] transform -translate-x-1/2 -translate-y-[120%] bg-[#b9e5d1] text-emerald-900 border border-emerald-300 px-4 py-2 rounded-lg shadow-sm flex flex-col items-center z-10">
                       <span className="text-[10px] font-bold">Thursday</span>
                       <span className="text-sm font-extrabold leading-none mt-1">14k</span>
                       <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#b9e5d1] border-b border-r border-emerald-300 rotate-45"></div>
                     </div>
                     <div className="absolute left-[50%] top-[30%] bottom-0 w-[1.5px] bg-emerald-300 border-dashed border-l border-emerald-400 h-full -z-10 opacity-70 border-spacing-2"></div>
                     <div className="absolute left-[50%] top-[30%] w-3 h-3 bg-white border-[3px] border-emerald-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
                  </div>
               </div>

               {/* Horizontal X axis labels */}
               <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] text-gray-400 font-medium">
                 <span>Sun</span><span>Mon</span><span>Tue</span><span className="text-gray-900 font-bold">Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
               </div>
            </div>
            
          </div>

          {/* Transaction Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Transaction</h3>
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                Filter <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="text-gray-500 font-medium border-y border-gray-100 bg-white">
                  <tr>
                    <th className="px-6 py-4 font-normal">No</th>
                    <th className="px-6 py-4 font-normal">Id Customer</th>
                    <th className="px-6 py-4 font-normal">Order Date</th>
                    <th className="px-6 py-4 font-normal">Status</th>
                    <th className="px-6 py-4 font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                     { no: '1.', id: '#6545', date: '01 Oct | 11:29 am', status: 'Paid', statusColor: 'bg-emerald-500', color: 'text-emerald-500', amount: '$64' },
                     { no: '2.', id: '#5412', date: '01 Oct | 11:29 am', status: 'Pending', statusColor: 'bg-amber-500', color: 'text-amber-500', amount: '$557' },
                     { no: '3.', id: '#6622', date: '01 Oct | 11:29 am', status: 'Paid', statusColor: 'bg-emerald-500', color: 'text-emerald-500', amount: '$156' },
                     { no: '4.', id: '#6462', date: '01 Oct | 11:29 am', status: 'Paid', statusColor: 'bg-emerald-500', color: 'text-emerald-500', amount: '$265' },
                     { no: '5.', id: '#6462', date: '01 Oct | 11:29 am', status: 'Paid', statusColor: 'bg-emerald-500', color: 'text-emerald-500', amount: '$265' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">{row.no}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{row.id}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{row.date}</td>
                      <td className="px-6 py-4">
                        <span className={`${row.color} font-bold flex items-center gap-2`}>
                          <span className={`w-2 h-2 rounded-full ${row.statusColor}`}></span>{row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-gray-900 text-sm">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-5 flex justify-end">
              <button className="text-[13px] text-blue-600 border border-blue-200 hover:bg-blue-50 px-6 py-2 rounded-full transition-colors font-semibold">Details</button>
            </div>
          </div>

          {/* Best selling product */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Best selling product</h3>
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                Filter <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 pb-2">
              <table className="w-full text-left text-[13px]">
                <thead className="text-gray-500 font-bold text-[11px] uppercase bg-emerald-50/70 rounded-xl">
                  <tr>
                    <th className="px-5 py-3.5 rounded-l-xl">PRODUCT</th>
                    <th className="px-5 py-3.5">TOTAL ORDER</th>
                    <th className="px-5 py-3.5">STATUS</th>
                    <th className="px-5 py-3.5 rounded-r-xl">PRICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 mt-2 block w-full table-row-group">
                  {[
                    { img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80", name: "Apple iPhone 13", orders: "104", status: "Stock", statusColor: "bg-emerald-500", color: "text-emerald-500", price: "$999.00" },
                    { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80", name: "Nike Air Jordan", orders: "56", status: "Stock out", statusColor: "bg-red-500", color: "text-red-500", price: "$999.00" },
                    { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80", name: "T-shirt", orders: "266", status: "Stock", statusColor: "bg-emerald-500", color: "text-emerald-500", price: "$999.00" },
                    { img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80", name: "Cross Bag", orders: "506", status: "Stock", statusColor: "bg-emerald-500", color: "text-emerald-500", price: "$999.00" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 flex items-center gap-3">
                           <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center">
                             <img src={row.img} alt={row.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                           </div>
                           <span className="font-bold text-gray-900">{row.name}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-medium">{row.orders}</td>
                      <td className="px-5 py-4">
                        <span className={`${row.color} font-bold flex items-center gap-2`}>
                          <span className={`w-2 h-2 rounded-full ${row.statusColor}`}></span>{row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-gray-900">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 pt-2 flex justify-end">
              <button className="text-[13px] text-blue-600 border border-blue-200 hover:bg-blue-50 px-6 py-2 rounded-full transition-colors font-semibold">Details</button>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Users in last 30 minutes & Sales by Country */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-blue-500">Users in last 30 minutes</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <h2 className="text-[40px] font-extrabold text-gray-900 mb-6 leading-none">21.5K</h2>
            
            <p className="text-[11px] font-medium text-gray-500 mb-3">Users per minute</p>
            {/* Simple Bar Chart Placeholder */}
            <div className="h-16 flex items-end gap-[3px] w-full mb-10 pb-3 border-b border-gray-100">
               {[40,30,50,60,40,20,30,80,60,50,40,30,60,70,50,40,30,60,80,90,70,50,60,80,90,100,60,70,80,95].map((val, i) => (
                 <div key={i} className="bg-emerald-500 w-full rounded-t-sm" style={{height: `${val}%`}}></div>
               ))}
            </div>

            <div className="flex justify-between items-end mb-6">
              <h3 className="font-bold text-gray-900 text-[15px]">Sales by Country</h3>
              <span className="text-[13px] font-bold text-gray-900">Sales</span>
            </div>
            
            <div className="space-y-6 mb-8">
              {[
                { code: 'us', name: 'US', val: '30k', pct: '25.8%', color: 'emerald', up: true, width: '70%'},
                { code: 'br', name: 'Brazil', val: '30k', pct: '15.8%', color: 'red', up: false, width: '50%'},
                { code: 'au', name: 'Australia', val: '25k', pct: '35.6%', color: 'emerald', up: true, width: '60%'}
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={`https://flagcdn.com/${item.code}.svg`} alt={item.name} className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-extrabold text-gray-900 flex flex-col leading-tight">
                        {item.val} <span className="text-[11px] text-gray-500 font-semibold">{item.name}</span>
                      </span>
                      <span className={`text-[11px] font-bold text-${item.color}-500 flex items-center`}>
                        {item.up ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />} {item.pct}
                      </span>
                    </div>
                    <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{width: item.width}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-2.5 text-[13px] text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors font-bold">View Insight</button>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Top Products</h3>
              <a href="#" className="text-[13px] text-blue-500 font-semibold hover:underline">All product</a>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-colors bg-white font-medium placeholder:text-gray-400 placeholder:font-normal" placeholder="Search" type="text" />
            </div>
            
            <div className="space-y-1">
              {[
                { img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80", name: "Apple iPhone 13", item: "#FXZ-4567", price: "$999.00", highlight: false },
                { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80", name: "Nike Air Jordan", item: "#FXZ-4567", price: "$72.40", highlight: true },
                { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80", name: "T-shirt", item: "#FXZ-4567", price: "$35.40", highlight: false },
                { img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80", name: "Assorted Cross\nBag", item: "#FXZ-4567", price: "$80.00", highlight: false },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between group pt-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
                      <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-900 leading-tight whitespace-pre-line">{product.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">Item: {product.item}</p>
                    </div>
                  </div>
                  <span className={`text-[13px] font-extrabold ${product.highlight ? 'text-emerald-500' : 'text-gray-900'}`}>{product.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Product widget */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Add New Product</h3>
              <button className="flex items-center gap-1 text-[13px] text-blue-500 hover:text-blue-600 font-semibold">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>
            
            <h4 className="text-[11px] font-medium text-gray-500 mb-3">Categories</h4>
            <div className="space-y-3 mb-4">
              {[
                { icon: "💻", text: "Electronic" },
                { icon: "👕", text: "Fashion" },
                { icon: "🛋️", text: "Home" }
              ].map((cat, i) => (
                <button key={i} className="w-full flex justify-between items-center p-2.5 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 group-hover:bg-white rounded-lg transition-colors"><span className="text-xl grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100">{cat.icon}</span></div>
                    <span className="font-bold text-[13px] text-gray-900">{cat.text}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 mr-1" />
                </button>
              ))}
            </div>
            <div className="text-center mb-8">
              <a href="#" className="text-[13px] text-blue-500 font-semibold hover:underline">See more</a>
            </div>

            <h4 className="text-[11px] font-medium text-gray-500 mb-4">Product</h4>
            <div className="space-y-5 mb-6">
              {[
                { icon: "⌚", name: "Smart Fitness Tracker", price: "$39.99" },
                { icon: "👝", name: "Leather Wallet", price: "$19.99" },
                { icon: "💈", name: "Electric Hair Trimmer", price: "$34.99" }
              ].map((prod, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center">
                       <span className="text-2xl grayscale opacity-70">{prod.icon}</span>
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-gray-900 leading-tight">{prod.name}</h5>
                      <p className="text-[13px] text-emerald-500 font-extrabold mt-1">{prod.price}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-200 text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a href="#" className="text-[13px] text-blue-500 font-semibold hover:underline">See more</a>
            </div>

          </div>
          
        </div>
        
      </div>
    </div>
  );
}
