import { useState, useEffect } from 'react';
// Assuming you will use the same CSS file or combine styles
import './VehicleRequestForm.css'; 

export default function VehicleRequestForm({ prefillRequest = null, isModification = false }) {
  const [formData, setFormData] = useState({
    vehicleType: '',
    plateNumber: '',
    vehicleColor: '',
    insuranceExpiry: '',
  });
  const [formMessage, setFormMessage] = useState('');
const [formMessageType, setFormMessageType] = useState('');

  const [vehicleImage, setVehicleImage] = useState(null);
  const [drivingLicenseImage, setDrivingLicenseImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [loadingRequestCheck, setLoadingRequestCheck] = useState(true);
  
  // State for file names to display in the UI, similar to the guest form
  const [vehicleImageName, setVehicleImageName] = useState("");
  const [drivingLicenseImageName, setDrivingLicenseImageName] = useState("");
  const [insuranceImageName, setInsuranceImageName] = useState("");

  useEffect(() => {
    const checkRequest = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicle/check-existing-request`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setHasExistingRequest(data.hasRequest);
      } catch (err) {
        console.error('Error checking existing request', err);
      } finally {
        setLoadingRequestCheck(false);
      }
    };
    checkRequest();
  }, []);

  useEffect(() => {
    if (isModification && prefillRequest) {
      setFormData({
        vehicleType: prefillRequest.Vehicle_Type || '',
        plateNumber: prefillRequest.Plate_Nb || '',
        vehicleColor: prefillRequest.Vehicle_Color || '',
        insuranceExpiry: prefillRequest.Insurance_Expiration_Date?.split('T')[0] || '',
      });
    }
  }, [isModification, prefillRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  // Updated file change handler to also set the file name for display
  const handleFileChange = (e, fileSetter, fileNameSetter) => {
    const file = e.target.files[0];
    if (file) {
      fileSetter(file);
      fileNameSetter(file.name);
    } else {
      fileSetter(null);
      fileNameSetter("");
    }
  };

  const handleSubmit = async (e) => {
    if (loading) return;
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('vehicleType', formData.vehicleType);
    data.append('plateNumber', formData.plateNumber);
    data.append('vehicleColor', formData.vehicleColor);
    data.append('insuranceExpiry', formData.insuranceExpiry);

    if (vehicleImage) data.append('vehicleImage', vehicleImage);
    if (drivingLicenseImage) data.append('drivingLicenseImage', drivingLicenseImage);
    if (insuranceImage) data.append('insuranceImage', insuranceImage);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicle/submit-vehicle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Request failed');
        setFormMessage('✅ تم إرسال الطلب بنجاح!');
  setFormMessageType('success');
    } catch (error) {
       setFormMessage(error.message || '❌ حدث خطأ أثناء إرسال الطلب.');
  setFormMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container"> {/* Using guest form's main container class */}
      <div className="header">
        <h1>طلب تصريح دخول مركبة</h1>
      </div>

      <div className="form-container">
        {loadingRequestCheck ? (
          <p>...جاري التحميل</p>
        ): (
          <form id="vehicleRequestForm" onSubmit={handleSubmit} encType="multipart/form-data">

            <div className="form-section">
              <h3 className="section-title">معلومات المركبة</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehicleType">نوع المركبة</label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">اختر نوع المركبة</option>
                    <option value="سيارة">سيارة</option>
                    <option value="دراجة نارية">دراجة نارية</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleColor">لون المركبة</label>
                  <input
                    type="text"
                    id="vehicleColor"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="plateNumber">رقم اللوحة</label>
                  <input
                    type="text"
                    id="plateNumber"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">المستندات المطلوبة</h3>

              <div className="form-row">
                 <div className="form-group">
                    <label className="file-input-label" htmlFor="vehicleImage">
                      صورة المركبة
                      <input
                        type="file"
                        id="vehicleImage"
                        className="file-input"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setVehicleImage, setVehicleImageName)}
                        required={!isModification}
                      />
                    </label>
                    {isModification && prefillRequest?.Vehicle_Image && !vehicleImageName && <div className="selected-file">📎 تم رفع صورة مسبقاً</div>}
                    {vehicleImageName && <div className="selected-file">{vehicleImageName}</div>}
                 </div>
                 <div className="form-group">
                    <label className="file-input-label" htmlFor="drivingLicenseImage">
                       صورة رخصة القيادة
                       <input
                         type="file"
                         id="drivingLicenseImage"
                         className="file-input"
                         accept="image/*"
                         onChange={(e) => handleFileChange(e, setDrivingLicenseImage, setDrivingLicenseImageName)}
                         required={!isModification}
                       />
                    </label>
                    {isModification && prefillRequest?.Driving_License && !drivingLicenseImageName && <div className="selected-file">📎 تم رفع صورة مسبقاً</div>}
                    {drivingLicenseImageName && <div className="selected-file">{drivingLicenseImageName}</div>}
                 </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="file-input-label" htmlFor="insuranceImage">
                    صورة وثيقة التأمين
                    <input
                      type="file"
                      id="insuranceImage"
                      className="file-input"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setInsuranceImage, setInsuranceImageName)}
                      required={!isModification}
                    />
                  </label>
                  {isModification && prefillRequest?.Insurance_Image && !insuranceImageName && <div className="selected-file">📎 تم رفع صورة مسبقاً</div>}
                  {insuranceImageName && <div className="selected-file">{insuranceImageName}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="insuranceExpiry">تاريخ صلاحية التأمين</label>
                  <input
                    type="date"
                    id="insuranceExpiry"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'جاري إرسال الطلب...' : isModification ? 'تعديل الطلب' : 'تقديم الطلب'}
            </button>
            {formMessage && (
  <div className={`form-message ${formMessageType}`}>
    {formMessage}
  </div>
)}
          </form>
          
        )}
      </div>
    </div>
  );
}