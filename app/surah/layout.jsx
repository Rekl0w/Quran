import Navbar from "../ui/Navbar";

export const metadata = {
  title: "Quranic",
  description:
    "A simple app to read and listen to the Quran in different languages.",
};

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-[#FEFFDD] bg-opacity-60">
      <div className="w-full flex-none md:w-64">
        <Navbar />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
