
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tmgbrmkzagzfjdjmtifo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ2JybWt6YWd6Zmpkam10aWZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0MzEzNiwiZXhwIjoyMDcyNDE5MTM2fQ._6I04Cc_nJA2Pikth_InLlVzQNzURjA6_J1UJWzMM-A'
const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
  console.log('Starting migration...')
  
  // Note: execute_sql RPC might not exist if not created. 
  // I'll try to use standard queries if possible, but for DDL I might need execute_sql.
  // If execute_sql fails, I'll assume I can't do DDL this way and might need the user to run it.
  // But usually in these environments, an 'execute_sql' function is provided.
  
  const sql = `
    ALTER TABLE buffet_offers ADD COLUMN IF NOT EXISTS persons_count INTEGER DEFAULT 0;
    
    ALTER TABLE daily_meals ADD COLUMN IF NOT EXISTS meters_count INTEGER DEFAULT 0;
    ALTER TABLE daily_meals ADD COLUMN IF NOT EXISTS items_count INTEGER DEFAULT 0;
    ALTER TABLE daily_meals ADD COLUMN IF NOT EXISTS persons_count INTEGER DEFAULT 0;
    ALTER TABLE daily_meals ADD COLUMN IF NOT EXISTS pepsi_per_meter INTEGER DEFAULT 0;
    ALTER TABLE daily_meals ADD COLUMN IF NOT EXISTS water_per_meter INTEGER DEFAULT 0;
    ALTER TABLE daily_meals ADD COLUMN IF NOT EXISTS includes_dessert BOOLEAN DEFAULT FALSE;
  `
  
  const { data, error } = await supabase.rpc('execute_sql', { sql })
  
  if (error) {
    console.error('Migration failed:', error)
    // If it fails because execute_sql doesn't exist, we'll try another way or report.
  } else {
    console.log('Migration successful:', data)
  }
}

migrate()
