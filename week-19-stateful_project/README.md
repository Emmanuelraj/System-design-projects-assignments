Here’s a **clean, minimal recap** — **only usage + core rules of Singleton**, no code walkthrough, no explanations.

---

## Singleton Pattern — Core Rules & Usage

### What Singleton Means

> **Only one instance of a class exists, and everyone uses that same instance.**

---

## Core Rules of Singleton

1. **Single Instance**

   * Only one object is ever created.

2. **Private Constructor**

   * Prevents creating objects using `new` from outside.

3. **Global Access Point**

   * A controlled way (usually `getInstance()`) to access the instance.

4. **Shared State**

   * All consumers read/write the same internal state.

---

## How Singleton Is Used

* You **never** create the object directly.
* You **always** access it through the singleton accessor.

Conceptually:

```
Get the instance → call methods on it
```

Not:

```
Create new objects
```

---

## What Singleton Is NOT

* ❌ Not a collection of static methods
* ❌ Not a global variable
* ❌ Not multiple instances with shared data

---

## When to Use Singleton

* Central state manager
* Game manager
* Logger
* Configuration manager
* Cache or in-memory store

---

## One-Line Rule to Remember

> **If you can create more than one instance, it’s not a Singleton.**

That’s the **core essence** of the Singleton pattern.
