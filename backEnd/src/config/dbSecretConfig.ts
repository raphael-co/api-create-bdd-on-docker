// import mysql from 'mysql2/promise';

// async function createDatabaseSecretKeyConnection() {
//   // const connection = await mysql.createConnection({
//   //   host: '127.0.0.1',
//   //   user: 'root',
//   //   password: 'root',
//   //   database: 'secret-Key',
//   //   socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
//   // });

//   const connection = await mysql.createConnection({
//     host: 'mysql_secret', // Utilisez localhost si le code s'exécute hors de Docker
//     // port: 3307, // Port mappé pour le service mysql_secret
//     user: 'root',
//     password: 'root',
//     database: 'secret-Key'
//   });
  
//   console.log('Database secret-Key is connected successfully!');
//   return connection;
// }

// // Exportez la promesse de connexion pour une utilisation globale
// const databaseSecretKeyConnectionPromise = createDatabaseSecretKeyConnection();

// export default databaseSecretKeyConnectionPromise;


import mysql from 'mysql2/promise';

// Create a connection pool instead of a single connection
const poolSecret = mysql.createPool({
  host: 'mysql_secret', // Use 'localhost' if running outside Docker
  // port: 3306, // Mapped port for mysql service, if needed
  user: 'root',
  password: 'root',
  database: 'secret-Key',
  waitForConnections: true,
  connectionLimit: 10, // Set the limit for connections in the pool
  queueLimit: 0 // Set the limit for the queue of waiting connections
});

// Function to get a connection from the pool
async function getConnection() {
  const connection = await poolSecret.getConnection();
  console.log('Database bddStokage is connected successfully!');
  // Release the connection back to the pool when done
  connection.release();
  return connection;
}

// Use the pool for queries directly, or use getConnection for specific tasks
export default poolSecret;
