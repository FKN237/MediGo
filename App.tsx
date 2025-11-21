
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Map as MapIcon, ShieldCheck, Menu, 
  PlusCircle, Camera, Mic, Navigation, X, ChevronRight, Home, Activity,
  User, Bell, ArrowLeft, Clock, Phone, HeartPulse, Stethoscope, Pill, ExternalLink, Info, BookOpen, AlertTriangle, Lightbulb
} from 'lucide-react';
import { MEDICATIONS, PHARMACIES, calculateDistance, RESEARCH_STATS } from './constants';
import { Medication, Pharmacy, SearchResult, ViewState, StockStatus } from './types';
import PharmacyList from './components/PharmacyList';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PharmacyLogin from './components/PharmacyLogin';
import PharmacyDashboard from './components/PharmacyDashboard';
import DrugVerification from './components/DrugVerification';
import DrugDetails from './components/DrugDetails';
import Onboarding from './components/Onboarding';
import Catalogue from './components/Catalogue';
import AboutUs from './components/AboutUs';
import Logo from './components/Logo';
import { interpretSearchQuery, getAlternatives, analyzePrescriptionImage } from './services/geminiService';

const App: React.FC = () => {
  // Start with Onboarding
  const [currentView, setCurrentView] = useState<ViewState>('ONBOARDING');
  const [userRole, setUserRole] = useState<'PATIENT' | 'PHARMACY' | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dosageQuery, setDosageQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'info'|'alert'} | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedMedicationInfo, setSelectedMedicationInfo] = useState<Medication | null>(null);
  const [previousView, setPreviousView] = useState<ViewState>('HOME');
  const [showMedicalDisclaimer, setShowMedicalDisclaimer] = useState(true);
  const [researchStatIndex, setResearchStatIndex] = useState(0);
  
  // Authentication States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isPharmacyAuthenticated, setIsPharmacyAuthenticated] = useState(false);

  // Initialize Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error", error);
          // Default to Douala coordinates if location fails
          setUserLocation({ lat: 4.0511, lng: 9.7679 });
        }
      );
    }

    // Simulate a "Restock Alert" only if in App mode
    if (currentView === 'HOME') {
      const timer = setTimeout(() => {
          setNotification({ msg: "Restock Alert: 'Coartem' is now available nearby!", type: 'info' });
      }, 12000);

      // Rotate research stats
      const statTimer = setInterval(() => {
          setResearchStatIndex((prev) => (prev + 1) % RESEARCH_STATS.length);
      }, 5000);

      return () => { clearTimeout(timer); clearInterval(statTimer); }
    }
  }, [currentView]);

  const handleOnboardingComplete = (role: 'PATIENT' | 'PHARMACY') => {
    setUserRole(role);
    if (role === 'PATIENT') {
      setCurrentView('HOME');
    } else {
      setCurrentView('PHARMACY_LOGIN');
    }
  };

  const handleSearch = useCallback(async (query: string, dosage?: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    if (dosage) setDosageQuery(dosage);
    setAlternatives([]);
    setSelectedPharmacy(null);
    setSelectedMedicationInfo(null);

    // 1. Use Gemini to interpret the query
    const interpretation = await interpretSearchQuery(query);
    const targetName = interpretation?.medicationName || query;

    // 2. Filter Local Database
    let matchedMedication = MEDICATIONS.find(m => 
      m.name.toLowerCase().includes(targetName.toLowerCase()) || 
      m.category.toLowerCase().includes(targetName.toLowerCase())
    );

    // Try to find a more specific match if dosage is provided
    if (dosage && matchedMedication) {
      const exactMatch = MEDICATIONS.find(m => 
        (m.name.toLowerCase().includes(targetName.toLowerCase()) || m.genericName.toLowerCase().includes(targetName.toLowerCase())) &&
        m.dosage.toLowerCase().includes(dosage.toLowerCase())
      );
      if (exactMatch) matchedMedication = exactMatch;
    }

    if (!matchedMedication) {
      const alts = await getAlternatives(targetName);
      setAlternatives(alts);
      setSearchResults([]);
      setIsSearching(false);
      setCurrentView('SEARCH_RESULTS');
      return;
    }

    // Store matched medication for the "Info" view
    setSelectedMedicationInfo(matchedMedication);

    // 3. Find Pharmacies
    const results: SearchResult[] = PHARMACIES.map(pharmacy => {
      const stockItem = pharmacy.stock.find(s => s.medicationId === matchedMedication!.id);
      if (!stockItem) return null;

      const dist = userLocation 
        ? calculateDistance(userLocation.lat, userLocation.lng, pharmacy.location.lat, pharmacy.location.lng)
        : Math.floor(Math.random() * 10) + 1;

      return {
        pharmacy,
        medication: matchedMedication!,
        stock: stockItem,
        distance: dist
      };
    }).filter(Boolean) as SearchResult[];

    // Sort by Stock availability first, then distance
    results.sort((a, b) => {
        if (a.stock.status === StockStatus.IN_STOCK && b.stock.status !== StockStatus.IN_STOCK) return -1;
        if (a.stock.status !== StockStatus.IN_STOCK && b.stock.status === StockStatus.IN_STOCK) return 1;
        return a.distance - b.distance;
    });

    setSearchResults(results);
    setCurrentView('SEARCH_RESULTS');
    setIsSearching(false);
  }, [userLocation]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSearching(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        const medNames = await analyzePrescriptionImage(base64Data);
        if (medNames.length > 0) {
            setNotification({msg: `Found: ${medNames[0]}`, type: 'info'});
            handleSearch(medNames[0]);
        } else {
            setNotification({msg: "Could not interpret prescription.", type: 'alert'});
            setIsSearching(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 pb-safe pt-3 flex justify-between items-end text-[10px] font-medium text-slate-400 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">
        <button 
            className={`flex flex-col items-center gap-1.5 pb-2 ${currentView === 'HOME' ? 'text-primary' : 'hover:text-slate-600'}`} 
            onClick={() => setCurrentView('HOME')}
        >
            <Home className={`w-6 h-6 ${currentView === 'HOME' ? 'fill-primary/20' : ''}`} strokeWidth={2} />
            <span>Home</span>
        </button>
        
        <button 
            className={`flex flex-col items-center gap-1.5 pb-2 ${currentView === 'CATALOGUE' ? 'text-primary' : 'hover:text-slate-600'}`} 
            onClick={() => setCurrentView('CATALOGUE')}
        >
            <BookOpen className={`w-6 h-6 ${currentView === 'CATALOGUE' ? 'fill-primary/20' : ''}`} strokeWidth={2} />
            <span>Drugs</span>
        </button>

        {/* Floating Scan Button */}
        <button 
          className="relative -top-8 bg-slate-900 text-white p-4 rounded-2xl shadow-xl shadow-slate-900/40 transition-transform hover:scale-105 active:scale-95 group"
          onClick={() => document.getElementById('cameraInput')?.click()}
        >
            <div className="absolute inset-0 bg-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            <Camera className="w-7 h-7 relative z-10" />
        </button>
        
        <button 
            className={`flex flex-col items-center gap-1.5 pb-2 ${currentView === 'VERIFY_DRUG' ? 'text-primary' : 'hover:text-slate-600'}`} 
            onClick={() => setCurrentView('VERIFY_DRUG')}
        >
            <ShieldCheck className={`w-6 h-6 ${currentView === 'VERIFY_DRUG' ? 'fill-primary/20' : ''}`} strokeWidth={2} />
            <span>Verify</span>
        </button>
        
        <button 
            className={`flex flex-col items-center gap-1.5 pb-2 ${currentView === 'PROFILE' ? 'text-primary' : 'hover:text-slate-600'}`} 
            onClick={() => setCurrentView('PROFILE')}
        >
            <User className={`w-6 h-6 ${currentView === 'PROFILE' ? 'fill-primary/20' : ''}`} strokeWidth={2} />
            <span>Account</span>
        </button>
    </nav>
  );

  const handleAdminAccess = () => {
      if (isAdminAuthenticated) {
          setCurrentView('ADMIN_DASHBOARD');
      } else {
          setCurrentView('ADMIN_LOGIN');
      }
  };

  // ROUTING
  if (currentView === 'ONBOARDING') return <Onboarding onComplete={handleOnboardingComplete} />;
  if (currentView === 'ABOUT') return <AboutUs onBack={() => setCurrentView('PROFILE')} />;
  if (currentView === 'PHARMACY_LOGIN') return <PharmacyLogin onLogin={() => { setIsPharmacyAuthenticated(true); setCurrentView('PHARMACY_DASHBOARD'); }} onCancel={() => setCurrentView('ONBOARDING')} />;
  if (currentView === 'PHARMACY_DASHBOARD' && isPharmacyAuthenticated) return <PharmacyDashboard onLogout={() => setCurrentView('ONBOARDING')} />;
  if (currentView === 'ADMIN_LOGIN') return <AdminLogin onLogin={() => { setIsAdminAuthenticated(true); setCurrentView('ADMIN_DASHBOARD'); }} onCancel={() => setCurrentView('HOME')} />;
  if (currentView === 'ADMIN_DASHBOARD' && isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-white">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10">
                <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                <span className="font-bold text-slate-800">Partner Dashboard</span>
            </div>
            <AdminDashboard />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative selection:bg-primary/30">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-500">
          <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('HOME')}>
                  <Logo className="w-9 h-9" />
                  <div>
                      <h1 className="font-bold text-lg leading-none text-slate-900">MediGo</h1>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Cameroon</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <button className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
                      <Bell className="w-6 h-6" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <button 
                      onClick={handleAdminAccess}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                  >
                      ADMIN
                  </button>
              </div>
          </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 scroll-smooth">
        
        {notification && (
            <div className={`fixed top-20 left-4 right-4 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex justify-between items-center animate-bounce-in z-[60] ${notification.type === 'alert' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span className="text-sm font-medium">{notification.msg}</span>
                </div>
                <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100"><X className="w-5 h-5"/></button>
            </div>
        )}

        {currentView === 'HOME' && (
            <div className="p-5 space-y-8 animate-fade-in">
                {/* Global Advisory Note */}
                {showMedicalDisclaimer && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 relative">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 uppercase mb-1">Medical Disclaimer</h4>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        All medications listed require consultation with a licensed doctor. Do not self-medicate.
                      </p>
                    </div>
                    <button onClick={() => setShowMedicalDisclaimer(false)} className="absolute top-2 right-2 text-blue-400 hover:text-blue-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="relative py-2">
                    <h2 className="text-3xl font-bold text-slate-900 mb-1">Hello, Guest</h2>
                    <p className="text-slate-500 mb-6">Find your medication instantly.</p>
                    
                    <div className="relative group z-20 space-y-2">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        
                        {/* Search Inputs Container */}
                        <div className="relative bg-white rounded-2xl shadow-sm p-2 border border-slate-100 flex flex-col gap-2">
                             <div className="flex items-center">
                               <Search className="h-6 w-6 text-slate-400 ml-3 flex-shrink-0" />
                               <input
                                  type="text"
                                  className="w-full p-3 outline-none text-slate-900 placeholder:text-slate-400 font-medium bg-transparent"
                                  placeholder="Search drug (e.g. Amoxil)"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery, dosageQuery)}
                              />
                             </div>
                             
                             <div className="flex items-center border-t border-slate-100 pt-1">
                               <Activity className="h-5 w-5 text-slate-400 ml-3 flex-shrink-0" />
                               <input
                                  type="text"
                                  className="w-full p-2 outline-none text-slate-900 placeholder:text-slate-400 text-sm bg-transparent"
                                  placeholder="Dosage (e.g. 500mg) - Optional"
                                  value={dosageQuery}
                                  onChange={(e) => setDosageQuery(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery, dosageQuery)}
                               />
                               <div className="flex gap-1 pr-1">
                                  <button className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors"><Mic className="w-5 h-5" /></button>
                                  <label className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 cursor-pointer transition-colors">
                                      <Camera className="w-5 h-5" />
                                      <input type="file" id="cameraInput" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                  </label>
                               </div>
                             </div>
                        </div>
                        
                        <button 
                          onClick={() => handleSearch(searchQuery, dosageQuery)}
                          className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primaryDark transition-colors"
                        >
                          Find Medication
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                         <h3 className="font-bold text-slate-800 text-lg">Browse Categories</h3>
                         <span className="text-xs font-bold text-primary cursor-pointer" onClick={() => setCurrentView('CATALOGUE')}>See All</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleSearch('Antimalarial')} className="group p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="block font-bold text-slate-800">Malaria</span>
                        </button>
                        <button onClick={() => handleSearch('Antibiotic')} className="group p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Pill className="w-5 h-5" />
                            </div>
                            <span className="block font-bold text-slate-800">Antibiotics</span>
                        </button>
                        <button onClick={() => handleSearch('Pain Relief')} className="group p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                            <span className="block font-bold text-slate-800">Pain Relief</span>
                        </button>
                         <button onClick={() => handleSearch('First Aid')} className="group p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left">
                            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <span className="block font-bold text-slate-800">First Aid</span>
                        </button>
                    </div>
                </div>

                {/* Health Insight Card (Research Stats) */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 rounded-bl-full -mr-2 -mt-2"></div>
                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0 z-10">
                        <Lightbulb className="w-5 h-5" />
                    </div>
                    <div className="z-10">
                       <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Health Insight</h4>
                       <p className="text-slate-800 font-bold text-sm leading-relaxed">
                         Did you know? <span className="text-primary">{RESEARCH_STATS[researchStatIndex].value}</span> {RESEARCH_STATS[researchStatIndex].label}
                       </p>
                    </div>
                </div>

                {/* Verify Banner */}
                <div onClick={() => setCurrentView('VERIFY_DRUG')} className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 shadow-xl cursor-pointer group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary to-emerald-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                     <div className="relative z-10 flex items-center justify-between">
                         <div>
                             <h3 className="text-white font-bold text-lg mb-1">Verify Authenticity</h3>
                             <p className="text-slate-400 text-xs mb-4 max-w-[180px]">Scan barcode to detect counterfeit drugs instantly.</p>
                             <div className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                 <Camera className="w-3 h-3" /> Open Scanner
                             </div>
                         </div>
                         <ShieldCheck className="w-16 h-16 text-emerald-500 opacity-80" />
                     </div>
                </div>
            </div>
        )}

        {currentView === 'CATALOGUE' && (
          <Catalogue onSelect={(med) => {
             setSelectedMedicationInfo(med);
             setPreviousView('CATALOGUE');
             setCurrentView('DRUG_DETAILS');
          }} />
        )}

        {currentView === 'SEARCH_RESULTS' && (
            <div className="flex flex-col h-full animate-fade-in">
                <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
                     <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                         <ArrowLeft className="w-5 h-5 text-slate-600" />
                     </button>
                     <h3 className="text-sm font-bold text-slate-800">Results</h3>
                     <div className="w-9"></div>
                </div>

                <div className="p-4">
                    {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-medium animate-pulse">Searching pharmacy network...</p>
                        </div>
                    ) : (
                        <>
                            {searchResults.length > 0 && selectedMedicationInfo && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{searchResults[0].medication.name}</h2>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span>{searchResults[0].medication.dosage}</span>
                                                <span>•</span>
                                                <span>{searchResults[0].medication.genericName}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                              setPreviousView('SEARCH_RESULTS');
                                              setCurrentView('DRUG_DETAILS');
                                            }}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                            title="View Drug Info"
                                        >
                                            <Info className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Available at {searchResults.length} locations near you.
                                    </div>
                                </div>
                            )}

                            {alternatives.length > 0 && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-4 h-4 text-amber-600" />
                                        <h4 className="text-amber-800 font-bold text-sm">Direct Match Unavailable</h4>
                                    </div>
                                    <p className="text-xs text-amber-700 mb-3">Found generic alternatives for "{searchQuery}":</p>
                                    <div className="flex flex-wrap gap-2">
                                        {alternatives.map((alt, i) => (
                                            <button key={i} onClick={() => handleSearch(alt)} className="bg-white text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg border border-amber-200 hover:border-amber-400 transition-colors">
                                                {alt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <PharmacyList 
                              results={searchResults} 
                              onSelect={(p) => setSelectedPharmacy(p)} 
                            />
                        </>
                    )}
                </div>
            </div>
        )}

        {/* --- VIEW: DRUG DETAILS --- */}
        {currentView === 'DRUG_DETAILS' && selectedMedicationInfo && (
          <DrugDetails 
            medication={selectedMedicationInfo} 
            onBack={() => setCurrentView(previousView)} 
          />
        )}

        {currentView === 'VERIFY_DRUG' && <DrugVerification />}

        {currentView === 'PROFILE' && (
            <div className="p-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">👤</div>
                    <h2 className="font-bold text-xl text-slate-900">Guest Account</h2>
                    <p className="text-slate-400 text-sm">Douala, Cameroon</p>
                </div>
                
                <div className="space-y-2">
                    <button className="w-full bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4"/></div>
                            <span className="text-sm font-medium text-slate-700">History</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <button 
                        onClick={() => setCurrentView('ABOUT')}
                        className="w-full bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center"><Info className="w-4 h-4"/></div>
                            <span className="text-sm font-medium text-slate-700">About MediGo</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <button 
                        onClick={() => setCurrentView('ONBOARDING')}
                        className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100 text-red-500"
                    >
                        <span className="text-sm font-medium">Sign Out / Switch Role</span>
                    </button>
                </div>
            </div>
        )}

      </main>

      {(currentView === 'HOME' || currentView === 'SEARCH_RESULTS' || currentView === 'VERIFY_DRUG' || currentView === 'PROFILE' || currentView === 'CATALOGUE') && renderBottomNav()}

      {selectedPharmacy && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={() => setSelectedPharmacy(null)}>
              <div className="bg-white w-full max-w-md rounded-3xl p-6 animate-slide-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6"></div>
                  
                  <div className="flex justify-between items-start mb-1">
                      <h2 className="text-xl font-bold text-slate-900">{selectedPharmacy.name}</h2>
                      {selectedPharmacy.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                  </div>
                  <p className="text-slate-500 text-sm mb-6 flex items-center gap-1"><MapIcon className="w-3 h-3"/> {selectedPharmacy.address}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="bg-slate-50 p-3 rounded-2xl text-center">
                          <Clock className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <p className={`text-xs font-bold ${selectedPharmacy.isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                              {selectedPharmacy.isOpen ? 'Open' : 'Closed'}
                          </p>
                      </div>
                      <a href={`tel:${selectedPharmacy.phone}`} className="bg-slate-50 p-3 rounded-2xl text-center hover:bg-slate-100">
                          <Phone className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <p className="text-xs font-bold text-slate-700">Call</p>
                      </a>
                      <div className="bg-slate-50 p-3 rounded-2xl text-center">
                          <Navigation className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <p className="text-xs font-bold text-slate-700">~2.4km</p>
                      </div>
                  </div>
                  
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Inventory Status</h3>
                  <div className="space-y-3 mb-6">
                      {selectedPharmacy.stock.map(s => {
                          const med = MEDICATIONS.find(m => m.id === s.medicationId);
                          return (
                              <div key={s.medicationId} className="flex justify-between items-center p-3 rounded-xl border border-slate-100">
                                  <div>
                                    <p className="font-bold text-sm text-slate-800">{med?.name}</p>
                                    <p className="text-xs text-slate-400">{med?.dosage} • {med?.category}</p>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                      s.status === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-700' : 
                                      s.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                      {s.status.replace('_', ' ')}
                                  </div>
                              </div>
                          )
                      })}
                  </div>

                  <button 
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 flex justify-center items-center gap-2 shadow-xl shadow-slate-900/20"
                    onClick={() => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPharmacy.name + ' ' + selectedPharmacy.address)}`;
                        window.open(url, '_blank');
                    }}
                  >
                      <Navigation className="w-5 h-5" /> Navigate with Google Maps
                  </button>
              </div>
          </div>
      )}

      <style>{`
        .pb-safe { padding-bottom: max(20px, env(safe-area-inset-bottom)); }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes bounceIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
