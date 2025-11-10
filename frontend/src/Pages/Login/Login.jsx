import { useState } from 'react';
import './Login.css'
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setError('');

try {
  const response = await fetch('${import.meta.env.VITE_API_URL}/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.message || 'حدث خطأ أثناء تسجيل الدخول');
    return;
  }
  console.log(data);

  
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.user.id);
  alert('تم تسجيل الدخول بنجاح!');



  
  navigate('/VehicleRequestForm');

} catch (err) {
  console.error('Login error:', err);
  setError('فشل الاتصال بالخادم');
}

  };

  return (
    <div className="login-container">
     
      
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">تسجيل الدخول</h2>
            <p className="login-subtitle">نظام تصاريح دخول المركبات - الجامعة اللبنانية</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="form-input"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="أدخل البريد الإلكتروني"
                dir="rtl"
              />
            </div>

         {/*   Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">كلمة المرور</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="form-input"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="أدخل كلمة المرور"
                dir="rtl"
              />
            </div>

            
            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Login Button */}
            <button type="submit" className="login-button">
              تسجيل الدخول
            </button>
          </form>

          <div className="register-link" style={{ marginTop: '1rem', textAlign: 'center' }}>
  <p>
    ليس لديك حساب؟{' '}
    <span 
      onClick={() => navigate('/CreateAccount')} 
      style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
    >
      اضغط هنا لإنشاء حساب
    </span>
  </p>
</div>


          
        </div>
      </div>
    </div>
  );
}