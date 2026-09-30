import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  timeout: 20000,
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("[SOCKET] Connected to server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("[SOCKET] Disconnected from server");
});

socket.on("connect_error", (error) => {
  console.error("[SOCKET] Connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("[SOCKET] Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("[SOCKET] Reconnection error:", error);
});

export default socket;
