import { Client } from 'pg';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

// Get file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SQL files
const SQL_FILES = [
  join(__dirname, '..', 'supabase', 'migrations', '20240609122440_create_incidents_table.sql')
];

async function runMigrations() {
  // Get database connection string from environment
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ Error: Missing database connection string');
    console.log('Please set DATABASE_URL in your .env file with the correct connection string');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🚀 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Enable UUID extension if not exists
    console.log('\n🔧 Setting up extensions...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

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
        let i = 0;
        for (const statement of statements) {
          try {
            // Check if table already exists before creating it
            if (statement.includes('CREATE TABLE')) {
              const tableNameMatch = statement.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/);
              if (tableNameMatch) {
                const tableName = tableNameMatch[1];
                const tableExists = await client.query(
                  `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`,
                  [tableName]
                );
                if (tableExists.rows[0].exists) {
                  // If table exists, check if we need to modify its schema
                  const columns = await client.query(
                    `SELECT column_name, data_type, is_nullable 
                     FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = $1`,
                    [tableName]
                  );
                  
                  // For system_alerts table, check if we need to add is_active column
                  if (tableName === 'system_alerts' && !columns.rows.some(col => col.column_name === 'is_active')) {
                    console.log(`  [${i + 1}/${statements.length}] Adding is_active column to system_alerts`);
                    await client.query(`ALTER TABLE public.system_alerts ADD COLUMN is_active BOOLEAN DEFAULT TRUE`);
                    // Skip the CREATE TABLE statement since table already exists
                    i++;
                    continue;
                  }
                  
                  console.log(`  [${i + 1}/${statements.length}] Skipping: Table ${tableName} already exists`);
                  i++;
                  continue;
                }
              }
            }
            
            console.log(`  [${i + 1}/${statements.length}] Executing: ${statement.substring(0, 50)}...`);
            await client.query(statement);
            i++;
          } catch (error) {
            console.error(`❌ Error executing statement ${i + 1}: ${error.message}`);
            throw error;
          }
        }
        
        console.log(`✅ Successfully executed ${sqlFile.split('/').pop()}`);
      } catch (error) {
        console.error(`❌ Error executing ${sqlFile}:`, error.message);
        if (error.message.includes('already exists')) {
          console.log('  ℹ️ This is not a critical error - the table already exists');
          continue;
        }
        throw error;
      }
    }
    
    console.log('\n🎉 Database migrations completed successfully!');
    console.log('Your database is now ready to use with the traffic management system.');
  } catch (error) {
    console.error('\n❌ Error running migrations:', error.message);
    console.error('\n💡 If you see connection errors, make sure:');
    console.error('   - Your database server is running');
    console.error('   - Your connection details are correct');
    console.error('   - The database user has sufficient permissions');
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the migrations
runMigrations().catch(error => {
  console.error('Unhandled error in migrations:', error);
  process.exit(1);
});
