import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users.model.js";

export const records = sqliteTable('records', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userId: integer('user_id').notNull().references(() => users.id),
    data: text('data')
}) 