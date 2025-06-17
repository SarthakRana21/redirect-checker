import type { Config } from 'drizzle-kit';
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  schema: "./src/models/schemas.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./src/database/redirect-checker.db",
  },
} satisfies Config );