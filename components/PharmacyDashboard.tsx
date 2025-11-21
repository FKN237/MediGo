
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, BarChart2, Bell, Settings, LogOut, 
  TrendingUp, AlertCircle, DollarSign, Search, Plus, Edit, HelpCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MEDICATIONS, MOCK_ORDERS } from '../constants';
import Logo from './Logo';

// Mock Sales Data
const SALES_DATA = [
  { day: 'Mon', sales: 120000 },
  { day: 'Tue', sales: 150000 },
  { day: 'Wed', sales: 180000 },
  { day: 'Thu', sales: 140000 },
  { day: 'Fri', sales: 200000 },
  { day: 'Sat', sales: 250000 },
  { day: 'Sun', sales: 190000 },
];

interface PharmacyDashboardProps {
  onLogout: () => void;
}

const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INVENTORY' | 'ORDERS' | 'HELP'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  // --- SIDEBAR ---
  const SidebarItem = ({ icon, label, id }: { icon: any, label: string, id: string }) => (
    <button 
      onClick={() => setActiveTab(id as any)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 ${
        activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-lg text-slate-900">MediGo Partner</span>
        </div>

        <nav className="flex-1 px-4">
          <SidebarItem id="OVERVIEW" label="Overview" icon={<LayoutDashboard className="w-5 h-5"/>} />
          <SidebarItem id="INVENTORY" label="Inventory" icon={<Package className="w-5 h-5"/>} />
          <SidebarItem id="ORDERS" label="Orders" icon={<ShoppingBag className="w-5 h-5"/>} />
          <SidebarItem id="HELP" label="Help & Support" icon={<HelpCircle className="w-5 h-5"/>} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-100 p-4 flex justify-between items-center md:hidden sticky top-0 z-20">
           <div className="flex items-center gap-2">
             <Logo className="w-8 h-8" />
             <span className="font-bold text-slate-900">Partner</span>
           </div>
           <button onClick={onLogout}><LogOut className="w-5 h-5 text-slate-500"/></button>
        </header>
        
        {/* Mobile Nav Tabs */}
        <div className="md:hidden bg-white border-b border-slate-100 flex justify-around p-2 overflow-x-auto">
             <button onClick={() => setActiveTab('OVERVIEW')} className={`p-2 text-xs font-bold ${activeTab==='OVERVIEW' ? 'text-blue-600' : 'text-slate-400'}`}>Overview</button>
             <button onClick={() => setActiveTab('INVENTORY')} className={`p-2 text-xs font-bold ${activeTab==='INVENTORY' ? 'text-blue-600' : 'text-slate-400'}`}>Inventory</button>
             <button onClick={() => setActiveTab('ORDERS')} className={`p-2 text-xs font-bold ${activeTab==='ORDERS' ? 'text-blue-600' : 'text-slate-400'}`}>Orders</button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          
          {/* --- TAB: OVERVIEW --- */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, Pharmacie Deido.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-6 h-6"/></div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12%</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Total Revenue</span>
                  <span className="text-3xl font-bold text-slate-900">1.2M <span className="text-sm text-slate-400 font-normal">XAF</span></span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-6 h-6"/></div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">3 New</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Active Orders</span>
                  <span className="text-3xl font-bold text-slate-900">24</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="w-6 h-6"/></div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Urgent</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Low Stock Alerts</span>
                  <span className="text-3xl font-bold text-slate-900">5</span>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Sales Overview</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: INVENTORY --- */}
          {activeTab === 'INVENTORY' && (
            <div className="space-y-6 animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <div>
                   <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
                   <p className="text-slate-500">Manage your stock levels and prices.</p>
                 </div>
                 <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                   <Plus className="w-4 h-4" /> Add Medicine
                 </button>
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                 <div className="p-4 border-b border-slate-100 flex gap-2">
                   <div className="relative flex-1">
                     <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                     <input 
                      type="text" 
                      placeholder="Search inventory..." 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-blue-500 transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                     />
                   </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">Category</th>
                          <th className="p-4 font-medium">Stock Level</th>
                          <th className="p-4 font-medium">Price (XAF)</th>
                          <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MEDICATIONS.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((med) => (
                          <tr key={med.id} className="hover:bg-slate-50 group">
                            <td className="p-4 font-bold text-slate-900">{med.name}</td>
                            <td className="p-4 text-slate-500">{med.category}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                145 Units
                              </span>
                            </td>
                            <td className="p-4 font-mono text-slate-600">{med.price}</td>
                            <td className="p-4 text-right">
                              <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
            </div>
          )}

          {/* --- TAB: ORDERS --- */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-6 animate-fade-in">
               <div>
                 <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                 <p className="text-slate-500">Track customer reservations and deliveries.</p>
               </div>

               <div className="grid gap-4">
                 {MOCK_ORDERS.map((order) => (
                   <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <span className="font-bold text-lg text-slate-900">{order.id}</span>
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                             order.status === 'READY' ? 'bg-emerald-100 text-emerald-700' :
                             order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                           }`}>
                             {order.status}
                           </span>
                         </div>
                         <p className="text-sm text-slate-500 font-medium mb-1">{order.customerName} • {order.time}</p>
                         <p className="text-sm text-slate-800">{order.items.join(', ')}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="text-right">
                           <span className="block text-xs text-slate-400 uppercase font-bold">Total</span>
                           <span className="font-bold text-xl">{order.total} XAF</span>
                         </div>
                         <div className="flex gap-2">
                           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Details</button>
                           <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">Process</button>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* --- TAB: HELP --- */}
           {activeTab === 'HELP' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
               <div>
                 <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>
                 <p className="text-slate-500">Guides and tutorials for MediGo Partners.</p>
               </div>

               <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                 <h3 className="font-bold text-lg mb-4">Quick Start Guide</h3>
                 <ul className="space-y-4">
                   <li className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                     <div>
                       <h4 className="font-bold text-slate-800">Update Stock Daily</h4>
                       <p className="text-sm text-slate-500">Ensure your inventory is accurate to appear in top search results.</p>
                     </div>
                   </li>
                   <li className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                     <div>
                       <h4 className="font-bold text-slate-800">Process Orders Fast</h4>
                       <p className="text-sm text-slate-500">Confirm reservations within 5 minutes to improve your pharmacy rating.</p>
                     </div>
                   </li>
                    <li className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                     <div>
                       <h4 className="font-bold text-slate-800">Use AI Forecasting</h4>
                       <p className="text-sm text-slate-500">Check the 'Overview' tab for AI-predicted high demand drugs.</p>
                     </div>
                   </li>
                 </ul>
               </div>
            </div>
           )}

        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
