import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  displayName: text("display_name"),
  cycleLengthDays: integer("cycle_length_days").default(28),
  periodLengthDays: integer("period_length_days").default(5),
});

export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  flowIntensity: text("flow_intensity"), 
  notes: text("notes"),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  symptoms: jsonb("symptoms").$type<string[]>(), 
  mood: text("mood"),
  severity: integer("severity"), 
  notes: text("notes"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("author_id"), 
  upvotes: integer("upvotes").default(0),
  verifiedMedicalAdvice: boolean("verified_medical_advice").default(false),
  category: text("category"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCycleSchema = createInsertSchema(cycles).omit({ id: true });
export const insertLogSchema = createInsertSchema(logs).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, upvotes: true, verifiedMedicalAdvice: true });

export type User = typeof users.$inferSelect;
export type Cycle = typeof cycles.$inferSelect;
export type Log = typeof logs.$inferSelect;
export type Post = typeof posts.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCycle = z.infer<typeof insertCycleSchema>;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;