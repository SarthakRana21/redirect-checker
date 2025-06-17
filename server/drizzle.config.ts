import type { Config } from 'drizzle-kit';
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  schema: "./src/models/schemas.js",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./redirect-checker.db",
  },
} satisfies Config );