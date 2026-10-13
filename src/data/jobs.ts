export type Job = {
  id: number;
  title: string;
  category: string;
  source: string;

  // 내 레이더 설정이 없을 때 보여줄 기본 추천점수
  score: number;

  // 화면 표시용
  budget: string;

  // 매칭 계산용
  budgetMin: number;
  budgetMax: number;

  // 화면 표시용
  estimatedTime: string;

  // 매칭 계산용
  estimatedHoursMin: number;
  estimatedHoursMax: number;

  hourlyRate: string;
  workType: string;

  tags: string[];

  summary: string;
  reasons: string[];
  risks: string[];
};

export const jobs: Job[] = [
  // =========================================================
  // 개발 · IT
  // =========================================================
  {
    id: 1,
    title: "Java / Spring API 오류 수정",
    category: "개발 · IT",
    source: "샘플 플랫폼",
    score: 94,

    budget: "800,000원",
    budgetMin: 800000,
    budgetMax: 800000,

    estimatedTime: "8~10시간",
    estimatedHoursMin: 8,
    estimatedHoursMax: 10,

    hourlyRate: "8~10만원",
    workType: "원격",

    tags: ["Java", "Spring", "Oracle"],

    summary:
      "기존 Java/Spring 서비스의 API 오류 원인을 분석하고 수정하는 단기 프로젝트입니다.",

    reasons: [
      "Java/Spring 운영개발 경험 활용 가능",
      "단기 프로젝트",
      "원격 작업 가능",
    ],

    risks: [
      "운영환경 접근 권한 확인 필요",
      "오류 원인에 따라 작업시간 증가 가능",
    ],
  },

  {
    id: 2,
    title: "React 관리자 화면 기능 추가",
    category: "개발 · IT",
    source: "샘플 플랫폼",
    score: 88,

    budget: "600,000원",
    budgetMin: 600000,
    budgetMax: 600000,

    estimatedTime: "10~14시간",
    estimatedHoursMin: 10,
    estimatedHoursMax: 14,

    hourlyRate: "4.2~6만원",
    workType: "원격",

    tags: ["React", "JavaScript", "API"],

    summary:
      "기존 관리자 웹서비스에 검색 및 목록관리 기능을 추가하는 프로젝트입니다.",

    reasons: [
      "기존 서비스 기능 추가 형태",
      "원격 작업 가능",
    ],

    risks: [
      "기존 소스 품질 확인 필요",
      "API 명세 제공 여부 확인 필요",
    ],
  },

  {
    id: 3,
    title: "Next.js 랜딩페이지 제작",
    category: "개발 · IT",
    source: "샘플 플랫폼",
    score: 86,

    budget: "500,000원",
    budgetMin: 500000,
    budgetMax: 500000,

    estimatedTime: "8~12시간",
    estimatedHoursMin: 8,
    estimatedHoursMax: 12,

    hourlyRate: "4.1~6.2만원",
    workType: "원격",

    tags: ["Next.js", "React", "디자인"],

    summary:
      "제공된 디자인을 기반으로 반응형 서비스 랜딩페이지를 구현하는 프로젝트입니다.",

    reasons: [
      "작업범위가 비교적 명확함",
      "단기 원격 프로젝트",
    ],

    risks: [
      "반응형 세부 요구사항 확인 필요",
      "디자인 변경 요청 가능성 있음",
    ],
  },

  {
    id: 4,
    title: "Flutter 앱 버그 수정 및 배포 지원",
    category: "개발 · IT",
    source: "샘플 플랫폼",
    score: 84,

    budget: "700,000원",
    budgetMin: 700000,
    budgetMax: 700000,

    estimatedTime: "12~16시간",
    estimatedHoursMin: 12,
    estimatedHoursMax: 16,

    hourlyRate: "4.3~5.8만원",
    workType: "원격",

    tags: ["Flutter", "Android", "iOS"],

    summary:
      "운영 중인 Flutter 앱의 오류를 수정하고 Android/iOS 배포를 지원하는 프로젝트입니다.",

    reasons: [
      "기존 앱 유지보수 업무",
      "원격 수행 가능",
    ],

    risks: [
      "스토어 계정 접근 필요",
      "기존 코드 구조에 따라 난이도 변동",
    ],
  },

  // =========================================================
  // 디자인
  // =========================================================
  {
    id: 5,
    title: "쇼핑몰 상세페이지 디자인 5종",
    category: "디자인",
    source: "샘플 플랫폼",
    score: 90,

    budget: "450,000원",
    budgetMin: 450000,
    budgetMax: 450000,

    estimatedTime: "8~10시간",
    estimatedHoursMin: 8,
    estimatedHoursMax: 10,

    hourlyRate: "4.5~5.6만원",
    workType: "원격",

    tags: ["디자인", "Photoshop", "쇼핑몰"],

    summary:
      "상품 자료를 기반으로 쇼핑몰 상세페이지 5종을 제작하는 프로젝트입니다.",

    reasons: [
      "결과물 범위가 명확함",
      "원격 작업 가능",
    ],

    risks: [
      "수정 횟수 확인 필요",
      "제품 이미지 제공 여부 확인 필요",
    ],
  },

  {
    id: 6,
    title: "스타트업 서비스 로고 제작",
    category: "디자인",
    source: "샘플 플랫폼",
    score: 82,

    budget: "300,000원",
    budgetMin: 300000,
    budgetMax: 300000,

    estimatedTime: "5~8시간",
    estimatedHoursMin: 5,
    estimatedHoursMax: 8,

    hourlyRate: "3.7~6만원",
    workType: "원격",

    tags: ["디자인", "로고", "브랜딩"],

    summary:
      "신규 서비스의 로고와 기본 컬러 가이드를 제작하는 프로젝트입니다.",

    reasons: [
      "단기 수행 가능",
      "원격 프로젝트",
    ],

    risks: [
      "추상적인 요구사항 가능성",
      "시안 수정 범위 협의 필요",
    ],
  },

  {
    id: 7,
    title: "모바일 앱 UI 화면 8종 디자인",
    category: "디자인",
    source: "샘플 플랫폼",
    score: 87,

    budget: "900,000원",
    budgetMin: 900000,
    budgetMax: 900000,

    estimatedTime: "16~20시간",
    estimatedHoursMin: 16,
    estimatedHoursMax: 20,

    hourlyRate: "4.5~5.6만원",
    workType: "원격",

    tags: ["디자인", "Figma", "UI/UX"],

    summary:
      "기획서를 기반으로 모바일 서비스의 주요 UI 화면을 디자인하는 프로젝트입니다.",

    reasons: [
      "높은 프로젝트 단가",
      "원격 가능",
    ],

    risks: [
      "기획 변경 가능성",
      "추가 화면 요청 가능성",
    ],
  },

  {
    id: 8,
    title: "회사소개서 PPT 디자인 리뉴얼",
    category: "디자인",
    source: "샘플 플랫폼",
    score: 80,

    budget: "350,000원",
    budgetMin: 350000,
    budgetMax: 350000,

    estimatedTime: "6~9시간",
    estimatedHoursMin: 6,
    estimatedHoursMax: 9,

    hourlyRate: "3.8~5.8만원",
    workType: "원격",

    tags: ["PPT", "디자인", "문서"],

    summary:
      "기존 회사소개서 내용을 유지하면서 디자인을 현대적으로 리뉴얼하는 프로젝트입니다.",

    reasons: [
      "단기 완료 가능",
      "원격 작업 가능",
    ],

    risks: [
      "원본 자료 품질 확인 필요",
      "페이지 수 추가 가능성",
    ],
  },

  // =========================================================
  // 글쓰기 · 콘텐츠
  // =========================================================
  {
    id: 9,
    title: "쇼핑몰 상품 소개 원고 작성",
    category: "글쓰기 · 콘텐츠",
    source: "샘플 플랫폼",
    score: 91,

    budget: "300,000원",
    budgetMin: 300000,
    budgetMax: 300000,

    estimatedTime: "5~7시간",
    estimatedHoursMin: 5,
    estimatedHoursMax: 7,

    hourlyRate: "4.2~6만원",
    workType: "원격",

    tags: ["글쓰기", "원고작성", "쇼핑몰"],

    summary:
      "온라인 쇼핑몰 상품을 소개하는 판매용 콘텐츠를 작성하는 프로젝트입니다.",

    reasons: [
      "작업시간이 짧음",
      "원격 가능",
    ],

    risks: [
      "수정 요청 범위 확인 필요",
      "상품 자료 제공 필요",
    ],
  },

  {
    id: 10,
    title: "기업 블로그 SEO 원고 10건 작성",
    category: "글쓰기 · 콘텐츠",
    source: "샘플 플랫폼",
    score: 89,

    budget: "500,000원",
    budgetMin: 500000,
    budgetMax: 500000,

    estimatedTime: "10~14시간",
    estimatedHoursMin: 10,
    estimatedHoursMax: 14,

    hourlyRate: "3.5~5만원",
    workType: "원격",

    tags: ["글쓰기", "블로그", "SEO"],

    summary:
      "지정된 키워드를 기반으로 기업 블로그에 게시할 SEO 콘텐츠를 작성합니다.",

    reasons: [
      "정기 외주로 확대 가능",
      "원격 가능",
    ],

    risks: [
      "SEO 가이드 숙지 필요",
      "글자수 기준 확인 필요",
    ],
  },

  {
    id: 11,
    title: "유튜브 영상 대본 5편 작성",
    category: "글쓰기 · 콘텐츠",
    source: "샘플 플랫폼",
    score: 84,

    budget: "400,000원",
    budgetMin: 400000,
    budgetMax: 400000,

    estimatedTime: "7~10시간",
    estimatedHoursMin: 7,
    estimatedHoursMax: 10,

    hourlyRate: "4~5.7만원",
    workType: "원격",

    tags: ["글쓰기", "대본", "YouTube"],

    summary:
      "정보형 유튜브 채널의 10분 내외 영상 대본을 작성하는 프로젝트입니다.",

    reasons: [
      "원격 가능",
      "반복 프로젝트 가능성",
    ],

    risks: [
      "톤앤매너 확인 필요",
      "자료조사 시간이 포함될 수 있음",
    ],
  },

  {
    id: 12,
    title: "AI 기술 뉴스레터 원고 작성",
    category: "글쓰기 · 콘텐츠",
    source: "샘플 플랫폼",
    score: 83,

    budget: "250,000원",
    budgetMin: 250000,
    budgetMax: 250000,

    estimatedTime: "4~6시간",
    estimatedHoursMin: 4,
    estimatedHoursMax: 6,

    hourlyRate: "4.1~6.2만원",
    workType: "원격",

    tags: ["글쓰기", "자료조사", "AI"],

    summary:
      "최근 AI 관련 이슈를 조사해 주간 뉴스레터 형태로 작성하는 프로젝트입니다.",

    reasons: [
      "짧은 작업시간",
      "자료조사 능력 활용 가능",
    ],

    risks: [
      "최신 자료 확인 필요",
      "출처 검증 작업 필요",
    ],
  },

  // =========================================================
  // 영상 · 마케팅
  // =========================================================
  {
    id: 13,
    title: "유튜브 쇼츠 영상 10건 편집",
    category: "영상 · 마케팅",
    source: "샘플 플랫폼",
    score: 87,

    budget: "500,000원",
    budgetMin: 500000,
    budgetMax: 500000,

    estimatedTime: "10~12시간",
    estimatedHoursMin: 10,
    estimatedHoursMax: 12,

    hourlyRate: "4.1~5만원",
    workType: "원격",

    tags: ["영상편집", "Shorts", "자막"],

    summary:
      "제공되는 영상 원본으로 유튜브 쇼츠 10개를 제작하는 프로젝트입니다.",

    reasons: [
      "작업량 명확",
      "원격 가능",
    ],

    risks: [
      "편집 스타일 협의 필요",
      "원본 품질 확인 필요",
    ],
  },

  {
    id: 14,
    title: "인스타그램 콘텐츠 운영 1개월",
    category: "영상 · 마케팅",
    source: "샘플 플랫폼",
    score: 84,

    budget: "900,000원",
    budgetMin: 900000,
    budgetMax: 900000,

    estimatedTime: "20~25시간",
    estimatedHoursMin: 20,
    estimatedHoursMax: 25,

    hourlyRate: "3.6~4.5만원",
    workType: "원격",

    tags: ["마케팅", "Instagram", "콘텐츠"],

    summary:
      "브랜드 인스타그램 계정의 콘텐츠 기획 및 게시물 운영을 담당합니다.",

    reasons: [
      "월 단위 안정적인 프로젝트",
      "원격 가능",
    ],

    risks: [
      "지속적인 커뮤니케이션 필요",
      "작업시간이 길 수 있음",
    ],
  },

  {
    id: 15,
    title: "제품 홍보 릴스 영상 5건 제작",
    category: "영상 · 마케팅",
    source: "샘플 플랫폼",
    score: 82,

    budget: "600,000원",
    budgetMin: 600000,
    budgetMax: 600000,

    estimatedTime: "10~15시간",
    estimatedHoursMin: 10,
    estimatedHoursMax: 15,

    hourlyRate: "4~6만원",
    workType: "원격",

    tags: ["영상편집", "마케팅", "Reels"],

    summary:
      "브랜드 제품 홍보를 위한 짧은 세로형 영상을 제작하는 프로젝트입니다.",

    reasons: [
      "온라인 작업 가능",
      "추가 발주 가능성",
    ],

    risks: [
      "촬영소스 제공 범위 확인 필요",
      "수정 요청 가능성",
    ],
  },

  {
    id: 16,
    title: "네이버 검색광고 캠페인 세팅",
    category: "영상 · 마케팅",
    source: "샘플 플랫폼",
    score: 81,

    budget: "400,000원",
    budgetMin: 400000,
    budgetMax: 400000,

    estimatedTime: "6~8시간",
    estimatedHoursMin: 6,
    estimatedHoursMax: 8,

    hourlyRate: "5~6.6만원",
    workType: "원격",

    tags: ["마케팅", "광고", "데이터분석"],

    summary:
      "신규 쇼핑몰의 네이버 검색광고 키워드 및 캠페인을 설정합니다.",

    reasons: [
      "단기 프로젝트",
      "원격 수행 가능",
    ],

    risks: [
      "광고계정 접근 필요",
      "성과 보장 요구 여부 확인 필요",
    ],
  },

  // =========================================================
  // 사무 · 리서치
  // =========================================================
  {
    id: 17,
    title: "경쟁사 시장조사 및 엑셀 정리",
    category: "사무 · 리서치",
    source: "샘플 플랫폼",
    score: 88,

    budget: "350,000원",
    budgetMin: 350000,
    budgetMax: 350000,

    estimatedTime: "6~8시간",
    estimatedHoursMin: 6,
    estimatedHoursMax: 8,

    hourlyRate: "4.3~5.8만원",
    workType: "원격",

    tags: ["자료조사", "Excel", "리서치"],

    summary:
      "경쟁사 제품과 가격정보를 조사하고 엑셀 형태로 정리하는 프로젝트입니다.",

    reasons: [
      "특수 기술 진입장벽 낮음",
      "원격 가능",
    ],

    risks: [
      "조사 범위 명확화 필요",
      "자료 출처 기준 확인 필요",
    ],
  },

  {
    id: 18,
    title: "엑셀 매출자료 정리 및 보고서 작성",
    category: "사무 · 리서치",
    source: "샘플 플랫폼",
    score: 86,

    budget: "250,000원",
    budgetMin: 250000,
    budgetMax: 250000,

    estimatedTime: "4~6시간",
    estimatedHoursMin: 4,
    estimatedHoursMax: 6,

    hourlyRate: "4.1~6.2만원",
    workType: "원격",

    tags: ["Excel", "PPT", "데이터"],

    summary:
      "기존 매출 데이터를 정리하고 경영진 보고용 요약자료를 작성합니다.",

    reasons: [
      "단기 완료 가능",
      "일반 직장인 부업 적합",
    ],

    risks: [
      "원본 데이터 품질 확인 필요",
      "보고서 양식 요구사항 확인 필요",
    ],
  },

  {
    id: 19,
    title: "해외 서비스 자료 번역 및 조사",
    category: "사무 · 리서치",
    source: "샘플 플랫폼",
    score: 79,

    budget: "450,000원",
    budgetMin: 450000,
    budgetMax: 450000,

    estimatedTime: "8~12시간",
    estimatedHoursMin: 8,
    estimatedHoursMax: 12,

    hourlyRate: "3.7~5.6만원",
    workType: "원격",

    tags: ["번역", "자료조사", "영어"],

    summary:
      "해외 서비스 관련 자료를 조사하고 주요 내용을 한국어로 번역·정리합니다.",

    reasons: [
      "원격 가능",
      "번역과 리서치 능력 동시 활용",
    ],

    risks: [
      "전문용어 난이도 확인 필요",
      "자료량 변동 가능성",
    ],
  },

  {
    id: 20,
    title: "설문조사 데이터 정리 및 PPT 제작",
    category: "사무 · 리서치",
    source: "샘플 플랫폼",
    score: 83,

    budget: "400,000원",
    budgetMin: 400000,
    budgetMax: 400000,

    estimatedTime: "7~10시간",
    estimatedHoursMin: 7,
    estimatedHoursMax: 10,

    hourlyRate: "4~5.7만원",
    workType: "원격",

    tags: ["Excel", "PPT", "자료조사"],

    summary:
      "설문 결과 데이터를 정리하고 주요 인사이트를 PPT 보고서로 제작합니다.",

    reasons: [
      "일반 사무역량 활용 가능",
      "원격 수행 가능",
    ],

    risks: [
      "분석 수준 사전 협의 필요",
      "PPT 디자인 요구수준 확인 필요",
    ],
  },
];