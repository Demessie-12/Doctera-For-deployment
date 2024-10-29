const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./db/connectToMongoDB.js");

const startRoutes = require("./routes/start.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const productRoutes = require("./routes/product.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const reviewRoutes = require("./routes/review.route.js");
const { checkLogin, restrictTo } = require("./middleware/authController.js");
const PaymnetRoutes = require("./routes/payment.route.js");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Change to your frontend's URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
// app.use(
//   cors({
//     origin: "https://localhost:5173/",
//     credentials: true,
//   })
// );

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: "https://xyz.onrender.com", // Doctera website
      credentials: true,
    })
  );
}

app.get("/", (req, res) => {
  res.send("Hello World from server");
});

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "*",
  });

  next();
});

app.use("/api/start", startRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", PaymnetRoutes);
app.use(
  "/api/admin",
  checkLogin,
  restrictTo("admin", "super admin"),
  adminRoutes
);

app.listen(5005, () => {
  connectToMongoDB();
  console.log("Server Running on PORT 5005");
});
