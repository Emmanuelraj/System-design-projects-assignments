# 🧠 WebSocket – Concept Recap

## 🔹 Overview
WebSocket provides a **persistent, full-duplex connection** between client and server —  
unlike HTTP, which is **request-response based**.

Both run over **TCP**, but the key difference is how they manage connections.

---

## 🔹 Key Concepts

| Concept | HTTP | WebSocket |
|----------|------|-----------|
| **Connection Type** | Request–Response | Persistent |
| **Underlying Protocol** | TCP | TCP |
| **Communication** | Half-duplex (client → server) | Full-duplex (both ways) |
| **Connection Setup** | Each request = new TCP handshake (unless keep-alive) | One handshake → persistent |
| **Emulated Real-Time** | HTTP Polling / Long Polling | Native real-time |
| **Secure Version** | HTTPS | WSS (WebSocket Secure) |

---

## 🔹 HTTP Polling (Simulated Real-Time)

- Client repeatedly sends requests: “Any new data?”
- Server replies if something changed.
- Inefficient and creates extra network overhead.

---

## 🔹 WebSocket (True Real-Time)

1. Client initiates a WebSocket handshake over TCP.
2. Once connected, both sides can send messages any time.
3. Connection remains open until explicitly closed with:
   ```js
   ws.close();
