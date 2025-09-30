import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search, Heart, Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Çoklu Dil Desteği",
      description: "Kuran-ı Kerim'i farklı dillerde okuyun ve anlayın",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Kolay Arama",
      description: "Sureleri kolayca arayın ve bulun",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Yer İmleri",
      description: "Favori ayetlerinizi kaydedin",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Modern Arayüz",
      description: "Şık ve kullanıcı dostu tasarım",
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 py-12"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary-400 to-emerald-400 blur-3xl opacity-30"
          />
          <h1 className="relative text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Quran App</span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Kuran-ı Kerim'i farklı dillerde okuyun ve dinleyin.
          <br />
          Modern ve güzel bir arayüzle İslami içerik.
        </p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/surahs"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2"
          >
            <span>Surelere Başla</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            114 sure • Çoklu dil desteği
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-200 dark:border-gray-700"
          >
            <div className="text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="glass rounded-3xl p-8 md:p-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
              114
            </div>
            <div className="text-gray-600 dark:text-gray-400">Sure</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
              6,236
            </div>
            <div className="text-gray-600 dark:text-gray-400">Ayet</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
              100+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Çeviri</div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500 to-emerald-600 p-8 md:p-16 text-center text-white"
      >
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Okumaya Hazır mısınız?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Kuran-ı Kerim'i okumaya ve dinlemeye başlayın. İster yeni başlıyor
            olun, ister düzenli okuyorsunuz, modern arayüzümüz size yardımcı
            olacak.
          </p>
          <Link
            to="/surahs"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Sureleri Görüntüle
          </Link>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </motion.section>
    </div>
  );
};

export default Home;
