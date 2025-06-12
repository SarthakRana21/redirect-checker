import { drizzle } from "drizzle-orm/singlestore/driver";
import { Database } from "sqlite3";
import { users } from "../models/users.model";
import { records } from "../models/records.model";

const sqlite = new Database('./redirect-checker.db')
export const db = drizzle(sqlite, {schema: {
    users, 
    records
}}) 