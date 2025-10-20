# Redis-Based API Rate Limiting

## Overview

This project demonstrates a simple **rate limiting mechanism** using **Redis** and **Node.js (Express)**. It limits the number of requests a client can make to an API within a **fixed 60-second window**.

## Features

* Per-client IP rate limiting
* Fixed window of 60 seconds
* Maximum 3 requests per IP per window
* Redis handles request counting and automatic reset via TTL
* Returns HTTP 429 if the limit is exceeded

## How It Works

1. When a client hits `/api/rate-limit`, the server retrieves the client IP.
2. Redis key is created per IP: `rate-limit:<IP>`.
3. Increment the counter using `INCR`:

   * If the key doesn't exist, `INCR` creates it with value 1.
   * If the key exists, it increments the value.
4. TTL (60 seconds) is set only on the first request of the window (`currentCount === 1`).
5. If the counter exceeds the allowed limit (`noOfReqPerMin = 3`), return **429 Too Many Requests**.
6. Otherwise, return **"RateLimit"**.

## Redis Commands Used

* `INCR key` → Increment counter for the client
* `EXPIRE key 60` → Set TTL for automatic reset
* `GET key` → View current count
* `TTL key` → View remaining expiry time

## Request Flow (Conceptual)

```
Client hits API
       ↓
Get client IP
       ↓
INCR counter in Redis
       ↓
IF count > limit → return 429
ELSE
   IF first request → set TTL
   Return 200 / "RateLimit"
```

## Example Testing

1. Start Redis server: `redis-server`
2. Start Node.js API: `npm run dev`
3.

Expected output:

```
200
200
200
429
429
...
```

4. Inspect Redis keys:

```bash
redis-cli
KEYS *
GET rate-limit:<IP>
TTL rate-limit:<IP>
```

## Advantages

* Simple and minimal code
* Redis automatically handles counting and expiration
* Works well for low to medium traffic APIs

## Limitations

* Fixed window allows bursts at the boundary (e.g., 3 requests at the end of one window + 3 at the start of the next)
* For burst-sensitive applications, consider sliding window or token bucket algorithms

## Future Exploration

* Sliding window rate limiting
* Token bucket algorithm
* Distributed rate limiting for multiple servers
