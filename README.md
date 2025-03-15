# EdTech Platformasi Backend

Bu repository EdTech platformasi uchun backend kod bazasini o'z ichiga oladi. Backend API xizmatlarini taqdim etib, platformaning to'liq ishlashini ta'minlaydi.

## 📌 Loyihaning tavsifi
EdTech platformasi o'quvchilar va o'qituvchilar uchun onlayn ta'lim berish va olish imkoniyatini yaratadi. Platforma quyidagi imkoniyatlarni taqdim etadi:
Royxatdan otkazish
Kurslar yaratish
AI bilan integratsiya

## 🌍 API Ma'lumotlari
**Base URL:** [https://edtech-platformasi-backend-5.onrender.com/api](https://edtech-platformasi-backend-5.onrender.com/api)

### 📜 API dokumentatsiyasi
Postman API dokumentatsiyasiga quyidagi havola orqali kirishingiz mumkin:
[Postman Documentation](https://documenter.getpostman.com/view/24139292/2sAYkBrLKA)

## 🚀 Deployment Havolalari
- **Backend API:** [Render Backend](https://edtech-platformasi-backend-5.onrender.com/api)
- **Admin Panel (Frontend):** [Netlify Dashboard](https://incredible-khapse-9e6f13.netlify.app/dashboard)

## 🔧 Texnologiyalar
- **Backend:** Node.js, Express.js
- **Ma'lumotlar ombori:** MongoDB
- **Autentifikatsiya:** JWT (JSON Web Token)
- **AI Yordamchi:** OpenAI API integratsiyasi
- **Deployment:** Render, Netlify

## ⚙️ O'rnatish va Ishga Tushirish
Loyihani ishga tushirish uchun quyidagi bosqichlarni bajaring:

### 1. Repositoryni klonlash
```bash
git clone https://github.com/abduhamid707/EdTech-platformasi_backend_4.git
cd EdTech-platformasi_backend_4
```

### 2. Muhit o'zgaruvchilarini sozlash
`.env` faylini yaratib, quyidagi ma'lumotlarni qo'shing:
```env
PORT=YOUR_PORT
SECRET_KEY=YOUR_KEY
OPENAI_API_KEY=YOUR_OPEN_AI_KEY
```

### 3. Paketlarni o'rnatish
```bash
npm install
```

### 4. Serverni ishga tushirish
```bash
npm start
```
Yoki development rejimida ishga tushirish uchun:
```bash
npm run dev
```

## 🔑 Autentifikatsiya
Foydalanuvchilar JWT orqali autentifikatsiya qilinadi. Har bir so‘rov `Authorization: Bearer <TOKEN>` sarlavhasi bilan yuborilishi kerak.

## 📚 Asosiy API endpointlari
| Yo'l | Metod | Tavsif |
|------|------|--------|
| `/auth/register` | POST | Foydalanuvchini ro'yxatdan o'tkazish |
| `/auth/login` | POST | Login qilish va JWT olish |
| `/courses` | GET | Barcha kurslarni olish |
| `/courses/:id` | GET | Bitta kursni olish |
| `/ai-assistant` | POST | AI yordamchi bilan suhbat |

## 🛠 Muammo bartaraf qilish
Agar loyiha ishlamasa:
1. Muhit o'zgaruvchilarini to'g'ri kiritilganligini tekshiring.
2. PostgreSQL va Redis serverlari ishga tushirilganligiga ishonch hosil qiling.
3. `npm install` orqali paketlarni qayta o‘rnating.
4. Xatoliklarni terminalda tekshiring.

## 👨‍💻 Muallif
**Abduhamid Botirov**
- 📞 Tel: +998997867075
- 📧 Email: abduhamidbotirovwork@gmail.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/abduhamiddev/)
- 📷 [Instagram](https://www.instagram.com/abduhamid_botirov_/)
- 📩 [Telegram](https://t.me/AbduhamidBotirov)

---

### 🚀 Loyihani qo'llab-quvvatlash
Agar loyiha sizga foydali bo'lsa, ⭐ yulduzcha bosing va `fork` qiling!

