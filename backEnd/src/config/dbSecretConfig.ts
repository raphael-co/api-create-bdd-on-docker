import mysql from 'mysql2/promise';

async function createDatabaseSecretKeyConnection() {
  // const connection = await mysql.createConnection({
  //   host: '127.0.0.1',
  //   user: 'root',
  //   password: 'root',
  //   database: 'secret-Key',
  //   socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  // });

  const connection = await mysql.createConnection({
    host: 'mysql_secret', // Utilisez localhost si le code s'exécute hors de Docker
    // port: 3307, // Port mappé pour le service mysql_secret
    user: 'root',
    password: 'root',
    database: 'secret-Key'
  });
  
  console.log('Database secret-Key is connected successfully!');
  return connection;
}

// Exportez la promesse de connexion pour une utilisation globale
const databaseSecretKeyConnectionPromise = createDatabaseSecretKeyConnection();

export default databaseSecretKeyConnectionPromise;
