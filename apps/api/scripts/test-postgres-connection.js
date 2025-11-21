// Скрипт для проверки подключения к PostgreSQL
const { Client } = require('pg');

const dbHost = process.argv[2] || 'localhost';
const dbPort = parseInt(process.argv[3]) || 5432;
const dbUser = process.argv[4] || 'postgres';
const dbPassword = process.argv[5] || '';

const client = new Client({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: 'postgres'
});

client.connect()
  .then(() => {
    console.log('SUCCESS');
    client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.log('FAILED');
    process.exit(1);
  });


