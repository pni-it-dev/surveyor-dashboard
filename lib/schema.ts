import {
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Sessions (for cookie-based auth)
export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    sessionTokenIdx: index("sessions_token_idx").on(table.sessionToken),
  }),
);

// Cities
export const cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    address: varchar("address", { length: 255 }).notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    geojsonData: jsonb("geojson_data").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("cities_name_idx").on(table.name),
  }),
);

// Demographics base data
export const demographics = pgTable(
  "demographics",
  {
    id: serial("id").primaryKey(),
    cityId: integer("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    totalPopulation: integer("total_population").notNull(),
    totalHouseholds: integer("total_households").notNull(),
    avgHouseholdSize: real("avg_household_size").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    cityIdIdx: index("demographics_city_idx").on(table.cityId),
  }),
);

// Gender breakdown
export const genderBreakdown = pgTable("gender_breakdown", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  male: integer("male").notNull(),
  female: integer("female").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Marital status breakdown
export const maritalStatusBreakdown = pgTable("marital_status_breakdown", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  married: integer("married").notNull(),
  single: integer("single").notNull(),
  widow: integer("widow").notNull(),
  divorced: integer("divorced").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Occupation status breakdown
export const occupationStatusBreakdown = pgTable("occupation_status_breakdown", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  employed: integer("employed").notNull(),
  unemployed: integer("unemployed").notNull(),
  student: integer("student").notNull(),
  retired: integer("retired").notNull(),
  other: integer("other").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Job occupations
export const jobOccupations = pgTable("job_occupations", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  count: integer("count").notNull(),
  percentage: real("percentage").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Age groups with generation data
export const ageGroupData = pgTable("age_group_data", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  ageGroup: varchar("age_group", { length: 50 }).notNull(),
  generation: varchar("generation", { length: 50 }).notNull(),
  count: integer("count").notNull(),
  percentage: real("percentage").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Socioeconomic data
export const socioeconomicData = pgTable("socioeconomic_data", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 255 }).notNull(),
  value: integer("value").notNull(),
  percentage: real("percentage").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Income data
export const incomeData = pgTable("income_data", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  incomeRange: varchar("income_range", { length: 255 }).notNull(),
  count: integer("count").notNull(),
  percentage: real("percentage").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Food expenditure data
export const foodExpenditureData = pgTable("food_expenditure_data", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 255 }).notNull(),
  amount: real("amount").notNull(),
  percentage: real("percentage").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Points of Interest (POI)
export const pointsOfInterest = pgTable("points_of_interest", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),
  poiType: varchar("poi_type", { length: 100 }).notNull(),
  count: integer("count").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;
export type Demographics = typeof demographics.$inferSelect;
export type GenderBreakdown = typeof genderBreakdown.$inferSelect;
export type MaritalStatusBreakdown = typeof maritalStatusBreakdown.$inferSelect;
export type OccupationStatusBreakdown = typeof occupationStatusBreakdown.$inferSelect;
export type JobOccupation = typeof jobOccupations.$inferSelect;
export type AgeGroupData = typeof ageGroupData.$inferSelect;
export type SocioeconomicData = typeof socioeconomicData.$inferSelect;
export type IncomeData = typeof incomeData.$inferSelect;
export type FoodExpenditureData = typeof foodExpenditureData.$inferSelect;
export type PointOfInterest = typeof pointsOfInterest.$inferSelect;
