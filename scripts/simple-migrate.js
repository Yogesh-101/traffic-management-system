import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

// Get file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SQL files
const SQL_FILES = [
  join(__dirname, '..', 'supabase', 'migrations', '20240609000000_create_system_alerts.sql'),
  join(__dirname, 'create_ai_tables.sql')
];

async function runMigrations() {
  // Get Supabase credentials
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase URL or Anon Key in environment variables');
    console.log('Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🚀 Running database migrations...');
    
    // Execute each SQL file
    for (const sqlFile of SQL_FILES) {
      try {
        console.log(`\n📄 Executing ${sqlFile.split('/').pop()}...`);
        const sql = await readFile(sqlFile, 'utf8');
        
        // Split SQL into individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        // Execute each statement
        for (const statement of statements) {
          if (!statement) continue;
          console.log(`  → ${statement.split('\n')[0].substring(0, 60)}...`);
          const { error } = await supabase.rpc('pg_catalog.pg_exec', { query: statement });
          if (error) {
            // If the function doesn't exist, try the exec function
            if (error.message.includes('function pg_catalog.pg_exec(unknown) does not exist')) {
              console.log('  ⚡ Trying alternative execution method...');
              const { error: execError } = await supabase.rpc('exec', { query: statement });
              if (execError) throw execError;
            } else {
              throw error;
            }
          }
        }
        
        console.log(`✅ Successfully executed ${sqlFile.split('/').pop()}`);
      } catch (error) {
        console.error(`❌ Error executing ${sqlFile}:`, error.message);
        if (error.message.includes('permission denied')) {
          console.log('\n💡 Permission denied. You may need to run these SQL commands in the Supabase SQL editor first:');
          console.log('   CREATE EXTENSION IF NOT EXISTS pgcrypto;');
          console.log('   GRANT ALL PRIVILEGES ON DATABASE your_database_name TO postgres;');
        }
        process.exit(1);
      }
    }
    
    console.log('\n🎉 Database migrations completed successfully!');
    console.log('Your database is now ready to use with the traffic management system.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Unhandled error in migrations:', error.message);
    process.exit(1);
  }
}

// Run the migrations
runMigrations();
