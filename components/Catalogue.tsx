
import React, { useState } from 'react';
import { Search, Filter, ChevronRight, Pill, Activity, Stethoscope, HeartPulse } from 'lucide-react';
import { MEDICATIONS } from '../constants';
import { Medication } from '../types';

interface CatalogueProps {
  onSelect: (medication: Medication) => void;
}

const Catalogue: React.FC<CatalogueProps> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(MEDICATIONS.map(m => m.category)))];

  const filteredMeds = MEDICATIONS.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) || 
                          med.genericName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || med.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-full animate-fade-in pb-32">
      <div className="bg-white sticky top-0 z-20 border-b border-slate-100 px-5 py-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Drug Catalogue</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search medications..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3">
        {filteredMeds.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No medications found.</p>
          </div>
        ) : (
          filteredMeds.map(med => (
            <button
              key={med.id}
              onClick={() => onSelect(med)}
              className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-primary/30 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    med.category === 'Antimalarial' ? 'bg-emerald-50 text-emerald-600' :
                    med.category === 'Antibiotic' ? 'bg-blue-50 text-blue-600' :
                    med.category === 'Analgesic' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-600'
                }`}>
                    {med.category === 'Antimalarial' ? <Activity className="w-6 h-6"/> :
                     med.category === 'Antibiotic' ? <Pill className="w-6 h-6"/> :
                     med.category === 'Analgesic' ? <HeartPulse className="w-6 h-6"/> :
                     <Stethoscope className="w-6 h-6"/>}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{med.name}</h3>
                  <p className="text-xs text-slate-500">{med.genericName} • {med.dosage}</p>
                  <p className="text-xs font-bold text-primary mt-1">
                    ~ {med.price} XAF
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
            </button>
          ))
        )}
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Catalogue;
