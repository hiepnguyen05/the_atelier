const slugify = require("slugify");

/**
 * Tạo slug từ chuỗi văn bản
 * @param {string} text - Chuỗi cần tạo slug
 * @param {string} suffix - Hậu tố (ví dụ: SKU) để đảm bảo tính duy nhất
 * @returns {string} - Chuỗi slug đã được làm sạch
 */
const generateSlug = (text, suffix = "") => {
  // Bước 1: Loại bỏ các ký tự đặc biệt gây nhiễu trước khi slugify
  const cleanText = text.replace(/[$#%^&*()!@]/g, "");

  const baseSlug = slugify(cleanText, {
    replacement: "-",  
    lower: true,      
    strict: true,     
    locale: "vi",     
    trim: true,       
  });

  return suffix ? `${baseSlug}-${suffix.toLowerCase()}` : baseSlug;
};

module.exports = {
  generateSlug,
};
