"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RadarProfile = {
  skills: string[];
  availability: string[];
  minimumBudget: number;
  maximumHours: number;
  remoteOnly: boolean;
};

const DEFAULT_PROFILE: RadarProfile = {
  skills: ["Java", "Spring", "Oracle"],
  availability: ["평일 야간", "주말"],
  minimumBudget: 300000,
  maximumHours: 15,
  remoteOnly: true,
};

const SKILL_OPTIONS = [
  "Java",
  "Spring",
  "Oracle",
  "React",
  "Next.js",
  "Flutter",
  "Excel",
  "PPT",
  "글쓰기",
  "디자인",
  "영상편집",
  "마케팅",
  "자료조사",
  "번역",
];

const AVAILABILITY_OPTIONS = [
  "평일 오전",
  "평일 오후",
  "평일 야간",
  "주말",
];

export default function RadarPage() {
  const [profile, setProfile] =
    useState<RadarProfile>(DEFAULT_PROFILE);

  const [saved, setSaved] = useState(false);

  const [minimumBudgetInput, setMinimumBudgetInput] =
  useState(DEFAULT_PROFILE.minimumBudget.toLocaleString("ko-KR"));
  
  // 브라우저에 저장된 내 레이더 설정 불러오기
useEffect(() => {
  const savedProfile = localStorage.getItem("ojuradar-profile");

  if (!savedProfile) {
    return;
  }

  try {
    const parsedProfile: RadarProfile =
      JSON.parse(savedProfile);

    // Effect 안에서 즉시 상태를 변경하지 않고
    // 다음 이벤트 루프에서 저장값을 화면에 반영
    setTimeout(() => {
      setProfile(parsedProfile);

      setMinimumBudgetInput(
        parsedProfile.minimumBudget > 0
          ? parsedProfile.minimumBudget.toLocaleString("ko-KR")
          : ""
      );
    }, 0);
  } catch {
    console.error("레이더 설정을 불러올 수 없습니다.");
  }
}, []);

  function toggleSkill(skill: string) {
    setSaved(false);

    setProfile((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }));
  }

  function toggleAvailability(value: string) {
    setSaved(false);

    setProfile((current) => ({
      ...current,
      availability: current.availability.includes(value)
        ? current.availability.filter((item) => item !== value)
        : [...current.availability, value],
    }));
  }

  function saveProfile() {
    localStorage.setItem(
      "ojuradar-profile",
      JSON.stringify(profile)
    );

    setSaved(true);
  }

  function resetProfile() {
    setProfile(DEFAULT_PROFILE);

    setMinimumBudgetInput(
        DEFAULT_PROFILE.minimumBudget.toLocaleString("ko-KR")
    );

    localStorage.removeItem("ojuradar-profile");

    setSaved(false);
    }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* 헤더 */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
              R
            </div>

            <div>
              <div className="font-bold">외주레이더</div>
              <div className="text-xs text-slate-400">
                AI 일거리 탐색 서비스
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* 타이틀 */}
        <section>
          <div className="text-sm font-semibold text-blue-400">
            MY RADAR
          </div>

          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            내 레이더 설정
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            내가 할 수 있는 일과 원하는 조건을 설정하면
            외주레이더가 수많은 공고 중 나에게 맞는 일만
            찾아드립니다.
          </p>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* 설정 */}
          <div className="space-y-6">
            {/* 기술 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                내가 할 수 있는 일
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                여러 개 선택할 수 있습니다.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {SKILL_OPTIONS.map((skill) => {
                  const selected =
                    profile.skills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/15 text-blue-400"
                          : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {selected ? "✓ " : ""}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 가능 시간 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                언제 일할 수 있나요?
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {AVAILABILITY_OPTIONS.map((value) => {
                  const selected =
                    profile.availability.includes(value);

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        toggleAvailability(value)
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-700 bg-slate-950"
                      }`}
                    >
                      <div className="font-semibold">
                        {selected ? "✓ " : ""}
                        {value}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 금액 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                최소 희망금액
              </h2>

              <div className="mt-6 flex items-center gap-3">
                <input
                    type="text"
                    inputMode="numeric"
                    value={minimumBudgetInput}
                    placeholder="예: 300,000"
                    onChange={(event) => {
                        setSaved(false);

                        // 숫자를 제외한 문자는 제거
                        const onlyNumber =
                        event.target.value.replace(/[^\d]/g, "");

                        // 빈 값이면 화면도 완전히 비워둔다.
                        if (onlyNumber === "") {
                        setMinimumBudgetInput("");

                        setProfile((current) => ({
                            ...current,
                            minimumBudget: 0,
                        }));

                        return;
                        }

                        const numberValue = Number(onlyNumber);

                        // 화면에는 100,000 형태로 표시
                        setMinimumBudgetInput(
                        numberValue.toLocaleString("ko-KR")
                        );

                        // 실제 데이터에는 숫자로 저장
                        setProfile((current) => ({
                        ...current,
                        minimumBudget: numberValue,
                        }));
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg outline-none focus:border-blue-500"
                    />

                <span className="text-slate-400">원</span>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                이 금액보다 낮은 공고의 추천점수가
                낮아집니다.
              </p>
            </section>

            {/* 최대 작업시간 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                한 프로젝트 최대 작업시간
              </h2>

              <div className="mt-6">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={profile.maximumHours}
                  onChange={(event) => {
                    setSaved(false);

                    setProfile({
                      ...profile,
                      maximumHours: Number(
                        event.target.value
                      ),
                    });
                  }}
                  className="w-full"
                />

                <div className="mt-4 text-3xl font-bold text-blue-400">
                  {profile.maximumHours}시간
                </div>
              </div>
            </section>

            {/* 원격 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <h2 className="text-xl font-bold">
                    원격 작업만 추천
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    상주·출근이 필요한 업무는 제외합니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSaved(false);

                    setProfile({
                      ...profile,
                      remoteOnly: !profile.remoteOnly,
                    });
                  }}
                  className={`relative h-8 w-14 rounded-full transition ${
                    profile.remoteOnly
                      ? "bg-blue-600"
                      : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                      profile.remoteOnly
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </section>
          </div>

          {/* 우측 요약 */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-sm text-slate-400">
                현재 레이더
              </div>

              <div className="mt-2 text-2xl font-bold">
                맞춤 조건 요약
              </div>

              <div className="my-6 border-t border-slate-800" />

              <div>
                <div className="text-xs text-slate-500">
                  가능한 업무
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-slate-800 px-2 py-1 text-xs"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-600">
                      선택 없음
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <SummaryRow
                  label="최소 금액"
                  value={`${profile.minimumBudget.toLocaleString()}원`}
                />

                <SummaryRow
                  label="최대 시간"
                  value={`${profile.maximumHours}시간`}
                />

                <SummaryRow
                  label="원격 전용"
                  value={profile.remoteOnly ? "ON" : "OFF"}
                />
              </div>

              <button
                type="button"
                onClick={saveProfile}
                className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-bold transition hover:bg-blue-500"
              >
                내 레이더 저장
              </button>

              <button
                type="button"
                onClick={resetProfile}
                className="mt-3 w-full rounded-xl border border-slate-700 py-3 text-sm text-slate-400 transition hover:bg-slate-800"
              >
                초기화
              </button>

              {saved && (
                <div className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-400">
                  ✓ 레이더 설정이 저장되었습니다.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}