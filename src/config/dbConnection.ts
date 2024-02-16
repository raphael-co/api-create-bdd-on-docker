import mysql from 'mysql2/promise';

async function createDatabaseConnection() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'bddStokage',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  });

  console.log('Database is connected successfully!');
  return connection;
}

// Exportez la promesse de connexion pour une utilisation globale
const databaseConnectionPromise = createDatabaseConnection();

export default databaseConnectionPromise;
