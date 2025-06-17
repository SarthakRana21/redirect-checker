import type { Config } from 'drizzle-kit';
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  schema: "./src/models/schemas.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "redirect-checker.db", // this sould be same as once specified in ./src/database/db.ts
  },
} satisfies Config );