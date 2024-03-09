"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { useEffect, useState } from "react";
import { getSurah } from "@/api/Request";
import Image from "next/image";

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

  return (
      <div>
        <div className="flex flex-col gap-5 mb-10">
          <h1 className="text-6xl font-semibold">{surah?.englishName}</h1>
          <h2 className="text-2xl font-semibold">{surah?.name}</h2>
        </div>
        <div className="mb-16">
          <AudioPlayer
            src={`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${params.surah}.mp3`}
            className="rounded-lg w-full"
          />
        </div>
        <div className="flex-col flex gap-5 text-xl">
          {ayahs?.map((ayah, index) => (
            <div key={index} className="border-4 p-4 rounded-lg">
              <div className="lg:flex justify-between items-center mb-4">
                <p>
                  {index + 1}. {ayah?.text}
                </p>

                <Image
                  src={`https://cdn.islamic.network/quran/images/${
                    params.surah
                  }_${index + 1}.png`}
                  alt="Ayah"
                  width={700}
                  height={500}
                  className="lg:m-0 my-5"
                />
              </div>
              <AudioPlayer
                src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`}
                className="rounded-lg w-full"
              />
            </div>
          ))}
        </div>
      </div>
  );
}
