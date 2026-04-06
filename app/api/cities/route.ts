import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const AREA_METADATA: Record<
  string,
  { name: string; address: string; latitude: number; longitude: number; palette: string[] }
> = {
  "351516": {
    name: "Gedangan",
    address: "Kab. Sidoarjo, Jawa Timur",
    latitude: -7.3805,
    longitude: 112.7197,
    palette: ["#f9c5d5", "#f8d49d", "#c7ceea"],
  },
  "357808": {
    name: "Gubeng",
    address: "Kota Surabaya, Jawa Timur",
    latitude: -7.2819,
    longitude: 112.7578,
    palette: ["#b5ead7", "#c7ceea", "#f6d6ad"],
  },
  "357302": {
    name: "Klojen",
    address: "Kota Malang, Jawa Timur",
    latitude: -7.9825,
    longitude: 112.6308,
    palette: ["#c7ceea", "#ffdac1", "#e2f0cb"],
  },
};

export async function GET() {
  try {
    const result = (await db.execute(sql`
      SELECT
        LEFT(no_kk, 6) AS prefix,
        kg.geojson AS geojson,
        COUNT(*)::int AS respondent_count,
        COUNT(DISTINCT no_kk)::int AS total_households
      FROM surveyor_population_fact
      LEFT JOIN kecamatan_geojson kg ON LEFT(no_kk, 6) = kg.code::text
      GROUP BY LEFT(no_kk, 6), kg.geojson
      ORDER BY LEFT(no_kk, 6) ASC
    `)) as { rows: Array<Record<string, unknown>> };

    const cities = result.rows.map((row) => {
      const prefix = String(row.prefix);
      const metadata = AREA_METADATA[prefix] ?? {
        name: prefix,
        address: `Kecamatan ${prefix}`,
        latitude: -7.0,
        longitude: 112.7,
        palette: ["#f9c5d5", "#c7ceea", "#b5ead7"],
      };

      return {
        id: prefix,
        name: metadata.name,
        address: metadata.address,
        geojson: row.geojson !== null ? JSON.parse(String(row.geojson)) : null,
        respondentCount: Number(row.respondent_count),
        totalPopulation: Number(row.respondent_count),
        totalHouseholds: Number(row.total_households),
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        palette: metadata.palette,
      };
    });

    return NextResponse.json({ success: true, cities }, { status: 200 });
  } catch (error) {
    console.error("[API CITIES]", error);
    return NextResponse.json(
      { error: "Failed to fetch area list" },
      { status: 500 },
    );
  }
}
