# 🏪 POS Sistem - Point of Sale Management System

<div align="center">

![POS Sistem Logo](https://img.shields.io/badge/POS-Sistem-2EA44F?style=for-the-badge&logo=github&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Modern və funksional Point of Sale (POS) idarəetmə sistemi**

[🌐 Live Demo](https://btb60.github.io/POS-Sistem/) | [📁 Repository](https://github.com/BTB60/POS-Sistem) | [📖 Documentation](#features)

</div>

---

## 📋 Mündəricat

- [✨ Əsas Xüsusiyyətlər](#-əsas-xüsusiyyətlər)
- [🚀 Demo](#-demo)
- [🛠️ Texnologiyalar](#️-texnologiyalar)
- [📦 Quraşdırma](#-quraşdırma)
- [🎯 İstifadə](#-istifadə)
- [📱 Ekran Görüntüləri](#-ekran-görüntüləri)
- [🔧 Funksiyalar](#-funksiyalar)
- [📊 Məlumat Strukturu](#-məlumat-strukturu)
- [🤝 Töhfə](#-tohfə)
- [📄 Lisenziya](#-lisenziya)

---

## ✨ Əsas Xüsusiyyətlər

### 🛒 Satış İdarəetməsi
- **Sürətli məhsul axtarışı** - ad, ID və ya barkod ilə
- **Barkod skan etmə** - real-time barkod oxuma
- **Avtomatik qiymət hesablama** - endirim və vergi hesablaması
- **Çap funksiyası** - satış qəbzi yazdırma

### 📦 Anbar İdarəetməsi
- **Məhsul əlavə etmə/düzənləmə** - tam CRUD əməliyyatları
- **Barkod əlavə etmə** - hər məhsula unikal barkod
- **Stok izləmə** - avtomatik stok yeniləmə
- **Axtarış və filtrləmə** - sürətli məhsul tapma

### 👥 Müştəri İdarəetməsi
- **Müştəri qeydiyyatı** - ətraflı məlumat saxlanması
- **Satış tarixçəsi** - müştəri bazarlığı
- **Statistika** - satış və xərclər analizi
- **Status izləmə** - aktiv/qeyri-aktiv müştərilər

### 🔐 Təhlükəsizlik
- **İstifadəçi autentifikasiyası** - giriş/qeydiyyat sistemi
- **Admin paneli** - tam idarəetmə imkanları
- **Məlumat qorunması** - LocalStorage istifadəsi

---

## 🚀 Demo

<div align="center">

### 🌐 Live Demo
**[https://btb60.github.io/POS-Sistem/](https://btb60.github.io/POS-Sistem/)**

### 📱 Demo Giriş Məlumatları
```
İstifadəçi adı: admin
Şifrə: admin123
```

</div>

---

## 🛠️ Texnologiyalar

| Texnologiya | Versiya | Məqsəd |
|-------------|---------|---------|
| **React.js** | 18.x | Frontend framework |
| **Vite** | 7.x | Build tool və development server |
| **HTML5-QRCode** | 2.x | Barkod skan etmə |
| **CSS3** | - | Styling və animasiyalar |
| **JavaScript ES6+** | - | Proqramlaşdırma dili |
| **LocalStorage** | - | Məlumat saxlanması |

---

## 📦 Quraşdırma

### Tələblər
- Node.js (v16 və ya daha yuxarı)
- npm və ya yarn

### Quraşdırma Addımları

```bash
# 1. Repository-ni klonlayın
git clone https://github.com/BTB60/POS-Sistem.git

# 2. Layihə qovluğuna keçin
cd POS-Sistem

# 3. Asılılıqları quraşdırın
npm install

# 4. Development server-i başladın
npm run dev

# 5. Brauzerinizdə açın
# http://localhost:5173
```

### Production Build

```bash
# Production üçün build edin
npm run build

# Build nəticəsini yoxlayın
npm run preview
```

---

## 🎯 İstifadə

### 🔐 Giriş
1. Brauzerinizdə `http://localhost:5173` ünvanına keçin
2. Demo məlumatları ilə giriş edin:
   - **İstifadəçi adı**: `admin`
   - **Şifrə**: `admin123`

### 🛒 Satış Əməliyyatı
1. **Kassa** bölməsinə keçin
2. Məhsul axtarın (ad, ID və ya barkod ilə)
3. Və ya **Barkod** düyməsi ilə barkod skan edin
4. Məhsulu səbətə əlavə edin
5. **Ödəniş** düyməsi ilə satışı tamamlayın
6. Qəbzi yazdırın

### 📦 Anbar İdarəetməsi
1. **Anbar** bölməsinə keçin
2. **Məhsul Əlavə Et** düyməsi ilə yeni məhsul əlavə edin
3. Barkod və digər məlumatları doldurun
4. Məhsulları redaktə və ya silin

### 👥 Müştəri İdarəetməsi
1. **Admin Panel** → **Müştəri İdarəetməsi**
2. Yeni müştəri əlavə edin
3. Müştəri məlumatlarını redaktə edin
4. Satış tarixçəsini izləyin

---

## 📱 Ekran Görüntüləri

<div align="center">

### 🏠 Ana Səhifə
![Ana Səhifə](https://via.placeholder.com/800x400/2EA44F/FFFFFF?text=Ana+Səhifə)

### 🛒 Kassa
![Kassa](https://via.placeholder.com/800x400/646CFF/FFFFFF?text=Kassa+Səhifəsi)

### 📦 Anbar
![Anbar](https://via.placeholder.com/800x400/F7DF1E/000000?text=Anbar+İdarəetməsi)

### 👥 Müştəri İdarəetməsi
![Müştəri](https://via.placeholder.com/800x400/1572B6/FFFFFF?text=Müştəri+İdarəetməsi)

</div>

---

## 🔧 Funksiyalar

### 🛒 Kassa Sistemi
- [x] Məhsul axtarışı (ad, ID, barkod)
- [x] Barkod skan etmə
- [x] Avtomatik qiymət hesablama
- [x] Endirim tətbiq etmə
- [x] Satış qəbzi yazdırma
- [x] Satış tarixçəsi

### 📦 Anbar İdarəetməsi
- [x] Məhsul əlavə etmə
- [x] Məhsul redaktə etmə
- [x] Məhsul silmə
- [x] Barkod əlavə etmə
- [x] Stok izləmə
- [x] Axtarış və filtrləmə

### 👥 Müştəri İdarəetməsi
- [x] Müştəri qeydiyyatı
- [x] Müştəri redaktə etmə
- [x] Satış tarixçəsi
- [x] Müştəri statistikası
- [x] Status izləmə

### 🔐 Təhlükəsizlik
- [x] İstifadəçi autentifikasiyası
- [x] Admin paneli
- [x] Məlumat qorunması
- [x] Session idarəetməsi

---

## 📊 Məlumat Strukturu

### Məhsul Strukturu
```javascript
{
  id: "unique_id",
  name: "Məhsul adı",
  price: 10.99,
  quantity: 100,
  barcode: "123456789",
  category: "Kateqoriya",
  description: "Təsvir"
}
```

### Müştəri Strukturu
```javascript
{
  id: "unique_id",
  name: "Müştəri adı",
  email: "email@example.com",
  phone: "+994501234567",
  address: "Ünvan",
  status: "active",
  totalSpent: 150.50,
  totalPurchases: 5
}
```

### Satış Strukturu
```javascript
{
  id: "unique_id",
  date: "2024-01-01",
  items: [...],
  total: 25.99,
  customerId: "customer_id",
  paymentMethod: "cash"
}
```

---

## 🤝 Töhfə

Bu layihəyə töhfə vermək üçün:

1. **Fork** edin
2. **Feature branch** yaradın (`git checkout -b feature/AmazingFeature`)
3. **Commit** edin (`git commit -m 'Add some AmazingFeature'`)
4. **Push** edin (`git push origin feature/AmazingFeature`)
5. **Pull Request** yaradın

### Töhfə Qaydaları
- Kod standartlarına riayət edin
- Test yazın
- README-ni yeniləyin
- Commit mesajlarını aydın yazın

---

## 📄 Lisenziya

Bu layihə **MIT Lisenziyası** altında yayımlanır. Ətraflı məlumat üçün [LICENSE](LICENSE) faylına baxın.

---

## 📞 Əlaqə

<div align="center">

**Layihə Sahibi**: BTB60  
**GitHub**: [@BTB60](https://github.com/BTB60)  
**Email**: [email@example.com](mailto:email@example.com)

---

⭐ **Bu layihəni bəyəndinizsə, star verməyi unutmayın!** ⭐

</div>

---

<div align="center">

**POS Sistem** - Modern və funksional satış nöqtəsi idarəetmə sistemi

*Son yeniləmə: 2024*

</div>
