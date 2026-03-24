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

const AREA_BLUEPRINTS = [
  {
    kecamatan: "Kebayoran Baru",
    kabkotId: 3171,
    baseNoKk: "317101",
    records: [
      [4, 2, 35, 1, 2, 5, 1, 6, 4, 2, 1200000],
      [3, 1, 22, 2, 1, 3, 3, 7, 2, 4, 900000],
      [5, 2, 41, 1, 2, 5, 1, 1, 5, 3, 1450000],
      [2, 1, 67, 1, 4, 1, 4, 15, 2, 3, 650000],
      [4, 2, 29, 2, 2, 4, 1, 2, 1, 2, 1000000],
      [3, 1, 18, 3, 1, 3, 3, 7, 1, 2, 700000],
      [6, 2, 52, 1, 2, 6, 1, 10, 3, 3, 1600000],
      [4, 1, 38, 2, 2, 5, 1, 4, 4, 4, 1150000],
      [3, 2, 31, 5, 2, 4, 2, 11, 2, 2, 850000],
      [5, 1, 44, 1, 2, 5, 1, 14, 3, 3, 1400000],
      [2, 2, 24, 2, 1, 5, 2, 6, 1, 1, 780000],
      [4, 1, 15, 3, 1, 3, 3, 7, 4, 2, 720000],
    ],
  },
  {
    kecamatan: "Gubeng",
    kabkotId: 3578,
    baseNoKk: "357801",
    records: [
      [4, 1, 33, 1, 2, 5, 1, 6, 3, 3, 980000],
      [3, 2, 27, 2, 1, 4, 1, 2, 2, 2, 760000],
      [5, 1, 46, 1, 2, 3, 1, 9, 3, 3, 1200000],
      [2, 2, 61, 3, 3, 1, 4, 15, 4, 3, 610000],
      [4, 1, 20, 3, 1, 3, 3, 7, 1, 2, 680000],
      [3, 2, 35, 2, 2, 4, 1, 1, 2, 4, 930000],
      [5, 1, 54, 1, 2, 5, 1, 10, 4, 3, 1260000],
      [4, 2, 40, 1, 2, 5, 1, 11, 3, 3, 1090000],
      [3, 1, 24, 5, 1, 4, 2, 6, 1, 1, 740000],
      [6, 2, 48, 1, 2, 5, 1, 14, 4, 3, 1380000],
      [2, 1, 17, 3, 1, 3, 3, 7, 1, 2, 650000],
      [4, 2, 30, 2, 2, 5, 2, 4, 2, 2, 870000],
    ],
  },
  {
    kecamatan: "Coblong",
    kabkotId: 3273,
    baseNoKk: "327301",
    records: [
      [4, 2, 37, 1, 2, 5, 1, 1, 3, 3, 1020000],
      [3, 1, 23, 2, 1, 4, 2, 7, 2, 2, 790000],
      [5, 2, 45, 1, 2, 5, 1, 6, 4, 4, 1320000],
      [2, 1, 64, 1, 3, 1, 4, 15, 4, 3, 600000],
      [4, 2, 28, 2, 1, 5, 1, 2, 2, 2, 910000],
      [3, 1, 19, 3, 1, 3, 3, 7, 1, 2, 700000],
      [5, 2, 51, 1, 2, 5, 1, 10, 3, 3, 1410000],
      [4, 1, 39, 2, 2, 4, 1, 11, 3, 3, 1110000],
      [3, 2, 26, 5, 1, 4, 2, 6, 1, 1, 760000],
      [6, 1, 43, 1, 2, 5, 1, 14, 4, 4, 1490000],
      [2, 2, 21, 3, 1, 3, 3, 7, 1, 2, 670000],
      [4, 1, 34, 2, 2, 5, 2, 4, 2, 3, 890000],
    ],
  },
] as const;

function buildPopulationFacts() {
  return AREA_BLUEPRINTS.flatMap((area) =>
    area.records.map((record, index) => ({
      noKk: `${area.baseNoKk}${String(index + 1).padStart(4, "0")}`,
      jumlahAnggota: record[0],
      genderId: record[1],
      usia: record[2],
      housingStatusId: record[3],
      kecamatan: area.kecamatan,
      kabkotId: area.kabkotId,
      maritalStatusId: record[4],
      educationId: record[5],
      occupationStatusId: record[6],
      occupationTypeId: record[7],
      monthlyIncomeId: record[8],
      foodPreferenceId: record[9],
      monthlyFoodExpenditure: record[10],
      socioclassId: deriveSocioClassId(record[8]),
    })),
  );
}

function deriveSocioClassId(monthlyIncomeId: number) {
  switch (monthlyIncomeId) {
    case 5:
      return 1;
    case 4:
      return 2;
    case 3:
      return 3;
    case 2:
      return 4;
    default:
      return 5;
  }
}

async function resetSequence(tableName: string) {
  await db.execute(
    sql.raw(
      `SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE((SELECT MAX(id) FROM ${tableName}), 1), true);`,
    ),
  );
}

async function main() {
  try {
    console.log("[SEED] Starting database seed...");

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

    const populationFacts = buildPopulationFacts();
    await db.insert(surveyorPopulationFact).values(populationFacts);

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
    ]);

    console.log(`[SEED] Inserted ${populationFacts.length} fact records.`);
    console.log("[SEED] Database seed completed successfully!");
  } catch (error) {
    console.error("[SEED] Seed failed:", error);
    process.exit(1);
  }
}

main();
