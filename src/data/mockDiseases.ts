import type { DiseaseDetection, RootCauseAnalysis, Treatment, ScanResult } from '@/types';

export const MOCK_DISEASES: Record<string, {
  disease: DiseaseDetection;
  rootCause: RootCauseAnalysis;
  treatments: Treatment[];
}> = {
  'early_blight': {
    disease: {
      name: 'Early Blight',
      confidence: 94.7,
      severity: 'high',
      affectedArea: 35,
      description: 'Alternaria solani infection causing concentric ring lesions on lower leaves. Progressive defoliation observed with characteristic dark brown spots surrounded by yellow halos.',
      scientificName: 'Alternaria solani',
    },
    rootCause: {
      primaryCause: 'High humidity combined with moderate temperature created ideal fungal growth conditions',
      factors: [
        { name: 'Humidity', category: 'weather', impact: 85, current: 88, optimal: 65, unit: '%', status: 'critical', description: 'Sustained humidity above 80% for 72+ hours enabled rapid spore germination' },
        { name: 'Temperature', category: 'weather', impact: 70, current: 27, optimal: 22, unit: '°C', status: 'suboptimal', description: 'Warm temperatures (24-29°C) accelerated fungal lifecycle' },
        { name: 'Soil Moisture', category: 'soil', impact: 60, current: 78, optimal: 55, unit: '%', status: 'critical', description: 'Overwatering created waterlogged conditions favoring pathogen spread' },
        { name: 'Nitrogen Level', category: 'soil', impact: 45, current: 340, optimal: 200, unit: 'mg/kg', status: 'critical', description: 'Excess nitrogen produced lush but disease-susceptible foliage' },
        { name: 'Crop Spacing', category: 'biological', impact: 40, current: 25, optimal: 45, unit: 'cm', status: 'critical', description: 'Dense planting reduced air circulation, trapping moisture around foliage' },
        { name: 'Fungicide Timing', category: 'chemical', impact: 35, current: 0, optimal: 1, unit: 'applications', status: 'critical', description: 'Preventive fungicide application was missed during critical growth stage' },
      ],
      reasoning: [
        'Environmental conditions analysis indicates a convergence of high humidity (88%) and elevated temperature (27°C) over the past 5 days, creating optimal conditions for Alternaria solani spore germination.',
        'Soil moisture data shows consistent overwatering (78% vs optimal 55%), which contributed to leaf wetness duration exceeding the 12-hour infection threshold.',
        'Nitrogen levels (340 mg/kg) are 70% above optimal, producing succulent leaf tissue that is more susceptible to fungal penetration.',
        'Combined with dense crop spacing (25cm vs recommended 45cm), air circulation was insufficient to dry leaf surfaces, extending the wetness period.',
        'The missed preventive fungicide application during Week 6 left the crop unprotected during peak vulnerability window.',
      ],
      sustainabilityImpact: 35,
      riskScore: 78,
      timeline: [
        { date: '2024-01-15', event: 'Humidity spike detected (85%+)', severity: 'medium', factor: 'Humidity' },
        { date: '2024-01-17', event: 'Overwatering flagged by soil sensors', severity: 'medium', factor: 'Soil Moisture' },
        { date: '2024-01-19', event: 'Missed scheduled fungicide window', severity: 'high', factor: 'Fungicide' },
        { date: '2024-01-22', event: 'First leaf lesions observed', severity: 'high', factor: 'Disease' },
        { date: '2024-01-25', event: 'Disease spread to adjacent rows', severity: 'high', factor: 'Disease' },
      ],
      correlations: [
        { factor1: 'Humidity', factor2: 'Disease Severity', correlation: 0.92, description: 'Strong positive correlation between sustained humidity and disease progression' },
        { factor1: 'Nitrogen Level', factor2: 'Leaf Susceptibility', correlation: 0.78, description: 'Excess nitrogen correlated with increased tissue vulnerability' },
        { factor1: 'Temperature', factor2: 'Spore Growth Rate', correlation: 0.85, description: 'Temperature range aligns with peak Alternaria growth curve' },
      ],
    },
    treatments: [
      { id: 't1', type: 'pesticide', name: 'Chlorothalonil 75WP', description: 'Broad-spectrum contact fungicide effective against Alternaria species. Apply at 2-3g/L water at 7-day intervals.', dosage: '2-3g/L water', frequency: 'Every 7 days', cost: 'low', effectiveness: 85, sustainabilityScore: 40, isOrganic: false, warnings: ['Use protective equipment', 'Do not apply within 7 days of harvest'] },
      { id: 't2', type: 'organic', name: 'Trichoderma harzianum', description: 'Biological control agent that parasitizes Alternaria. Apply as soil drench and foliar spray for dual action.', dosage: '5g/L water', frequency: 'Every 10 days', cost: 'medium', effectiveness: 65, sustainabilityScore: 95, isOrganic: true },
      { id: 't3', type: 'irrigation', name: 'Drip Irrigation Conversion', description: 'Switch from overhead to drip irrigation to minimize leaf wetness duration and reduce humidity in crop canopy.', cost: 'high', effectiveness: 75, sustainabilityScore: 90, isOrganic: true },
      { id: 't4', type: 'nutrient', name: 'Nitrogen Reduction Protocol', description: 'Reduce nitrogen application by 40% and supplement with potassium to strengthen cell walls and improve disease resistance.', dosage: 'Reduce N by 40%, add K at 100mg/kg', frequency: 'Next fertilization cycle', cost: 'low', effectiveness: 60, sustainabilityScore: 85, isOrganic: true },
      { id: 't5', type: 'cultural', name: 'Canopy Management', description: 'Remove lower infected leaves, increase plant spacing, and improve air circulation through strategic pruning.', cost: 'low', effectiveness: 55, sustainabilityScore: 100, isOrganic: true },
    ],
  },
  'late_blight': {
    disease: {
      name: 'Late Blight',
      confidence: 91.2,
      severity: 'critical',
      affectedArea: 52,
      description: 'Phytophthora infestans infection causing large water-soaked lesions with white fuzzy sporulation on undersides of leaves. Rapid tissue necrosis observed.',
      scientificName: 'Phytophthora infestans',
    },
    rootCause: {
      primaryCause: 'Cool wet conditions with prolonged leaf wetness enabled Phytophthora epidemic',
      factors: [
        { name: 'Leaf Wetness', category: 'weather', impact: 95, current: 18, optimal: 6, unit: 'hours/day', status: 'critical', description: '18 hours daily leaf wetness far exceeds the 6-hour infection threshold' },
        { name: 'Temperature', category: 'weather', impact: 80, current: 18, optimal: 25, unit: '°C', status: 'suboptimal', description: 'Cool temperatures (15-20°C) are ideal for P. infestans zoospore release' },
        { name: 'Rainfall', category: 'weather', impact: 75, current: 120, optimal: 40, unit: 'mm/week', status: 'critical', description: 'Heavy rainfall facilitated splash dispersal of sporangia' },
        { name: 'Air Circulation', category: 'biological', impact: 50, current: 2, optimal: 8, unit: 'km/h', status: 'critical', description: 'Stagnant air prevented canopy drying between rain events' },
        { name: 'Phosphorus', category: 'soil', impact: 30, current: 15, optimal: 50, unit: 'mg/kg', status: 'critical', description: 'Low phosphorus weakened root development and overall plant immunity' },
      ],
      reasoning: [
        'Late blight outbreak is driven primarily by 3 consecutive weeks of cool (18°C average) and wet (120mm/week) conditions.',
        'Leaf wetness duration averaging 18 hours/day is three times the infection threshold for Phytophthora infestans.',
        'Heavy rainfall events enabled splash-dispersal of sporangia, spreading the pathogen across the entire field within 5 days.',
        'Phosphorus deficiency (15 mg/kg vs optimal 50 mg/kg) compromised plant immune response, reducing ability to mount hypersensitive resistance.',
      ],
      sustainabilityImpact: 55,
      riskScore: 92,
      timeline: [
        { date: '2024-02-01', event: 'Sustained rainfall period begins', severity: 'medium', factor: 'Rainfall' },
        { date: '2024-02-05', event: 'First water-soaked lesions detected', severity: 'high', factor: 'Disease' },
        { date: '2024-02-07', event: 'Sporulation confirmed on leaf undersides', severity: 'high', factor: 'Disease' },
        { date: '2024-02-10', event: 'Field-wide spread confirmed', severity: 'high', factor: 'Disease' },
      ],
      correlations: [
        { factor1: 'Rainfall', factor2: 'Disease Spread Rate', correlation: 0.95, description: 'Rainfall directly correlated with sporangial dispersal distance' },
        { factor1: 'Temperature', factor2: 'Zoospore Activity', correlation: -0.72, description: 'Lower temperatures favor indirect germination via zoospores' },
      ],
    },
    treatments: [
      { id: 't6', type: 'pesticide', name: 'Mancozeb + Metalaxyl', description: 'Systemic + contact fungicide combination for immediate control. Apply preventively and curatively.', dosage: '2.5g/L water', frequency: 'Every 5-7 days', cost: 'medium', effectiveness: 92, sustainabilityScore: 30, isOrganic: false, warnings: ['Rotate with different mode of action', 'Maximum 3 applications per season'] },
      { id: 't7', type: 'organic', name: 'Copper Hydroxide', description: 'OMRI-listed copper fungicide. Preventive only — must be applied before infection.', dosage: '3g/L water', frequency: 'Every 7 days', cost: 'low', effectiveness: 60, sustainabilityScore: 70, isOrganic: true, warnings: ['Copper accumulation in soil with repeated use'] },
      { id: 't8', type: 'cultural', name: 'Emergency Harvest', description: 'If more than 50% of foliage is affected, consider early harvest to salvage tubers before pathogen reaches underground.', cost: 'low', effectiveness: 80, sustainabilityScore: 100, isOrganic: true },
    ],
  },
  'leaf_curl': {
    disease: {
      name: 'Leaf Curl Virus',
      confidence: 88.3,
      severity: 'moderate',
      affectedArea: 22,
      description: 'Tomato Yellow Leaf Curl Virus (TYLCV) transmitted by whitefly vectors. Upward curling of leaves with yellowing and stunted growth.',
      scientificName: 'Begomovirus (TYLCV)',
    },
    rootCause: {
      primaryCause: 'Whitefly population explosion due to hot dry conditions and lack of natural predators',
      factors: [
        { name: 'Temperature', category: 'weather', impact: 80, current: 34, optimal: 25, unit: '°C', status: 'critical', description: 'High temperatures accelerated whitefly reproductive cycle' },
        { name: 'Humidity', category: 'weather', impact: 55, current: 35, optimal: 60, unit: '%', status: 'suboptimal', description: 'Low humidity favored whitefly survival and dispersal' },
        { name: 'Pesticide Usage', category: 'chemical', impact: 65, current: 4, optimal: 1, unit: 'applications', status: 'critical', description: 'Broad-spectrum pesticides eliminated beneficial predator insects' },
        { name: 'Weed Management', category: 'biological', impact: 45, current: 0, optimal: 1, unit: 'score', status: 'critical', description: 'Surrounding weeds served as alternative host reservoir for virus' },
      ],
      reasoning: [
        'TYLCV outbreak is vector-mediated, with whitefly (Bemisia tabaci) populations reaching critical levels due to 34°C temperatures and 35% humidity.',
        'The use of 4 broad-spectrum pesticide applications eliminated natural whitefly predators (parasitic wasps, ladybugs), causing a secondary pest outbreak.',
        'Surrounding weed populations acted as viral reservoirs, maintaining virus inoculum between crop cycles.',
      ],
      sustainabilityImpact: 45,
      riskScore: 65,
      timeline: [
        { date: '2024-03-01', event: 'Whitefly population detected above threshold', severity: 'medium', factor: 'Pest' },
        { date: '2024-03-08', event: 'First leaf curling symptoms observed', severity: 'medium', factor: 'Disease' },
        { date: '2024-03-12', event: 'TYLCV confirmed via visual diagnosis', severity: 'high', factor: 'Disease' },
      ],
      correlations: [
        { factor1: 'Temperature', factor2: 'Whitefly Population', correlation: 0.88, description: 'Higher temperatures directly increased whitefly reproduction rate' },
        { factor1: 'Pesticide Applications', factor2: 'Predator Population', correlation: -0.91, description: 'Pesticide use inversely correlated with beneficial insect diversity' },
      ],
    },
    treatments: [
      { id: 't9', type: 'pesticide', name: 'Imidacloprid 17.8 SL', description: 'Systemic neonicotinoid for whitefly control. Apply as soil drench for extended protection.', dosage: '0.5ml/L water', frequency: 'Single soil application', cost: 'medium', effectiveness: 80, sustainabilityScore: 25, isOrganic: false, warnings: ['Toxic to pollinators', 'Do not apply during flowering'] },
      { id: 't10', type: 'organic', name: 'Yellow Sticky Traps + Neem Oil', description: 'Integrated approach: yellow traps for monitoring and mass trapping, neem oil as repellent spray.', dosage: 'Neem 3ml/L, 20 traps/acre', frequency: 'Traps: weekly refresh, Neem: every 5 days', cost: 'low', effectiveness: 55, sustainabilityScore: 90, isOrganic: true },
      { id: 't11', type: 'cultural', name: 'Reflective Mulch + Barrier Crops', description: 'Silver reflective mulch disorients whiteflies. Plant marigold barriers to repel vectors.', cost: 'medium', effectiveness: 50, sustainabilityScore: 95, isOrganic: true },
    ],
  },
  'healthy': {
    disease: {
      name: 'Healthy',
      confidence: 97.1,
      severity: 'low',
      affectedArea: 0,
      description: 'No disease detected. The leaf appears healthy with normal coloration and structure. Continue monitoring for preventive care.',
      scientificName: 'N/A',
    },
    rootCause: {
      primaryCause: 'Plant is healthy — all environmental parameters within optimal range',
      factors: [
        { name: 'Humidity', category: 'weather', impact: 10, current: 62, optimal: 65, unit: '%', status: 'optimal', description: 'Humidity levels well within healthy range' },
        { name: 'Temperature', category: 'weather', impact: 10, current: 24, optimal: 25, unit: '°C', status: 'optimal', description: 'Temperature ideal for crop growth' },
        { name: 'Soil Moisture', category: 'soil', impact: 10, current: 55, optimal: 55, unit: '%', status: 'optimal', description: 'Soil moisture at optimal level' },
        { name: 'Nitrogen', category: 'soil', impact: 10, current: 210, optimal: 200, unit: 'mg/kg', status: 'optimal', description: 'Nutrient levels balanced' },
      ],
      reasoning: [
        'All environmental parameters are within optimal ranges for healthy crop development.',
        'Current growing conditions support robust plant growth with no stress indicators detected.',
        'Recommend continuing current management practices with regular preventive monitoring.',
      ],
      sustainabilityImpact: 90,
      riskScore: 8,
      timeline: [],
      correlations: [],
    },
    treatments: [
      { id: 't12', type: 'cultural', name: 'Preventive Monitoring', description: 'Continue regular scouting and sensor monitoring. Schedule bi-weekly leaf scans to detect issues early.', cost: 'low', effectiveness: 90, sustainabilityScore: 100, isOrganic: true },
    ],
  },
};

export function getRandomDisease(): typeof MOCK_DISEASES[keyof typeof MOCK_DISEASES] {
  const keys = Object.keys(MOCK_DISEASES).filter(k => k !== 'healthy');
  const key = keys[Math.floor(Math.random() * keys.length)];
  return MOCK_DISEASES[key];
}

export function simulateScanResult(imageUrl: string): ScanResult {
  const data = getRandomDisease();
  return {
    id: `scan-${Date.now()}`,
    farmId: 'farm-1',
    userId: 'user-1',
    imageUrl,
    disease: data.disease,
    rootCause: data.rootCause,
    treatments: data.treatments,
    createdAt: new Date(),
  };
}
