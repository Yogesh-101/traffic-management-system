// Mock traffic data for junctions in Hyderabad
export const junctions = [
  // Central and Business Areas
  { id: 1, lat: 17.3850, lng: 78.4867, congestion: 'high', name: 'Hitech City, Hyderabad' },
  { id: 2, lat: 17.4400, lng: 78.4983, congestion: 'high', name: 'Kukatpally, Hyderabad' },
  { id: 3, lat: 17.4156, lng: 78.4347, congestion: 'high', name: 'KPHB Colony, Hyderabad' },
  { id: 4, lat: 17.3616, lng: 78.4747, congestion: 'high', name: 'Jubilee Hills, Hyderabad' },
  { id: 5, lat: 17.3254, lng: 78.4380, congestion: 'medium', name: 'Film Nagar, Hyderabad' },
  { id: 6, lat: 17.3841, lng: 78.4564, congestion: 'medium', name: 'Madhapur, Hyderabad' },
  { id: 7, lat: 17.4501, lng: 78.3817, congestion: 'medium', name: 'Miyapur, Hyderabad' },
  { id: 8, lat: 17.5007, lng: 78.3920, congestion: 'low', name: 'Bachupally, Hyderabad' },
  { id: 9, lat: 17.3510, lng: 78.5559, congestion: 'high', name: 'Secunderabad, Hyderabad' },
  { id: 10, lat: 17.4560, lng: 78.5012, congestion: 'medium', name: 'Kompally, Hyderabad' },
  { id: 11, lat: 17.3908, lng: 78.4930, congestion: 'high', name: 'Ameerpet, Hyderabad' },
  { id: 12, lat: 17.4170, lng: 78.5030, congestion: 'high', name: 'Begumpet, Hyderabad' },
  { id: 13, lat: 17.3813, lng: 78.4765, congestion: 'high', name: 'Banjara Hills, Hyderabad' },
  { id: 14, lat: 17.3687, lng: 78.5247, congestion: 'medium', name: 'Khairtabad, Hyderabad' },
  { id: 15, lat: 17.4121, lng: 78.4308, congestion: 'medium', name: 'Moosapet, Hyderabad' },
  { id: 16, lat: 17.4289, lng: 78.4601, congestion: 'high', name: 'Yousufguda, Hyderabad' },
  { id: 17, lat: 17.3683, lng: 78.5128, congestion: 'high', name: 'Panjagutta, Hyderabad' },
  { id: 18, lat: 17.3848, lng: 78.4519, congestion: 'high', name: 'Cyberabad, Hyderabad' },
  
  // Major Areas
  { id: 19, lat: 17.4260, lng: 78.5371, congestion: 'medium', name: 'Bowenpally, Hyderabad' },
  { id: 20, lat: 17.3604, lng: 78.4745, congestion: 'medium', name: 'Somajiguda, Hyderabad' },
  { id: 21, lat: 17.3398, lng: 78.5800, congestion: 'high', name: 'Dilsukhnagar, Hyderabad' },
  { id: 22, lat: 17.3616, lng: 78.5153, congestion: 'high', name: 'Himayatnagar, Hyderabad' },
  { id: 23, lat: 17.3433, lng: 78.5522, congestion: 'high', name: 'Narayanguda, Hyderabad' },
  { id: 24, lat: 17.3563, lng: 78.5045, congestion: 'medium', name: 'Lakdikapul, Hyderabad' },
  { id: 25, lat: 17.3846, lng: 78.4796, congestion: 'high', name: 'Shaikpet, Hyderabad' },
  { id: 26, lat: 17.3995, lng: 78.5095, congestion: 'high', name: 'SR Nagar, Hyderabad' },
  { id: 27, lat: 17.3981, lng: 78.5585, congestion: 'medium', name: 'Tarnaka, Hyderabad' },
  { id: 28, lat: 17.3723, lng: 78.5635, congestion: 'medium', name: 'Amberpet, Hyderabad' },
  { id: 29, lat: 17.3750, lng: 78.5410, congestion: 'high', name: 'Basheerbagh, Hyderabad' },
  { id: 30, lat: 17.3616, lng: 78.4749, congestion: 'high', name: 'Road No. 36 Jubilee Hills, Hyderabad' },
  { id: 31, lat: 17.4346, lng: 78.4239, congestion: 'medium', name: 'Gachibowli, Hyderabad' },
  { id: 32, lat: 17.4517, lng: 78.4610, congestion: 'high', name: 'Erragadda, Hyderabad' },
  { id: 33, lat: 17.3758, lng: 78.5535, congestion: 'medium', name: 'Kachiguda, Hyderabad' },
  { id: 34, lat: 17.5004, lng: 78.4654, congestion: 'medium', name: 'Alwal, Hyderabad' },
  { id: 35, lat: 17.4368, lng: 78.3563, congestion: 'medium', name: 'Chandanagar, Hyderabad' },
  
  // Additional localities
  { id: 36, lat: 17.3644, lng: 78.5386, congestion: 'high', name: 'Mehdipatnam, Hyderabad' },
  { id: 37, lat: 17.3687, lng: 78.6410, congestion: 'high', name: 'LB Nagar, Hyderabad' },
  { id: 38, lat: 17.3070, lng: 78.5522, congestion: 'medium', name: 'Shamshabad, Hyderabad' },
  { id: 39, lat: 17.4239, lng: 78.5586, congestion: 'medium', name: 'Malkajgiri, Hyderabad' },
  { id: 40, lat: 17.5025, lng: 78.3823, congestion: 'low', name: 'Patancheru, Hyderabad' },
  { id: 41, lat: 17.4490, lng: 78.3651, congestion: 'medium', name: 'Lingampally, Hyderabad' },
  { id: 42, lat: 17.4813, lng: 78.4144, congestion: 'low', name: 'Nanakramguda, Hyderabad' },
  { id: 43, lat: 17.4237, lng: 78.5420, congestion: 'medium', name: 'Paradise, Hyderabad' },
  { id: 44, lat: 17.3844, lng: 78.4568, congestion: 'high', name: 'Kondapur, Hyderabad' },
  { id: 45, lat: 17.4795, lng: 78.4072, congestion: 'medium', name: 'Financial District, Hyderabad' },
  { id: 46, lat: 17.4062, lng: 78.4691, congestion: 'high', name: 'Sanath Nagar, Hyderabad' },
  { id: 47, lat: 17.4500, lng: 78.4472, congestion: 'medium', name: 'Suraram, Hyderabad' },
  { id: 48, lat: 17.4400, lng: 78.4482, congestion: 'medium', name: 'Balanagar, Hyderabad' },
  { id: 49, lat: 17.3615, lng: 78.5222, congestion: 'high', name: 'Nampally, Hyderabad' },
  { id: 50, lat: 17.3826, lng: 78.4775, congestion: 'high', name: 'Tolichowki, Hyderabad' },
  { id: 51, lat: 17.3188, lng: 78.5546, congestion: 'medium', name: 'Rajendranagar, Hyderabad' },
  { id: 52, lat: 17.3950, lng: 78.3968, congestion: 'medium', name: 'Manikonda, Hyderabad' },
  { id: 53, lat: 17.3619, lng: 78.4890, congestion: 'high', name: 'Masab Tank, Hyderabad' },
  { id: 54, lat: 17.3540, lng: 78.5266, congestion: 'high', name: 'Abids, Hyderabad' },
  { id: 55, lat: 17.3230, lng: 78.5408, congestion: 'medium', name: 'Upparpally, Hyderabad' },
  { id: 56, lat: 17.4138, lng: 78.5421, congestion: 'medium', name: 'Safilguda, Hyderabad' },
  { id: 57, lat: 17.4482, lng: 78.3899, congestion: 'medium', name: 'Hafeezpet, Hyderabad' }
];

// Mock traffic flow connections for Hyderabad
export const connections = [
  // Core City Connections
  { from: 1, to: 6, flow: 'high' },    // Hitech City to Madhapur
  { from: 6, to: 13, flow: 'high' },   // Madhapur to Banjara Hills
  { from: 13, to: 17, flow: 'high' },  // Banjara Hills to Panjagutta
  { from: 17, to: 11, flow: 'high' },  // Panjagutta to Ameerpet
  { from: 11, to: 12, flow: 'high' },  // Ameerpet to Begumpet
  { from: 12, to: 9, flow: 'medium' }, // Begumpet to Secunderabad
  { from: 2, to: 3, flow: 'high' },    // Kukatpally to KPHB
  { from: 3, to: 15, flow: 'medium' }, // KPHB to Moosapet
  { from: 15, to: 7, flow: 'medium' }, // Moosapet to Miyapur
  { from: 7, to: 8, flow: 'low' },     // Miyapur to Bachupally
  { from: 2, to: 10, flow: 'medium' }, // Kukatpally to Kompally
  { from: 4, to: 5, flow: 'medium' },  // Jubilee Hills to Film Nagar
  { from: 6, to: 18, flow: 'high' },   // Madhapur to Cyberabad
  { from: 17, to: 14, flow: 'medium' }, // Panjagutta to Khairtabad
  
  // Additional Connections
  { from: 4, to: 30, flow: 'high' },   // Jubilee Hills to Road No. 36
  { from: 13, to: 25, flow: 'high' },  // Banjara Hills to Shaikpet
  { from: 11, to: 26, flow: 'high' },  // Ameerpet to SR Nagar
  { from: 17, to: 24, flow: 'medium' }, // Panjagutta to Lakdikapul
  { from: 20, to: 24, flow: 'medium' }, // Somajiguda to Lakdikapul
  { from: 22, to: 29, flow: 'high' },  // Himayatnagar to Basheerbagh
  { from: 12, to: 19, flow: 'medium' }, // Begumpet to Bowenpally
  { from: 9, to: 27, flow: 'medium' }, // Secunderabad to Tarnaka
  { from: 27, to: 28, flow: 'medium' }, // Tarnaka to Amberpet
  { from: 29, to: 23, flow: 'high' },  // Basheerbagh to Narayanguda
  { from: 23, to: 33, flow: 'medium' }, // Narayanguda to Kachiguda
  { from: 3, to: 31, flow: 'medium' },  // KPHB to Gachibowli
  { from: 15, to: 32, flow: 'high' },  // Moosapet to Erragadda
  { from: 7, to: 35, flow: 'medium' },  // Miyapur to Chandanagar
  { from: 10, to: 34, flow: 'medium' }  // Kompally to Alwal
];

// Hyderabad coordinates as default center
export const defaultCenter = {
  lat: 17.3850, // Hyderabad coordinates
  lng: 78.4867
};

// Color mapping for congestion levels
export const congestionColors = {
  low: '#10b981', // green
  medium: '#f97316', // orange
  high: '#ef4444', // red
};

// Flow styling for connections
export const flowStyles = {
  low: '#10b981',
  medium: '#f97316',
  high: '#ef4444',
};
