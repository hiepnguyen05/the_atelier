const request = require("supertest");
const app = require("../src/app");
const cartService = require("../src/services/cartService");
const jwt = require("jsonwebtoken");

jest.mock("../src/services/cartService");

describe("Cart API Tests", () => {
  let userToken;

  beforeAll(() => {
    userToken = jwt.sign(
      { userId: 1, email: "user@example.com", role: "customer" },
      process.env.JWT_SECRET || "your_default_jwt_secret"
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/cart", () => {
    it("should return the user's cart", async () => {
      const mockCart = {
        cartId: 1,
        userId: 1,
        cartItems: []
      };
      cartService.getCart.mockResolvedValue(mockCart);

      const res = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.cartId).toBe(1);
    });
  });

  describe("POST /api/cart/items", () => {
    it("should add an item to the cart", async () => {
      const mockCart = {
        cartId: 1,
        userId: 1,
        cartItems: [{ cartItemId: 1, variantId: 5, quantity: 2 }]
      };
      cartService.addItemToCart.mockResolvedValue(mockCart);

      const res = await request(app)
        .post("/api/cart/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ variantId: 5, quantity: 2 });

      expect(res.statusCode).toBe(201);
      expect(res.body.cartItems[0].quantity).toBe(2);
      expect(cartService.addItemToCart).toHaveBeenCalledWith(1, 5, 2);
    });
  });

  describe("PUT /api/cart/items/:itemId", () => {
    it("should update item quantity", async () => {
      const mockCart = {
        cartId: 1,
        userId: 1,
        cartItems: [{ cartItemId: 1, variantId: 5, quantity: 5 }]
      };
      cartService.updateItemQuantity.mockResolvedValue(mockCart);

      const res = await request(app)
        .put("/api/cart/items/1")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.cartItems[0].quantity).toBe(5);
      expect(cartService.updateItemQuantity).toHaveBeenCalledWith(1, "1", 5);
    });
  });

  describe("DELETE /api/cart/items/:itemId", () => {
    it("should remove an item from the cart", async () => {
      const mockCart = {
        cartId: 1,
        userId: 1,
        cartItems: []
      };
      cartService.removeItemFromCart.mockResolvedValue(mockCart);

      const res = await request(app)
        .delete("/api/cart/items/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(cartService.removeItemFromCart).toHaveBeenCalledWith(1, "1");
    });
  });

  describe("DELETE /api/cart", () => {
    it("should clear the entire cart", async () => {
      const mockCart = {
        cartId: 1,
        userId: 1,
        cartItems: []
      };
      cartService.clearCart.mockResolvedValue(mockCart);

      const res = await request(app)
        .delete("/api/cart")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(cartService.clearCart).toHaveBeenCalledWith(1);
    });
  });
});
