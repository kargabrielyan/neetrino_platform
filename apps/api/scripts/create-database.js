// Скрипт для создания базы данных PostgreSQL
const { Client } = require('pg');

const dbHost = process.argv[2] || 'localhost';
const dbPort = parseInt(process.argv[3]) || 5432;
const dbUser = process.argv[4] || 'postgres';
const dbPassword = process.argv[5] || '';
const dbName = process.argv[6] || 'neetrino_platform';

const client = new Client({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: 'postgres'
});

client.connect()
  .then(async () => {
    try {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('SUCCESS');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('EXISTS');
      } else {
        throw err;
      }
    }
    client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.log('FAILED: ' + err.message);
    process.exit(1);
  });



