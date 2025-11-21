
import React, { useState } from 'react';
import { Medication } from '../types';
import { 
  ArrowLeft, ShieldCheck, Activity, AlertTriangle, Clock, 
  Pill, Info, Flame, Snowflake, AlertOctagon, ChevronDown, ChevronUp, Factory, Stethoscope
} from 'lucide-react';

interface DrugDetailsProps {
  medication: Medication;
  onBack: () => void;
}

const DrugDetails: React.FC<DrugDetailsProps> = ({ medication, onBack }) => {
  const [activeSection, setActiveSection] = useState<string | null>('safety');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="bg-white min-h-full animate-fade-in pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-30 flex items-center p-4 gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="font-bold text-slate-900 text-lg truncate">{medication.name}</h2>
        {medication.requiresPrescription && (
          <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200">
            Rx ONLY
          </span>
        )}
      </div>
      
      {/* Medical Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-800">Doctor Consultation Required</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            This medication should only be taken under the supervision of a qualified healthcare practitioner. 
            Self-medication can be dangerous. Please visit a doctor for a proper diagnosis and prescription.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
               <h1 className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">{medication.name}</h1>
               <p className="text-lg text-slate-500 font-medium">{medication.genericName}</p>
            </div>
            <div className="bg-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[80px]">
                <Pill className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">{medication.dosage}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              {medication.category}
            </span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> FDA / ONP Approved
            </span>
          </div>
        </div>

        {/* Overview & Treats */}
        <div className="prose prose-slate max-w-none">
           <p className="text-slate-600 leading-relaxed text-base">
             {medication.description}
           </p>
           
           <div className="mt-4">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Primary Uses</h3>
             <div className="flex flex-wrap gap-2">
               {medication.treats.map((symptom, idx) => (
                 <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm font-medium flex items-center gap-2">
                   <Activity className="w-3 h-3 text-primary" /> {symptom}
                 </span>
               ))}
             </div>
           </div>
        </div>

        {/* --- SAFETY PROFILE (Collapsible) --- */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('safety')}
            className="w-full p-4 bg-slate-50 flex justify-between items-center border-b border-slate-100"
          >
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <AlertOctagon className="w-5 h-5 text-amber-500" /> Safety Profile
            </div>
            {activeSection === 'safety' ? <ChevronUp className="w-5 h-5 text-slate-400"/> : <ChevronDown className="w-5 h-5 text-slate-400"/>}
          </button>

          {activeSection === 'safety' && (
            <div className="p-5 space-y-6 bg-white animate-fade-in">
              {/* Warnings */}
              <div>
                <h4 className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-1">
                   <AlertTriangle className="w-3 h-3" /> Warnings & Contraindications
                </h4>
                <ul className="bg-red-50 rounded-xl p-4 space-y-2 border border-red-100">
                  {medication.warnings.map((warn, idx) => (
                    <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span> {warn}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Side Effects */}
              <div>
                 <h4 className="text-xs font-bold text-amber-600 uppercase mb-2">Common Side Effects</h4>
                 <div className="grid grid-cols-2 gap-2">
                    {medication.sideEffects.map((effect, idx) => (
                      <div key={idx} className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                         {effect}
                      </div>
                    ))}
                 </div>
              </div>

               {/* Interactions */}
               <div>
                 <h4 className="text-xs font-bold text-purple-600 uppercase mb-2">Drug Interactions</h4>
                 <ul className="space-y-1">
                    {medication.interactions.map((inter, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                         <div className="w-1 h-1 bg-purple-400 rounded-full"></div> {inter}
                      </li>
                    ))}
                 </ul>
              </div>
            </div>
          )}
        </div>

        {/* --- USAGE & STORAGE --- */}
        <div className="grid grid-cols-1 gap-4">
           <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Usage & Dosage
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                {medication.usage}
              </p>
           </div>

           <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-slate-400">
                 <Snowflake className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-900 text-sm mb-1">Storage Instructions</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">{medication.storage}</p>
              </div>
           </div>
        </div>

        {/* Manufacturer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Factory className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Manufacturer</p>
                    <p className="text-sm font-bold text-slate-800">{medication.manufacturer}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Avg. Price</p>
                <p className="text-lg font-bold text-emerald-600">{medication.price} <span className="text-xs font-normal text-slate-500">XAF</span></p>
            </div>
        </div>

        <div className="pt-4 pb-safe">
          <button onClick={onBack} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-transform active:scale-95 flex justify-center items-center gap-2">
             Find Pharmacies with Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrugDetails;
