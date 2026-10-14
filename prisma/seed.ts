import { seedJobs } from "./seed-data";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";


const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL이 설정되어 있지 않습니다.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("📡 OJURADAR 샘플 데이터 Seed 시작");

  /*
   * 기존 샘플 데이터만 삭제
   *
   * 나중에 실제 수집 공고가 들어와도
   * 실제 데이터까지 지우지 않도록
   * '샘플 플랫폼' 데이터만 삭제한다.
   */
  await prisma.job.deleteMany({
    where: {
      source: "샘플 플랫폼",
    },
  });

  const result = await prisma.job.createMany({
    data: seedJobs.map((job) => ({
      source: job.source,

      sourceUrl: null,
      externalId: `sample-${job.id}`,

      title: job.title,
      category: job.category,

      budgetMin: job.budgetMin,
      budgetMax: job.budgetMax,

      workType: job.workType,

      estimatedHoursMin:
        job.estimatedHoursMin,

      estimatedHoursMax:
        job.estimatedHoursMax,

      tags: job.tags,

      summary: job.summary,

      deadline: null,
      publishedAt: null,

      isActive: true,
    })),
  });

  console.log(
    `✅ 샘플 공고 ${result.count}건 저장 완료`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed 실패");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });