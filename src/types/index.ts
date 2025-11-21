import { sql } from "drizzle-orm";
import { mysqlTable, varchar, text, int, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// -------------------- Users --------------------
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

// -------------------- Events --------------------
export const events = mysqlTable("events", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  image: text("image"),
  registrationLink: text("registration_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Team Members --------------------
export const teamMembers = mysqlTable("team_members", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  image: text("image"),
  socialLinks: text("social_links"),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Announcements --------------------
export const announcements = mysqlTable("announcements", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Registrations --------------------
export const registrations = mysqlTable("registrations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: text("name").notNull(),
  roll_number: text("roll_number").notNull(),
  department: text("department").notNull(),
  phone: text("phone").notNull(),
  event_title: text("event_title").notNull(), // added event_title
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Messages --------------------
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  senderId: varchar("sender_id", { length: 36 }).notNull(), // FK to users.id
  receiverId: varchar("receiver_id", { length: 36 }).notNull(), // FK to users.id
  content: text("content").notNull(),
  read: int("read").default(0).notNull(), // 0 = unread, 1 = read
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Contact Messages --------------------
export const contactMessages = mysqlTable("contact_messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Zod Schemas --------------------
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectEventSchema = createSelectSchema(events);

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectTeamMemberSchema = createSelectSchema(teamMembers);

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectAnnouncementSchema = createSelectSchema(announcements);

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const selectRegistrationSchema = createSelectSchema(registrations);

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectMessageSchema = createSelectSchema(messages);

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectContactMessageSchema = createSelectSchema(contactMessages);

// -------------------- TypeScript Types --------------------
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
