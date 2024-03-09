"use client";
import { getSurahs, getEditions } from "@/api/Request";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./Navbar.css";

export default function Navbar() {
  const [surahs, setSurahs] = useState([]);
  const [editions, setEditions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    getEditions().then((editions) => {
      setEditions(editions);
    });
  }, []);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("selectedLanguage");
    if (storedLanguage && !selectedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (selectedLanguage) {
      window.localStorage.setItem("selectedLanguage", selectedLanguage);
    }

    getSurahs(
      selectedLanguage
        ? selectedLanguage
        : window.localStorage.getItem(selectedLanguage)
        ? window.localStorage.getItem(selectedLanguage)
        : "tr.yazir"
    ).then((surahs) => {
      setSurahs(surahs);
    });
  }, [selectedLanguage]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="overflow-auto bg-green-700">
      <div className="flex items-center justify-center bg-green-700 w-[256px] h-[250px] shadow-lg flex-col">
        <Link href={"/"} className="flex items-center justify-center">
          <Image src="/quran.png" alt="Quran" width={100} height={100} />
        </Link>
        <div className="px-6">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="w-full mt-8 p-2 bg-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {editions.map((edition) => (
              <>
                <option key={edition.identifier} value={edition.identifier}>
                  {edition.language} - {edition.name}
                </option>
              </>
            ))}
          </select>
        </div>
      </div>

      <div className="surahs overflow-y-auto overflow-x-hidden max-h-[690px] pb-5">
        <ul className="flex flex-col gap-5 w-full h-full ml-5 mt-5 ">
          {surahs?.map((surah) => (
            <Link
              className="bg-green-500 rounded-full px-4 py-2"
              key={surah.number}
              href={`/surah/${surah.number}/${selectedLanguage}`}
            >
              <li>
                {surah.number}. {surah.englishName}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
