# 🔐 Fitur Login - DEMPLON

## 📋 Overview

Fitur login telah ditambahkan ke aplikasi DEMPLON dengan desain yang konsisten menggunakan tema violet-fuchsia gradient. Halaman login dilengkapi dengan animasi, validasi form, dan sistem autentikasi berbasis localStorage.

---

## 🎨 Desain & Tampilan

### Tema Konsisten
- ✅ **Gradient Violet-Fuchsia**: Sama seperti halaman Konsumsi
- ✅ **Animasi Smooth**: Menggunakan Framer Motion
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Dark Mode Support**: Otomatis mengikuti system preference
- ✅ **Background Animated**: Blob animations untuk efek visual

### Komponen UI
- 🎯 Logo dengan icon Lock di tengah card
- 🎨 Gradient background dengan animated blobs
- ✨ Konfeti animation saat login berhasil
- 🔒 Toggle show/hide password
- ⚠️ Error messages dengan icon
- 🎭 Loading state dengan spinner

---

## 📁 File yang Dibuat

### 1. **`/src/pages/login.tsx`**
Halaman utama login dengan fitur:
- Form login (username & password)
- Validasi input
- Toggle show/hide password
- Remember me checkbox
- Forgot password link
- Loading state & error handling
- Konfeti animation saat berhasil login
- Redirect otomatis ke home setelah login

### 2. **`/src/contexts/AuthContext.tsx`**
Context untuk manajemen state authentication:
- `isAuthenticated`: Status login user
- `username`: Nama user yang login
- `login()`: Fungsi untuk login
- `logout()`: Fungsi untuk logout
- Auto-load session dari localStorage

### 3. **`/src/components/ProtectedRoute.tsx`**
Component untuk proteksi route/halaman:
- Cek authentication status
- Redirect ke `/login` jika belum login
- Loading state saat validasi

---

## 🚀 Cara Menggunakan

### 1. **Akses Halaman Login**
```
http://localhost:3000/login
```

### 2. **Login Credentials (Development Mode)**
Saat ini sistem dalam mode development, jadi **username dan password apa saja akan diterima**.

Contoh:
- Username: `admin`
- Password: `admin123`

**ATAU**
- Username: `user`
- Password: `password`

> ⚠️ **PENTING**: Sebelum production, ganti logic login di `login.tsx` dengan API call ke backend yang sebenarnya!

### 3. **Setelah Login Berhasil**
- Konfeti animation muncul 🎉
- Otomatis redirect ke halaman home
- Session tersimpan di localStorage
- Tidak perlu login lagi sampai logout

---

## 🔧 Integrasi ke Halaman Lain

### Cara 1: Menggunakan ProtectedRoute Component

Wrap halaman yang perlu proteksi dengan `ProtectedRoute`:

```tsx
// Di file halaman (contoh: /pages/konsumsi/index.tsx)
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ConsumptionOrderPage() {
    return (
        <ProtectedRoute>
            {/* Konten halaman di sini */}
            <div>...</div>
        </ProtectedRoute>
    );
}
```

### Cara 2: Menggunakan AuthContext

```tsx
import { useAuth } from "@/contexts/AuthContext";

export default function SomePage() {
    const { isAuthenticated, username, logout } = useAuth();

    if (!isAuthenticated) {
        return <div>Redirecting...</div>;
    }

    return (
        <div>
            <p>Welcome, {username}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

---

## 🔐 Menambahkan Tombol Logout

### Di Navbar/Sidebar

Tambahkan tombol logout di `TopNavbar` atau `AppSidebar`:

```tsx
import { useRouter } from 'next/router';

function TopNavbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        router.push('/login');
    };

    return (
        <nav>
            {/* ... */}
            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}
```

---

## 🛠️ Kustomisasi

### Mengubah Logo
Edit di `/src/pages/login.tsx` line ~134:
```tsx
<Lock className="w-10 h-10 text-white" />
// Ganti dengan logo perusahaan
```

### Mengubah Warna Gradient
Edit di `/src/pages/login.tsx`:
```tsx
// Background gradient
className="bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50"

// Button gradient
className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
```

### Menambah Field Login (contoh: Email)
```tsx
<div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
    />
</div>
```

---

## 🔗 Integrasi dengan Backend API

Untuk production, ganti logic login di `handleSubmit` function:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
        // API call ke backend
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login gagal');
        }

        const data = await response.json();

        // Simpan token JWT atau session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', data.username);
        localStorage.setItem('token', data.token); // JWT token

        // Konfeti & redirect
        setShowConfetti(true);
        setTimeout(() => router.push('/'), 2000);

    } catch (err) {
        setError('Username atau password salah');
    } finally {
        setIsLoading(false);
    }
};
```

---

## 📊 Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ Akses halaman
       ▼
┌─────────────────┐
│  Check Session  │
│  (localStorage) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ Sudah  │ │  Belum   │
│ Login  │ │  Login   │
└───┬────┘ └────┬─────┘
    │           │
    │           ▼
    │    ┌────────────┐
    │    │   /login   │
    │    └──────┬─────┘
    │           │
    │           │ Submit credentials
    │           ▼
    │    ┌────────────┐
    │    │  Validasi  │
    │    └──────┬─────┘
    │           │
    │      ┌────┴────┐
    │      │         │
    │      ▼         ▼
    │   ┌──────┐  ┌──────┐
    │   │ OK   │  │ Gagal│
    │   └──┬───┘  └──┬───┘
    │      │         │
    │      │         └─────► Error message
    │      │
    │      ▼
    │   ┌────────────┐
    │   │   Konfeti  │
    │   │  Animation │
    │   └──────┬─────┘
    │          │
    └──────────┴──────────┐
                          │
                          ▼
                   ┌──────────────┐
                   │  Home Page   │
                   │  (Protected) │
                   └──────────────┘
```

---

## 🧪 Testing Checklist

### Fungsional
- [ ] Login dengan credentials valid berhasil
- [ ] Login dengan credentials invalid ditolak
- [ ] Error message muncul saat field kosong
- [ ] Toggle show/hide password berfungsi
- [ ] Loading state muncul saat proses login
- [ ] Konfeti animation muncul saat berhasil
- [ ] Redirect ke home setelah login
- [ ] Session tersimpan di localStorage
- [ ] Tidak perlu login ulang setelah refresh

### UI/UX
- [ ] Responsive di mobile, tablet, desktop
- [ ] Dark mode berfungsi dengan baik
- [ ] Animasi smooth dan tidak lag
- [ ] Button hover effects working
- [ ] Background animated blobs berjalan
- [ ] Font size readable di semua device

### Security (untuk production)
- [ ] Password tidak terlihat di network tab
- [ ] HTTPS only
- [ ] JWT token disimpan dengan aman
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting untuk prevent brute force

---

## 🔒 Security Best Practices

### Untuk Production:

1. **Gunakan HTTPS**: Selalu gunakan SSL/TLS
2. **JWT Token**: Gunakan token dengan expiry time
3. **HTTP-Only Cookies**: Lebih aman dari localStorage
4. **Password Hashing**: Bcrypt/Argon2 di backend
5. **Rate Limiting**: Cegah brute force attacks
6. **2FA**: Two-factor authentication (opsional)
7. **Session Timeout**: Auto logout setelah idle
8. **Secure Headers**: CSP, X-Frame-Options, etc.

### Contoh dengan JWT:
```tsx
// Login
const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });

// Verify
const decoded = jwt.verify(token, SECRET_KEY);
```

---

## 🎯 Next Steps

### Prioritas 1 (Harus):
1. ✅ Halaman login sudah dibuat
2. ⏳ Integrasikan dengan backend API
3. ⏳ Tambah tombol logout di navbar
4. ⏳ Protect semua halaman dengan ProtectedRoute

### Prioritas 2 (Optional):
5. ⏳ Halaman forgot password
6. ⏳ Halaman register (jika diperlukan)
7. ⏳ Profile page
8. ⏳ Change password feature
9. ⏳ Session management (auto logout)
10. ⏳ Login history / audit log

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek console browser untuk error messages
2. Cek localStorage di DevTools (Application tab)
3. Pastikan semua dependencies terinstall: `npm install`
4. Restart development server: `npm run dev`

---

## 📝 Changelog

### v1.0.0 (2025-11-05)
- ✨ Initial release
- 🎨 Login page dengan gradient theme
- 🔐 LocalStorage authentication
- 📱 Responsive design
- 🌙 Dark mode support
- 🎉 Konfeti animation
- 🛡️ ProtectedRoute component
- 🔄 AuthContext untuk state management

---

**Dibuat dengan ❤️ untuk DEMPLON**
