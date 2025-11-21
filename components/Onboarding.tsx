
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, MapPin, Store, User, BrainCircuit } from 'lucide-react';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: (role: 'PATIENT' | 'PHARMACY') => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: <MapPin className="w-16 h-16 text-primary" />,
      title: "End the Search",
      desc: "38% of patients report stock-outs as a major concern. MediGo uses GPS to instantly locate available meds in Cameroon.",
    },
    {
      icon: <BrainCircuit className="w-16 h-16 text-secondary" />,
      title: "AI Prescription Reader",
      desc: "Can't read the doctor's handwriting? Upload a photo, and our AI will identify the drug and find it for you.",
    },
    {
      icon: <ShieldCheck className="w-16 h-16 text-accent" />,
      title: "Avoid Fake Drugs",
      desc: "With 27% of medicines being substandard in some regions, our Verification Scanner ensures you buy only authentic products.",
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-50 rounded-b-[4rem] -z-10"></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="pt-12 pb-6 flex justify-center">
        <Logo className="w-16 h-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {step < slides.length ? (
          <div className="animate-fade-in space-y-8 max-w-md">
            <div className="mx-auto w-32 h-32 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-center mb-8">
              {slides[step].icon}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              {slides[step].title}
            </h2>
            <p className="text-slate-500 leading-relaxed text-lg">
              {slides[step].desc}
            </p>

            <div className="flex justify-center gap-2 pt-8">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => setStep(step + 1)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 mt-8"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6 animate-slide-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Who are you?</h2>
              <p className="text-slate-500">Select your profile to continue.</p>
            </div>

            <button 
              onClick={() => onComplete('PATIENT')}
              className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group text-left flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient / Guest</h3>
                <p className="text-sm text-slate-400">I am searching for medication.</p>
              </div>
              <ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-primary" />
            </button>

            <button 
              onClick={() => onComplete('PHARMACY')}
              className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group text-left flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pharmacy Partner</h3>
                <p className="text-sm text-slate-400">I want to manage inventory.</p>
              </div>
              <ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-blue-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
