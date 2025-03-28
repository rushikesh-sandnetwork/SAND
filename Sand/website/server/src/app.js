const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// 1. Fix CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ["http://localhost:3000"];

app.use(cors({
  origin: function(origin, callback) {        
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// // Add required CORS headers middleware
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());


// API Routes (Register these BEFORE static files)
app.use("/api/v1/user", require("./routes/user.routes"));
app.use("/api/v1/admin", require("./routes/admin.routes"));
app.use("/api/v1/promoter", require("./routes/promoter.routes"));
app.use("/api/v1/mis", require("./routes/mis.routes"));
app.use("/api/v1/manager", require("./routes/manager.routes"));

// Serve React static files (AFTER API routes)
app.use(express.static(path.join(__dirname, "client/dist")));

// Catch-all route for client-side routing (AFTER all other routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});
// After API routes and static files
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  } else {
    next();
  }
});

// Start Server
module.exports = app;

// // Importing Routes
// const userRouter = require("./routes/user.routes");
// const adminRouter = require("./routes/admin.routes");
// const promoterRouter = require("./routes/promoter.routes");
// const misRouter = require("./routes/mis.routes");
// const managerRouter = require("./routes/manager.routes");

// // 🔹 **Ensure API Routes are Registered Before the Catch-All Route**
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/admin", adminRouter);
// app.use("/api/v1/promoter", promoterRouter);
// app.use("/api/v1/mis", misRouter);
// app.use("/api/v1/manager", managerRouter);

// // **Error Handling for Undefined API Routes**
// app.use("/api", (req, res) => {
//   res.status(404).json({ error: "API endpoint not found" });
// });

// // **Serve React Build Folder**
// app.use(express.static(path.join(__dirname, "client/dist")));

// // 🔹 **Catch-All Route for React App**
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// });

// module.exports = app;
