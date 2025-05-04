import { pgTable, serial, text, varchar, timestamp, boolean, uniqueIndex, integer, primaryKey } from 'drizzle-orm/pg-core';

/**
 * ตาราง users สำหรับเก็บข้อมูลผู้ใช้งาน
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  fullName: varchar('full_name', { length: 100 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordExpiresAt: timestamp('reset_password_expires_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(table.email),
    usernameIdx: uniqueIndex('username_idx').on(table.username),
  };
});

/**
 * ตาราง user_profiles สำหรับเก็บข้อมูลโปรไฟล์เพิ่มเติม
 */
export const userProfiles = pgTable('user_profiles', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  birthDate: timestamp('birth_date', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId] }),
  };
});

/**
 * ตาราง user_sessions สำหรับเก็บข้อมูลเซสชันของผู้ใช้
 */
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
}, (table) => {
  return {
    tokenIdx: uniqueIndex('token_idx').on(table.token),
  };
});

// Export types ที่สร้างจาก schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
