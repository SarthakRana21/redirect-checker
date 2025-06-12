import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    refreshToken: text('refresh_token'),
})