import { useState } from 'react';
import './SetPassword.css'; // Reuse same CSS as Login
import { useNavigate, useParams } from 'react-router-dom';


export default function SetPassword() {
  const {email} = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');
    setSuccess('');

    const { password, confirmPassword } = formData;

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

 try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'حدث خطأ أثناء تعيين كلمة المرور');
        return;
      }

      setSuccess('تم تعيين كلمة المرور بنجاح');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Set password error:', err);
      setError('فشل الاتصال بالخادم');
    } 
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">تعيين كلمة المرور</h2>
            <p className="login-subtitle">يرجى إدخال كلمة مرور جديدة وتأكيدها</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">كلمة المرور الجديدة</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="أدخل كلمة المرور"
                dir="rtl"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">تأكيد كلمة المرور</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="أعد إدخال كلمة المرور"
                dir="rtl"
              />
            </div>

            {/* Error or Success Message */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Submit Button */}
            <button type="submit" className="login-button">
              حفظ كلمة المرور
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
