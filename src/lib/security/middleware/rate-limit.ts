import { serverOnly } from "@tanstack/react-start";
import { securityConfig } from "../config";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// TODO: In-memory store for rate limiting - this resets on each cold start in serverless environments.
// For production, use a durable store like Upstash Redis, DynamoDB, or rely on CDN rate limiting.
// Current implementation is suitable for development and single-instance deployments only.
const rateLimitStore: RateLimitStore = {};

/**
 * Rate limiting middleware
 * @param type - Type of rate limit to apply ('auth' or 'api')
 * @param key - Unique key for the rate limit (e.g., IP address, user ID)
 */
export const rateLimit = serverOnly(
  (type: keyof typeof securityConfig.rateLimit, key: string) => {
    const config = securityConfig.rateLimit[type];
    const now = Date.now();

    // Clean up expired entries
    Object.keys(rateLimitStore).forEach((k) => {
      if (rateLimitStore[k].resetTime < now) {
        delete rateLimitStore[k];
      }
    });

    const limitKey = `${type}:${key}`;
    const record = rateLimitStore[limitKey];

    if (!record || record.resetTime < now) {
      // Create new record
      rateLimitStore[limitKey] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return { allowed: true, remaining: config.max - 1 };
    }

    if (record.count >= config.max) {
      // Rate limit exceeded
      const error = Object.assign(
        new Error("Too many requests, please try again later."),
        {
          status: 429,
          statusText: "Too Many Requests",
        },
      );
      throw error;
    }

    // Increment count
    record.count++;

    return {
      allowed: true,
      remaining: config.max - record.count,
    };
  },
);

/**
 * Extract client IP from request headers
 */
export const getClientIp = serverOnly((headers: Headers): string => {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Default to a placeholder if no IP found
  return "unknown";
});
