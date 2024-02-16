import mysql from 'mysql2/promise';

async function createDatabaseSecretKeyConnection() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'secret-Key',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  });

  console.log('Database is connected successfully!');
  return connection;
}

// Exportez la promesse de connexion pour une utilisation globale
const databaseSecretKeyConnectionPromise = createDatabaseSecretKeyConnection();

export default databaseSecretKeyConnectionPromise;
