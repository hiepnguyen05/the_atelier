const slugify = require("slugify");

/**
 * Loại bỏ dấu tiếng Việt khỏi chuỗi
 * @param {string} str - Chuỗi cần loại bỏ dấu
 * @returns {string} - Chuỗi không dấu
 */
const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Tạo slug từ chuỗi văn bản
 * @param {string} text - Chuỗi cần tạo slug
 * @param {string} suffix - Hậu tố (ví dụ: SKU) để đảm bảo tính duy nhất
 * @returns {string} - Chuỗi slug đã được làm sạch
 */
const generateSlug = (text, suffix = "") => {
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

/**
 * Tạo SKU tự động (Không dấu)
 * @param {string} categoryName - Tên danh mục (để lấy tiền tố)
 * @returns {string} - Mã SKU tự sinh
 */
const generateSKU = (categoryName = "GEN") => {
  const cleanName = removeAccents(categoryName);
  const prefix = cleanName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 3);
  
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  
  return `${prefix}-${random}-${timestamp}`;
};

module.exports = {
  generateSlug,
  generateSKU,
  removeAccents
};
