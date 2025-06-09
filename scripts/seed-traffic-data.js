import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Anon Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hyderabad localities
const localities = [
  'Hitech City', 'Gachibowli', 'Madhapur', 'Jubilee Hills', 'Banjara Hills',
  'Kukatpally', 'Ameerpet', 'Secunderabad', 'Abids', 'Koti', 'Himayatnagar',
  'Tarnaka', 'Dilsukhnagar', 'Lakdikapul', 'Begumpet', 'Punjagutta',
  'Somajiguda', 'Khairatabad', 'Mehdipatnam', 'Tolichowki', 'Narayanguda',
  'Sainikpuri', 'Miyapur', 'Chandanagar', 'Lingampally', 'KPHB', 'Kukatpally',
  'Miyapur', 'Chandanagar', 'Lingampally', 'KPHB', 'Kukatpally', 'Kondapur',
  'Gachibowli', 'Nanakramguda', 'Manikonda', 'Narsingi', 'Kokapet', 'Financial District'
];

// Generate random traffic data
function generateTrafficData(count = 100) {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const location = faker.helpers.arrayElement(localities);
    const date = faker.date.recent(30, now);
    const hour = date.getHours();
    
    // Base traffic pattern
    let baseVolume = 1000; // Base volume
    let baseCongestion = 0.3; // Base congestion (0-1)
    
    // Adjust for time of day
    if (hour >= 7 && hour <= 10) {
      // Morning rush hour
      baseVolume += faker.number.int({ min: 500, max: 1000 });
      baseCongestion += 0.3;
    } else if (hour >= 16 && hour <= 20) {
      // Evening rush hour
      baseVolume += faker.number.int({ min: 400, max: 900 });
      baseCongestion += 0.4;
    } else if (hour >= 22 || hour <= 5) {
      // Night time
      baseVolume = faker.number.int({ min: 100, max: 400 });
      baseCongestion = faker.number.float({ min: 0.1, max: 0.3 });
    } else {
      // Day time
      baseVolume += faker.number.int({ min: 100, max: 400 });
      baseCongestion += faker.number.float({ min: 0.1, max: 0.3 });
    }
    
    // Add some randomness
    const volume = Math.round(baseVolume * faker.number.float({ min: 0.8, max: 1.2 }));
    const congestion = Math.min(0.95, Math.max(0.05, baseCongestion * faker.number.float({ min: 0.8, max: 1.2 })));
    
    data.push({
      location,
      date: date.toISOString(),
      volume,
      avg_speed: Math.round(40 - (congestion * 30)), // Higher congestion = lower speed
      congestion_level: parseFloat(congestion.toFixed(2)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return data;
}

// Generate AI predictions
function generateAIPredictions() {
  const predictions = [];
  const now = new Date();
  
  localities.forEach(location => {
    // Generate predictions for next 24 hours
    for (let i = 1; i <= 24; i++) {
      const predictionTime = new Date(now.getTime() + (i * 60 * 60 * 1000));
      const hour = predictionTime.getHours();
      
      // Base prediction
      let baseVolume = 1000;
      let baseCongestion = 0.3;
      
      // Adjust for time of day
      if (hour >= 7 && hour <= 10) {
        baseVolume += 700;
        baseCongestion += 0.35;
      } else if (hour >= 16 && hour <= 20) {
        baseVolume += 800;
        baseCongestion += 0.45;
      } else if (hour >= 22 || hour <= 5) {
        baseVolume = 300;
        baseCongestion = 0.2;
      } else {
        baseVolume += 300;
        baseCongestion += 0.25;
      }
      
      // Add some randomness
      const volume = Math.round(baseVolume * (0.9 + Math.random() * 0.2));
      const congestion = Math.min(0.95, Math.max(0.05, baseCongestion * (0.9 + Math.random() * 0.2)));
      
      predictions.push({
        location,
        prediction_time: predictionTime.toISOString(),
        predicted_volume: volume,
        predicted_congestion: parseFloat(congestion.toFixed(2)),
        confidence_level: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)), // 70-95% confidence
        model_version: '1.2.0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  });
  
  return predictions;
}

// Insert data into database
async function seedData() {
  try {
    console.log('🌱 Seeding traffic data...');
    
    // Generate and insert traffic data
    const trafficData = generateTrafficData(1000);
    const { data: trafficResult, error: trafficError } = await supabase
      .from('traffic_data')
      .insert(trafficData);
    
    if (trafficError) throw trafficError;
    console.log(`✅ Inserted ${trafficData.length} traffic records`);
    
    // Generate and insert AI predictions
    const predictions = generateAIPredictions();
    const { data: predictionResult, error: predictionError } = await supabase
      .from('ai_predictions')
      .insert(predictions);
    
    if (predictionError) throw predictionError;
    console.log(`✅ Inserted ${predictions.length} prediction records`);
    
    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedData();
