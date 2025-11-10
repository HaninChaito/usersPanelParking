// db.js
import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2';
import bcrypt from 'bcrypt';


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
   ssl: {
      // Aiven requires an SSL connection
      rejectUnauthorized: false,
    }
});

// Use this for all promise-based operations
const promisePool = pool.promise();
export default promisePool;

// Hash all existing passwords (only run this once)
const [users] = await promisePool.query('SELECT UserID, Password FROM user');

for (const user of users) {
  if (!user.Password.startsWith('$2b$')) { // already hashed?
    const hashed = await bcrypt.hash(user.Password, 10);
    await promisePool.query('UPDATE User SET Password = ? WHERE UserID = ?', [hashed, user.UserID]);
    console.log(`Updated password for UserID ${user.UserID}`);
  }
}

console.log('Done hashing all user passwords.');
