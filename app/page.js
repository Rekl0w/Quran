import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold">Welcome to Quranic</h1>
      <Image
        src="/quran.png"
        alt="Quran"
        width={300}
        height={300}
      />

      <p className="text-2xl">
        A simple app to read and listen to the Quran in different languages.
      </p>

      <p className="text-2xl">Click on the Surahs link to get started.</p>

      <Link href="/surah">
        <p className="text-2xl text-blue-500 underline">Surahs</p>
      </Link>
    </main>
  );
}
