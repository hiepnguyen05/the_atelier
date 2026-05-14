const { generateSlug } = require("../src/utils/slugifyUtils");

describe("Slugify Utility", () => {
  it("nên chuyển đổi tiếng Việt có dấu thành slug chuẩn", () => {
    const text = "Áo Sơ Mi Nam Cao Cấp";
    const slug = generateSlug(text);
    expect(slug).toBe("ao-so-mi-nam-cao-cap");
  });

  it("nên ghép thêm SKU vào slug cho sản phẩm", () => {
    const text = "Giày Thể Thao";
    const sku = "GTT01";
    const slug = generateSlug(text, sku);
    expect(slug).toBe("giay-the-thao-gtt01");
  });

  it("nên loại bỏ các ký tự đặc biệt", () => {
    const text = "Sản Phẩm! @Mới# 2024$";
    const slug = generateSlug(text);
    expect(slug).toBe("san-pham-moi-2024");
  });

  it("nên chuyển về chữ thường (lowercase)", () => {
    const text = "HOT NEW ARRIVAL";
    const slug = generateSlug(text);
    expect(slug).toBe("hot-new-arrival");
  });
});
