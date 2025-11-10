import { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleRequestForm from '../RequestForm/VehicleRequestForm';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [modificationRequest, setModificationRequest] = useState(null);
  const statusArabicMap = {
  pending: 'قيد الانتظار',
  declined: 'مرفوض',
  modified: 'مُعدّل, قيد الانتظار',
  modification_requested: 'تم طلب تعديل',
  approvedByManager: 'تمت الموافقة من الادارة',
  approvedBySecurity: 'تمت الموافقة على الطلب, يمكنك الان الدخول بالمركبة'
};
const statusColorMap = {
  pending: '#f39c12', // yellow
  declined: '#e74c3c', // red
  approvedByManager: '#3498db', // blue
  approvedBySecurity: '#2ecc71', // green
  modification_requested: '#e67e22', // orange
  modified: '#9b59b6' // purple
};



  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/notify`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setNotifications(res.data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <main className="form-main">
      <div className="form-container">
        <h2 className="form-title">الإشعارات</h2>

        {notifications.length === 0 ? (
          <p className="text-muted text-center">لا توجد إشعارات حالياً.</p>
        ) : (
          notifications.map((notif, i) => (
            <div key={i} className="notification-box">
            <p>
  <strong>الحالة:</strong>{' '}
  <span style={{ color: statusColorMap[notif.Status] || '#333' }}>
    {statusArabicMap[notif.Status] || notif.Status}
  </span>
</p>


              <p><strong>رقم اللوحة:</strong> {notif.Plate_Nb}</p>
              <p><strong>نوع المركبة:</strong> {notif.Vehicle_Type}</p>
              <p><strong>ملاحظات:</strong> {notif.Comment || '- '}</p>
              <p><strong>التاريخ:</strong>{' '}
  {notif.TimeStamp ? new Date(notif.TimeStamp).toLocaleString('ar-EG') : 'لا يوجد تاريخ'}</p>

              {notif.Status === 'modification_requested' && (
                <button className="modify-button" onClick={() => setModificationRequest(notif)}>
                  تعديل الطلب
                </button>
              )}
            </div>
          ))
        )}

        {modificationRequest && (
          <div className="modification-form">
            <h3 className="form-title">تعديل الطلب الحالي</h3>
            <p className="text-warning"><strong>ملاحظة:</strong> {modificationRequest.Comment}</p>
            <VehicleRequestForm prefillRequest={modificationRequest} isModification={true} />
          </div>
        )}
      </div>
    </main>
  );
}
