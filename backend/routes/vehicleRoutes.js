import express from 'express';
import vehicleController from '../controllers/vehicleController.js';
import upload from '../middlewares/upload.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

// Handle vehicle request submission
router.post('/submit-vehicle', authenticateToken, upload.fields([
  { name: 'vehicleImage', maxCount: 1 },
  { name: 'drivingLicenseImage', maxCount: 1 },
  { name: 'insuranceImage', maxCount: 1 },
]),vehicleController.submitVehicleRequest);

router.get('/check-existing-request', authenticateToken, vehicleController.checkExistingRequest);


export default router;
