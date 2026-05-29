const request = require("supertest");
const app = require("../src/app");
const orderService = require("../src/services/orderService");
const jwt = require("jsonwebtoken");

jest.mock("../src/services/orderService");

describe("Order API Tests", () => {
  let customerToken;
  let adminToken;
  
  beforeAll(() => {
    customerToken = jwt.sign(
      { userId: 1, email: "customer@example.com", role: "user" },
      process.env.JWT_SECRET || "your_default_jwt_secret"
    );

    adminToken = jwt.sign(
      { userId: 2, email: "admin@example.com", role: "admin" },
      process.env.JWT_SECRET || "your_default_jwt_secret"
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/orders/admin", () => {
    it("should return orders with default pagination for admin (200)", async () => {
      const mockResult = { totalItems: 10, totalPages: 1, currentPage: 1, orders: [] };
      orderService.getAllOrders.mockResolvedValue(mockResult);

      const res = await request(app)
        .get("/api/orders/admin")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockResult);
      expect(orderService.getAllOrders).toHaveBeenCalledWith({});
    });

    it("should return orders with custom query params for admin (200)", async () => {
      const mockResult = { totalItems: 10, totalPages: 1, currentPage: 2, orders: [] };
      orderService.getAllOrders.mockResolvedValue(mockResult);

      const res = await request(app)
        .get("/api/orders/admin?page=2&limit=5&status=pending&search=John")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockResult);
      expect(orderService.getAllOrders).toHaveBeenCalledWith({
        page: "2", limit: "5", status: "pending", search: "John"
      });
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app).get("/api/orders/admin");
      expect(res.statusCode).toBe(401);
    });

    it("should return 403 if user is a customer not admin", async () => {
      const res = await request(app)
        .get("/api/orders/admin")
        .set("Authorization", `Bearer ${customerToken}`);
      
      expect(res.statusCode).toBe(403);
    });

    it("should return 500 on server database crash", async () => {
      orderService.getAllOrders.mockRejectedValue(new Error("Database disconnected"));

      const res = await request(app)
        .get("/api/orders/admin")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(500);
    });
  });

  describe("PUT /api/orders/:id/status", () => {
    it("should allow admin to update order status to a valid one (200)", async () => {
      const mockOrder = { orderId: 1, status: "completed" };
      orderService.updateOrderStatus.mockResolvedValue(mockOrder);

      const res = await request(app)
        .put("/api/orders/1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "completed" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Order status updated");
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith("1", "completed");
    });

    it("should return 400 if admin sends empty or undefined status", async () => {
      orderService.updateOrderStatus.mockRejectedValue(new Error("Invalid status"));

      const res = await request(app)
        .put("/api/orders/1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid status");
    });

    it("should return 400 if admin sends malicious or invalid status", async () => {
      orderService.updateOrderStatus.mockRejectedValue(new Error("Invalid status"));

      const res = await request(app)
        .put("/api/orders/1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "drop_table" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid status");
    });

    it("should return 404 if order ID does not exist or is invalid string", async () => {
      orderService.updateOrderStatus.mockRejectedValue(new Error("Order not found"));

      const res = await request(app)
        .put("/api/orders/abc/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "processing" });

      expect(res.statusCode).toBe(404);
    });

    it("should block customer from updating status (403)", async () => {
      const res = await request(app)
        .put("/api/orders/1/status")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ status: "completed" });

      expect(res.statusCode).toBe(403);
    });

    it("should return 500 on database timeout during save", async () => {
      orderService.updateOrderStatus.mockRejectedValue(new Error("Timeout"));

      const res = await request(app)
        .put("/api/orders/1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "completed" });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("POST /api/orders", () => {
    it("should create order successfully with items (201)", async () => {
      orderService.createOrder.mockResolvedValue({ orderId: 10, totalAmount: 500 });

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          items: [{ variantId: 5, quantity: 2 }],
          shippingAddress: { city: "HCM", phoneNumber: "123" }
        });

      expect(res.statusCode).toBe(201);
      expect(orderService.createOrder).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it("should return 400 if items array is empty", async () => {
      orderService.createOrder.mockRejectedValue(new Error("No order items"));

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ items: [] });

      expect(res.statusCode).toBe(400);
    });

    it("should return 401 if missing auth token", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({ items: [{ variantId: 5, quantity: 1 }] });

      expect(res.statusCode).toBe(401);
    });

    it("should return 500 and rollback if DB error happens", async () => {
      orderService.createOrder.mockRejectedValue(new Error("Rollback error"));

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ items: [{ variantId: 5, quantity: 1 }] });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return order details for the owner (200)", async () => {
      orderService.getOrderById.mockResolvedValue({ orderId: 1, userId: 1 });

      const res = await request(app)
        .get("/api/orders/1")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(orderService.getOrderById).toHaveBeenCalledWith("1", 1, "user");
    });

    it("should return order details for admin viewing any order (200)", async () => {
      orderService.getOrderById.mockResolvedValue({ orderId: 1, userId: 1 });

      const res = await request(app)
        .get("/api/orders/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(orderService.getOrderById).toHaveBeenCalledWith("1", 2, "admin");
    });

    it("should return 403 if customer tries to view someone else's order", async () => {
      orderService.getOrderById.mockRejectedValue(new Error("Not authorized to view this order"));

      const res = await request(app)
        .get("/api/orders/99")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if fake order ID is requested", async () => {
      orderService.getOrderById.mockRejectedValue(new Error("Order not found"));

      const res = await request(app)
        .get("/api/orders/999")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET /api/orders", () => {
    it("should return user's orders successfully (200)", async () => {
      orderService.getUserOrders.mockResolvedValue([{ orderId: 1 }]);

      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 401 if user session expired", async () => {
      const res = await request(app).get("/api/orders");
      expect(res.statusCode).toBe(401);
    });

    it("should return 500 on model include crash", async () => {
      orderService.getUserOrders.mockRejectedValue(new Error("Include failed"));

      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(500);
    });
  });
});
