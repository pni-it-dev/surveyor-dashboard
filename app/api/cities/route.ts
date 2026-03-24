import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const AREA_METADATA: Record<
  string,
  { address: string; latitude: number; longitude: number; palette: string[] }
> = {
  "Kebayoran Baru": {
    address: "Jakarta Selatan, DKI Jakarta",
    latitude: -6.2447,
    longitude: 106.8003,
    palette: ["#f9c5d5", "#f8d49d", "#c7ceea"],
  },
  Gubeng: {
    address: "Kota Surabaya, Jawa Timur",
    latitude: -7.2819,
    longitude: 112.7578,
    palette: ["#b5ead7", "#c7ceea", "#f6d6ad"],
  },
  Coblong: {
    address: "Kota Bandung, Jawa Barat",
    latitude: -6.8867,
    longitude: 107.6186,
    palette: ["#c7ceea", "#ffdac1", "#e2f0cb"],
  },
};

export async function GET() {
  try {
    const result = (await db.execute(sql`
      SELECT
        MIN(id)::int AS id,
        kecamatan AS name,
        kabkot_id::int AS kabkot_id,
        COUNT(*)::int AS respondent_count,
        COALESCE(SUM(jumlah_anggota), 0)::int AS total_population
      FROM surveyor_population_fact
      GROUP BY kecamatan, kabkot_id
      ORDER BY kecamatan ASC
    `)) as { rows: Array<Record<string, unknown>> };

    const cities = result.rows.map((row) => {
      const name = String(row.name);
      const metadata = AREA_METADATA[name] ?? {
        address: `Kab/Kota ${row.kabkot_id}`,
        latitude: -6.2,
        longitude: 106.8,
        palette: ["#f9c5d5", "#c7ceea", "#b5ead7"],
      };

      return {
        id: Number(row.id),
        name,
        address: metadata.address,
        kabkotId: Number(row.kabkot_id),
        respondentCount: Number(row.respondent_count),
        totalPopulation: Number(row.total_population),
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
