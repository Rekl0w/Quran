"use client";

import { useEffect, useState } from "react";
import { getSurah } from "@/api/Request";

export default function Page({ params }) {
  const [surah, setSurah] = useState({});
  const [ayahs, setAyahs] = useState([]);

  useEffect(() => {
    getSurah(params.surah).then((surah) => {
      setSurah(surah);
    });
  }, [params]);

  useEffect(() => {
    setAyahs(surah?.ayahs || []);
  }, [surah]);

  return (
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
  );
}
