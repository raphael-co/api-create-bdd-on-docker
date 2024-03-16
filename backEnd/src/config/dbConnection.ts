// import mysql from 'mysql2/promise';

// async function createDatabaseConnection() {
//   // const connection = await mysql.createConnection({
//   //   host: '127.0.0.1',
//   //   user: 'root',
//   //   password: 'root',
//   //   database: 'bddStokage',
//   //   socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
//   // });

//   const connection = await mysql.createConnection({
//     host: 'mysql', // Utilisez localhost si le code s'exécute hors de Docker
//     // port: 3306, // Port mappé pour le service mysql
//     user: 'root',
//     password: 'root',
//     database: 'bddStokage'
//   });
  

//   console.log('Database bddStokage is connected successfully!');
//   return connection;
// }

// // Exportez la promesse de connexion pour une utilisation globale
// const databaseConnectionPromise = createDatabaseConnection();

// export default databaseConnectionPromise;

import mysql from 'mysql2/promise';

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: 'mysql', // Use 'localhost' if running outside Docker
  // port: 3306, // Mapped port for mysql service, if needed
  user: 'root',
  password: 'root',
  database: 'bddStokage',
  waitForConnections: true,
  connectionLimit: 10, // Set the limit for connections in the pool
  queueLimit: 0 // Set the limit for the queue of waiting connections
});

// Function to get a connection from the pool
async function getConnection() {
  const connection = await pool.getConnection();
  console.log('Database bddStokage is connected successfully!');
  // Release the connection back to the pool when done
  connection.release();
  return connection;
}

// Use the pool for queries directly, or use getConnection for specific tasks
export default pool;
