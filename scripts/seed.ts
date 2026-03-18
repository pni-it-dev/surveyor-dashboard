import { db } from "../lib/db";
import {
  cities,
  demographics,
  genderBreakdown,
  maritalStatusBreakdown,
  occupationStatusBreakdown,
  jobOccupations,
  ageGroupData,
  socioeconomicData,
  incomeData,
  foodExpenditureData,
  pointsOfInterest,
} from "../lib/schema";
import { eq } from "drizzle-orm";

interface CityData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geojson: any;
}

const CITIES_DATA: CityData[] = [
  {
    name: "Jakarta",
    address: "Central Jakarta, Indonesia",
    latitude: -6.2088,
    longitude: 106.8456,
    geojson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.7, -6.3],
            [106.9, -6.3],
            [106.9, -6.1],
            [106.7, -6.1],
            [106.7, -6.3],
          ],
        ],
      },
      properties: { name: "Jakarta" },
    },
  },
  {
    name: "Surabaya",
    address: "East Java, Indonesia",
    latitude: -7.2504,
    longitude: 112.7488,
    geojson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [112.6, -7.35],
            [112.85, -7.35],
            [112.85, -7.15],
            [112.6, -7.15],
            [112.6, -7.35],
          ],
        ],
      },
      properties: { name: "Surabaya" },
    },
  },
  {
    name: "Bandung",
    address: "West Java, Indonesia",
    latitude: -6.9175,
    longitude: 107.6062,
    geojson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.5, -7.0],
            [107.7, -7.0],
            [107.7, -6.8],
            [107.5, -6.8],
            [107.5, -7.0],
          ],
        ],
      },
      properties: { name: "Bandung" },
    },
  },
];

async function seedCity(cityData: CityData) {
  try {
    // Check if city already exists
    const existingCity = await db
      .select()
      .from(cities)
      .where(eq(cities.name, cityData.name))
      .limit(1);

    if (existingCity.length > 0) {
      console.log(`[SEED] City "${cityData.name}" already exists, skipping...`);
      return existingCity[0];
    }

    // Insert city
    const [newCity] = await db
      .insert(cities)
      .values({
        name: cityData.name,
        address: cityData.address,
        latitude: cityData.latitude,
        longitude: cityData.longitude,
        geojsonData: cityData.geojson,
      })
      .returning();

    console.log(`[SEED] Created city: ${cityData.name}`);

    // Seed demographics for this city
    const totalPopulation = Math.floor(Math.random() * 3000000) + 500000;
    const totalHouseholds = Math.floor(totalPopulation / 4);
    const avgHouseholdSize = (totalPopulation / totalHouseholds).toFixed(2);

    await db
      .insert(demographics)
      .values({
        cityId: newCity.id,
        totalPopulation,
        totalHouseholds,
        avgHouseholdSize: Number(avgHouseholdSize),
      })
      .returning();

    // Seed gender breakdown
    const malePopulation = Math.floor(totalPopulation * 0.48);
    const femalePopulation = totalPopulation - malePopulation;

    await db.insert(genderBreakdown).values({
      cityId: newCity.id,
      male: malePopulation,
      female: femalePopulation,
    });

    // Seed marital status
    const married = Math.floor(totalPopulation * 0.45);
    const single = Math.floor(totalPopulation * 0.35);
    const widow = Math.floor(totalPopulation * 0.12);
    const divorced = totalPopulation - married - single - widow;

    await db.insert(maritalStatusBreakdown).values({
      cityId: newCity.id,
      married,
      single,
      widow,
      divorced,
    });

    // Seed occupation status
    const employed = Math.floor(totalPopulation * 0.55);
    const unemployed = Math.floor(totalPopulation * 0.08);
    const student = Math.floor(totalPopulation * 0.15);
    const retired = Math.floor(totalPopulation * 0.12);
    const otherOccupation =
      totalPopulation - employed - unemployed - student - retired;

    await db.insert(occupationStatusBreakdown).values({
      cityId: newCity.id,
      employed,
      unemployed,
      student,
      retired,
      other: otherOccupation,
    });

    // Seed job occupations
    const jobOccupationList = [
      { name: "Farmer", percentage: 15 },
      { name: "Tech Professional", percentage: 18 },
      { name: "Retail/Sales", percentage: 16 },
      { name: "Health Worker", percentage: 12 },
      { name: "Entrepreneur", percentage: 14 },
      { name: "Manufacturing", percentage: 10 },
      { name: "Education", percentage: 9 },
      { name: "Finance", percentage: 6 },
    ];

    for (const job of jobOccupationList) {
      const count = Math.floor(employed * (job.percentage / 100));
      await db.insert(jobOccupations).values({
        cityId: newCity.id,
        occupation: job.name,
        count,
        percentage: job.percentage,
      });
    }

    // Seed age group data
    const ageGroups = [
      { group: "0-4", generation: "Gen Alpha", percentage: 6 },
      { group: "5-9", generation: "Gen Alpha", percentage: 7 },
      { group: "10-14", generation: "Gen Z", percentage: 7 },
      { group: "15-19", generation: "Gen Z", percentage: 8 },
      { group: "20-24", generation: "Gen Z", percentage: 9 },
      { group: "25-29", generation: "Millennials", percentage: 10 },
      { group: "30-34", generation: "Millennials", percentage: 10 },
      { group: "35-39", generation: "Millennials", percentage: 9 },
      { group: "40-44", generation: "Gen X", percentage: 8 },
      { group: "45-49", generation: "Gen X", percentage: 7 },
      { group: "50-54", generation: "Gen X", percentage: 6 },
      { group: "55-59", generation: "Boomer II", percentage: 4 },
      { group: "60-64", generation: "Boomer II", percentage: 2 },
      { group: "65-69", generation: "Boomer I", percentage: 2 },
      { group: ">70", generation: "Boomer I", percentage: 2 },
    ];

    for (const ag of ageGroups) {
      const count = Math.floor(totalPopulation * (ag.percentage / 100));
      await db.insert(ageGroupData).values({
        cityId: newCity.id,
        ageGroup: ag.group,
        generation: ag.generation,
        count,
        percentage: ag.percentage,
      });
    }

    // Seed socioeconomic data
    const socioeconomic = [
      { category: "Low Income", percentage: 25 },
      { category: "Lower Middle", percentage: 30 },
      { category: "Middle Income", percentage: 30 },
      { category: "Upper Middle", percentage: 12 },
      { category: "High Income", percentage: 3 },
    ];

    for (const se of socioeconomic) {
      const value = Math.floor(totalHouseholds * (se.percentage / 100));
      await db.insert(socioeconomicData).values({
        cityId: newCity.id,
        category: se.category,
        value,
        percentage: se.percentage,
      });
    }

    // Seed income data
    const incomes = [
      { range: "< $500", percentage: 20 },
      { range: "$500-$1000", percentage: 25 },
      { range: "$1000-$2000", percentage: 30 },
      { range: "$2000-$5000", percentage: 18 },
      { range: "> $5000", percentage: 7 },
    ];

    for (const income of incomes) {
      const count = Math.floor(totalHouseholds * (income.percentage / 100));
      await db.insert(incomeData).values({
        cityId: newCity.id,
        incomeRange: income.range,
        count,
        percentage: income.percentage,
      });
    }

    // Seed food expenditure
    const foodExpenditure = [
      { category: "Staple Foods", amount: 150, percentage: 30 },
      { category: "Vegetables & Fruits", amount: 100, percentage: 20 },
      { category: "Meat & Protein", amount: 120, percentage: 24 },
      { category: "Beverages", amount: 80, percentage: 16 },
      { category: "Other Food", amount: 50, percentage: 10 },
    ];

    for (const fe of foodExpenditure) {
      await db.insert(foodExpenditureData).values({
        cityId: newCity.id,
        category: fe.category,
        amount: fe.amount,
        percentage: fe.percentage,
      });
    }

    // Seed points of interest
    const pois = [
      { type: "Retail Store", count: Math.floor(Math.random() * 500) + 100 },
      { type: "Restaurant", count: Math.floor(Math.random() * 400) + 80 },
      { type: "Hotel", count: Math.floor(Math.random() * 200) + 20 },
      { type: "Hospital", count: Math.floor(Math.random() * 50) + 10 },
      { type: "Gas Station", count: Math.floor(Math.random() * 150) + 30 },
      { type: "Bank", count: Math.floor(Math.random() * 100) + 20 },
      { type: "School", count: Math.floor(Math.random() * 200) + 50 },
      { type: "Park", count: Math.floor(Math.random() * 80) + 15 },
      { type: "Shopping Mall", count: Math.floor(Math.random() * 30) + 5 },
      { type: "Movie Theater", count: Math.floor(Math.random() * 20) + 2 },
    ];

    for (const poi of pois) {
      await db.insert(pointsOfInterest).values({
        cityId: newCity.id,
        poiType: poi.type,
        count: poi.count,
      });
    }

    console.log(`[SEED] Seeded all data for city: ${cityData.name}`);
    return newCity;
  } catch (error) {
    console.error(`[SEED] Error seeding city ${cityData.name}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log("[SEED] Starting database seed...");

    for (const cityData of CITIES_DATA) {
      await seedCity(cityData);
    }

    console.log("[SEED] Database seed completed successfully!");
  } catch (error) {
    console.error("[SEED] Seed failed:", error);
    process.exit(1);
  }
}

main();
