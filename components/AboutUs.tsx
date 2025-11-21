
import React from 'react';
import { TEAM_MEMBERS, FUTURE_ROADMAP, RESEARCH_STATS } from '../constants';
import Logo from './Logo';
import { ArrowLeft, Lightbulb, User, Rocket, Quote } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="bg-white min-h-full animate-fade-in pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-30 flex items-center p-4 gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="font-bold text-slate-900 text-lg">About MediGo</h2>
      </div>

      <div className="p-6 space-y-10">
        
        {/* Mission Statement */}
        <div className="text-center space-y-4">
           <Logo className="w-16 h-16 mx-auto" />
           <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
             Improving Healthcare Access in Cameroon
           </h1>
           <p className="text-slate-500 leading-relaxed">
             MediGo bridges the critical gap in medicine availability. We combine AI, GPS, and Certification to save lives during emergencies.
           </p>
        </div>

        {/* The "Why" - Research Data */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
           <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Quote className="w-5 h-5 text-primary" /> The Reality
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {RESEARCH_STATS.map((stat, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="text-2xl font-black text-slate-800 w-20 text-right">{stat.value}</div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Team Section */}
        <div>
           <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-500" /> The Team
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {TEAM_MEMBERS.map((member, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                       {member.image}
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900">{member.name}</h4>
                       <p className="text-sm text-primary font-medium">{member.role}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Roadmap */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
           
           <h3 className="font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
              <Rocket className="w-6 h-6 text-yellow-400" /> Future Roadmap
           </h3>
           
           <div className="space-y-6 relative z-10">
              {FUTURE_ROADMAP.map((item, idx) => (
                 <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                       {idx !== FUTURE_ROADMAP.length - 1 && <div className="w-px h-full bg-slate-700 my-1"></div>}
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-blue-200">{item.title}</h4>
                       <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
