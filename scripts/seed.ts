import { db } from "../lib/db";
import {
  foodPreferencesMaster,
  genderMaster,
  housingStatusMaster,
  educationMaster,
  maritalStatusMaster,
  monthlyIncomeMaster,
  occupationStatusMaster,
  occupationTypeMaster,
  poiTypeMaster,
  socioeconomyMaster,
  surveyorPopulationFact,
  surveyorPoiFact,
} from "../lib/schema";
import { sql } from "drizzle-orm";

const masterSeedData = {
  gender: [
    { id: 1, gender: "LAKI LAKI" },
    { id: 2, gender: "PEREMPUAN" },
  ],
  maritalStatus: [
    { id: 1, status: "LAJANG" },
    { id: 2, status: "MENIKAH" },
    { id: 3, status: "JANDA / DUDA" },
    { id: 4, status: "CERAI MATI" },
  ],
  occupationStatus: [
    { id: 1, status: "BEKERJA" },
    { id: 2, status: "TIDAK BEKERJA" },
    { id: 3, status: "PELAJAR" },
    { id: 4, status: "PENSIUNAN" },
    { id: 5, status: "LAINNYA" },
  ],
  occupationType: [
    { id: 1, type: "Sains dan Teknologi" },
    { id: 2, type: "FnB dan Retail" },
    { id: 3, type: "Agrikultur" },
    { id: 4, type: "Seni Budaya" },
    { id: 5, type: "Kesahatan" },
    { id: 6, type: "Bisnis dan Manajemen" },
    { id: 7, type: "Pendidikan" },
    { id: 8, type: "Lingkungan dan Energi" },
    { id: 9, type: "Industri dan Manufaktur" },
    { id: 10, type: "Teknik dan Rekayasa" },
    { id: 11, type: "Sosial dan Politik" },
    { id: 12, type: "Kegamaan" },
    { id: 13, type: "Ketatanegaraan dan Sipil" },
    { id: 14, type: "Aparat Hukum dan Militer" },
    { id: 15, type: "Lainnya" },
  ],
  socioeconomy: [
    { id: 1, className: "Atas" },
    { id: 2, className: "Menengah Atas" },
    { id: 3, className: "Menengah" },
    { id: 4, className: "Menengah Bawah" },
    { id: 5, className: "Bawah" },
  ],
  education: [
    { id: 1, grade: "SD" },
    { id: 2, grade: "SMP" },
    { id: 3, grade: "SLTA" },
    { id: 4, grade: "DIPLOMA" },
    { id: 5, grade: "S1" },
    { id: 6, grade: "S2" },
    { id: 7, grade: "S3" },
  ],
  monthlyIncome: [
    { id: 1, income: "< 3jt" },
    { id: 2, income: "3jt - 5jt" },
    { id: 3, income: "5jt - 10jt" },
    { id: 4, income: "10jt - 15jt" },
    { id: 5, income: "15jt+" },
  ],
  housingStatus: [
    { id: 1, status: "Rumah Pribadi" },
    { id: 2, status: "Rumah Sewa / Kontrak" },
    { id: 3, status: "Rumah Orang Tua" },
    { id: 4, status: "Rumah Dinas" },
    { id: 5, status: "Apartemen" },
  ],
  foodPreferences: [
    { id: 1, preference: "Masakan Cepat Saji" },
    { id: 2, preference: "Masakan Jalanan" },
    { id: 3, preference: "Masakan Rumahan" },
    { id: 4, preference: "Restaurant" },
  ],
  poiTypes: [
    { id: 1, poi: "Toko dan Retail" },
    { id: 2, poi: "FnB" },
    { id: 3, poi: "Pendidikan" },
    { id: 4, poi: "Perkantoran dan Komersil" },
    { id: 5, poi: "Fasilitas Publik" },
    { id: 6, poi: "Manufaktur" },
    { id: 7, poi: "Otomotif dan Jasa" },
    { id: 8, poi: "Taman dan Rekreasi" },
    { id: 9, poi: "Hiburan Umum" },
    { id: 10, poi: "Hiburan Dewasa" },
    { id: 11, poi: "Pom Bensin" },
    { id: 12, poi: "Rumah Sakit" },
    { id: 13, poi: "Hotel dan Penginapan" },
    { id: 14, poi: "Transportasi dan Pemberhentian" },
    { id: 15, poi: "Fasilitas Olahraga dan Gelanggang" },
  ],
};

// ─── Population Fact ──────────────────────────────────────────────────────────

const AREA_PREFIXES = ["351516", "357808", "357302"];

function buildPopulationFacts() {
  const result = [];
  for (let i = 0; i < 1000; i++) {
    const baseNoKk = AREA_PREFIXES[i % AREA_PREFIXES.length];
    const monthlyIncomeId = Math.floor(Math.random() * 5) + 1;
    result.push({
      noKk: `${baseNoKk}${String(i + 1).padStart(10, "0")}`,
      namaAnggota: `Dummy Name ${i + 1}`,
      genderId: Math.floor(Math.random() * 2) + 1,
      usia: Math.floor(Math.random() * 66) + 15,
      housingStatusId: Math.floor(Math.random() * 5) + 1,
      maritalStatusId: Math.floor(Math.random() * 4) + 1,
      educationId: Math.floor(Math.random() * 7) + 1,
      occupationStatusId: Math.floor(Math.random() * 5) + 1,
      occupationTypeId: Math.floor(Math.random() * 15) + 1,
      monthlyIncomeId: monthlyIncomeId,
      foodPreferenceId: Math.floor(Math.random() * 4) + 1,
      monthlyFoodExpenditure: Math.floor(Math.random() * 2500000) + 500000,
      socioclassId: deriveSocioClassId(monthlyIncomeId),
    });
  }
  return result;
}

function deriveSocioClassId(monthlyIncomeId: number) {
  switch (monthlyIncomeId) {
    case 5: return 1;
    case 4: return 2;
    case 3: return 3;
    case 2: return 4;
    default: return 5;
  }
}

// ─── POI Fact ─────────────────────────────────────────────────────────────────

const AREA_META: Record<string, { streets: string[]; lat: number; lng: number }> = {
  "351516": {
    streets: [
      "Jl. Raya Gedangan", "Jl. Veteran", "Jl. Mawar", "Jl. Melati",
      "Jl. Pahlawan", "Jl. Diponegoro", "Jl. Soekarno Hatta", "Jl. Raya Ketajen",
    ],
    lat: -7.3805,
    lng: 112.7197,
  },
  "357808": {
    streets: [
      "Jl. Raya Gubeng", "Jl. Ngaglik", "Jl. Sulawesi", "Jl. Pemuda",
      "Jl. Embong Malang", "Jl. Dharmahusada", "Jl. Kertajaya", "Jl. Prof. Dr. Moestopo",
    ],
    lat: -7.2819,
    lng: 112.7578,
  },
  "357302": {
    streets: [
      "Jl. Basuki Rahmat", "Jl. Kawi", "Jl. Ijen", "Jl. Semeru",
      "Jl. Merdeka", "Jl. Bromo", "Jl. Arjuno", "Jl. Besar Ijen",
    ],
    lat: -7.9825,
    lng: 112.6308,
  },
};

const POI_NAMES_BY_TYPE: Record<number, string[]> = {
  1:  ["Alfamart", "Indomaret", "Toko Serbada", "Minimarket Sejahtera", "Toko Berkah", "Swalayan Maju", "Toko Pak Andi", "Kios Mandiri"],
  2:  ["Warteg Bu Sari", "RM Padang Sederhana", "Cafe Kopi Nusantara", "RM Ayam Bakar", "Kedai Mie Ayam", "Depot Soto Lamongan", "Warung Nasi Uduk", "Kedai Bakso Pak Po"],
  3:  ["SDN 01", "SMPN 02", "SMAN 03", "TK Tunas Bangsa", "Madrasah Ibtidaiyah", "SMKN 04", "Lembaga Bimbel Pintar", "PAUD Harapan Bangsa"],
  4:  ["Kantor Bank BRI", "Gedung Graha Perkantoran", "Ruko Central Business", "Kantor Pos", "Gedung Komersil Mitra", "Ruko Golden Business"],
  5:  ["Balai Desa", "Puskesmas Kecamatan", "Kantor Kelurahan", "Masjid Agung", "Gereja Bethel", "Pura Kerta Bumi", "Kantor Kecamatan"],
  6:  ["PT Sumber Jaya Abadi", "Pabrik Tekstil Maju", "CV Karya Mandiri", "UD Hasil Bumi", "PT Cipta Industri Nusantara"],
  7:  ["Bengkel Pak Budi", "Cuci Motor Express", "AHASS Resmi", "Bengkel Las Mulia", "Dealer Yamaha Resmi", "Toko Sparepart Otomotif"],
  8:  ["Taman Kota", "Alun-alun Kecamatan", "Taman Bermain Anak", "Hutan Kota", "Lapangan Hijau Warga"],
  9:  ["Bioskop Plaza", "Karaoke Inul Vista", "Game Center Fun", "Arena Bowling", "Wahana Hiburan Keluarga"],
  10: ["Club Malam XO", "Lounge Bar Platinum", "Diskotik Paradise", "Sports Bar Elite"],
  11: ["SPBU Pertamina 54-101", "SPBU Shell CBD", "SPBU Total Raya", "SPBU Vivo Maju"],
  12: ["RSUD Daerah", "Klinik Pratama Sehat", "RS Ibu dan Anak", "Poliklinik Husada", "Apotek Kimia Farma", "Klinik dr. Santoso"],
  13: ["Hotel Grand Mahkota", "Guest House Melati", "Hotel Bintang Lima", "Penginapan Nyaman", "Hotel Budget Inn", "Villa Sejahtera"],
  14: ["Terminal Bus Kota", "Halte TransJawa", "Shelter Angkot", "Stasiun Kereta Lokal", "Pool Bus Malam"],
  15: ["GOR Kecamatan", "Lapangan Futsal Maju", "Kolam Renang Tirta", "Gelanggang Olahraga", "Stadion Mini Warga"],
};

const OPERATIONAL_OPTIONS = ["Senin - Jumat", "Senin - Sabtu", "Setiap Hari", "Sabtu - Minggu"];
const OPEN_HOUR_OPTIONS   = ["06:00", "07:00", "08:00", "09:00", "10:00"];
const CLOSE_HOUR_OPTIONS  = ["16:00", "17:00", "18:00", "20:00", "21:00", "22:00", "23:00"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPoiFacts() {
  const result = [];
  const poiTypeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  for (let i = 0; i < 500; i++) {
    const prefix  = AREA_PREFIXES[i % AREA_PREFIXES.length];
    const meta    = AREA_META[prefix];
    const street  = rand(meta.streets);
    const houseNo = (i % 99) + 1;

    // ~8% of records have no poi_type (unknown/unclassified)
    const hasType   = Math.random() > 0.08;
    const poiTypeId = hasType ? rand(poiTypeIds) : null;
    const namePool  = poiTypeId ? POI_NAMES_BY_TYPE[poiTypeId] : ["Tempat Usaha Umum", "Fasilitas Lainnya"];
    const suffix    = Math.ceil((i + 1) / namePool.length);
    const poiName   = `${rand(namePool)}${suffix > 1 ? ` ${suffix}` : ""}`;

    // Optional fields — ~85% chance each
    const hasOps    = Math.random() > 0.15;
    const hasHours  = Math.random() > 0.15;
    const hasCoords = Math.random() > 0.1;

    result.push({
      kecamatanId:    prefix,
      poiName:        poiName,
      poiAddress:     `${street} No. ${houseNo}`,
      poiTypeId:      poiTypeId,
      operationalDay: hasOps    ? rand(OPERATIONAL_OPTIONS) : null,
      avgOpenHour:    hasHours  ? rand(OPEN_HOUR_OPTIONS)   : null,
      avgClosedHour:  hasHours  ? rand(CLOSE_HOUR_OPTIONS)  : null,
      longitude:      hasCoords ? parseFloat((meta.lng + (Math.random() * 0.04 - 0.02)).toFixed(6)) : null,
      latitude:       hasCoords ? parseFloat((meta.lat + (Math.random() * 0.04 - 0.02)).toFixed(6)) : null,
    });
  }
  return result;
}

// ─── Sequence Reset ───────────────────────────────────────────────────────────

async function resetSequence(tableName: string) {
  await db.execute(
    sql.raw(
      `SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE((SELECT MAX(id) FROM ${tableName}), 1), true);`,
    ),
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  try {
    console.log("[SEED] Starting database seed...");

    // Delete in dependency order (fact tables first)
    await db.delete(surveyorPoiFact);
    await db.delete(surveyorPopulationFact);
    await db.delete(poiTypeMaster);
    await db.delete(foodPreferencesMaster);
    await db.delete(housingStatusMaster);
    await db.delete(monthlyIncomeMaster);
    await db.delete(educationMaster);
    await db.delete(socioeconomyMaster);
    await db.delete(occupationTypeMaster);
    await db.delete(occupationStatusMaster);
    await db.delete(maritalStatusMaster);
    await db.delete(genderMaster);

    // Master data
    await db.insert(genderMaster).values(masterSeedData.gender);
    await db.insert(maritalStatusMaster).values(masterSeedData.maritalStatus);
    await db.insert(occupationStatusMaster).values(masterSeedData.occupationStatus);
    await db.insert(occupationTypeMaster).values(masterSeedData.occupationType);
    await db.insert(socioeconomyMaster).values(masterSeedData.socioeconomy);
    await db.insert(educationMaster).values(masterSeedData.education);
    await db.insert(monthlyIncomeMaster).values(masterSeedData.monthlyIncome);
    await db.insert(housingStatusMaster).values(masterSeedData.housingStatus);
    await db.insert(foodPreferencesMaster).values(masterSeedData.foodPreferences);
    await db.insert(poiTypeMaster).values(masterSeedData.poiTypes);

    // Fact tables
    const populationFacts = buildPopulationFacts();
    await db.insert(surveyorPopulationFact).values(populationFacts);
    console.log(`[SEED] Inserted ${populationFacts.length} population fact records.`);

    const poiFacts = buildPoiFacts();
    await db.insert(surveyorPoiFact).values(poiFacts);
    console.log(`[SEED] Inserted ${poiFacts.length} POI fact records.`);

    // Reset sequences
    await Promise.all([
      resetSequence("gender_master"),
      resetSequence("marital_status_master"),
      resetSequence("occupation_status_master"),
      resetSequence("occupation_type_master"),
      resetSequence("socioeconomy_master"),
      resetSequence("education_master"),
      resetSequence("monthly_income_master"),
      resetSequence("housing_status_master"),
      resetSequence("food_preferences_master"),
      resetSequence("poi_type_master"),
      resetSequence("surveyor_population_fact"),
      resetSequence("surveyor_poi_fact"),
    ]);

    console.log("[SEED] Database seed completed successfully!");
  } catch (error) {
    console.error("[SEED] Seed failed:", error);
    process.exit(1);
  }
}

main();
