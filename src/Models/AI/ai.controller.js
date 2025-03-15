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
      const { message } = req.body

      // 🔍 AI orqali Email va Course nomini ajratib olish
      const aiExtractResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "Siz foydalanuvchi matnidan faqat Email va Course nomini ajratib oladigan AI botsiz. Agar email yoki kurs nomi bo‘lmasa, 'not found' deb qaytaring.",
          },
          {
            role: 'user',
            content: `Matnni analiz qiling va faqat Email va Course nomini ajrating: "${message}"`,
          },
        ],
      })

      const extractedText = aiExtractResponse.choices[0].message.content
      // 📌 Ma'lumotlarni ajratish
      const emailMatch = extractedText.match(
        /Email:\s*([\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,})/i
      )
      const email = emailMatch ? emailMatch[1].trim() : null

      const courseMatch = extractedText.match(/Course:\s*(.+)/i)
      const courseTitle = courseMatch ? courseMatch[1].trim() : null

      // 🔍 Agar email yoki kurs nomi yetarli bo‘lmasa, AI javob yozadi
      if (!email || !courseTitle) {
        const aiMissingFieldsResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi yetarli ma'lumot bermadi. Shunga mos javob yozing qisqaroq.`,
            },
          ],
        })

        return res
          .status(400)
          .json({ error: aiMissingFieldsResponse.choices[0].message.content })
      }

      // 🔍 Studentni topish (faqat email orqali)
      const student = await Student.findOne({ email })

      if (!student) {
        const aiNotFoundResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi "${email}" bilan tizimda topilmadi. Shunga mos javob yozing qisqaroq.`,
            },
          ],
        })

        return res
          .status(404)
          .json({ error: aiNotFoundResponse.choices[0].message.content })
      }

      // 🔍 Kursni topish (faqat kurs nomi orqali)
      const course = await Course.findOne({ title: courseTitle })

      if (!course) {
        const aiCourseNotFoundResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi "${courseTitle}" kursini topa olmadi. Shunga mos javob yozing qisqaroq.`,
            },
          ],
        })

        return res
          .status(404)
          .json({ error: aiCourseNotFoundResponse.choices[0].message.content })
      }

      // 🔄 Studentni kursga qo‘shish
      if (student.enrolledCourses.includes(course._id)) {
        const aiAlreadyEnrolledResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
            },
            {
              role: 'user',
              content: `Foydalanuvchi "${email}" allaqachon "${course.title}" kursiga yozilgan. Shunga mos javob yozing qisqaroq.`,
            },
          ],
        })

        return res
          .status(400)
          .json({ error: aiAlreadyEnrolledResponse.choices[0].message.content })
      }

      student.enrolledCourses.push(course._id)
      await student.save()

      // 🔥 AI muvaffaqiyatli enroll qilish haqida javob yozadi
      const aiSuccessResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Siz foydalanuvchiga AI javob yozadigan botsiz.',
          },
          {
            role: 'user',
            content: `Foydalanuvchi "${email}" "${course.title}" kursiga muvaffaqiyatli yozildi. Shunga mos javob yozing qisqaroq.`,
          },
        ],
      })

      return res
        .status(200)
        .json({ message: aiSuccessResponse.choices[0].message.content })
    } catch (error) {
      next(error)
    }
  }
}

export default CourseController
