import type { Job } from "@/types/job";

export type JobQualityResult = {
  score: number;

  label: string;

  difficulty:
    | "낮음"
    | "보통"
    | "높음";

  reasons: string[];
  warnings: string[];
};

const POSITIVE_KEYWORDS = [
  "개발",
  "구축",
  "웹",
  "홈페이지",
  "소프트웨어",
  "플랫폼",
  "클라우드",
  "유지보수",
  "영상",
  "유튜브",
  "sns",
  "마케팅",
  "브랜딩",
  "디자인",
  "번역",
  "시장조사",
  "설문조사",
  "데이터 분석",
];

const NEGATIVE_KEYWORDS = [
  "연수",
  "교육 운영",
  "교육 위탁",
  "행사 운영",
  "위탁 운영",
  "회계교육",
  "결산 지원",
  "탁본",
  "인쇄",
  "렌탈",
  "임차",
];

function includesKeyword(
  text: string,
  keyword: string
) {
  return text.includes(
    keyword.toLowerCase()
  );
}

export function calculateJobQuality(
  job: Job
): JobQualityResult {
  let score = 45;

  const reasons: string[] = [];
  const warnings: string[] = [];

  const text = [
    job.title,
    job.summary,
    ...job.tags,
  ]
    .join(" ")
    .toLowerCase();

  /*
   * 1. 외주다운 업무인가?
   */
  const positiveMatches =
    POSITIVE_KEYWORDS.filter(
      (keyword) =>
        includesKeyword(
          text,
          keyword
        )
    );

  const positiveScore =
    Math.min(
      positiveMatches.length * 6,
      24
    );

  score += positiveScore;

  if (positiveMatches.length > 0) {
    reasons.push(
      `외주형 업무 키워드: ${positiveMatches
        .slice(0, 3)
        .join(", ")}`
    );
  }

  /*
   * 2. 외주레이더와 거리가 있는 업무
   */
  const negativeMatches =
    NEGATIVE_KEYWORDS.filter(
      (keyword) =>
        includesKeyword(
          text,
          keyword
        )
    );

  const negativeScore =
    Math.min(
      negativeMatches.length * 12,
      24
    );

  score -= negativeScore;

  if (negativeMatches.length > 0) {
    warnings.push(
      `일반 외주와 거리가 있을 수 있음: ${negativeMatches
        .slice(0, 3)
        .join(", ")}`
    );
  }

  /*
   * 3. 카테고리
   */
  if (
    [
      "개발 · IT",
      "디자인",
      "영상 · 마케팅",
      "글쓰기 · 콘텐츠",
    ].includes(job.category)
  ) {
    score += 10;

    reasons.push(
      "외주 활용도가 높은 분야입니다."
    );
  } else if (
    job.category ===
    "사무 · 리서치"
  ) {
    score += 5;
  }

  /*
   * 4. 예산 규모
   *
   * 너무 큰 나라장터 사업은
   * 개인/소규모 팀이 접근하기 어려움.
   */
  const budget =
    job.budgetMax;

  if (budget <= 30000000) {
    score += 20;

    reasons.push(
      "비교적 소규모 예산의 공고입니다."
    );
  } else if (
    budget <= 50000000
  ) {
    score += 15;
  } else if (
    budget <= 100000000
  ) {
    score += 10;
  } else if (
    budget <= 200000000
  ) {
    score += 5;
  } else if (
    budget <= 500000000
  ) {
    score -= 5;

    warnings.push(
      "예산 규모가 커 업체형 입찰일 가능성이 있습니다."
    );
  } else {
    score -= 15;

    warnings.push(
      "대규모 사업으로 개인 또는 소규모 팀의 접근 난도가 높을 수 있습니다."
    );
  }

  /*
   * 5. 계약 방법
   */
  if (
    text.includes("수의계약")
  ) {
    score += 15;

    reasons.push(
      "수의계약 방식으로 상대적으로 접근성이 높습니다."
    );
  } else if (
    text.includes("제한경쟁")
  ) {
    score -= 8;

    warnings.push(
      "제한경쟁으로 참가자격 확인이 필요합니다."
    );
  } else if (
    text.includes("일반경쟁")
  ) {
    score -= 10;

    warnings.push(
      "일반경쟁 입찰로 참여 절차 확인이 필요합니다."
    );
  }

  /*
   * 최종 점수
   */
  score = Math.max(
    0,
    Math.min(100, score)
  );

  /*
   * 입찰 난이도
   */
  let difficulty:
    | "낮음"
    | "보통"
    | "높음";

  if (
    text.includes("수의계약") &&
    budget <= 100000000
  ) {
    difficulty = "낮음";
  } else if (
    budget >= 200000000 ||
    text.includes("일반경쟁") ||
    text.includes("제한경쟁")
  ) {
    difficulty = "높음";
  } else {
    difficulty = "보통";
  }

  /*
   * 사용자용 라벨
   */
  let label: string;

  if (score >= 75) {
    label = "추천 공고";
  } else if (score >= 55) {
    label = "검토 공고";
  } else {
    label = "참고 공고";
  }

  return {
    score,
    label,
    difficulty,
    reasons,
    warnings,
  };
}