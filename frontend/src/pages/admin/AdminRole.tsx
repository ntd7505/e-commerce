import React from 'react';
import { 
  Share2, Copy, Plus, EyeOff, Calendar, 
  PenTool, Wand2, Edit3, HelpCircle
} from 'lucide-react';

export default function AdminRole() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <h2 className="text-[22px] font-bold text-gray-900 mb-6">About section</h2>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
         
         {/* Left Column */}
         <div className="w-full lg:w-[35%] flex flex-col gap-6">
            
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-[16px]">Profile</h3>
                <div className="flex items-center gap-3 text-gray-500">
                  <button className="hover:text-emerald-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button className="hover:text-emerald-600 transition-colors"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-sm ring-1 ring-gray-100">
                 <img src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=200" alt="Wade Warren" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Wade Warren</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500 text-[13px] font-medium">wade.warren@example.com</span>
                <button className="text-blue-500 hover:text-blue-700"><Copy className="w-3.5 h-3.5" /></button>
              </div>
              
              <div className="w-full border-t border-gray-100 mb-6"></div>
              
              <p className="text-gray-500 text-[13px] font-medium mb-4">Linked with Social media</p>
              
              <div className="flex items-center justify-center gap-5 mb-6">
                 {/* Google */}
                 <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.8-2.95c-1.07.72-2.45 1.14-4.13 1.14-3.18 0-5.88-2.15-6.84-5.04H1.24v3.1A11.96 11.96 0 0012 24z"/><path fill="#4285F4" d="M23.64 12.2c0-.83-.07-1.64-.21-2.43H12v4.6h6.53c-.28 1.5-1.12 2.76-2.4 3.59l3.8 2.95C21.95 20.25 23.64 16.5 23.64 12.2z"/><path fill="#FBBC05" d="M5.16 14.18c-.25-.74-.39-1.54-.39-2.36 0-.82.14-1.62.39-2.36V6.36H1.24a11.97 11.97 0 000 11.28l3.92-3.46z"/><path fill="#34A853" d="M12 4.72c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.18 15.24 0 12 0 6.64 0 2.1 3.09 1.24 6.36l3.92 3.46C6.12 6.87 8.82 4.72 12 4.72z"/></svg>
                    <span className="text-[11px] text-blue-500 font-bold opacity-80 line-through">Linked</span>
                 </div>
                 {/* Facebook */}
                 <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span className="text-[11px] text-blue-500 font-bold opacity-80 line-through">Linked</span>
                 </div>
                 {/* X / Twitter */}
                 <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="black"/></svg>
                    <span className="text-[11px] text-blue-500 font-bold opacity-80 line-through">Linked</span>
                 </div>
              </div>
              
              <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-gray-50 transition-colors">
                <Plus className="w-4 h-4 text-gray-400" /> Social media
              </button>
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-[16px]">Change Password</h3>
                <a href="#" className="flex items-center gap-1.5 text-[13px] text-blue-500 font-bold hover:underline">
                  Need help <HelpCircle className="w-3.5 h-3.5" />
                </a>
              </div>
              
              <div className="flex flex-col gap-5">
                 <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input type="password" placeholder="Enter password" className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                    <a href="#" className="block mt-2 text-[12px] text-blue-500 font-medium hover:underline">Forgot Current Password? Click here</a>
                 </div>

                 <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input type="password" placeholder="Enter password" className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                 </div>

                 <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-2">Re-enter Password</label>
                    <div className="relative mb-2">
                      <input type="password" placeholder="Enter password" className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
                 
                 <button className="w-full bg-[#3c9c64] text-white font-bold py-3 rounded-lg text-[14px] hover:bg-emerald-700 transition-colors shadow-sm mt-1">
                   Save Change
                 </button>
              </div>
            </div>

         </div>

         {/* Right Column */}
         <div className="w-full lg:w-[65%] bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-900 text-lg">Profile Update</h3>
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full overflow-hidden border-[2px] border-white ring-1 ring-gray-100 shadow-sm flex-shrink-0">
                 <img src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=200" alt="Wade Warren" className="w-full h-full object-cover" />
              </div>
              <button className="bg-[#3c9c64] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">Upload New</button>
              <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors">Delete</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" defaultValue="Wade" className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
               </div>
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" defaultValue="Warren" className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
               </div>
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input type="password" defaultValue="************" className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tracking-wider" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <EyeOff className="w-4 h-4" />
                    </button>
                  </div>
               </div>
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex bg-[#f8f9fa] border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <input type="text" defaultValue="(406) 555-0120" className="flex-1 px-4 py-3 bg-transparent text-[13px] font-bold text-gray-900 focus:outline-none" />
                    <button className="px-3 border-l border-gray-200 flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors">
                      <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 h-auto rounded-[2px]" />
                      <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
               </div>
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">E-mail</label>
                  <input type="email" defaultValue="wade.warren@example.com" className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
               </div>
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <input type="text" defaultValue="12- January- 1999" className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Location</label>
                  <input type="text" defaultValue="2972 Westheimer Rd. Santa Ana, Illinois 85486" className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
               </div>
               
               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Credit Card</label>
                  <div className="flex relative items-center bg-[#f8f9fa] border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <div className="pl-4 pr-2 flex items-center">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7" cy="12" r="6" fill="#EA001B"/>
                          <circle cx="17" cy="12" r="6" fill="#FFA200"/>
                          <path d="M12 16.5C10.744 15.352 10 13.768 10 12C10 10.232 10.744 8.648 12 7.5C13.256 8.648 14 10.232 14 12C14 13.768 13.256 15.352 12 16.5Z" fill="#FF5E00"/>
                       </svg>
                    </div>
                    <input type="text" defaultValue="843-4359-4444" className="flex-1 px-2 py-3.5 bg-transparent text-[13px] font-bold text-gray-900 focus:outline-none" />
                    <button className="pr-4 pl-2 h-full flex items-center justify-center border-l-transparent text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
               </div>

               <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Biography</label>
                  <div className="relative">
                     <textarea 
                       placeholder="Enter a biography about you" 
                       className="w-full px-4 py-4 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[120px] resize-none pb-12"
                     ></textarea>
                     <div className="absolute bottom-3 right-3 flex items-center gap-2 text-gray-400">
                       <button className="hover:text-emerald-600 transition-colors p-1"><PenTool className="w-4 h-4" /></button>
                       <button className="hover:text-emerald-600 transition-colors p-1"><Wand2 className="w-4 h-4" /></button>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
