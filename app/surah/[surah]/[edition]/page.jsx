"use client";

import { Suspense, useEffect, useState } from "react";
import { getSurah, getAyahPng, getAyahAudio, getSurahAudio } from "@/api/Request";
import Loading from "./loading";

export default function Page({ params }) {
  const [surah, setSurah] = useState({});
  const [ayahs, setAyahs] = useState([]);

  useEffect(() => {
    getSurah(params.surah, params.edition).then((surah) => {
      setSurah(surah);
    });
  }, [params]);

  useEffect(() => {
    setAyahs(surah?.ayahs || []);
  }, [surah]);

  useEffect(() => {
    getSurahAudio(params.surah).then((audio) => {
      console.log(audio);
    });
  }, [params]);

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <div className="flex flex-col gap-5 mb-10">
          <h1 className="text-6xl font-semibold">{surah?.englishName}</h1>
          <h2 className="text-2xl font-semibold">{surah?.name}</h2>
        </div>

        <div className="flex-col flex gap-5 text-xl">
          {ayahs?.map((ayah, index) => (
            <p key={index}>
              {index + 1}. {ayah?.text}
            </p>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
