import express from 'express';
import aiReplayController from './ai.controller.js';
import openai from '../../utils/openai.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body;

    // 🔍 AI orqali foydalanuvchi so‘rovini analiz qilish
    const aiRoleResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            "Siz foydalanuvchi matnini tahlil qilib, u qaysi so‘rov turiga tegishli ekanini aniqlaydigan AI botsiz. Quyidagi uchta tur mavjud:\n\n" +
            "- Agar foydalanuvchi talabani qo‘shmoqchi bo‘lsa, 'role: createAIStudentReaply' deb qaytaring.\n" +
            "- Agar foydalanuvchi yangi kurs yaratmoqchi bo‘lsa, 'role: createAICourseReaply' deb qaytaring.\n" +
            "- Agar foydalanuvchi talabani kursga yozmoqchi bo‘lsa, 'role: createAIEnrollReaply' deb qaytaring.\n\n" +
            "Bundan boshqa javob yozmang, faqat kerakli role nomini qaytaring.",
        },
        {
          role: 'user',
          content: `Foydalanuvchi quyidagi so‘rovni yubordi: "${message}". Bu qaysi turga tegishli?`,
        },
      ],
    });

    const roleText = aiRoleResponse.choices[0].message.content.trim();

    // 🔄 Tegishli funksiya chaqiriladi
    switch (roleText) {
      case 'role: createAIStudentReaply':
        return aiReplayController.createAIStudentReaply(req, res, next);
      case 'role: createAICourseReaply':
        return aiReplayController.createAICourseReaply(req, res, next);
      case 'role: createAIEnrollReaply':
        return aiReplayController.createAIEnrollReaply(req, res, next);
      default:
        return res.status(400).json({ error: 'Noto‘g‘ri so‘rov turi' });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
