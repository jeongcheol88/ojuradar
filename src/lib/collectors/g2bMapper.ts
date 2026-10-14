import type { CollectedJob } from "./types";
import type { G2bJob } from "./g2bCollector";

type CategoryRule = {
  category: string;

  // 하나만 걸려도 의미가 강한 키워드
  strong: string[];

  // 단독으로는 애매해서 2개 이상 걸려야 인정
  weak: string[];
};

const EXCLUDE_KEYWORDS = [
  "청소",
  "경비",
  "시설관리",
  "건물관리",
  "주차관리",

  "폐기물",
  "생활폐기물",
  "의료폐기물",

  "급식",
  "식당 운영",
  "도시락",

  "버스",
  "통근버스",
  "차량 임차",
  "자동차 임차",
  "렌터카",

  "방역",
  "소독",
  "방제",

  "세탁",
  "운송",
  "배송",

  "승강기",
  "엘리베이터",

  "전기안전관리",
  "소방시설",
  "기계설비",

  "수목관리",
  "조경관리",

  "폐수",
  "정화조",

  "시험 검사",
  "시험검사",
  "검체 검사",
  "성분 분석",
  "성분분석",
  "유전자 분석",
  "유전자분석",
];

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "개발 · IT",

    strong: [
      "소프트웨어",
      "정보시스템",
      "시스템 구축",
      "시스템구축",
      "홈페이지",
      "웹사이트",
      "웹 서비스",
      "웹서비스",
      "모바일 앱",
      "모바일앱",
      "앱 개발",
      "앱개발",
      "정보화",
      "데이터베이스",
      "빅데이터",
      "인공지능",
      "AI",
      "플랫폼 구축",
      "플랫폼구축",
      "클라우드",
      "전산 개발",
      "전산개발",
    ],

    weak: [
      "시스템",
      "전산",
      "데이터",
      "플랫폼",
      "유지보수",
      "서버",
      "API",
    ],
  },

  {
    category: "영상 · 마케팅",

    strong: [
      "홍보영상",
      "영상 제작",
      "영상제작",
      "유튜브",
      "SNS 운영",
      "SNS운영",
      "마케팅",
      "광고 운영",
      "광고운영",
      "온라인 홍보",
      "온라인홍보",
      "콘텐츠 제작",
      "콘텐츠제작",
    ],

    weak: [
      "홍보",
      "영상",
      "광고",
      "콘텐츠",
      "캠페인",
    ],
  },

  {
    category: "디자인",

    strong: [
      "디자인",
      "브랜딩",
      "브랜드 개발",
      "브랜드개발",
      "로고 제작",
      "로고제작",
      "UI/UX",
      "UI UX",
      "편집디자인",
      "웹디자인",
    ],

    weak: [
      "시각",
      "그래픽",
      "편집",
      "제작",
    ],
  },

  {
    category: "글쓰기 · 콘텐츠",

    strong: [
      "번역",
      "통번역",
      "원고 작성",
      "원고작성",
      "집필",
      "교정 교열",
      "교정교열",
      "콘텐츠 원고",
      "뉴스레터",
    ],

    weak: [
      "원고",
      "교정",
      "교열",
      "편집",
      "작성",
    ],
  },

  {
    category: "사무 · 리서치",

    strong: [
      "시장조사",
      "설문조사",
      "실태조사",
      "만족도 조사",
      "만족도조사",
      "리서치",
      "컨설팅",
      "연구용역",
      "정책연구",
      "데이터 분석",
      "데이터분석",
      "통계 분석",
      "통계분석",
      "사업성 분석",
      "사업성분석",
    ],

    weak: [
      "연구",
      "조사",
      "분석",
      "통계",
      "보고서",
      "컨설팅",
    ],
  },
];

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function containsKeyword(
  text: string,
  keyword: string
) {
  return text.includes(
    normalizeText(keyword)
  );
}

function shouldExclude(
  title: string
) {
  const normalized =
    normalizeText(title);

  return EXCLUDE_KEYWORDS.some(
    (keyword) =>
      containsKeyword(
        normalized,
        keyword
      )
  );
}

function classifyJob(
  title: string
) {
  const normalized =
    normalizeText(title);

  const candidates =
    CATEGORY_RULES.map(
      (rule) => {
        const strongMatches =
          rule.strong.filter(
            (keyword) =>
              containsKeyword(
                normalized,
                keyword
              )
          );

        const weakMatches =
          rule.weak.filter(
            (keyword) =>
              containsKeyword(
                normalized,
                keyword
              )
          );

        const score =
          strongMatches.length * 3 +
          weakMatches.length;

        return {
          category:
            rule.category,

          strongMatches,

          weakMatches,

          score,
        };
      }
    )
      .filter((result) => {
        /*
         * 강한 키워드가 하나 있거나,
         * 약한 키워드가 2개 이상일 때만 인정.
         *
         * "분석" 하나만 있는 실험공고 같은
         * 오탐을 줄이기 위한 조건.
         */
        return (
          result.strongMatches
            .length > 0 ||
          result.weakMatches.length >= 2
        );
      })
      .sort(
        (a, b) =>
          b.score - a.score
      );

  const best =
    candidates[0];

  if (!best) {
    return null;
  }

  return {
    category:
      best.category,

    matchedKeywords:
      Array.from(
        new Set([
          ...best.strongMatches,
          ...best.weakMatches,
        ])
      ),
  };
}

function parseG2bDate(
  value: string
): Date | null {
  if (!value) {
    return null;
  }

  const digits =
    value.replace(/\D/g, "");

  if (digits.length < 8) {
    return null;
  }

  const year =
    Number(
      digits.slice(0, 4)
    );

  const month =
    Number(
      digits.slice(4, 6)
    );

  const day =
    Number(
      digits.slice(6, 8)
    );

  const hour =
    digits.length >= 10
      ? Number(
          digits.slice(8, 10)
        )
      : 0;

  const minute =
    digits.length >= 12
      ? Number(
          digits.slice(10, 12)
        )
      : 0;

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  return new Date(
    `${year}-${String(
      month
    ).padStart(
      2,
      "0"
    )}-${String(day).padStart(
      2,
      "0"
    )}T${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(
      2,
      "0"
    )}:00+09:00`
  );
}

export function mapG2bJob(
  job: G2bJob
): CollectedJob | null {
  /*
   * 외주레이더 범위와 명확히 다른
   * 오프라인/시설성 용역 먼저 제외
   */
  if (
    shouldExclude(job.title)
  ) {
    return null;
  }

  const classification =
    classifyJob(job.title);

  /*
   * 개발 / 디자인 / 콘텐츠 /
   * 마케팅 / 리서치와 연관성이
   * 부족한 공고는 저장하지 않음.
   */
  if (!classification) {
    return null;
  }

  const budget =
    job.allocatedBudget > 0
      ? job.allocatedBudget
      : job.estimatedPrice;

  const tags =
    Array.from(
      new Set([
        ...classification
          .matchedKeywords,
        "나라장터",
      ])
    ).slice(0, 6);

  const summaryParts: string[] =
    [];

  if (
    job.demandInstitution
  ) {
    summaryParts.push(
      `수요기관: ${job.demandInstitution}`
    );
  }

  if (
    job.noticeInstitution &&
    job.noticeInstitution !==
      job.demandInstitution
  ) {
    summaryParts.push(
      `공고기관: ${job.noticeInstitution}`
    );
  }

  if (
    job.contractMethod
  ) {
    summaryParts.push(
      `계약방법: ${job.contractMethod}`
    );
  }

  return {
    source: "나라장터",

    externalId:
      `${job.bidNoticeNo}-${job.bidNoticeOrder}`,

    sourceUrl:
      job.sourceUrl ||
      null,

    title:
      job.title,

    category:
      classification.category,

    budgetMin:
      budget,

    budgetMax:
      budget,

    /*
     * 나라장터 공고 목록만으로
     * 실제 투입시간은 알 수 없음.
     */
    estimatedHoursMin: 0,
    estimatedHoursMax: 0,

    workType:
      "용역 입찰",

    tags,

    summary:
      summaryParts.join(
        " · "
      ),

    deadline:
      parseG2bDate(
        job.bidCloseDate
      ),

    publishedAt:
      parseG2bDate(
        job.noticeDate
      ),
  };
}