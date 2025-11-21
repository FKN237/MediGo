
import React from 'react';
import { Pharmacy, SearchResult, StockStatus } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  results: SearchResult[];
  onSelectPharmacy: (p: Pharmacy) => void;
}

// A simulated map view for the demo since we don't have a real Google Maps Key with billing
const MapView: React.FC<MapViewProps> = ({ results, onSelectPharmacy }) => {
  
  // Generate fake relative positions for the demo to scatter pins on the screen
  // In a real app, these would be projected from lat/lng to pixels
  const getPosition = (index: number, total: number) => {
    const seed = index * 137; // Deterministic chaos
    const top = 20 + (seed % 60); 
    const left = 15 + ((seed * 7) % 70);
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="relative w-full h-[calc(100vh-180px)] bg-slate-200 overflow-hidden rounded-xl shadow-inner border border-slate-300">
      {/* Fake Map Background Elements */}
      <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-0 w-full h-4 bg-white transform -rotate-6"></div>
          <div className="absolute top-[60%] left-0 w-full h-6 bg-white transform rotate-12"></div>
          <div className="absolute top-0 left-[40%] w-6 h-full bg-white"></div>
          <div className="absolute top-0 left-[70%] w-4 h-full bg-white"></div>
          <div className="absolute top-[40%] left-[50%] w-24 h-24 bg-green-100 rounded-full mix-blend-multiply"></div>
      </div>

      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-md z-10">
          <p className="text-xs font-bold text-slate-500">Douala, Cameroon</p>
      </div>

      {/* Pins */}
      {results.map((result, idx) => {
        const pos = getPosition(idx, results.length);
        const isStocked = result.stock.status === StockStatus.IN_STOCK;
        
        return (
          <div 
            key={result.pharmacy.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group transition-all hover:z-50"
            style={{ top: pos.top, left: pos.left }}
            onClick={() => onSelectPharmacy(result.pharmacy)}
          >
            {/* Tooltip on Hover */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-white p-2 rounded shadow-lg text-center z-50">
                <p className="font-bold text-xs truncate">{result.pharmacy.name}</p>
                <p className={`text-[10px] font-bold ${isStocked ? 'text-green-600' : 'text-red-500'}`}>
                    {isStocked ? 'In Stock' : 'Out of Stock'}
                </p>
            </div>

            {/* Pin Icon */}
            <div className={`relative ${isStocked ? 'text-primary' : 'text-red-500'} hover:scale-125 transition-transform`}>
              <MapPin className="w-10 h-10 fill-current stroke-white stroke-2 drop-shadow-md" />
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 bg-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-800">
                  {idx + 1}
              </div>
            </div>
          </div>
        );
      })}

      {/* User Location */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="w-12 h-12 bg-blue-500 rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      </div>

      <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-primary" onClick={() => alert("Centering on your location...")}>
          <Navigation className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MapView;
