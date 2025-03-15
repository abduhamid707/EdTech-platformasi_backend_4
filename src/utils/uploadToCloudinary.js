import { v2 as cloudinary } from 'cloudinary'

// Cloudinary konfiguratsiyasi
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME', // Cloudinary hisobingizning cloud_name qiymati
  api_key: 'YOUR_API_KEY', // API kalitingiz
  api_secret: 'YOUR_API_SECRET', // API maxfiy kaliti
})

/**
 * Faylni Cloudinary-ga yuklash funksiyasi
 * @param {string} filePath - Yuklanayotgan faylning to'liq yo'li
 * @param {object} options - Cloudinary yuklash parametrlari
 * @returns {Promise<string>} - Yuklangan rasmning URL manzili
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Portfolio', // Fayllarni saqlash uchun papka nomi (ixtiyoriy)
      ...options,
    })
    return result.secure_url // Yuklangan faylning URL manzilini qaytarish
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Rasmni yuklashda xatolik yuz berdi')
  }
}
