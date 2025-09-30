# Quran App 🕌

Modern ve güzel bir Kuran-ı Kerim okuma ve dinleme uygulaması. Vite + React + Tailwind CSS ile geliştirilmiştir.

## ✨ Özellikler

- 📖 114 surenin tamamı
- 🌍 100+ dil ve çeviri desteği
- 🎵 Sesli okuma (Sure ve ayet bazlı)
- 🔍 Gelişmiş arama fonksiyonu
- 🔖 Yer imi sistemi
- 🌙 Karanlık mod
- 📱 Tam responsive tasarım
- ⚡ Hızlı ve modern arayüz
- 🎨 Glassmorphism ve modern UI efektleri
- 🖼️ Arapça ayetlerin kaliteli görselleri

## 🚀 Teknolojiler

- **Vite** - Hızlı build tool
- **React 18** - UI kütüphanesi
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **Axios** - HTTP istekleri
- **React H5 Audio Player** - Audio player
- **Lucide React** - Modern ikonlar
- **React Hot Toast** - Bildirimleri

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## 📖 API

Bu uygulama [AlQuran Cloud API](https://alquran.cloud) kullanmaktadır.

- Sureler: `https://api.alquran.cloud/v1/quran/{edition}`
- Sure detayı: `https://api.alquran.cloud/v1/surah/{number}/{edition}`
- Çeviriler: `https://api.alquran.cloud/v1/edition`
- Sesli okuma: `https://cdn.islamic.network/quran/audio/`

## 📱 Özellikler

### Yer İmleri

- Ayetleri yer imlerine ekleyin
- Yer imleri localStorage'da saklanır
- Kolayca erişim

### Karanlık Mod

- Otomatik tema değişimi
- localStorage ile kayıt
- Göz dostu renkler

### Arama

- Sure ismi ile arama
- Ayet sayısı ile arama
- Anlık sonuçlar

### Sesli Okuma

- Sure bazlı dinleme
- Ayet bazlı dinleme
- Kaliteli ses dosyaları (Alafasy)

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 🙏 Teşekkürler

- [AlQuran Cloud](https://alquran.cloud) - API sağlayıcı
- [Islamic Network](https://islamic.network) - Ses ve görsel içerik

---

**Not:** Bu uygulama eğitim ve ibadete yardımcı olmak amacıyla geliştirilmiştir. Kuran-ı Kerim'in orijinal Arapça metnine danışmak her zaman en iyisidir.
