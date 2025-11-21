
import React from 'react';
import { Pharmacy, SearchResult, StockStatus } from '../types';
import { MapPin, Phone, Clock, Navigation, AlertTriangle, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface PharmacyListProps {
  results: SearchResult[];
  onSelect: (pharmacy: Pharmacy) => void;
}

const PharmacyList: React.FC<PharmacyListProps> = ({ results, onSelect }) => {
  
  const openGoogleMaps = (e: React.MouseEvent, p: Pharmacy) => {
    e.stopPropagation();
    e.preventDefault();
    // Construct Google Maps URL
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.address)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-slate-400 mt-10">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-lg font-semibold text-slate-600">No results found</p>
        <p className="text-sm max-w-xs mt-1">We couldn't find pharmacies with this stock nearby.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-32">
      {results.map((result) => {
        const isAvailable = result.stock.status === StockStatus.IN_STOCK;
        
        return (
          <div
            key={result.pharmacy.id}
            onClick={() => onSelect(result.pharmacy)}
            className={`relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all active:scale-[0.98] cursor-pointer hover:shadow-md group ${
              !isAvailable ? 'opacity-75 grayscale-[0.5]' : ''
            }`}
          >
            {/* Verified Badge Top Right */}
            {result.pharmacy.isVerified && (
                <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-600 px-3 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> OFFICIAL PARTNER
                </div>
            )}

            <div className="p-5">
              <div className="flex justify-between items-start mb-3 mt-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight pr-2">{result.pharmacy.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {result.pharmacy.address}
                  </p>
                </div>
              </div>

              {/* Stock Info Row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <StockBadge status={result.stock.status} />
                  <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {result.stock.lastUpdated}
                  </div>
                  {result.stock.price && (
                      <>
                        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                         <div className="text-sm font-bold text-slate-800">
                            {result.stock.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">XAF</span>
                         </div>
                      </>
                  )}
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 flex flex-col">
                      <span>DISTANCE</span>
                      <span className="text-slate-800 text-sm">{result.distance} km</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                        className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${result.pharmacy.phone}`) }}
                    >
                        <Phone className="w-4 h-4" />
                    </button>
                    <button
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
                      onClick={(e) => openGoogleMaps(e, result.pharmacy)}
                    >
                      <Navigation className="w-3 h-3" /> Directions
                    </button>
                  </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StockBadge: React.FC<{ status: StockStatus }> = ({ status }) => {
  switch (status) {
    case StockStatus.IN_STOCK:
      return (
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Available</span>
        </div>
      );
    case StockStatus.LOW_STOCK:
      return (
        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Low Stock</span>
        </div>
      );
    case StockStatus.OUT_OF_STOCK:
      return (
        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Out of Stock</span>
        </div>
      );
    default:
      return null;
  }
};

export default PharmacyList;
