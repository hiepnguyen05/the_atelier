require("dotenv").config();
const Express = require("express");
const app = Express();
const db = require("./src/config/db");
const routes = require("./src/routes");

app.use(Express.json());

// Kết nối database
db.authenticate()
  .then(() => {
    console.log("Connection to the database has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Sử dụng các routes
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
