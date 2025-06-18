import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "./src/models/users.model";
import { records } from "./src/models/records.model";

const sqlite = new Database("./drizzle/redirect-checker.db")
export const db = drizzle(sqlite, {schema: {
    users, 
    records
}}) 