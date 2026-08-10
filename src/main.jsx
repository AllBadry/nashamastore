import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useAuthStore } from './store/authStore.js'

// استرجاع جلسة المستخدم المخزنة (توكن) عند تشغيل التطبيق
useAuthStore.getState().restoreSession()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
