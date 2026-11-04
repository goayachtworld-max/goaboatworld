const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function runImport() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sqlPath = path.join(__dirname, '..', 'Database', 'development.sql');
  const sqlFile = fs.readFileSync(sqlPath, 'utf8');
  
  // Filter out comments and empty lines
  const cleanSql = sqlFile
    .split('\n')
    .filter(line => line.trim() && !line.trim().startsWith('--'))
    .join('\n');

  // We need to split into logical statements. 
  // For simplicity in this environment, we'll target the CREATE TABLE and basic setup.
  // Because the dump uses COPY, we will manually convert them to INSERTs or skip them.
  
  const statements = cleanSql.split(';').filter(s => s.trim().length > 0);
  console.log(`Found ${statements.length} statements to execute.`);
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    try {
      if (statement.toUpperCase().startsWith('COPY')) {
        console.log(`Skipping COPY statement ${i + 1} (requires psql client)`);
        continue;
      }
      await pool.query(statement);
      successCount++;
    } catch (e) {
      // Ignore role errors as we are using the provided user
      if (e.message.includes('role') || e.message.includes('owner')) {
        console.log(`Skipping ownership statement ${i + 1}: ${e.message}`);
        continue;
      }
      console.error(`Error executing statement ${i + 1}: ${e.message}`);
      failCount++;
    }
  }
  
  console.log(`Schema import completed. Successes: ${successCount}, Failures: ${failCount}`);
  await pool.end();
}

runImport().catch(console.error);
