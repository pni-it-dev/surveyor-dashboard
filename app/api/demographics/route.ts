import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
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
} from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get("cityId");

    if (!cityId) {
      return NextResponse.json(
        { error: "cityId is required" },
        { status: 400 },
      );
    }

    const cityIdNum = parseInt(cityId);

    const [
      demo,
      gender,
      marital,
      occupation,
      jobs,
      ages,
      socio,
      income,
      food,
      poi,
    ] = await Promise.all([
      db.select().from(demographics).where(eq(demographics.cityId, cityIdNum)),
      db
        .select()
        .from(genderBreakdown)
        .where(eq(genderBreakdown.cityId, cityIdNum)),
      db
        .select()
        .from(maritalStatusBreakdown)
        .where(eq(maritalStatusBreakdown.cityId, cityIdNum)),
      db
        .select()
        .from(occupationStatusBreakdown)
        .where(eq(occupationStatusBreakdown.cityId, cityIdNum)),
      db
        .select()
        .from(jobOccupations)
        .where(eq(jobOccupations.cityId, cityIdNum)),
      db.select().from(ageGroupData).where(eq(ageGroupData.cityId, cityIdNum)),
      db
        .select()
        .from(socioeconomicData)
        .where(eq(socioeconomicData.cityId, cityIdNum)),
      db.select().from(incomeData).where(eq(incomeData.cityId, cityIdNum)),
      db
        .select()
        .from(foodExpenditureData)
        .where(eq(foodExpenditureData.cityId, cityIdNum)),
      db
        .select()
        .from(pointsOfInterest)
        .where(eq(pointsOfInterest.cityId, cityIdNum)),
    ]);

    return NextResponse.json(
      {
        success: true,
        demographics: demo.length > 0 ? demo[0] : null,
        genderBreakdown: gender,
        maritalStatusBreakdown: marital.length > 0 ? marital[0] : null,
        occupationStatusBreakdown: occupation.length > 0 ? occupation[0] : null,
        jobOccupations: jobs,
        ageGroupData: ages,
        socioeconomicData: socio,
        incomeData: income,
        foodExpenditureData: food,
        pointsOfInterest: poi,
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
