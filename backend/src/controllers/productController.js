const db = require("../config/db");

// api tạo sản phẩm mới
const createProduct = async (req, res) => {
  const {
    sku_base,
    name,
    slug,
    category_id,
    collection_id,
    base_price,
    description,
    material,
    care_instructions,
  } = req.body;
  try {
    const [result, created] = await db.models.products.findOrCreate({
      where: { sku_base },
      defaults: {
        name,
        slug,
        category_id,
        collection_id,
        base_price,
        description,
        material,
        care_instructions,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProduct,
};
