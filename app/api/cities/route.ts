import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const AREA_METADATA: Record<string, { address: string; latitude: number; longitude: number }> = {
  "Kebayoran Baru": { address: "Jakarta Selatan, DKI Jakarta", latitude: -6.2447, longitude: 106.8003 },
  Gubeng: { address: "Kota Surabaya, Jawa Timur", latitude: -7.2819, longitude: 112.7578 },
  Coblong: { address: "Kota Bandung, Jawa Barat", latitude: -6.8867, longitude: 107.6186 },
};

export async function GET() {
  try {
    const result = (await db.execute(sql`
      SELECT
        MIN(spf.id)::int AS id,
        spf.kecamatan AS name,
        spf.kabkot_id::int AS kabkot_id,
        COALESCE(kg.name, UPPER(spf.kecamatan)) AS kabkot_name,
        kg.geojson AS geojson_data,
        COUNT(*)::int AS respondent_count,
        COALESCE(SUM(spf.jumlah_anggota), 0)::int AS total_population
      FROM surveyor_population_fact spf
      LEFT JOIN surveyor_kabkot_geojson kg ON kg.id = spf.kabkot_id
      GROUP BY spf.kecamatan, spf.kabkot_id, kg.name, kg.geojson
      ORDER BY spf.kecamatan ASC
    `)) as { rows: Array<Record<string, unknown>> };

    const cities = result.rows.map((row) => {
      const name = String(row.name);
      const metadata = AREA_METADATA[name] ?? {
        address: `Kab/Kota ${row.kabkot_id}`,
        latitude: -6.2,
        longitude: 106.8,
      };

      return {
        id: Number(row.id),
        name,
        address: metadata.address,
        kabkotId: Number(row.kabkot_id),
        kabkotName: String(row.kabkot_name),
        respondentCount: Number(row.respondent_count),
        totalPopulation: Number(row.total_population),
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        geojsonData: row.geojson_data,
      };
    });

    return NextResponse.json({ success: true, cities }, { status: 200 });
  } catch (error) {
    console.error("[API CITIES]", error);
    return NextResponse.json({ error: "Failed to fetch area list" }, { status: 500 });
  }
}
