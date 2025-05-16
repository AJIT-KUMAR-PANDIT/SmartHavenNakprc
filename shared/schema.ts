import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  pin: text("pin").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  pin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  username: string;
  pin: string;
  createdAt?: string;
};

// Device model
export type Device = {
  id: string;
  name: string;
  route: string;
  type: string;
  pin: number;
  status: string;
  lastSeen: string | null;
  value?: number;
  unit?: string;
  brightness?: number;
  level?: number;
};

// Route model
export type Route = {
  id: string;
  route: string;
  type: string;
  action?: string;
  method?: string;
  lastAccessed: string | null;
  deviceStatus?: string;
};

// Log model
export type Log = {
  action: string;
  message: string;
  timestamp: string;
};

// Settings model
export type Settings = {
  mqtt?: {
    brokerUrl: string;
    port: string;
    username: string;
    password: string;
    clientId: string;
    autoReconnect: boolean;
    useSSL: boolean;
  };
  notifications?: {
    showNotifications: boolean;
    notificationSound: boolean;
    errorNotifications: boolean;
  };
  theme?: {
    darkMode: boolean;
    accentColor: string;
  };
  advanced?: {
    logLevel: string;
    logRetention: string;
    deviceCheckInterval: string;
  };
  [key: string]: any;
};
