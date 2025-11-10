import pool from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


export const login = async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const [rows] = await pool.query('SELECT * FROM User WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'غير موجود' });
    }

    const user = rows[0];

   const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
    }
    console.log("Entered password:", password);
    console.log("Stored hash:", user.Password);
    // Step 3: Generate JWT token
  
  
 const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

   return res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.UserID,
        name: `${user.FirstName} ${user.LastName}`,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'حدث خطأ ما في الخادم' });
  }
};


export const CreateAccount = async (req, res) => {
  const { email} = req.body;
  

  try {
    const [rows] = await pool.query('SELECT * FROM User WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'غير موجود' });
    }

    const user = rows[0];

  

   return res.status(200).json({
      message: 'تم ايجاد البريد الشخصي بنجاح',
      user: {
        id: user.UserID,
        name: `${user.FirstName} ${user.LastName}`,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'حدث خطأ ما في الخادم' });
  }
};


export const  sendEmail = async(req,res)=> {
   const { to, subject, text } = req.body;
  console.log("Email Params →", { to, subject, text });
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email  ,    // Replace with your Gmail address
      pass: process.env.App_Password// Use app password or real password
    },
    tls: {
    rejectUnauthorized: false, // Allow self-signed cert
  },
  });

  
 try {
    let info = await transporter.sendMail({
      from: `"Lebanese University Vehivcle Access " <${process.env.email}>`, // sender address
      to,
      subject,  // Subject line
      text      // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
 } 


export const setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [rows] = await pool.query('SELECT * FROM User WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the password
    await pool.query('UPDATE User SET Password = ? WHERE Email = ?', [hashedPassword, email]);

    return res.status(200).json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Set password error:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث كلمة المرور' });
  }
};

