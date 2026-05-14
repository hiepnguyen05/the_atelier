const cloudinary = require("../config/cloudinary");

/**
 * Hàm upload ảnh lên Cloudinary
 * @param {string} file - Đường dẫn file local hoặc chuỗi Base64
 * @param {string} folder - Thư mục trên Cloudinary (ví dụ: 'products', 'avatars')
 * @returns {Promise} - Trả về object chứa url và public_id
 */
const uploadImage = async (file, folder = "the-atelier") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

/**
 * Hàm xóa ảnh trên Cloudinary
 * @param {string} public_id - ID của ảnh cần xóa
 */
const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
