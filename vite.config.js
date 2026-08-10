import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // المصادقة والمستخدمين: السيرفر المحلي (قاعدة بيانات محلية)
      '/api/v1': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
      // باقي الـ API (المنتجات، الماركات): الـ API البعيد الجاهز
      '/api': {
        target: 'https://api.nashamastore.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
