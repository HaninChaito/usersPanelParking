// controllers/notificationsController.js
import db from '../database.js'; // Adjust the path if needed

export const getNotifications = async (req, res) => {
  const userId = req.user.id; // from authenticateToken

  try {
    const [rows] = await db.query(`
      SELECT 
        R.Req_ID, 
        R.Status, 
        R.Comment, 
        R.UpdatedAt AS TimeStamp,  -- Replace RH.TimeStamp with R.Submit_Date or equivalent
        V.Vehicle_ID,
        V.Vehicle_Type, 
        V.Plate_Nb,
        V.Vehicle_Color,
        V.Insurance_Expiration_Date,
        V.Vehicle_Image,
        V.Driving_License,
        V.Insurance_Image
      FROM request R
      JOIN vehicle V ON V.Vehicle_ID = R.Vehicle_ID
      WHERE R.Sender_ID = ?
      ORDER BY R.UpdatedAt DESC  -- Replace with your actual timestamp column from request
    `, [userId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

