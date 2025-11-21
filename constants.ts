
import { Medication, Pharmacy, StockStatus, PharmacyStock, Order, Report } from './types';

// --- APP INFO FROM PDF ---
export const TEAM_MEMBERS = [
  { name: 'Nelson Fodjo', role: 'Software Developer', image: '👨🏿‍💻' },
  { name: 'Tinkouree Shania', role: 'Researcher', image: '👩🏾‍🔬' },
  { name: 'Fatine Icyimpaye', role: 'Project Manager', image: '👩🏾‍💼' }
];

export const RESEARCH_STATS = [
  { value: '38%', label: 'of patients report drug stock-outs as a major concern.' },
  { value: '49.2%', label: 'Availability of cardiovascular meds in SW Region.' },
  { value: '64%', label: 'of facility users cite long waiting times.' },
  { value: '27%', label: 'of medicines in circulation are substandard/falsified.' }
];

export const FUTURE_ROADMAP = [
  { title: 'Medical Metrics Gadget', desc: 'Hardware to measure vital health metrics via smartphones.' },
  { title: 'AI Education', desc: 'Multilingual programs with personalized learning paths.' },
  { title: 'Holistic Monitoring', desc: 'Expansion toward complete health user empowerment.' }
];

export const MEDICATIONS: Medication[] = [
  { 
    id: 'm1', 
    name: 'Coartem', 
    genericName: 'Artemether/Lumefantrine',
    dosage: '80/480mg',
    category: 'Antimalarial', 
    price: 2500, 
    currency: 'XAF', 
    requiresPrescription: false, 
    description: 'Coartem is a fixed-dose combination therapy widely used for the treatment of acute uncomplicated malaria caused by Plasmodium falciparum. It is effective against multi-drug resistant strains.',
    treats: ['Malaria', 'Fever', 'Chills', 'Headache', 'Muscle Pain'],
    sideEffects: ['Headache', 'Dizziness', 'Loss of appetite', 'Palpitations', 'Weakness'],
    usage: 'Take with food or milk/fatty drink for best absorption. Complete the full 3-day course (6 doses).',
    warnings: ['Do not take during the first trimester of pregnancy unless prescribed.', 'Avoid if you have a history of heart rhythm problems (QT prolongation).'],
    interactions: ['Grapefruit juice (increases absorption)', 'Certain antidepressants', 'Other antimalarials (Halofantrine)'],
    storage: 'Store below 30°C in a dry place protected from light.',
    manufacturer: 'Novartis / MediPharma Global'
  },
  { 
    id: 'm2', 
    name: 'Amoxil', 
    genericName: 'Amoxicillin',
    dosage: '500mg',
    category: 'Antibiotic', 
    price: 1500, 
    currency: 'XAF', 
    requiresPrescription: true, 
    description: 'Amoxil is a broad-spectrum penicillin antibiotic used to treat a wide variety of bacterial infections by stopping the growth of bacteria.',
    treats: ['Respiratory infections', 'Ear infections', 'Urinary tract infections', 'Skin infections'],
    sideEffects: ['Nausea', 'Rash', 'Diarrhea', 'Vomiting'],
    usage: 'Take every 8 hours. Complete the full course even if symptoms disappear.',
    warnings: ['Do not use if allergic to penicillin or cephalosporins.', 'May reduce effectiveness of oral contraceptives.'],
    interactions: ['Allopurinol (increases rash risk)', 'Blood thinners (Warfarin)', 'Oral birth control pills'],
    storage: 'Store at room temperature away from moisture and heat.',
    manufacturer: 'GSK / Local Generics'
  },
  { 
    id: 'm3', 
    name: 'Doliprane', 
    genericName: 'Paracetamol',
    dosage: '1000mg',
    category: 'Analgesic', 
    price: 500, 
    currency: 'XAF', 
    requiresPrescription: false, 
    description: 'Doliprane 1000mg is a high-strength analgesic and antipyretic used for the relief of moderate to severe pain and fever.',
    treats: ['Headache', 'Fever', 'Body aches', 'Flu symptoms', 'Toothache'],
    sideEffects: ['Nausea (rare)', 'Liver damage (high dose)', 'Skin rash'],
    usage: 'Take 1 tablet every 6-8 hours. Do not exceed 4g (4 tablets) daily.',
    warnings: ['Overdose can cause severe liver failure.', 'Do not combine with other paracetamol-containing products.', 'Avoid alcohol while taking this medication.'],
    interactions: ['Warfarin (blood thinner)', 'Alcohol', 'Isoniazid'],
    storage: 'Store below 25°C.',
    manufacturer: 'Sanofi'
  },
  { 
    id: 'm3b', 
    name: 'Doliprane', 
    genericName: 'Paracetamol',
    dosage: '500mg',
    category: 'Analgesic', 
    price: 300, 
    currency: 'XAF', 
    requiresPrescription: false, 
    description: 'Common pain reliever and a fever reducer suitable for mild pain.',
    treats: ['Headache', 'Fever', 'Mild pain'],
    sideEffects: ['Nausea (rare)'],
    usage: 'Take 1-2 tablets every 4-6 hours.',
    warnings: ['Do not exceed recommended dose.'],
    interactions: ['Alcohol'],
    storage: 'Store below 25°C.',
    manufacturer: 'Sanofi'
  },
  { 
    id: 'm4', 
    name: 'Lantus', 
    genericName: 'Insulin Glargine',
    dosage: '100IU/ml',
    category: 'Diabetes', 
    price: 12000, 
    currency: 'XAF', 
    requiresPrescription: true, 
    description: 'Lantus is a long-acting basal insulin analogue used to control high blood sugar in adults and children with diabetes mellitus.',
    treats: ['High blood sugar', 'Type 1 Diabetes', 'Type 2 Diabetes'],
    sideEffects: ['Hypoglycemia (low blood sugar)', 'Weight gain', 'Injection site reaction', 'Swelling'],
    usage: 'Inject subcutaneously once daily at the same time each day. Rotate injection sites.',
    warnings: ['Monitor blood sugar regularly.', 'Do not mix with other insulins in the same syringe.'],
    interactions: ['Beta-blockers (may mask hypoglycemia)', 'Steroids', 'Diuretics'],
    storage: 'Keep refrigerated (2°C-8°C). Once opened, can be kept at room temp for 28 days.',
    manufacturer: 'Sanofi'
  },
  { 
    id: 'm5', 
    name: 'Ventolin', 
    genericName: 'Salbutamol',
    dosage: '100mcg',
    category: 'Respiratory', 
    price: 4000, 
    currency: 'XAF', 
    requiresPrescription: true, 
    description: 'Ventolin is a rapid-acting bronchodilator used to relieve symptoms of asthma and chronic obstructive pulmonary disease (COPD) such as coughing, wheezing and feeling breathless.',
    treats: ['Asthma attacks', 'Wheezing', 'Shortness of breath', 'COPD'],
    sideEffects: ['Tremors', 'Nervousness', 'Palpitations', 'Headache'],
    usage: '1-2 puffs every 4-6 hours as needed for symptom relief.',
    warnings: ['Seek medical help if inhaler stops working effectively.', 'Use with caution in patients with heart disease.'],
    interactions: ['Beta-blockers', 'Diuretics', 'Digoxin'],
    storage: 'Store below 30°C. Protect from frost and direct sunlight.',
    manufacturer: 'GSK'
  },
  { 
    id: 'm6', 
    name: 'Viraday', 
    genericName: 'Tenofovir/Lamivudine',
    dosage: '300/300mg',
    category: 'Antiretroviral', 
    price: 0, 
    currency: 'XAF', 
    requiresPrescription: true, 
    description: 'A complete HIV-1 treatment regimen in a single tablet, combining three antiretroviral agents to suppress viral load.',
    treats: ['HIV-1 Infection'],
    sideEffects: ['Nausea', 'Dizziness', 'Kidney issues', 'Sleep problems'],
    usage: 'Take one tablet once daily on an empty stomach, preferably at bedtime.',
    warnings: ['Do not stop taking without medical advice.', 'May cause lactic acidosis (rare but serious).'],
    interactions: ['Other nephrotoxic drugs', 'Orlistat'],
    storage: 'Store in original container below 30°C.',
    manufacturer: 'Cipla'
  },
  { 
    id: 'm7', 
    name: 'Advil', 
    genericName: 'Ibuprofen',
    dosage: '400mg',
    category: 'Analgesic', 
    price: 1000, 
    currency: 'XAF', 
    requiresPrescription: false, 
    description: 'Non-steroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation caused by many conditions.',
    treats: ['Inflammation', 'Pain', 'Fever', 'Arthritis', 'Menstrual cramps'],
    sideEffects: ['Stomach upset', 'Heartburn', 'Ulcers', 'Dizziness'],
    usage: 'Take with food or milk to prevent stomach upset.',
    warnings: ['Risk of stomach bleeding.', 'Do not take if you have aspirin asthma.', 'Avoid in late pregnancy.'],
    interactions: ['Aspirin', 'Blood thinners', 'Corticosteroids'],
    storage: 'Store at room temperature.',
    manufacturer: 'Pfizer'
  },
  { 
    id: 'm8', 
    name: 'Zithromax', 
    genericName: 'Azithromycin',
    dosage: '500mg',
    category: 'Antibiotic', 
    price: 3000, 
    currency: 'XAF', 
    requiresPrescription: true, 
    description: 'Zithromax is a macrolide antibiotic used to treat mild to moderate bacterial infections.',
    treats: ['Throat infections', 'Pneumonia', 'Typhoid', 'Sinusitis'],
    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain', 'Vomiting'],
    usage: 'Take once daily for 3 days (or as prescribed). Can be taken with or without food.',
    warnings: ['May cause heart rhythm changes.', 'Discontinue if allergic reaction occurs.'],
    interactions: ['Antacids (separate by 2 hours)', 'Warfarin'],
    storage: 'Store below 30°C.',
    manufacturer: 'Pfizer'
  },
  { 
    id: 'm10', 
    name: 'Mopral', 
    genericName: 'Omeprazole',
    dosage: '20mg',
    category: 'Gastric', 
    price: 2000, 
    currency: 'XAF', 
    requiresPrescription: false, 
    description: 'Proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach.',
    treats: ['Acid reflux (GERD)', 'Heartburn', 'Ulcers', 'Gastritis'],
    sideEffects: ['Headache', 'Stomach pain', 'Gas', 'Nausea'],
    usage: 'Take in the morning before breakfast with a glass of water. Do not crush or chew.',
    warnings: ['Long term use may affect bone density.', 'Masks symptoms of gastric cancer.'],
    interactions: ['Clopidogrel', 'Iron supplements (reduces absorption)'],
    storage: 'Store in a dry place below 25°C.',
    manufacturer: 'AstraZeneca'
  },
];

// --- MASSIVE DATA GENERATION FOR CATALOGUE (100+ Items) ---
const CATEGORIES = ['Antibiotic', 'Antimalarial', 'Analgesic', 'Vitamin', 'Cardiovascular', 'Diabetes', 'Gastric', 'Respiratory', 'Antihistamine'];
const MANUFACTURERS = ['Sanofi', 'Pfizer', 'GSK', 'Novartis', 'Cipla', 'Denk Pharma', 'Bayer', 'Local Generics'];

const EXTRA_DRUGS_DATA = [
  { n: 'Cipro', g: 'Ciprofloxacin', d: '500mg', c: 'Antibiotic' },
  { n: 'Augmentin', g: 'Amoxicillin/Clavulanate', d: '625mg', c: 'Antibiotic' },
  { n: 'Flagyl', g: 'Metronidazole', d: '400mg', c: 'Antibiotic' },
  { n: 'Doxy', g: 'Doxycycline', d: '100mg', c: 'Antibiotic' },
  { n: 'Efferalgan', g: 'Paracetamol', d: '500mg', c: 'Analgesic' },
  { n: 'Voltaren', g: 'Diclofenac', d: '50mg', c: 'Analgesic' },
  { n: 'Tramadol', g: 'Tramadol', d: '50mg', c: 'Analgesic' },
  { n: 'Asprin', g: 'Acetylsalicylic acid', d: '100mg', c: 'Cardiovascular' },
  { n: 'Amlodipine', g: 'Amlodipine', d: '5mg', c: 'Cardiovascular' },
  { n: 'Losartan', g: 'Losartan', d: '50mg', c: 'Cardiovascular' },
  { n: 'Atorvastatin', g: 'Atorvastatin', d: '20mg', c: 'Cardiovascular' },
  { n: 'Metformin', g: 'Metformin', d: '500mg', c: 'Diabetes' },
  { n: 'Glibenclamide', g: 'Glibenclamide', d: '5mg', c: 'Diabetes' },
  { n: 'Vitamin C', g: 'Ascorbic Acid', d: '500mg', c: 'Vitamin' },
  { n: 'Neurobion', g: 'B-Complex', d: 'Tablet', c: 'Vitamin' },
  { n: 'Ferrous', g: 'Ferrous Sulphate', d: '200mg', c: 'Vitamin' },
  { n: 'Calcium', g: 'Calcium + D3', d: '500mg', c: 'Vitamin' },
  { n: 'Zinc', g: 'Zinc Sulphate', d: '20mg', c: 'Vitamin' },
  { n: 'Loratadine', g: 'Loratadine', d: '10mg', c: 'Antihistamine' },
  { n: 'Cetirizine', g: 'Cetirizine', d: '10mg', c: 'Antihistamine' },
  { n: 'Promethazine', g: 'Promethazine', d: '25mg', c: 'Antihistamine' },
  { n: 'Gaviscon', g: 'Alginate', d: 'Syrup', c: 'Gastric' },
  { n: 'Maalox', g: 'Al/Mg Hydroxide', d: 'Tablet', c: 'Gastric' },
  { n: 'Spasfon', g: 'Phloroglucinol', d: '80mg', c: 'Analgesic' },
  { n: 'Buscopan', g: 'Hyoscine', d: '10mg', c: 'Analgesic' },
  { n: 'Imodium', g: 'Loperamide', d: '2mg', c: 'Gastric' },
  { n: 'Vermox', g: 'Mebendazole', d: '100mg', c: 'Antibiotic' },
  { n: 'Zentel', g: 'Albendazole', d: '400mg', c: 'Antibiotic' },
  { n: 'Prednisolone', g: 'Prednisolone', d: '5mg', c: 'Respiratory' },
  { n: 'Ibuprofen', g: 'Ibuprofen', d: '200mg', c: 'Analgesic' },
];

// Generate 100+ variations
for (let i = 0; i < 4; i++) {
  EXTRA_DRUGS_DATA.forEach((d, idx) => {
    const uniqueId = `gen_${i}_${idx}`;
    const price = Math.floor(Math.random() * 5000) + 500;
    
    MEDICATIONS.push({
      id: uniqueId,
      name: d.n,
      genericName: d.g,
      dosage: d.d,
      category: d.c,
      price: price,
      currency: 'XAF',
      requiresPrescription: ['Antibiotic', 'Cardiovascular', 'Diabetes'].includes(d.c),
      description: `Standard ${d.g} formulation used for ${d.c.toLowerCase()} treatments. Consult your doctor for specific usage.`,
      treats: ['General Symptoms', 'Pain', 'Infection'],
      sideEffects: ['Nausea', 'Dizziness'],
      usage: 'As prescribed by physician.',
      warnings: ['Consult doctor before use.', 'Keep out of reach of children.'],
      interactions: ['Alcohol'],
      storage: 'Store in a cool dry place.',
      manufacturer: MANUFACTURERS[Math.floor(Math.random() * MANUFACTURERS.length)]
    });
  });
}


// --- DATA GENERATION UTILS ---

const CITIES = [
  { name: 'Douala', lat: 4.0511, lng: 9.7679, neighborhoods: ['Akwa', 'Bonanjo', 'Bonapriso', 'Deido', 'Ndokoti', 'Makepe', 'Logpom', 'City Chic', 'Bali'] },
  { name: 'Yaoundé', lat: 3.8480, lng: 11.5021, neighborhoods: ['Bastos', 'Mvan', 'Mokolo', 'Biyem-Assi', 'Mendong', 'Ngoa-Ekelle', 'Tsinga', 'Essos'] },
  { name: 'Bamenda', lat: 5.9631, lng: 10.1591, neighborhoods: ['Commercial Ave', 'Nkwen', 'Bambili', 'Up Station'] },
  { name: 'Bafoussam', lat: 5.4778, lng: 10.4176, neighborhoods: ['Centre', 'Hausa', 'Tamdja'] },
  { name: 'Buea', lat: 4.1550, lng: 9.2310, neighborhoods: ['Molyko', 'Clerks Quarters', 'Buea Town'] },
];

const PHARMACY_PREFIXES = ['Pharmacie', 'Pharmacie de', 'Pharmacy', 'Health Point', 'MediCare', 'LifeCare', 'Green Cross'];
const PHARMACY_SUFFIXES = ['Health', 'Plus', 'Express', 'Center', 'Life', 'Trust', 'Soins', 'Espoir', 'Alliance', 'Lumière', 'Paix'];

const generatePharmacies = (count: number): Pharmacy[] => {
  const pharmacies: Pharmacy[] = [];
  
  for (let i = 0; i < count; i++) {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const neighborhood = city.neighborhoods[Math.floor(Math.random() * city.neighborhoods.length)];
    
    // Randomize location slightly around city center
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    // Generate Name
    const prefix = PHARMACY_PREFIXES[Math.floor(Math.random() * PHARMACY_PREFIXES.length)];
    const suffix = Math.random() > 0.5 ? PHARMACY_SUFFIXES[Math.floor(Math.random() * PHARMACY_SUFFIXES.length)] : '';
    const name = Math.random() > 0.6 
      ? `${prefix} ${neighborhood}` 
      : `${prefix} ${suffix} ${neighborhood}`;

    // Generate Stock
    // Only stock a subset of all medications (random 20-50 items per pharmacy) to be realistic
    const pharmacyStockSubset = MEDICATIONS
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 30) + 20);

    const stock: PharmacyStock[] = pharmacyStockSubset.map(med => {
       const statusRoll = Math.random();
       let status = StockStatus.IN_STOCK;
       if (statusRoll > 0.8) status = StockStatus.OUT_OF_STOCK;
       else if (statusRoll > 0.6) status = StockStatus.LOW_STOCK;
       
       return {
         medicationId: med.id,
         status,
         quantity: status === StockStatus.OUT_OF_STOCK ? 0 : Math.floor(Math.random() * 200) + 10,
         lastUpdated: `${Math.floor(Math.random() * 59) + 1} mins ago`,
         price: med.price + (Math.floor(Math.random() * 10) * 50) // Slight price variation
       };
    });

    pharmacies.push({
      id: `p${i}`,
      name: name,
      city: city.name,
      address: `${neighborhood}, ${city.name}`,
      location: { lat: city.lat + latOffset, lng: city.lng + lngOffset },
      isVerified: Math.random() > 0.1, // 90% verified
      isOpen: Math.random() > 0.2, // 80% open
      phone: `+237 6${Math.floor(Math.random() * 90000000 + 10000000)}`,
      stock
    });
  }
  return pharmacies;
};

// Generate 150 Fake Pharmacies
export const PHARMACIES: Pharmacy[] = generatePharmacies(150);

// Helper to simulate distance calculation
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Mock Orders for Pharmacy Dashboard
export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-2401', customerName: 'Jean-Paul N.', items: ['Coartem 80/480mg', 'Paracetamol 500mg'], total: 3000, status: 'READY', time: '10:30 AM' },
  { id: 'ORD-2402', customerName: 'Marie T.', items: ['Ventolin Inhaler'], total: 4000, status: 'PENDING', time: '10:45 AM' },
  { id: 'ORD-2403', customerName: 'Samuel E.', items: ['Ibuprofen 400mg', 'Amoxicillin 500mg'], total: 2500, status: 'COMPLETED', time: '09:15 AM' },
];

// Mock Reports for Admin Dashboard
export const MOCK_REPORTS: Report[] = [
  { id: 'RPT-001', type: 'PRICE_MISMATCH', pharmacyName: 'Pharmacie Akwa', description: 'Price for Coartem is 500 XAF higher than listed.', date: '2023-10-25', status: 'OPEN' },
  { id: 'RPT-002', type: 'FAKE_DRUG', pharmacyName: 'Health Point Bonanjo', description: 'User reported suspicious packaging for Amoxil.', date: '2023-10-24', status: 'OPEN' },
  { id: 'RPT-003', type: 'POOR_SERVICE', pharmacyName: 'MediCare Molyko', description: 'Pharmacy was closed during stated open hours.', date: '2023-10-23', status: 'RESOLVED' },
];
