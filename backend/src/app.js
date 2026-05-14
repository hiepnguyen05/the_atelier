require("dotenv").config();
const Express = require("express");
const app = Express();
const routes = require("./routes");
const errorHandler = require("./middlewares/errorMiddleware");

app.use(Express.json());

// Sử dụng các routes
app.use("/api", routes);

// Error Handler - Luôn đặt sau cùng
app.use(errorHandler);

module.exports = app;
