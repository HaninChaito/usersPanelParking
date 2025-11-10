import db from '../database.js';
import fs from 'fs';
import path from 'path';

const saveFile = (buffer, originalname) => {
  const uniqueName = Date.now() + '-' + originalname.replace(/\s+/g, '-');
  const filePath = path.join('uploads', uniqueName);
  fs.writeFileSync(filePath, buffer);
  return uniqueName;
};

const submitVehicleRequest = async (req, res) => {
  let conn;
  try {
     conn = await db.getConnection(); // ✅ Get a connection from the pool
    await conn.beginTransaction();
    
    const { vehicleType, plateNumber, vehicleColor, insuranceExpiry } = req.body;
    const userId = req.user.id;

    // ✅ Validate insurance date
    const expiryDate = new Date(insuranceExpiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(expiryDate.getTime()) || expiryDate <= today) {
      return res.status(400).json({ message: 'صلاحية التامين منتهية لديك,الطلب مرف' });
    }

const [plateTaken] = await db.query(
  `
    SELECT 1 
    FROM vehicle v
    WHERE v.Plate_Nb = ?
      
      AND (
        EXISTS (
          SELECT 1 FROM approved_vehicles av 
          WHERE av.Vehicle_ID = v.Vehicle_ID 
            AND av.Status IN ('enabled', 'disabled')
)
        OR (
        EXISTS (
          SELECT 1 FROM request r
          WHERE r.Vehicle_ID = v.Vehicle_ID
            AND r.Status NOT IN ('declined', 'approvedByManager','modification_requested')
            
))
        
)
    LIMIT 1
  `,
  [plateNumber]
);


if (plateTaken.length > 0) {
  return res.status(409).json({ message: 'رقم اللوحة مستخدم من قبل' });
}

    // ✅ Handle file uploads
    const files = {
      vehicle: req.files.vehicleImage?.[0] ? saveFile(req.files.vehicleImage[0].buffer, req.files.vehicleImage[0].originalname) : null,
      license: req.files.drivingLicenseImage?.[0] ? saveFile(req.files.drivingLicenseImage[0].buffer, req.files.drivingLicenseImage[0].originalname) : null,
      insurance: req.files.insuranceImage?.[0] ? saveFile(req.files.insuranceImage[0].buffer, req.files.insuranceImage[0].originalname) : null,
    };

   


        // Check if the user has a request that is pending or declined or approved or modified
        //bde es2al iza n3amal declined aw approved la request la user iza by2dr yrj3 y3mel another request aw laa
   /*const [existingRequest] = await db.query(
      'SELECT * FROM Request WHERE Sender_ID = ? AND Status IN (?, ?,?,?)',
      [userId,  'pending', 'modified','approvedByManager','declined']
    );

        if(existingRequest.length) return res.status(400).json({ message: ' يوجد طلب سابق باسمك' }) */

           // ✅ Insert new vehicle (always create a new row)
    const [vehicleResult] = await db.query(`
      INSERT INTO Vehicle SET ?
    `, {
      User_ID: userId,
      Vehicle_Type: vehicleType,
      Plate_Nb: plateNumber,
      Vehicle_Color: vehicleColor,
      Vehicle_Image: files.vehicle,
      Insurance_Image: files.insurance,
      Insurance_Expiration_Date: insuranceExpiry,
      Driving_License: files.license
    });

    console.log(vehicleResult);

    const newVehicleId = vehicleResult.insertId;

    // ✅ Check for existing request in "modification_requested" status
    const [modificationRequest] = await db.query(`
      SELECT Req_ID 
      FROM Request 
      WHERE Sender_ID = ? AND Status = 'modification_requested'
      LIMIT 1
    `, [userId]);

    if (modificationRequest.length > 0) {
      // 🔁 Update existing request with new vehicle
      const requestId = modificationRequest[0].Req_ID;
      
        const [[requestData]] = await db.query(
    `SELECT ModificationCount FROM Request WHERE Req_ID = ?`,
    [requestId]
  );

  const modificationCount = (requestData?.ModificationCount || 0) + 1;

      await db.query(`
        UPDATE Request SET Vehicle_ID = ?, Status = 'modified', ModificationCount = ?  WHERE Req_ID = ?
      `, [newVehicleId, modificationCount, requestId]);

      return res.status(200).json({ success: true, message: 'تم تحديث الطلب الحالي بنجاح' });
    }

    // 📨 No modifiable request exists — create a new request
    
    else{
     

      await db.query(`
      INSERT INTO Request SET ?
    `, {
      Sender_ID: userId,
      Vehicle_ID: newVehicleId,
      Status: 'pending',
        Request_Date: new Date()
    });

      await conn.commit();
    return res.status(200).json({ success: true, message: 'تم ارسال الطلب بنجاح' });

  } }catch (err) {
    console.error('Submission error:', err);
    return res.status(500).json({ message: 'حدث خطأ في الطلب' });
  }
};

const checkExistingRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const [existingRequest] = await db.query(
      'SELECT * FROM Request WHERE Sender_ID = ? AND Status IN (?)',
      [userId,  'pending']
    );

    if (existingRequest.length > 0) {
      return res.json({ hasRequest: true });
    } else {
      return res.json({ hasRequest: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'خطأ في التحقق من الطلبات السابقة' });
  }
};

export default {
  submitVehicleRequest,
  checkExistingRequest, // ⬅️ Export the new function
};