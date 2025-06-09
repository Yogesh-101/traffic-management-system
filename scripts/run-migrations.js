import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function readSqlFile(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading SQL file: ${filePath}`, error);
    throw error;
  }
}

async function runMigrations() {
  // Initialize Supabase client
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase URL or Anon Key in environment variables');
    console.log('Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🚀 Running database migrations...');
    
    // Read and execute the system_alerts migration
    const systemAlertsSql = await readSqlFile(
      join(__dirname, '..', 'supabase', 'migrations', '20240609000000_create_system_alerts.sql')
    );
    
    // Read and execute the AI tables migration
    const aiTablesSql = await readSqlFile(
      join(__dirname, 'create_ai_tables.sql')
    );

    // Execute the SQL files using raw SQL execution
    console.log('\n🔨 Creating system_alerts table...');
    await executeSql(supabase, systemAlertsSql, 'system_alerts');

    console.log('\n🤖 Creating AI tables...');
    await executeSql(supabase, aiTablesSql, 'AI tables');

    console.log('\n✅ Database migrations completed successfully!');
    console.log('🎉 Your database is now ready to use!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error running migrations:', error.message);
    console.error('\n💡 If you see "permission denied" errors, make sure your Supabase database has the correct permissions.');
    console.error('   You may need to run these SQL commands in the Supabase SQL editor first:');
    console.error('   - CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    console.error('   - GRANT ALL PRIVILEGES ON DATABASE your_database_name TO postgres;');
    process.exit(1);
  }
}

async function executeSql(supabase, sql, description) {
  try {
    // Try direct SQL execution first
    const { error } = await supabase.rpc('pg_catalog.pg_exec', { query: sql });
    
    if (error) {
      // If direct execution fails, try using the exec function
      if (error.message.includes('function pg_catalog.pg_exec(unknown) does not exist')) {
        console.log(`  ⚡ Using exec function for ${description}...`);
        const { error: execError } = await supabase.rpc('exec', { query: sql });
        if (execError) throw execError;
      } else {
        throw error;
      }
    }
    
    console.log(`  ✓ Successfully executed ${description} migration`);
  } catch (error) {
    console.error(`  ✗ Error executing ${description} migration:`, error.message);
    throw error;
  }
}

// Run the migrations
runMigrations().catch(error => {
  console.error('Unhandled error in migrations:', error);
  process.exit(1);
});
