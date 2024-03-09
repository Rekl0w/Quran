import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const getCurrentTime = () => {
    const date = new Date();
    return date.getFullYear();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20 bg-[#FEFFDD] bg-opacity-60">
      <h1 className="text-6xl font-bold">Welcome to Quranic</h1>
      <Image src="/quran.png" alt="Quran" width={250} height={250} />

      <p className="text-2xl">
        A simple app to read and listen to the Quran in different languages.
      </p>

      <p className="text-2xl">Click on the Surahs link to get started.</p>

      <Link href="/surah">
        <button className="bg-emerald-700 border-2 border-emerald-700 p-6 text-4xl text-white rounded-2xl hover:bg-transparent hover:text-emerald-700 hover:border-emerald-700 transition duration-300">
          Surahs
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline-block ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </Link>

      <p>© {getCurrentTime()} Rekl0w</p>
    </main>
  );
}
