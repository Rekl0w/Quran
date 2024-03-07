"use client";

export default function Loading() {
  return (
    <div>
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-6xl font-semibold">Loading...</h1>
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>

      <div className="flex-col flex gap-5 text-xl">
        <p>Loading...</p>
      </div>
    </div>
  );
}
