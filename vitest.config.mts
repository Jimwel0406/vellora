import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      include: [
        "src/lib/**/*.ts",
      ],
      exclude: [
        "src/lib/**/*.test.ts",
        "src/lib/auth.ts",
        "src/lib/complete-order.ts",
        "src/lib/email.ts",
        "src/lib/notifications.ts",
        "src/lib/product-qa.ts",
        "src/lib/promo.ts",
        "src/lib/stripe.ts",
        "src/lib/supabase.ts",
      ],
      reporter: ["text", "json-summary"],
      thresholds: {
        statements: 80,
        functions: 80,
        lines: 80,
        branches: 70,
      },
    },
  },
});