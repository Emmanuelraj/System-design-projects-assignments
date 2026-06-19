````markdown
# Redis CLI – Top 10 Commands (With TTL Deep Dive)

A practical reference guide for the most useful Redis CLI commands, with a detailed look at TTL (Time To Live) management.

---

## 1. SET & GET (Basic Storage)

Store and retrieve simple string values.

```bash
# Set a key
127.0.0.1:6379> SET username "Alice"
OK

# Retrieve the value
127.0.0.1:6379> GET username
"Alice"
````

Notes:

* Keys are overwritten if they already exist.
* SET works only with string values.

---

## 2. EXPIRE & TTL (Expiration Management)

Control how long a key remains in Redis.

```bash
# Create key
127.0.0.1:6379> SET session_id "abc123"
OK

# Set expiration (seconds)
127.0.0.1:6379> EXPIRE session_id 60
(integer) 1

# Check remaining TTL
127.0.0.1:6379> TTL session_id
(integer) 54
```

### TTL Return Values

| Value | Meaning            |
| ----- | ------------------ |
| > 0   | Seconds remaining  |
| -1    | No expiration set  |
| -2    | Key does not exist |

TTL countdown starts immediately after EXPIRE is set.

---

## 3. SETEX (Set + Expiration in One Step)

Atomic operation: set value and TTL together.

```bash
127.0.0.1:6379> SETEX temp_code 30 "9988"
OK
```

Equivalent to:

```bash
SET temp_code "9988"
EXPIRE temp_code 30
```

But safer and atomic.

---

## 4. PTTL (Precise TTL in Milliseconds)

Returns remaining time in milliseconds.

```bash
127.0.0.1:6379> PTTL session_id
(integer) 42500
```

Use PTTL when millisecond precision is required.

---

## 5. PERSIST (Remove Expiration)

Make a key permanent again.

```bash
127.0.0.1:6379> PERSIST session_id
(integer) 1

127.0.0.1:6379> TTL session_id
(integer) -1
```

Expiration removed, data preserved.

---

## 6. EXISTS & DEL (Key Management)

Check for a key's presence or delete it.

```bash
# Check existence
127.0.0.1:6379> EXISTS username
(integer) 1

# Delete key
127.0.0.1:6379> DEL username
(integer) 1
```

You can check multiple keys:

```bash
EXISTS key1 key2 key3
```

---

## 7. HSET & HGETALL (Hashes – Store Objects)

Store structured data like user profiles.

```bash
# Create object
127.0.0.1:6379> HSET user:101 name "Bob" age 25
(integer) 2

# Retrieve entire object
127.0.0.1:6379> HGETALL user:101
1) "name"
2) "Bob"
3) "age"
4) "25"
```

Good for:

* User profiles
* Product metadata
* Configuration objects

---

## 8. LPUSH & LRANGE (Lists)

Useful for queues and task systems.

```bash
# Add to list
127.0.0.1:6379> LPUSH tasks "email_client" "process_data"
(integer) 2

# Retrieve list
127.0.0.1:6379> LRANGE tasks 0 -1
1) "process_data"
2) "email_client"
```

* `0` = first element
* `-1` = last element

---

## 9. INCR (Atomic Counters)

Increment integer values safely.

```bash
127.0.0.1:6379> SET page_views 10
OK

127.0.0.1:6379> INCR page_views
(integer) 11
```

Ideal for:

* Page views
* Rate limiting
* API counters
* Leaderboards

---

## 10. INFO (Server Statistics)

Monitor Redis server health.

```bash
127.0.0.1:6379> INFO memory
# Memory
used_memory:1048576
used_memory_human:1.00M
```

Useful sections:

* INFO memory
* INFO stats
* INFO replication
* INFO server

---

# TTL Best Practices (Production Tips)

## 1. Set TTL at Creation Time

Prefer:

```bash
SET key value EX 60
```

or

```bash
SETEX key 60 value
```

Instead of:

```bash
SET key value
EXPIRE key 60
```

This avoids race conditions.

---

## 2. Sliding Expiration (Session Refresh)

For session systems:

```bash
EXPIRE session_id 60
```

Call this on every request to extend session lifetime.

---

## 3. Use PTTL for Precision Systems

Recommended for:

* Rate limiters
* OTP systems
* Cache invalidation timers

---

## 4. TTL Edge Cases

If a key expires:

* It is deleted automatically.
* It disappears silently.
* TTL becomes -2.

---

# Built-in Help

List generic commands:

```bash
HELP @generic
```

Help for specific command:

```bash
HELP SET
```

---

End of Guide.

```
```
