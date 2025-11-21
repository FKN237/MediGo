
import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_REPORTS } from '../constants';
import * as d3 from 'd3';
import { AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';

const MOCK_TRENDS = [
  { name: 'Mon', searches: 400, stock: 240 },
  { name: 'Tue', searches: 300, stock: 220 },
  { name: 'Wed', searches: 550, stock: 180 },
  { name: 'Thu', searches: 450, stock: 190 },
  { name: 'Fri', searches: 700, stock: 150 },
  { name: 'Sat', searches: 800, stock: 100 },
  { name: 'Sun', searches: 600, stock: 200 },
];

// Mock data for Cameroon regions heat bubbles
const REGION_DATA = [
  { id: 'center', x: 150, y: 200, r: 40, label: 'Centre', severity: 0.2 },
  { id: 'littoral', x: 100, y: 220, r: 45, label: 'Littoral', severity: 0.8 }, // High shortage
  { id: 'west', x: 100, y: 160, r: 30, label: 'West', severity: 0.4 },
  { id: 'north', x: 200, y: 80, r: 35, label: 'North', severity: 0.6 },
];

const AdminDashboard: React.FC = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear previous

      const nodes = svg.selectAll("g")
        .data(REGION_DATA)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Circle representing region
      nodes.append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", (d) => d3.interpolateReds(d.severity))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", "#fff"); });

      // Label
      nodes.append("text")
        .text((d) => d.label)
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .style("pointer-events", "none");
    }
  }, []);

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-screen pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Public Health Insights</h2>
        <p className="text-sm text-slate-500">Real-time monitoring of drug availability.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase">Critical Stock-outs</h3>
          <p className="text-2xl font-bold text-red-600">12%</p>
          <span className="text-xs text-red-500">↑ 2% vs last week</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase">Active Pharmacies</h3>
          <p className="text-2xl font-bold text-emerald-600">512</p>
          <span className="text-xs text-emerald-500">All Certified</span>
        </div>
      </div>

      {/* Recharts Trend Line */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">Search Demand vs. Stock Level</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="searches" stroke="#0284c7" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="stock" stroke="#059669" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
           <MessageSquare className="w-5 h-5 text-slate-400" /> Recent User Reports
         </h3>
         <div className="space-y-3">
           {MOCK_REPORTS.map(report => (
             <div key={report.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    report.type === 'FAKE_DRUG' ? 'bg-red-100 text-red-600' : 
                    report.type === 'PRICE_MISMATCH' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {report.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">{report.date}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800">{report.pharmacyName}</h4>
                <p className="text-xs text-slate-500 mb-2">{report.description}</p>
                <div className="flex justify-end">
                   {report.status === 'OPEN' ? (
                     <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded">Resolve</button>
                   ) : (
                     <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Resolved</span>
                   )}
                </div>
             </div>
           ))}
         </div>
      </div>

      {/* D3 Map Container */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-2">Regional Heatmap</h3>
        <div className="flex justify-center">
          <svg ref={d3Container} width={300} height={300} className="overflow-visible" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
