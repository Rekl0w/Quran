# Quran App 🕌

Çok dilli Kur'an-ı Kerim okuma, meal karşılaştırma ve dinleme uygulaması. Vite,
React ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

- Arayüz diliyle birlikte yerelleşen 114 sure adı
- 48 arayüz dili için klasör tabanlı i18n kaynakları ve kalıcı dil seçimi
- Arapça ayetlerin görsel yerine seçilebilir ve erişilebilir metni
- Yalnızca gerçek metin meallerini içeren meal seçimi
- En fazla dört meali aynı anda yan yana karşılaştırma
- Sayfalar, önceki/sonraki sureler, yer imleri ve yenilemeler arasında korunan
  meal grubu
- Meal grubuyla birlikte saklanan ayet yer imleri
- Sure adı, sure numarası ve ayet sayısıyla arama
- Tek, isteğe bağlı yüklenen Alafasy ses oynatıcısı
- Spinner yerine içeriğe uyumlu ve hareket tercihini gözeten skeleton ekranları
- Kaldığın yerden devam et kartı
- Sistem tercihinden başlayan kalıcı karanlık mod
- Responsive ve klavye/ekran okuyucu dostu arayüz

## Kurulum

Node.js 24 kullanın.

```bash
npm ci
npm run dev
```

Üretim doğrulaması:

```bash
npm run check
```

## Veri kaynakları

- Meal ve Arapça ayet metni: [AlQuran Cloud API](https://alquran.cloud/api)
- Ses: [Islamic Network CDN](https://alquran.cloud/cdn)
- Yerelleştirilmiş sure adları: dil bazında tembel yüklenen yerel kataloglar
- Türkçe adların çevrimdışı yedeği: [Diyanet Kur'an-ı Kerim](https://kuran.diyanet.gov.tr/mushaf)

Sure listesi için küçük `/surah` metadata endpoint'i kullanılır. Okuma ekranı,
seçilen 1–4 meal ile `quran-uthmani` Arapça metnini tek istekte eşleştirir. Ses
dosyaları kullanıcı oynatmayı başlatana kadar indirilmez. Arayüz metinleri ve
114 sure adı, yalnızca seçilen dile ait dosyalar yüklenerek sunulur.

## Yerel veri

Arayüz dili, meal grubu, yer imleri, son okunan konum ve tema tercihi
`localStorage` içinde sürümlü ve güvenli biçimde tutulur. Eski tek-meal
kayıtları otomatik olarak yeni çoklu-meal biçimine taşınır.

## Lisans

Bu proje MIT lisansı altındadır. Uygulama eğitim ve ibadete yardımcı olmak için
hazırlanmıştır; Kur'an-ı Kerim'in orijinal Arapça metni esas kaynaktır.
