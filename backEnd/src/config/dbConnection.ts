import mysql from 'mysql2/promise';

async function createDatabaseConnection() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'bddStokage',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  });

  // const connection = await mysql.createConnection({
  //   host: 'mysql', // Utilisez localhost si le code s'exécute hors de Docker
  //   // port: 3306, // Port mappé pour le service mysql
  //   user: 'root',
  //   password: 'root',
  //   database: 'bddStokage'
  // });
  

  console.log('Database bddStokage is connected successfully!');
  return connection;
}

// Exportez la promesse de connexion pour une utilisation globale
const databaseConnectionPromise = createDatabaseConnection();

export default databaseConnectionPromise;
