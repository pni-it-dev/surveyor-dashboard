import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cities } from "@/lib/schema";

export async function GET() {
  try {
    const citiesList = await db.select().from(cities);

    return NextResponse.json(
      {
        success: true,
        cities: citiesList.map((city) => ({
          id: city.id,
          name: city.name,
          address: city.address,
          latitude: city.latitude,
          longitude: city.longitude,
          geojsonData: city.geojsonData,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API CITIES]", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 },
    );
  }
}
