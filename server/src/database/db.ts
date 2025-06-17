import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../models/users.model";
import { records } from "../models/records.model";

const sqlite = new Database("redirect-checker.db")
export const db = drizzle(sqlite, {schema: {
    users, 
    records
}}) 