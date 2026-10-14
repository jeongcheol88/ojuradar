import type { CollectedJob } from "./types";
import type { G2bJob } from "./g2bCollector";

type CategoryRule = {
  category: string;
  keywords: string[];
};

function parseG2bDate(
  value: string
): Date | null {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length < 8) {
    return null;
  }

  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));

  const hour =
    digits.length >= 10
      ? Number(digits.slice(8, 10))
      : 23;

  const minute =
    digits.length >= 12
      ? Number(digits.slice(10, 12))
      : 59;

  // 나라장터 시간은 한국시간 기준으로 처리
  return new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+09:00`
  );
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "개발 · IT",
    keywords: [
      "시스템",
      "소프트웨어",
      "홈페이지",
      "웹",
      "앱",
      "정보화",
      "전산",
      "데이터",
      "AI",
      "인공지능",
      "유지보수",
      "플랫폼",
    ],
  },
  {
    category: "디자인",
    keywords: [
      "디자인",
      "브랜딩",
      "로고",
      "편집디자인",
      "UI",
      "UX",
    ],
  },
  {
    category: "영상 · 마케팅",
    keywords: [
      "홍보",
      "마케팅",
      "광고",
      "영상",
      "유튜브",
      "SNS",
      "콘텐츠 제작",
    ],
  },
  {
    category: "글쓰기 · 콘텐츠",
    keywords: [
      "원고",
      "번역",
      "교정",
      "편집",
      "집필",
    ],
  },
  {
    category: "사무 · 리서치",
    keywords: [
      "연구",
      "조사",
      "컨설팅",
      "분석",
      "설문",
      "리서치",
    ],
  },
];

function classifyJob(title: string) {
  const normalized =
    title.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    const matchedKeywords =
      rule.keywords.filter((keyword) =>
        normalized.includes(
          keyword.toLowerCase()
        )
      );

    if (matchedKeywords.length > 0) {
      return {
        category: rule.category,
        matchedKeywords,
      };
    }
  }

  return null;
}

export function mapG2bJob(
  job: G2bJob
): CollectedJob | null {
  const classification =
    classifyJob(job.title);

  // 외주레이더와 관련 없는 청소/시설/운송 등의
  // 나라장터 용역은 일단 저장하지 않는다.
  if (!classification) {
    return null;
  }

  const budget =
    job.allocatedBudget > 0
      ? job.allocatedBudget
      : job.estimatedPrice;

  return {
    source: "나라장터",

    externalId:
      `${job.bidNoticeNo}-${job.bidNoticeOrder}`,

    sourceUrl:
      job.sourceUrl || null,

    title: job.title,

    category:
      classification.category,

    budgetMin: budget,
    budgetMax: budget,

    // 나라장터 목록 API에는
    // 실제 예상 작업시간 정보가 없음
    estimatedHoursMin: 0,
    estimatedHoursMax: 0,

    workType: "원문 확인",

    tags: [
      ...classification.matchedKeywords,
      "나라장터",
    ],

    summary: [
      job.demandInstitution &&
        `수요기관: ${job.demandInstitution}`,
      job.contractMethod &&
        `계약방법: ${job.contractMethod}`,
    ]
      .filter(Boolean)
      .join(" · "),

    deadline: parseG2bDate(
        job.bidCloseDate
    ),
    publishedAt: null,
  };
}