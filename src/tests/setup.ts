// Ensure we are in React dev/test mode for tests
process.env["NODE_ENV"] = "test";

// @ts-expect-error - This is a global variable set for React's act environment
global.IS_REACT_ACT_ENVIRONMENT = true;

import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock environment variables for tests
vi.mock("~/lib/env.server", () => ({
  env: {
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://test",
    DATABASE_URL_UNPOOLED: "postgresql://test",
    BETTER_AUTH_SECRET: "test-secret",
    VITE_BASE_URL: "http://localhost:3000",
  },
}));

// Mock CSS imports
vi.mock("~/styles.css?url", () => ({
  default: "/test-styles.css",
}));
