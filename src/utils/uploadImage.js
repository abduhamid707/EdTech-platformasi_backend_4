import path from 'path';
import fs from 'fs';

/**
 * Bir nechta rasmni yuklash funksiyasi
 * @param {Array} files - Yuklangan fayllar (req.files.[fieldName])
 * @param {string} baseUrl - Serverning asosiy URL manzili (masalan: http://localhost:5000)
 * @returns {Promise<Array<string>>} - Rasm URL manzillarining massivini qaytaradi
 */
const uploadImages = (files, baseUrl) => {
  return new Promise((resolve, reject) => {
    // Rasm formati tekshiriladi
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // Rasm saqlanadigan yo'lni aniqlash
    const uploadDir = path.join(process.cwd(), 'src', 'public', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Agar katalog mavjud bo'lmasa, uni yaratadi
    }

    // Fayllarni yuklash
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const fileExtension = path.extname(file.name).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
          return reject(new Error(`Yaroqsiz fayl turi: ${file.name}. Faqat rasm yuklash mumkin.`));
        }

        // Unikal fayl nomi yaratish
        const uniqueName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, uniqueName);

        // Faylni saqlash
        file.mv(filePath, (err) => {
          if (err) {
            return reject(new Error(`Fayl yuklashda xatolik yuz berdi: ${file.name}`));
          }

          // Faylning to'liq URL manzilini qaytarish
          const fileUrl = `${baseUrl}/images/${uniqueName}`;
          resolve(fileUrl);
        });
      });
    });

    // Barcha fayllarni yuklash va ularning URL manzillarini qaytarish
    Promise.all(uploadPromises)
      .then(fileUrls => resolve(fileUrls))  // Barcha URL manzillarini qaytarish
      .catch(error => reject(error));      // Agar xato bo'lsa, reject qilish
  });
}

export default uploadImages;
