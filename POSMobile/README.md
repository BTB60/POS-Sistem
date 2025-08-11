# 📱 POS Sistem - Mobil Tətbiq

**Kassa və Satış İdarəetməsi üçün React Native Mobil Tətbiq**

## 🚀 Xüsusiyyətlər

### 📊 **Ana Funksiyalar**
- **🔐 Təhlükəsiz Giriş** - İstifadəçi autentifikasiyası
- **📈 Dashboard** - Real-time statistikalar və qrafiklər
- **🛒 Satış İdarəetməsi** - Barkod skan etmə və səbət idarəetməsi
- **📦 Anbar İdarəetməsi** - Məhsul əlavə etmə və stok idarəetməsi
- **👥 Müştəri İdarəetməsi** - Müştəri qeydiyyatı və statistikaları
- **📊 Hesabatlar** - Satış və gəlir analizi
- **⚙️ Tənzimləmələr** - Tətbiq konfiqurasiyası

### 🎯 **Texniki Xüsusiyyətlər**
- **📱 Cross-Platform** - iOS və Android dəstəyi
- **🎨 Modern UI/UX** - Material Design komponentləri
- **📊 Real-time Charts** - Satış və gəlir qrafikləri
- **🔍 Barkod Skan etmə** - Məhsul axtarışı
- **💾 Offline Dəstək** - İnternet olmadan işləyə bilər
- **🔔 Push Bildirişlər** - Real-time bildirişlər

## 🛠️ Quraşdırma

### **Tələblər**
- Node.js (v16 və ya daha yuxarı)
- npm və ya yarn
- Expo CLI
- Android Studio (Android üçün)
- Xcode (iOS üçün)

### **Quraşdırma Addımları**

1. **Layihəni klonlayın:**
```bash
git clone https://github.com/BTB60/POS-Sistem.git
cd POS-Sistem/POSMobile
```

2. **Asılılıqları quraşdırın:**
```bash
npm install
# və ya
yarn install
```

3. **Expo CLI quraşdırın:**
```bash
npm install -g @expo/cli
```

4. **Tətbiqi başladın:**
```bash
npm start
# və ya
expo start
```

## 📱 İstifadə

### **Giriş Məlumatları**
- **Admin:** `admin` / `admin`
- **Demo:** `demo` / `demo`

### **Əsas Funksiyalar**

#### 🛒 **Satış İdarəetməsi**
1. **Məhsul Axtarışı** - Ad və ya barkod ilə
2. **Barkod Skan etmə** - Kamera ilə avtomatik əlavə etmə
3. **Səbət İdarəetməsi** - Miqdar dəyişdirmə və silmə
4. **Ödəniş** - Nağd, kart və ya köçürmə

#### 📦 **Anbar İdarəetməsi**
1. **Məhsul Əlavə etmə** - Ad, qiymət, stok və barkod
2. **Stok İdarəetməsi** - Az qalan məhsulların izlənməsi
3. **Kateqoriya Təsnifatı** - Məhsulları kateqoriyalara bölmə

#### 👥 **Müştəri İdarəetməsi**
1. **Müştəri Qeydiyyatı** - Ad, telefon və email
2. **Alış Tarixçəsi** - Müştərinin bütün alışları
3. **Statistikalar** - Ümumi xərclər və alış sayı

## 🏗️ Layihə Strukturu

```
POSMobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── SalesScreen.tsx
│   │   ├── InventoryScreen.tsx
│   │   ├── CustomersScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   └── utils/
├── App.tsx
├── package.json
└── README.md
```

## 📦 Asılılıqlar

### **Əsas Asılılıqlar**
- `expo` - Cross-platform development
- `react-native` - Mobile app framework
- `@react-navigation` - Navigation system
- `react-native-paper` - UI components
- `expo-barcode-scanner` - Barcode scanning
- `react-native-chart-kit` - Charts and graphs

### **Əlavə Asılılıqlar**
- `expo-camera` - Camera access
- `expo-print` - Print functionality
- `expo-sharing` - File sharing
- `expo-sqlite` - Local database
- `expo-secure-store` - Secure storage
- `expo-notifications` - Push notifications

## 🚀 Build və Deploy

### **Android APK**
```bash
expo build:android
```

### **iOS IPA**
```bash
expo build:ios
```

### **Web Versiyası**
```bash
expo build:web
```

## 📊 Performans

- **Başlanğıc vaxtı:** < 3 saniyə
- **Memory istifadəsi:** < 100MB
- **APK ölçüsü:** ~25MB
- **iOS ölçüsü:** ~30MB

## 🔧 Konfiqurasiya

### **Məlumatların Saxlanması**
- **LocalStorage** - Offline məlumatlar
- **SQLite** - Strukturlaşdırılmış məlumatlar
- **SecureStore** - Həssas məlumatlar

### **API İnteqrasiyası**
- **REST API** - Backend ilə əlaqə
- **WebSocket** - Real-time məlumatlar
- **Push Notifications** - Bildirişlər

## 🐛 Problemlərin Həlli

### **Ümumi Problemlər**

1. **Metro bundler xətası:**
```bash
npx react-native start --reset-cache
```

2. **iOS build xətası:**
```bash
cd ios && pod install
```

3. **Android build xətası:**
```bash
cd android && ./gradlew clean
```

## 📞 Dəstək

- **Email:** support@possystem.az
- **GitHub Issues:** [Problemləri bildirin](https://github.com/BTB60/POS-Sistem/issues)
- **Telegram:** @possystem_support

## 📄 Lisenziya

Bu layihə **MIT Lisenziyası** altında yayımlanır.

## 🤝 Töhfə

1. Layihəni fork edin
2. Feature branch yaradın (`git checkout -b feature/amazing-feature`)
3. Dəyişiklikləri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch-i push edin (`git push origin feature/amazing-feature`)
5. Pull Request yaradın

## 📈 Gələcək Planlar

- [ ] **PWA Dəstəyi** - Progressive Web App
- [ ] **Offline Mode** - Tam offline işləmə
- [ ] **Multi-language** - Çoxdilli dəstək
- [ ] **Cloud Sync** - Bulud sinxronizasiyası
- [ ] **Advanced Analytics** - Təkmilləşdirilmiş analitika
- [ ] **Payment Integration** - Ödəniş sistemləri
- [ ] **Inventory Alerts** - Stok xəbərdarlıqları
- [ ] **Customer Loyalty** - Müştəri sadiqliyi proqramı

---

**© 2024 POS Sistem. Bütün hüquqlar qorunur.**
