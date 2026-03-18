import {
  sqliteTable as table,
  integer,
  text,
  real,
  blob,
  index,
} from 'drizzle-orm/sqlite-core';

// Users table
export const users = table(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

// Password reset tokens
export const passwordResetTokens = table(
  'password_reset_tokens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Sessions (for cookie-based auth)
export const sessions = table(
  'sessions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    sessionToken: text('session_token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  },
  (table) => ({
    sessionTokenIdx: index('sessions_token_idx').on(table.sessionToken),
  })
);

// Cities
export const cities = table(
  'cities',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    address: text('address').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    geojsonData: text('geojson_data').notNull(), // GeoJSON stored as JSON string
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  },
  (table) => ({
    nameIdx: index('cities_name_idx').on(table.name),
  })
);

// Demographics base data
export const demographics = table(
  'demographics',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    totalPopulation: integer('total_population').notNull(),
    totalHouseholds: integer('total_households').notNull(),
    avgHouseholdSize: real('avg_household_size').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  },
  (table) => ({
    cityIdIdx: index('demographics_city_idx').on(table.cityId),
  })
);

// Gender breakdown
export const genderBreakdown = table(
  'gender_breakdown',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    male: integer('male').notNull(),
    female: integer('female').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Marital status breakdown
export const maritalStatusBreakdown = table(
  'marital_status_breakdown',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    married: integer('married').notNull(),
    single: integer('single').notNull(),
    widow: integer('widow').notNull(),
    divorced: integer('divorced').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Occupation status breakdown
export const occupationStatusBreakdown = table(
  'occupation_status_breakdown',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    employed: integer('employed').notNull(),
    unemployed: integer('unemployed').notNull(),
    student: integer('student').notNull(),
    retired: integer('retired').notNull(),
    other: integer('other').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Job occupations
export const jobOccupations = table(
  'job_occupations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    occupation: text('occupation').notNull(),
    count: integer('count').notNull(),
    percentage: real('percentage').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Age groups with generation data
export const ageGroupData = table(
  'age_group_data',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    ageGroup: text('age_group').notNull(),
    generation: text('generation').notNull(),
    count: integer('count').notNull(),
    percentage: real('percentage').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Socioeconomic data
export const socioeconomicData = table(
  'socioeconomic_data',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    value: integer('value').notNull(),
    percentage: real('percentage').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Income data
export const incomeData = table(
  'income_data',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    incomeRange: text('income_range').notNull(),
    count: integer('count').notNull(),
    percentage: real('percentage').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Food expenditure data
export const foodExpenditureData = table(
  'food_expenditure_data',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    amount: real('amount').notNull(),
    percentage: real('percentage').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

// Points of Interest (POI)
export const pointsOfInterest = table(
  'points_of_interest',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    poiType: text('poi_type').notNull(),
    count: integer('count').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date()),
  }
);

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
