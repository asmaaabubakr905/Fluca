/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const ChatMessage = require("./models/ChatMessage");
const compression = require('compression');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// Static folder for uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_PATH || "uploads"), {
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AquaFlow backend is running." });
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/ratings", require("./routes/ratings"));
app.use("/api/offers", require("./routes/offers"));

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  console.log("Socket transport:", socket.conn.transport.name);

  // انضمام لغرفة رحلة معينة
  socket.on("joinTrip", (tripId) => {
    console.log(`User ${socket.id} joining trip: ${tripId}`);
    socket.join(tripId);
  });

  // استقبال تحديث موقع الكابتن من الكابتن نفسه
  socket.on("captainLocation", ({ tripId, lat, lng }) => {
    console.log(`Captain location update for trip ${tripId}:`, { lat, lng });
    // ابعت الموقع الجديد لكل الباسنجرز في نفس الرحلة
    io.to(tripId).emit("captainLocationUpdate", { lat, lng });
  });

  // Chat message event
  socket.on("chatMessage", async (data) => {
    console.log("[SOCKET] Received chatMessage:", data);
    // data: { tripId, sender, receiver, message }
    try {
      const chatMsg = new ChatMessage({
        trip: data.tripId,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
      });
      await chatMsg.save();
      console.log("[SOCKET] Saved chatMessage:", chatMsg);
      // Emit to all in the trip room
      io.to(data.tripId).emit("chatMessage", {
        _id: chatMsg._id,
        trip: data.tripId,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        timestamp: chatMsg.timestamp || new Date(),
      });
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, "Reason:", reason);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handler for payload too large
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({
      message:
        "الصورة كبيرة جدًا. يرجى ضغط الصورة أو اختيار صورة أصغر من 10 ميجا.",
    });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
