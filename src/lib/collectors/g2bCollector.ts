export type G2bJob = {
  bidNoticeNo: string;
  bidNoticeOrder: string;

  title: string;

  noticeInstitution: string;
  demandInstitution: string;

  contractMethod: string;

  estimatedPrice: number;
  allocatedBudget: number;

  noticeDate: string;
  bidCloseDate: string;

  sourceUrl: string;
};

type UnknownObject = Record<string, unknown>;

function text(value: unknown): string {
  return value === null || value === undefined
    ? ""
    : String(value);
}

function numberValue(value: unknown): number {
  const parsed = Number(
    String(value ?? "").replace(/[^\d.-]/g, "")
  );

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatKstDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return (
    get("year") +
    get("month") +
    get("day") +
    get("hour") +
    get("minute")
  );
}

export async function collectG2bJobs(
  days = 3,
  pageNo = 1,
  numOfRows = 10
): Promise<G2bJob[]> {
  const serviceKey = process.env.G2B_API_KEY;

  if (!serviceKey) {
    throw new Error(
      "G2B_API_KEY가 .env에 설정되어 있지 않습니다."
    );
  }

  const now = new Date();
  const start = new Date(
    now.getTime() - days * 24 * 60 * 60 * 1000
  );

  const params = new URLSearchParams({
    serviceKey,
    pageNo: String(pageNo),
    numOfRows: String(numOfRows),

    // JSON 응답
    type: "json",

    // 1 = 등록일시 기준
    inqryDiv: "1",

    inqryBgnDt: formatKstDate(start),
    inqryEndDt: formatKstDate(now),
  });

  const endpoint =
    "https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServc";

  const response = await fetch(
    `${endpoint}?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `나라장터 API HTTP 오류: ${response.status}`
    );
  }

  const data = await response.json();

  const resultCode =
    data?.response?.header?.resultCode;

  if (
    resultCode !== "00" &&
    resultCode !== 0 &&
    resultCode !== "0"
  ) {
    throw new Error(
      `나라장터 API 오류: ${resultCode} / ${
        data?.response?.header?.resultMsg ?? "알 수 없는 오류"
      }`
    );
  }

  const rawItems =
    data?.response?.body?.items;

  let items: UnknownObject[] = [];

  if (Array.isArray(rawItems)) {
    items = rawItems;
  } else if (Array.isArray(rawItems?.item)) {
    items = rawItems.item;
  } else if (rawItems?.item) {
    items = [rawItems.item];
  }

  return items.map((item) => {
    const bidNoticeNo =
      text(item.bidNtceNo);

    const bidNoticeOrder =
      text(item.bidNtceOrd);

    return {
      bidNoticeNo,
      bidNoticeOrder,

      title:
        text(item.bidNtceNm),

      noticeInstitution:
        text(item.ntceInsttNm),

      demandInstitution:
        text(item.dminsttNm),

      contractMethod:
        text(item.cntrctCnclsMthdNm),

      estimatedPrice:
        numberValue(item.presmptPrce),

      allocatedBudget:
        numberValue(item.asignBdgtAmt),

      noticeDate:
        text(
          item.bidNtceDt ??
          item.rgstDt
        ),

      bidCloseDate:
        text(
          item.bidClseDt ??
          item.bidClseDate
        ),

      sourceUrl:
        text(
          item.bidNtceDtlUrl ??
          item.bidNtceUrl
        ),
    };
  });
}