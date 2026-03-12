const { Client } = require('pg');

const client = new Client({
  host: 'db.zwjujpjlisnynghmhioj.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fiszi3-timwoN-sepvik',
  database: 'postgres',
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected successfully!');

    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0]);

    await client.end();
  } catch (err) {
    console.error('Connection error', err);
  }
}

testConnection();