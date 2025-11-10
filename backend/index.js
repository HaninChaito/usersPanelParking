import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath function
import db from './database.js'; // make sure this file also uses ESM
import fs from 'fs';
import notificationsRoutes from './routes/notificationsRoutes.js';

dotenv.config();

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(
  cors({
    origin: "https://users-panel-parking-6i36xt0zx-haninchaitos-projects.vercel.app", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);
// Use the notification route under /api/notifications
app.use('/api/notifications', notificationsRoutes);

const PORT =process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runningn porjj ${PORT}`);
});

// Right after app.listen()
console.log("\n🔥 Server Status:");
console.log(`- Port: ${PORT}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? "Exists" : "MISSING!"}`);
console.log(`- DB Connected: ${(await db.query('SELECT 1')).length ? "✅" : "❌"}`);
console.log(`- Uploads folder: ${fs.existsSync('uploads') ? "✅" : "❌"}`);

/*async function getUsers() {
  try {
    const [rows] = await db.query('SELECT * FROM user');
    console.log(rows);
  } catch (err) {
    console.error('DB Error:', err);
  }
}

getUsers();*/
console.log(await bcrypt.compare('hashedpass4',
  '$2b$10$fkcA8K/zkvfdWpq/UwMXo.xqwaBWDI0K.07AguMpX4qqcoyisyiOy'
)); // it  return true wich is true actually
