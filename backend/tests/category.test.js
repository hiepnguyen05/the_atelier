const request = require("supertest");
const app = require("../src/app");
const categoryService = require("../src/services/categoryService");

// Simple random data generator to replace Faker (avoiding ESM issues)
const randomString = (length) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

jest.mock("../src/services/categoryService");

describe("Comprehensive Category API Tests", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Kịch bản kiểm tra cơ bản (Basic API Tests)
  describe("Basic API Tests", () => {
    it("should return JSON content type", async () => {
      categoryService.getAllCategories.mockResolvedValue([]);
      const res = await request(app).get("/api/categories");
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.statusCode).toBe(200);
    });
  });

  // 2. Kịch bản kiểm tra CRUD (CRUD Tests)
  describe("CRUD Operations", () => {
    it("should perform full CRUD flow successfully", async () => {
      const newCat = { name: "New Category", slug: "new-cat" };
      categoryService.createCategory.mockResolvedValue({ category_id: 10, ...newCat });
      const createRes = await request(app).post("/api/categories").send(newCat);
      expect(createRes.statusCode).toBe(201);

      categoryService.getCategoryById.mockResolvedValue({ category_id: 10, ...newCat });
      const readRes = await request(app).get("/api/categories/10");
      expect(readRes.body.name).toBe(newCat.name);

      // Read by Slug (Now using the same clean route)
      categoryService.getCategoryBySlug.mockResolvedValue({ category_id: 10, ...newCat });
      const slugRes = await request(app).get("/api/categories/new-cat");
      expect(slugRes.statusCode).toBe(200);
      expect(slugRes.body.slug).toBe(newCat.slug);

      const updatedCat = { name: "Updated Category" };
      categoryService.updateCategory.mockResolvedValue({ category_id: 10, ...updatedCat });
      const updateRes = await request(app).put("/api/categories/10").send(updatedCat);
      expect(updateRes.body.name).toBe(updatedCat.name);

      categoryService.deleteCategory.mockResolvedValue(true);
      const deleteRes = await request(app).delete("/api/categories/10");
      expect(deleteRes.statusCode).toBe(200);
    });
  });

  // 3. Kịch bản Negative (Test lỗi)
  describe("Negative Tests", () => {
    it("should return 404 for non-existent category", async () => {
      categoryService.getCategoryById.mockResolvedValue(null);
      categoryService.getCategoryBySlug.mockResolvedValue(null);
      const res = await request(app).get("/api/categories/99999");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Category not found");
    });

    it("should handle server errors gracefully", async () => {
      categoryService.getAllCategories.mockRejectedValue(new Error("Database error"));
      const res = await request(app).get("/api/categories");
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Database error");
    });
  });

  // 4. Kịch bản kiểm tra dữ liệu động (Dynamic data)
  describe("Dynamic Data Tests", () => {
    it("should handle random category names", async () => {
      const dynamicName = "Category_" + randomString(8);
      categoryService.createCategory.mockResolvedValue({ 
        category_id: Math.floor(Math.random() * 1000), 
        name: dynamicName 
      });

      const res = await request(app)
        .post("/api/categories")
        .send({ name: dynamicName });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(dynamicName);
    });
  });

  // 5. Kịch bản kiểm tra business logic
  describe("Business Logic Tests", () => {
    it("should reject deletion if category has sub-categories", async () => {
      categoryService.deleteCategory.mockRejectedValue(new Error("Cannot delete category with sub-categories"));
      const res = await request(app).delete("/api/categories/1");
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toContain("sub-categories");
    });
  });

  // 6. Kịch bản kiểm tra performance (cơ bản)
  describe("Performance Tests", () => {
    it("should respond within 200ms", async () => {
      categoryService.getAllCategories.mockResolvedValue([]);
      const start = Date.now();
      await request(app).get("/api/categories");
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });
  });

  // 7. Kịch bản dữ liệu biên (Boundary test)
  describe("Boundary Tests", () => {
    it("should handle extremely long category names", async () => {
      const longName = "a".repeat(255);
      categoryService.createCategory.mockResolvedValue({ category_id: 1, name: longName });
      const res = await request(app).post("/api/categories").send({ name: longName });
      expect(res.statusCode).toBe(201);
      expect(res.body.name.length).toBe(255);
    });

    it("should handle special characters", async () => {
      const specialName = "!@#$%^&*()_+";
      categoryService.createCategory.mockResolvedValue({ category_id: 1, name: specialName });
      const res = await request(app).post("/api/categories").send({ name: specialName });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(specialName);
    });
  });
});
