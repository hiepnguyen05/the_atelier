require("dotenv").config();
const Express = require("express");
const cors = require("cors");
const app = Express();
const routes = require("./routes");
const errorHandler = require("./middlewares/errorMiddleware");

app.use(cors());
app.use(Express.json({ limit: '10mb' }));
app.use(Express.urlencoded({ limit: '10mb', extended: true }));

// Sử dụng các routes
app.use("/api", routes);

// Error Handler - Luôn đặt sau cùng
app.use(errorHandler);

module.exports = app;
