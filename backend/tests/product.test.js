const request = require("supertest");
const app = require("../src/app");
const productService = require("../src/services/productService");
const jwt = require("jsonwebtoken");

jest.mock("../src/services/productService");

describe("Product API Tests", () => {
  let adminToken;

  beforeAll(() => {
    adminToken = jwt.sign(
      { userId: 1, email: "admin@example.com", role: "admin" },
      process.env.JWT_SECRET || "your_default_jwt_secret"
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return products list in camelCase", async () => {
      const mockProducts = {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        products: [
          {
            productId: 1,
            name: "Premium Silk Dress",
            slug: "premium-silk-dress",
            basePrice: 1500000,
            categoryId: 2,
            status: "active",
            productImages: [{ imageId: 1, imageUrl: "test.jpg" }]
          }
        ]
      };
      
      productService.getProducts.mockResolvedValue(mockProducts);
      
      const res = await request(app).get("/api/products");
      
      expect(res.statusCode).toBe(200);
      expect(res.body.products[0]).toHaveProperty("productId");
      expect(res.body.products[0]).toHaveProperty("basePrice");
      expect(res.body.products[0]).toHaveProperty("productImages");
      expect(res.body.products[0]).not.toHaveProperty("product_id");
    });
  });

  describe("POST /api/products", () => {
    it("should create a product with camelCase payload", async () => {
      const productData = {
        name: "New Luxury Coat",
        categoryId: 1,
        basePrice: 5000000,
        skuBase: "COAT-001",
        status: "active"
      };

      const mockResponse = {
        productId: 100,
        ...productData,
        slug: "new-luxury-coat"
      };

      productService.createProduct.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData);

      expect(res.statusCode).toBe(201);
      expect(res.body.productId).toBe(100);
      expect(res.body.name).toBe(productData.name);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should call deleteProduct (soft delete)", async () => {
      productService.deleteProduct.mockResolvedValue(true);
      
      const res = await request(app)
        .delete("/api/products/1")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("successfully");
      expect(productService.deleteProduct).toHaveBeenCalledWith("1");
    });
  });
});
