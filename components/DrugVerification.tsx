
import React, { useState, useRef, useEffect } from 'react';
import { Scan, CheckCircle, XCircle, RefreshCw, Flashlight, Info, Camera, AlertTriangle } from 'lucide-react';
import Logo from './Logo';
import { identifyMedicineFromImage } from '../services/geminiService';
import { MEDICATIONS } from '../constants';

const DrugVerification: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<'none' | 'authentic' | 'fake'>('none');
  const [detectedDrug, setDetectedDrug] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanning(true);
    setAnalyzing(true);
    setResult('none');

    // Capture Frame
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
      
      const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

      // Send to Gemini
      const analysis = await identifyMedicineFromImage(base64Image);
      
      setAnalyzing(false);
      setScanning(false);
      setDetectedDrug(analysis.detectedName);

      // Validate against Database
      if (analysis.detectedName === 'Unknown') {
        setResult('fake'); // Couldn't read it
      } else {
        // Check if the detected name loosely matches anything in our database
        const isValid = MEDICATIONS.some(m => 
          m.name.toLowerCase().includes(analysis.detectedName.toLowerCase()) || 
          analysis.detectedName.toLowerCase().includes(m.name.toLowerCase())
        );
        setResult(isValid ? 'authentic' : 'fake');
      }
    }
  };

  const resetScan = () => {
    setResult('none');
    setDetectedDrug('');
    startCamera(); // Restart stream if it paused
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" light={true} />
              <span className="font-bold tracking-wide">MediCheck™</span>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-white/10 rounded-full backdrop-blur-md"
          >
             <Info className="w-5 h-5 text-white" />
          </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-black">
          
          {/* Camera Feed */}
          {result === 'none' && (
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               className="absolute inset-0 w-full h-full object-cover opacity-80"
             />
          )}

          {/* Scan Overlay UI */}
          {result === 'none' && (
            <div className="relative z-10 flex flex-col items-center">
                {/* Scan Box */}
                <div className="w-72 h-72 border-2 border-white/30 rounded-[2rem] relative overflow-hidden backdrop-blur-[2px]">
                    <div className="absolute inset-0 border-2 border-white/50 rounded-[2rem]"></div>
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                    
                    {/* Scanning Laser */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] animate-scan-laser"></div>
                </div>
                
                <p className="mt-6 text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                    {analyzing ? 'Analyzing packaging...' : 'Align medicine box within frame'}
                </p>

                {/* Capture Button */}
                <button 
                   onClick={handleScan}
                   disabled={analyzing}
                   className="mt-8 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-transform active:scale-90"
                >
                   <div className="w-16 h-16 border-4 border-slate-900 rounded-full"></div>
                </button>
            </div>
          )}

          {/* --- RESULTS UI --- */}

          {/* AUTHENTIC RESULT */}
          {result === 'authentic' && (
            <div className="relative z-30 w-full max-w-sm bg-white rounded-3xl p-8 text-center text-slate-900 animate-scale-up shadow-2xl mx-4">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-emerald-700 mb-1 uppercase tracking-tight">Authentic</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Verified against MediGo Registry</p>
                
                <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mb-6 border border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Detected</span>
                        <span className="font-bold text-lg text-slate-900">{detectedDrug}</span>
                    </div>
                    <div className="h-px bg-slate-200"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                        <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-100">CERTIFIED GENUINE</span>
                    </div>
                </div>

                <button onClick={resetScan} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Scan Another
                </button>
            </div>
          )}

          {/* FAKE RESULT */}
          {result === 'fake' && (
            <div className="relative z-30 w-full max-w-sm bg-white rounded-3xl p-8 text-center text-slate-900 animate-scale-up shadow-2xl mx-4 border-t-8 border-red-500">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-red-600 mb-1 uppercase tracking-tight">Warning</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Product not found in certified database.</p>
                
                <div className="bg-red-50 rounded-xl p-5 text-left mb-6 border border-red-100">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-red-800 uppercase mb-1">Risk of Counterfeit</p>
                            <p className="text-xs text-red-700 leading-relaxed">
                                The scanned item "{detectedDrug || 'Unknown'}" does not match any record from our partner pharmacies. Do not consume.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors">
                        Report
                    </button>
                    <button onClick={resetScan} className="py-4 bg-slate-100 text-slate-800 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                        Close
                    </button>
                </div>
            </div>
          )}

      </div>
      
      {/* Info Modal */}
      {showInfo && (
         <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowInfo(false)}>
             <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl text-center">
                 <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                     <Info className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Why Scan?</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Up to <span className="text-white font-bold">27%</span> of medicines in Cameroon are substandard. Our AI cross-references packaging with verified manufacturer data to keep you safe.
                 </p>
                 <button className="text-blue-400 font-bold text-sm">Tap to close</button>
             </div>
         </div>
      )}

      <style>{`
        @keyframes scan-laser {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
        }
        .animate-scan-laser {
            animation: scan-laser 2s linear infinite;
        }
        .animate-scale-up {
            animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scaleUp {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
             animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes bounceIn {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DrugVerification;
