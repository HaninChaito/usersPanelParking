import { useState } from 'react';
import './CreateAccount.css'
import { Navigate, useNavigate } from 'react-router-dom';

export default function CreateAccount() {
  const [credentials, setCredentials] = useState({
    email: ''
  });
  const [error, setError] = useState('');

  

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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/CreateAccount`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.message || 'أدخل البريد الإلكتروني المسجّل لدى الجامعة');
    return;
  }
  console.log(data);

 


const email = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: data.user.email,
    subject: 'رابط إعداد كلمة المرور الخاصة بك',
    text: `نرجو منكم استخدام الرابط التالي لإعداد كلمة المرور الخاصة بحسابكم:\n\nhttp://localhost:5173/SetPassword/${data.user.email}\n\nيرجى عدم مشاركة هذا الرابط مع أي شخص آخر حفاظًا على سرية معلوماتكم.\n\nإذا لم تطلب إعداد كلمة مرور، يرجى تجاهل هذه الرسالة.`
  })
});


const result = await email.json();
console.log(result);
alert("يرجى التحقق من بريدك الإلكتروني، لقد أرسلنا رسالة لإتمام العملية.");


 

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
                placeholder="أدخل بريدك الإلكتروني"
                dir="rtl"
              />
            </div>

         

            
            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Login Button */}
            <button type="submit" className="login-button">
              ارسال
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}