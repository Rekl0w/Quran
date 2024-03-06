"use client";
import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold">Welcome to Quranic</h1>
      <Image src="/quran.png" alt="Quran" width={300} height={300} />

      <p className="text-2xl">
        A simple app to read the Quran in different languages.
      </p>
    </div>
  );
}
