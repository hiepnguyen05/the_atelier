/**
 * Cấu hình Loại Sản Phẩm (Product Type)
 * Mỗi loại xác định bộ thuộc tính biến thể (variant) và thông số kỹ thuật (specs)
 * mà form sẽ hiển thị cho admin khi tạo/sửa sản phẩm.
 */

export const PRODUCT_TYPES = {
  clothing_top: {
    label: 'Áo',
    icon: 'checkroom',
    variantConfig: {
      sizeLabel: 'Kích cỡ (Size)',
      colorLabel: 'Màu sắc',
      suggestedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    specsDefinition: [
      { key: 'fabric_type', label: 'Kiểu vải' },
      { key: 'fit', label: 'Form dáng' },
      { key: 'length', label: 'Chiều dài' },
      { key: 'collar', label: 'Kiểu cổ' },
    ],
  },
  clothing_bottom: {
    label: 'Quần',
    icon: 'straighten',
    variantConfig: {
      sizeLabel: 'Kích cỡ (Size)',
      colorLabel: 'Màu sắc',
      suggestedSizes: ['XS', 'S', 'M', 'L', 'XL', '28', '29', '30', '31', '32', '33', '34', '36', '38'],
    },
    specsDefinition: [
      { key: 'fabric_type', label: 'Kiểu vải' },
      { key: 'fit', label: 'Form dáng' },
      { key: 'leg_length', label: 'Chiều dài ống' },
      { key: 'waist_type', label: 'Kiểu cạp' },
    ],
  },
  shoes: {
    label: 'Giày',
    icon: 'steps',
    variantConfig: {
      sizeLabel: 'Size giày',
      colorLabel: 'Màu sắc',
      suggestedSizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    },
    specsDefinition: [
      { key: 'sole_material', label: 'Chất liệu đế' },
      { key: 'upper_material', label: 'Chất liệu mũ giày' },
      { key: 'heel_height', label: 'Chiều cao gót' },
      { key: 'closure_type', label: 'Kiểu buộc/khóa' },
    ],
  },
  slippers: {
    label: 'Dép',
    icon: 'spa',
    variantConfig: {
      sizeLabel: 'Size dép',
      colorLabel: 'Màu sắc',
      suggestedSizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    },
    specsDefinition: [
      { key: 'sole_material', label: 'Chất liệu đế' },
      { key: 'strap_type', label: 'Kiểu quai' },
      { key: 'strap_material', label: 'Chất liệu quai' },
    ],
  },
  eyewear: {
    label: 'Kính',
    icon: 'visibility',
    variantConfig: {
      sizeLabel: '',
      colorLabel: 'Màu gọng',
      suggestedSizes: [],
    },
    specsDefinition: [
      { key: 'frame_material', label: 'Chất liệu gọng' },
      { key: 'lens_type', label: 'Loại tròng' },
      { key: 'lens_width', label: 'Kích thước mắt (mm)' },
      { key: 'frame_shape', label: 'Hình dạng gọng' },
    ],
  },
  bag: {
    label: 'Túi xách',
    icon: 'shopping_bag',
    variantConfig: {
      sizeLabel: '',
      colorLabel: 'Màu sắc',
      suggestedSizes: [],
    },
    specsDefinition: [
      { key: 'dimensions', label: 'Kích thước (Dài x Rộng x Cao)' },
      { key: 'leather_type', label: 'Loại da / Chất liệu' },
      { key: 'strap_length', label: 'Chiều dài dây đeo' },
      { key: 'compartments', label: 'Số ngăn' },
      { key: 'closure_type', label: 'Kiểu khóa' },
    ],
  },
  perfume: {
    label: 'Nước hoa',
    icon: 'airwave',
    variantConfig: {
      sizeLabel: 'Dung tích',
      colorLabel: '',
      suggestedSizes: ['10ml', '30ml', '50ml', '75ml', '100ml', '200ml'],
    },
    specsDefinition: [
      { key: 'fragrance_family', label: 'Nhóm hương' },
      { key: 'top_notes', label: 'Hương đầu' },
      { key: 'heart_notes', label: 'Hương giữa' },
      { key: 'base_notes', label: 'Hương cuối' },
      { key: 'longevity', label: 'Độ lưu hương' },
      { key: 'concentration', label: 'Nồng độ (EDP/EDT/Parfum)' },
    ],
  },
};

/**
 * Các lựa chọn giới tính
 */
export const GENDERS = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'nam', label: 'Nam' },
  { value: 'nu', label: 'Nữ' },
];

/**
 * Lấy config cho loại sản phẩm (an toàn)
 */
export const getProductTypeConfig = (type) => {
  return PRODUCT_TYPES[type] || PRODUCT_TYPES.clothing_top;
};

/**
 * Lấy danh sách loại sản phẩm dạng options
 */
export const getProductTypeOptions = () => {
  return Object.entries(PRODUCT_TYPES).map(([value, config]) => ({
    value,
    label: config.label,
    icon: config.icon,
  }));
};
