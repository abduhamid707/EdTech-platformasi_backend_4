import openai from '../../utils/openai.js'
import Student from '../Student/student.schema.js'
import Course from '../Course/course.schema.js'

class CourseController {
  static async createAIStudentReaply(req, res, next) {
    try {
      const { message } = req.body

      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "Siz foydalanuvchi matnidan ism va emailni ajrata oladigan AI botsiz. Agar email yo‘q bo‘lsa, 'email not found' deb qaytaring.",
          },
          {
            role: 'user',
            content: `Matnni analiz qiling va Name va Emailni ajrating: "${message}"`,
          },
        ],
      })

      const extractedText = aiResponse.choices[0].message.content
      const emailMatch = extractedText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      )
      const email = emailMatch ? emailMatch[0] : null
      const nameMatch = extractedText
        .replace(email ? email : '', '')
        .replace(/Name:|Email:/gi, '')
        .trim()
      const name = nameMatch || null

      if (!email) {
        const aiEmailNotFound = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga mos AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi email kiritmagan yoki topilmadi. Shunga mos javob yozing qisqaroq.`,
            },
          ],
        })

        return res
          .status(400)
          .json({ error: aiEmailNotFound.choices[0].message.content })
      }
      let student = await Student.findOne({ email })

      if (student) {
        const aiAlreadyExists = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga mos AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi allaqachon tizimda mavjud. Shunga mos javob yozing qisqaroq.`,
            },
          ],
        })
        return res
          .status(400)
          .json({ error: aiAlreadyExists.choices[0].message.content })
      }

      // ✨ Yangi student yaratish
      const newStudent = new Student({ name, email, enrolledCourses: [] })
      await newStudent.save()

      // ✨ AI orqali muvaffaqiyatli qo‘shilganini bildirish
      const aiSuccess = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Siz foydalanuvchiga mos AI javob yozadigan botsiz.',
          },
          {
            role: 'user',
            content: `Foydalanuvchi ${name} (${email}) muvaffaqiyatli tizimga qo‘shildi. Shunga mos javob yozing qisqaroq.`,
          },
        ],
      })

      return res.status(201).json({
        message: aiSuccess.choices[0].message.content,
        student: newStudent,
      })
    } catch (error) {
      next(error)
    }
  }

  static async createAICourseReaply(req, res, next) {
    try {
      const { message } = req.body

      // 🔍 AI orqali Title, Description, Price, Instructor ajratib olish
      const aiExtractResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "Siz foydalanuvchi matnidan kurs nomi (title), tavsifi (description), narxi (price) va instruktor ismini (instructor) ajrata oladigan AI botsiz. Agar ma’lumotlar yo‘q bo‘lsa, 'not found' deb qaytaring.",
          },
          {
            role: 'user',
            content: `Matnni analiz qiling va Title, Description, Price, Instructor ni ajrating: "${message}"`,
          },
        ],
      })

      const extractedText = aiExtractResponse.choices[0].message.content
      console.log('Extracted AI Response:', extractedText)

      // 📌 Ma'lumotlarni ajratish
      const titleMatch = extractedText.match(/Title:\s*(.+)/i)
      const title = titleMatch ? titleMatch[1].trim() : null

      const descriptionMatch = extractedText.match(/Description:\s*(.+)/i)
      const description = descriptionMatch ? descriptionMatch[1].trim() : null

      const priceMatch = extractedText.match(/Price:\s*([\d.]+)/i)
      const price = priceMatch ? parseFloat(priceMatch[1]) : null

      const instructorMatch = extractedText.match(/Instructor:\s*(.+)/i)
      const instructor = instructorMatch ? instructorMatch[1].trim() : null

      console.log('Extracted Data:', { title, description, price, instructor })

      // 🔍 Agar ma'lumotlar yetarli bo‘lmasa, AI javob yozadi
      if (!title || !description || !price || !instructor) {
        const aiMissingFieldsResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi yetarli ma'lumot bermadi.`,
            },
          ],
        })

        return res
          .status(400)
          .json({ message: aiMissingFieldsResponse.choices[0].message.content })
      }

      // 🔍 Kurs bazada bor-yo‘qligini tekshirish
      let existingCourse = await Course.findOne({ title })

      if (existingCourse) {
        const aiAlreadyExistsResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi "${title}" nomli kursni yaratmoqchi, ammo bu kurs allaqachon mavjud. Shu haqida mos javob yozing.`,
            },
          ],
        })

        return res
          .status(400)
          .json({ message: aiAlreadyExistsResponse.choices[0].message.content })
      }

      // 📌 Yangi kursni yaratish
      const newCourse = new Course({ title, description, price, instructor })
      await newCourse.save()

      // 🔥 AI muvaffaqiyatli yaratish haqida javob yozadi
      const aiSuccessResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
          },
          {
            role: 'user',
            content: `Foydalanuvchi "${title}" nomli yangi kursni muvaffaqiyatli yaratdi. Shu haqida javob yozing.`,
          },
        ],
      })

      return res.status(201).json({
        message: aiSuccessResponse.choices[0].message.content,
        course: newCourse,
      })
    } catch (error) {
      next(error)
    }
  }

  static async createAIEnrollReaply(req, res, next) {
    try {
      const { message } = req.body;
  
      // 🔍 AI orqali Email va Kurs nomini ajratish
      const aiExtractResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: "Foydalanuvchi matnidan faqat Email va Course nomini ajratib oling. Agar topilmasa, 'not found' deb qaytaring.",
          },
          {
            role: 'user',
            content: `Matn: "${message}". Natijani quyidagi formatda qaytaring: Email: ..., Course: ...`,
          },
        ],
      });
  
      const extractedText = aiExtractResponse.choices[0].message.content;
      const emailMatch = extractedText.match(/Email:\s*([\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,})/i);
      const courseMatch = extractedText.match(/Course:\s*(.+)/i);
  
      const email = emailMatch ? emailMatch[1].trim() : null;
      const courseTitle = courseMatch ? courseMatch[1].trim() : null;
  
      if (!email || !courseTitle) {
        return res.status(400).json({ error: "Email yoki kurs nomi topilmadi." });
      }
  
      // 🔍 Student va kursni topish
      const student = await Student.findOne({ email });
      if (!student) return res.status(404).json({ error: `"${email}" tizimda topilmadi.` });
  
      const course = await Course.findOne({ title: courseTitle });
      if (!course) return res.status(404).json({ error: `"${courseTitle}" kursi topilmadi.` });
  
      // 🔄 Student allaqachon kursga yozilganmi?
      if (student.enrolledCourses.includes(course._id)) {
        return res.status(400).json({ error: `"${email}" allaqachon "${courseTitle}" kursiga yozilgan.` });
      }
  
      // ✅ Kursga yozish
      student.enrolledCourses.push(course._id);
      await student.save();
  
      return res.status(200).json({ message: `"${email}" "${courseTitle}" kursiga muvaffaqiyatli yozildi.` });
  
    } catch (error) {
      next(error);
    }
  }
  
}

export default CourseController
