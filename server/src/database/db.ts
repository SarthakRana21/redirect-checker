import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../models/users.model.js";
import { records } from "../models/records.model.js";

const sqlite = new Database("./redirect-checker.db")
export const db = drizzle(sqlite, {schema: {
    users, 
    records
}}) 