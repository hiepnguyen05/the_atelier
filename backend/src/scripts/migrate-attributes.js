const { sequelize } = require("../config/db");

async function migrate() {
  console.log("Starting attribute and specification migrations...");
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");

    // 1. Alter categories table to add attribute_config
    const [categoriesColumns] = await sequelize.query("SHOW COLUMNS FROM categories LIKE 'attribute_config'");
    if (categoriesColumns.length === 0) {
      console.log("Adding attribute_config column to categories...");
      await sequelize.query("ALTER TABLE categories ADD COLUMN attribute_config JSON NULL");
    } else {
      console.log("attribute_config column already exists in categories.");
    }

    // 2. Alter products table to add specifications
    const [productsColumns] = await sequelize.query("SHOW COLUMNS FROM products LIKE 'specifications'");
    if (productsColumns.length === 0) {
      console.log("Adding specifications column to products...");
      await sequelize.query("ALTER TABLE products ADD COLUMN specifications JSON NULL");
    } else {
      console.log("specifications column already exists in products.");
    }

    // 3. Seed attribute_config for existing categories
    console.log("Seeding category attribute configurations...");

    const clothingConfig = {
      variant_size_label: "Kích cỡ",
      variant_color_label: "Màu sắc",
      specs_definition: [
        { key: "material", label: "Chất liệu chính" },
        { key: "lining", label: "Lớp vải lót" },
        { key: "fit", label: "Phom dáng (Fit)" }
      ]
    };

    const bagsConfig = {
      variant_size_label: "Dòng túi (Size)",
      variant_color_label: "Màu sắc",
      specs_definition: [
        { key: "dimensions", label: "Kích thước (Dài x Rộng x Cao)" },
        { key: "strap_length", label: "Độ dài dây đeo" },
        { key: "hardware", label: "Chi tiết kim loại" }
      ]
    };

    const shoesConfig = {
      variant_size_label: "Size giày / Phụ kiện",
      variant_color_label: "Màu sắc",
      specs_definition: [
        { key: "material", label: "Chất liệu" },
        { key: "height", label: "Độ cao gót / Chiều dài" }
      ]
    };

    const jewelryConfig = {
      variant_size_label: "Kích thước mặt / Dây",
      variant_color_label: "Màu sắc / Chất liệu kim loại",
      specs_definition: [
        { key: "carat", label: "Trọng lượng / Carat" },
        { key: "case_material", label: "Vỏ đồng hồ / Khung viền" },
        { key: "gemstone", label: "Loại đá quý đính kèm" }
      ]
    };

    const cosmeticsConfig = {
      variant_size_label: "Dung tích / Trọng lượng",
      variant_color_label: "Tông màu / Phân loại",
      specs_definition: [
        { key: "concentration", label: "Nồng độ nước hoa" },
        { key: "fragrance_family", label: "Nhóm hương" },
        { key: "top_notes", label: "Hương đầu (Top notes)" },
        { key: "heart_notes", label: "Hương giữa (Heart notes)" },
        { key: "base_notes", label: "Hương cuối (Base notes)" },
        { key: "skin_type", label: "Loại da phù hợp" },
        { key: "key_ingredients", label: "Thành phần chính" }
      ]
    };

    // Update by Category ID
    const updates = [
      { ids: [30007, 30008, 30009], config: clothingConfig },
      { ids: [30010, 60001], config: bagsConfig },
      { ids: [30011], config: shoesConfig },
      { ids: [30012], config: jewelryConfig },
      { ids: [30013], config: cosmeticsConfig }
    ];

    for (const update of updates) {
      const configStr = JSON.stringify(update.config);
      await sequelize.query(
        "UPDATE categories SET attribute_config = :config WHERE category_id IN (:ids)",
        {
          replacements: { config: configStr, ids: update.ids },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }

    console.log("Seeding category configurations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
