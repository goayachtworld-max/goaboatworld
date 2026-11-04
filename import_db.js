const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

async function runImport() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sqlFile = fs.readFileSync('Database/development.sql', 'utf8');
  
  const statements = sqlFile.split(';').filter(s => s.trim().length > 0);
  console.log(`Found ${statements.length} statements to execute.`);
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    try {
      if (statement.toUpperCase().startsWith('COPY')) {
        console.log(`Skipping COPY statement ${i + 1}`);
        continue;
      }
      await pool.query(statement);
      successCount++;
    } catch (e) {
      console.error(`Error executing statement ${i + 1}: ${e.message}`);
      failCount++;
    }
  }
  
  console.log(`Import completed. Successes: ${successCount}, Failures: ${failCount}`);
  await pool.end();
}

runImport().catch(console.error);
