import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

function mapRows<T = Record<string, unknown>>(result: unknown) {
  return ((result as { rows?: T[] }).rows ?? []) as T[];
}

function buildPoiSummary(totalPopulation: number, householdCount: number) {
  const poiTypes = [
    "Toko dan Retail",
    "FnB",
    "Pendidikan",
    "Perkantoran dan Komersil",
    "Fasilitas Publik",
    "Manufaktur",
    "Otomotif dan Jasa",
    "Taman dan Rekreasi",
    "Hiburan Umum",
    "Hiburan Dewasa",
    "Pom Bensin",
    "Rumah Sakit",
    "Hotel dan Penginapan",
    "Transportasi dan Pemberhentian",
    "Fasilitas Olahraga dan Gelanggang",
  ];

  return poiTypes.map((poi, index) => ({
    id: index + 1,
    poiType: poi,
    count: Math.max(2, Math.round(totalPopulation / 18 + householdCount / 3 + (index + 1) * 2)),
  }));
}

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get("cityId");

    if (!cityId) {
      return NextResponse.json(
        { error: "cityId is required" },
        { status: 400 },
      );
    }

    const cityIdNum = Number.parseInt(cityId, 10);
    if (Number.isNaN(cityIdNum)) {
      return NextResponse.json({ error: "cityId is invalid" }, { status: 400 });
    }

    const selectedAreaResult = await db.execute(sql`
      SELECT kecamatan, kabkot_id::int AS kabkot_id
      FROM surveyor_population_fact
      WHERE id = ${cityIdNum}
      LIMIT 1
    `);
    const selectedArea = mapRows<{ kecamatan: string; kabkot_id: number }>(selectedAreaResult)[0];

    if (!selectedArea) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    const areaName = selectedArea.kecamatan;

    const [
      summaryResult,
      genderResult,
      maritalResult,
      occupationStatusResult,
      occupationTypeResult,
      ageResult,
      socioResult,
      incomeResult,
      foodResult,
    ] = await Promise.all([
      db.execute(sql`
        SELECT
          kecamatan,
          kabkot_id::int AS "kabkotId",
          COUNT(*)::int AS "respondentCount",
          COUNT(DISTINCT no_kk)::int AS "totalHouseholds",
          COALESCE(SUM(jumlah_anggota), 0)::int AS "totalPopulation",
          ROUND(COALESCE(AVG(jumlah_anggota), 0), 2)::float AS "avgHouseholdSize",
          ROUND(COALESCE(AVG(usia), 0), 1)::float AS "averageAge",
          ROUND(COALESCE(AVG(monthly_food_expenditure), 0), 2)::float AS "averageMonthlyFoodExpenditure"
        FROM surveyor_population_fact
        WHERE kecamatan = ${areaName}
        GROUP BY kecamatan, kabkot_id
      `),
      db.execute(sql`
        SELECT gm.gender AS name, COUNT(*)::int AS value
        FROM surveyor_population_fact spf
        JOIN gender_master gm ON gm.id = spf.gender_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY gm.id, gm.gender
        ORDER BY gm.id
      `),
      db.execute(sql`
        SELECT msm.status AS name, COUNT(*)::int AS value
        FROM surveyor_population_fact spf
        JOIN marital_status_master msm ON msm.id = spf.marital_status_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY msm.id, msm.status
        ORDER BY msm.id
      `),
      db.execute(sql`
        SELECT osm.status AS name, COUNT(*)::int AS value
        FROM surveyor_population_fact spf
        JOIN occupation_status_master osm ON osm.id = spf.occupation_status_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY osm.id, osm.status
        ORDER BY osm.id
      `),
      db.execute(sql`
        SELECT otm.type AS name, COUNT(*)::int AS value
        FROM surveyor_population_fact spf
        JOIN occupation_type_master otm ON otm.id = spf.occupation_type_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY otm.id, otm.type
        ORDER BY value DESC, otm.id ASC
      `),
      db.execute(sql`
        SELECT
          CASE
            WHEN usia <= 5 THEN '0-5'
            WHEN usia <= 10 THEN '6-10'
            WHEN usia <= 15 THEN '11-15'
            WHEN usia <= 20 THEN '16-20'
            WHEN usia <= 25 THEN '21-25'
            WHEN usia <= 30 THEN '26-30'
            WHEN usia <= 35 THEN '31-35'
            WHEN usia <= 40 THEN '36-40'
            WHEN usia <= 45 THEN '41-45'
            WHEN usia <= 50 THEN '46-50'
            WHEN usia <= 55 THEN '51-55'
            WHEN usia <= 60 THEN '56-60'
            ELSE '60+'
          END AS "ageGroup",
          CASE
            WHEN usia <= 12 THEN 'Gen Alpha'
            WHEN usia <= 28 THEN 'Gen Z'
            WHEN usia <= 44 THEN 'Millennials'
            WHEN usia <= 60 THEN 'Gen X'
            ELSE 'Boomers'
          END AS generation,
          COALESCE(SUM(jumlah_anggota), 0)::int AS value
        FROM surveyor_population_fact
        WHERE kecamatan = ${areaName}
        GROUP BY 1, 2
        ORDER BY MIN(usia), 2
      `),
      db.execute(sql`
        SELECT sem.class AS name, COUNT(*)::int AS value
        FROM surveyor_population_fact spf
        JOIN socioeconomy_master sem ON sem.id = spf.socioclass_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY sem.id, sem.class
        ORDER BY sem.id
      `),
      db.execute(sql`
        SELECT mim.income AS name, COUNT(*)::int AS value
        FROM surveyor_population_fact spf
        JOIN monthly_income_master mim ON mim.id = spf.monthly_income_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY mim.id, mim.income
        ORDER BY mim.id
      `),
      db.execute(sql`
        SELECT fpm.preference AS name,
               COALESCE(SUM(spf.jumlah_anggota), 0)::int AS value
        FROM surveyor_population_fact spf
        JOIN food_preferences_master fpm ON fpm.id = spf.food_preference_id
        WHERE spf.kecamatan = ${areaName}
        GROUP BY fpm.id, fpm.preference
        ORDER BY fpm.id
      `),
    ]);

    const demographics = mapRows(summaryResult)[0] as
      | {
          kecamatan: string;
          kabkotId: number;
          respondentCount: number;
          totalHouseholds: number;
          totalPopulation: number;
          avgHouseholdSize: number;
          averageAge: number;
          averageMonthlyFoodExpenditure: number;
        }
      | undefined;

    return NextResponse.json(
      {
        success: true,
        demographics: demographics ?? null,
        genderBreakdown: mapRows<{ name: string; value: number }>(genderResult),
        maritalStatusBreakdown: mapRows<{ name: string; value: number }>(maritalResult),
        occupationStatusBreakdown: mapRows<{ name: string; value: number }>(occupationStatusResult),
        jobOccupations: mapRows<{ name: string; value: number }>(occupationTypeResult),
        ageGroupData: mapRows<{ ageGroup: string; generation: string; value: number }>(ageResult),
        socioeconomicData: mapRows<{ name: string; value: number }>(socioResult),
        incomeData: mapRows<{ name: string; value: number }>(incomeResult),
        foodExpenditureData: mapRows<{ name: string; value: number }>(foodResult),
        pointsOfInterest: demographics
          ? buildPoiSummary(demographics.totalPopulation, demographics.totalHouseholds)
          : [],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API DEMOGRAPHICS]", error);
    return NextResponse.json(
      { error: "Failed to fetch demographics" },
      { status: 500 },
    );
  }
}
