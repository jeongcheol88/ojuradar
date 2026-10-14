import "dotenv/config";

import { collectG2bJobs } from "../src/lib/collectors/g2bCollector";

function money(value: number) {
  if (!value) {
    return "-";
  }

  return `${value.toLocaleString("ko-KR")}원`;
}

async function main() {
  console.log("📡 나라장터 용역공고 수집 시작");

  const jobs =
    await collectG2bJobs(3, 1, 10);

  console.log(
    `✅ 실제 용역공고 ${jobs.length}건 수집`
  );

  jobs.forEach((job, index) => {
    console.log(
      "\n========================================"
    );

    console.log(
      `${index + 1}. ${job.title}`
    );

    console.log(
      `공고번호: ${job.bidNoticeNo}-${job.bidNoticeOrder}`
    );

    console.log(
      `공고기관: ${job.noticeInstitution}`
    );

    console.log(
      `수요기관: ${job.demandInstitution}`
    );

    console.log(
      `계약방법: ${job.contractMethod}`
    );

    console.log(
      `추정가격: ${money(job.estimatedPrice)}`
    );

    console.log(
      `배정예산: ${money(job.allocatedBudget)}`
    );

    console.log(
      `공고일: ${job.noticeDate}`
    );

    console.log(
      `마감일: ${job.bidCloseDate}`
    );

    console.log(
      `원문: ${job.sourceUrl || "-"}`
    );
  });
}

main().catch((error) => {
  console.error("❌ 나라장터 Collector 실패");
  console.error(error);

  process.exit(1);
});