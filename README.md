# 🔐 Redis Usage in Real-Time Chat App with AI Integration

## 📁 Redis Context in This Project

In this real-time AI chat application, **Redis is used for token management**, specifically:

- **Blacklisting JWTs on logout**
- Ensuring logged-out users cannot reuse old tokens
- Securing the stateless authentication flow

---

## 📂 File Structure (Related)

- `redis.service.js` – Redis client setup
- `user.controller.js` – Uses Redis in `logoutController` to blacklist tokens

---

## 🚀 How It Works

### 🔑 Login Flow

When a user logs in:
- A JWT is generated using `user.generateJWT()`.
- No token is stored in Redis at this point.

### ❌ Logout Flow

When a user logs out:

```js
const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
await redisClient.set(token, 'logout', { EX: 60 * 60 * 24 }); // Expires in 24 hrs

This stores the token in Redis as a blacklist entry for 24 hours (or until its expiry), preventing it from being reused.
```

✅ Token Validation (Middleware Assumption)
In protected routes, a middleware can check Redis to confirm if the token is blacklisted:

const isBlacklisted = await redisClient.get(token);
if (isBlacklisted) {
  return res.status(401).json({ message: 'Token is blacklisted' });
}
📌 Why Redis?
🧠 Fast in-memory checks – Redis makes blacklist lookups instant.

⏱️ TTL support – Tokens automatically expire after their lifespan.

🔐 Stateless security – Prevents reuse of JWTs after logout without a DB call.



