# 🔐 Update: Login sebagai Halaman Terpisah

## ✅ Perubahan yang Dilakukan

Login sekarang menjadi **halaman terpisah** dan **gerbang utama** sebelum user bisa mengakses aplikasi.

---

## 🔄 Cara Kerja Baru

### **Flow Authentication:**

```
1. User buka aplikasi (http://localhost:3000)
                ↓
2. Cek: Sudah login? 
        ↓               ↓
      TIDAK            YA
        ↓               ↓
3. Redirect ke     Tampilkan
   /login          Konsumsi
        ↓
4. User login
        ↓
5. Redirect ke Konsumsi
```

---

## 📋 Aturan Akses

### ✅ **Halaman yang TIDAK Butuh Login:**
- `/login` - Halaman login

### 🔒 **Halaman yang BUTUH Login:**
- `/` - Home
- `/konsumsi` - Konsumsi
- `/pemesanan` - Pemesanan
- **Semua halaman lainnya**

---

## 🎯 Behavior Aplikasi

### Scenario 1: User Belum Login
```
User buka http://localhost:3000
     ↓
Otomatis redirect ke http://localhost:3000/login
     ↓
User harus login dulu
```

### Scenario 2: User Sudah Login
```
User buka http://localhost:3000
     ↓
Langsung tampil halaman Konsumsi
     ↓
User bisa akses semua halaman
```

### Scenario 3: User Sudah Login, Akses /login
```
User sudah login, tapi coba buka /login
     ↓
Otomatis redirect ke http://localhost:3000/konsumsi
     ↓
Tidak bisa akses login lagi
```

### Scenario 4: User Logout
```
User klik Logout di navbar
     ↓
Session dihapus dari localStorage
     ↓
Otomatis redirect ke /login
     ↓
Harus login lagi untuk akses aplikasi
```

---

## 🔧 Perubahan Teknis

### File yang Diupdate:

#### 1. **`src/pages/_app.tsx`** 
**Sebelum:**
```tsx
// Semua halaman langsung render dengan AppLayout
return (
  <AppLayout>
    <Component {...pageProps} />
  </AppLayout>
);
```

**Sesudah:**
```tsx
// Cek authentication dulu, baru render
useEffect(() => {
  const loggedIn = localStorage.getItem('isLoggedIn');
  
  if (!loggedIn && router.pathname !== '/login') {
    router.push('/login'); // Redirect ke login
  } else if (loggedIn === 'true' && router.pathname === '/login') {
    router.push('/konsumsi'); // Redirect ke konsumsi jika sudah login
  }
}, [router]);

// Login page tanpa AppLayout (navbar/sidebar)
if (router.pathname === '/login') {
  return <Component {...pageProps} />;
}

// Protected pages dengan AppLayout
return (
  <AppLayout>
    <Component {...pageProps} />
  </AppLayout>
);
```

**Fitur Baru:**
- ✅ Auto redirect ke `/login` jika belum login
- ✅ Auto redirect ke `/konsumsi` jika sudah login tapi akses `/login`
- ✅ Halaman login tanpa navbar/sidebar (fullscreen)
- ✅ Halaman lain dengan AppLayout (navbar/sidebar)
- ✅ Loading state saat check authentication
- ✅ Login langsung masuk ke halaman Konsumsi

---

## 🎨 Tampilan

### Login Page (Fullscreen):
```
┌─────────────────────────────┐
│                             │
│     [Background Animated]   │
│                             │
│    ┌────────────────┐       │
│    │   [Lock Icon]  │       │
│    │  Welcome Back  │       │
│    │                │       │
│    │  [Username]    │       │
│    │  [Password]    │       │
│    │  [Login Btn]   │       │
│    └────────────────┘       │
│                             │
└─────────────────────────────┘
```

### Home/Konsumsi (Dengan Navbar & Sidebar):
```
┌─────────────────────────────────────┐
│ [Navbar] User: Admin [Logout]      │
├─────────┬───────────────────────────┤
│[Sidebar]│                           │
│         │  Content (Konsumsi/Home)  │
│ - Home  │                           │
│ - Konsu │                           │
│ - etc   │                           │
└─────────┴───────────────────────────┘
```

---

## 🧪 Testing

### Test 1: Akses Tanpa Login
1. Hapus localStorage (F12 → Application → Clear)
2. Buka `http://localhost:3000`
3. **Expected**: Otomatis redirect ke `/login` ✅

### Test 2: Login Berhasil
1. Di halaman login, isi username & password
2. Klik "Masuk"
3. **Expected**: Konfeti muncul → Redirect ke /konsumsi ✅

### Test 3: Refresh Setelah Login
1. Login berhasil (di halaman konsumsi)
2. Refresh browser (F5)
3. **Expected**: Tetap di konsumsi, tidak redirect ke login ✅

### Test 4: Logout
1. Sudah login
2. Klik avatar → Logout
3. **Expected**: Redirect ke login, session hilang ✅

### Test 5: Akses Login Saat Sudah Login
1. Sudah login
2. Buka `http://localhost:3000/login`
3. **Expected**: Otomatis redirect ke /konsumsi ✅

### Test 6: Direct URL Protected Page
1. Belum login
2. Buka `http://localhost:3000/konsumsi`
3. **Expected**: Otomatis redirect ke login ✅

---

## 🔐 Security Flow

```
┌──────────────────┐
│ User Action      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check localStorage│
│ isLoggedIn?      │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  FALSE      TRUE
    │         │
    │         ▼
    │   ┌─────────────┐
    │   │ Allow Access│
    │   └─────────────┘
    │
    ▼
┌──────────────────┐
│ Redirect to      │
│ /login           │
└──────────────────┘
```

---

## 📝 Catatan Penting

### ✅ Yang Sudah Bekerja:
- Login sebagai gerbang utama
- Auto redirect jika belum login
- Session persistent (tidak perlu login ulang)
- Logout menghapus session
- Login page fullscreen (tanpa navbar/sidebar)
- Protected pages dengan layout lengkap

### ⚠️ Untuk Production:
1. Ganti localStorage dengan **JWT token**
2. Tambah **token expiry** (auto logout)
3. Implement **refresh token** mechanism
4. Add **HTTPS** enforcement
5. Add **rate limiting** untuk login
6. Implement **session timeout** (idle)

---

## 🎯 Next Steps (Opsional)

1. [ ] Tambah "Ingat Saya" functionality (persistent login)
2. [ ] Halaman "Forgot Password"
3. [ ] Session timeout (auto logout setelah 30 menit idle)
4. [ ] Login history/audit log
5. [ ] 2FA (Two-Factor Authentication)
6. [ ] Social login (Google, Microsoft, etc.)

---

## 🔄 Migration Guide

### Jika ada halaman baru yang perlu proteksi:

**Tidak perlu apa-apa!** Semua halaman otomatis protected kecuali `/login`.

### Jika ada halaman public (tidak perlu login):

Edit `_app.tsx` line 18:
```tsx
const publicRoutes = ['/login', '/about', '/contact']; // Tambah di sini
```

---

## 🐛 Troubleshooting

### Problem: Redirect loop (bolak-balik login-home)
**Solution**: Hapus localStorage dan restart browser
```javascript
localStorage.clear();
```

### Problem: Stuck di loading screen
**Solution**: Check console untuk error, pastikan router berfungsi

### Problem: Logout tidak berfungsi
**Solution**: Check TopNavbar, pastikan fungsi handleLogout terpanggil

---

**Update completed! Login sekarang halaman terpisah yang muncul sebelum konsumsi.** ✅
