import {
  index,
  integer,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "surveyor_users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("surveyor_users_email_idx").on(table.email),
  }),
);

export const passwordResetTokens = pgTable("surveyor_password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "surveyor_sessions",
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
    sessionTokenIdx: index("surveyor_sessions_token_idx").on(table.sessionToken),
  }),
);

export const genderMaster = pgTable("gender_master", {
  id: serial("id").primaryKey(),
  gender: varchar("gender", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const maritalStatusMaster = pgTable("marital_status_master", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const occupationStatusMaster = pgTable("occupation_status_master", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const occupationTypeMaster = pgTable("occupation_type_master", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 150 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const socioeconomyMaster = pgTable("socioeconomy_master", {
  id: serial("id").primaryKey(),
  className: varchar("class", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const educationMaster = pgTable("education_master", {
  id: serial("id").primaryKey(),
  grade: varchar("grade", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const monthlyIncomeMaster = pgTable("monthly_income_master", {
  id: serial("id").primaryKey(),
  income: varchar("income", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const housingStatusMaster = pgTable("housing_status_master", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const foodPreferencesMaster = pgTable("food_preferences_master", {
  id: serial("id").primaryKey(),
  preference: varchar("preference", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const poiTypeMaster = pgTable("poi_type_master", {
  id: serial("id").primaryKey(),
  poi: varchar("poi", { length: 150 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const surveyorPoiFact = pgTable(
  "surveyor_poi_fact",
  {
    id: serial("id").primaryKey(),
    kecamatanId: varchar("kecamatan_id", { length: 6 }).notNull(),
    poiName: varchar("poi_name", { length: 255 }).notNull(),
    poiAddress: varchar("poi_address", { length: 500 }).notNull(),
    poiTypeId: integer("poi_type_id").references(() => poiTypeMaster.id),
    operationalDay: varchar("operational_day", { length: 100 }),
    avgOpenHour: varchar("avg_open_hour", { length: 5 }),
    avgClosedHour: varchar("avg_closed_hour", { length: 5 }),
    longitude: real("longitude"),
    latitude: real("latitude"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    poiKecamatanIdx: index("surveyor_poi_fact_kecamatan_idx").on(table.kecamatanId),
    poiTypeIdx: index("surveyor_poi_fact_poi_type_idx").on(table.poiTypeId),
  }),
);

export const surveyorPopulationFact = pgTable(
  "surveyor_population_fact",
  {
    id: serial("id").primaryKey(),
    noKk: varchar("no_kk", { length: 50 }).notNull().unique(),
    namaAnggota: varchar("nama_anggota", { length: 255 }).notNull(),
    genderId: integer("gender_id")
      .notNull()
      .references(() => genderMaster.id),
    usia: integer("usia").notNull(),
    housingStatusId: integer("housing_status_id")
      .notNull()
      .references(() => housingStatusMaster.id),
    maritalStatusId: integer("marital_status_id")
      .notNull()
      .references(() => maritalStatusMaster.id),
    educationId: integer("education_id")
      .notNull()
      .references(() => educationMaster.id),
    occupationStatusId: integer("occupation_status_id")
      .notNull()
      .references(() => occupationStatusMaster.id),
    occupationTypeId: integer("occupation_type_id")
      .notNull()
      .references(() => occupationTypeMaster.id),
    monthlyIncomeId: integer("monthly_income_id")
      .notNull()
      .references(() => monthlyIncomeMaster.id),
    foodPreferenceId: integer("food_preference_id")
      .notNull()
      .references(() => foodPreferencesMaster.id),
    monthlyFoodExpenditure: real("monthly_food_expenditure").notNull(),
    socioclassId: integer("socioclass_id")
      .notNull()
      .references(() => socioeconomyMaster.id),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    genderIdx: index("surveyor_population_fact_gender_idx").on(table.genderId),
    maritalIdx: index("surveyor_population_fact_marital_idx").on(
      table.maritalStatusId,
    ),
  }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GenderMaster = typeof genderMaster.$inferSelect;
export type MaritalStatusMaster = typeof maritalStatusMaster.$inferSelect;
export type OccupationStatusMaster = typeof occupationStatusMaster.$inferSelect;
export type OccupationTypeMaster = typeof occupationTypeMaster.$inferSelect;
export type SocioeconomyMaster = typeof socioeconomyMaster.$inferSelect;
export type EducationMaster = typeof educationMaster.$inferSelect;
export type MonthlyIncomeMaster = typeof monthlyIncomeMaster.$inferSelect;
export type HousingStatusMaster = typeof housingStatusMaster.$inferSelect;
export type FoodPreferencesMaster = typeof foodPreferencesMaster.$inferSelect;
export type PoiTypeMaster = typeof poiTypeMaster.$inferSelect;
export type SurveyorPopulationFact = typeof surveyorPopulationFact.$inferSelect;
export type InsertSurveyorPopulationFact = typeof surveyorPopulationFact.$inferInsert;
export type SurveyorPoiFact = typeof surveyorPoiFact.$inferSelect;
export type InsertSurveyorPoiFact = typeof surveyorPoiFact.$inferInsert;
