# 🔧 Troubleshooting: Login Auto-Redirect

## ❌ **Masalah:**
Login page langsung redirect ke konsumsi dalam beberapa detik tanpa harus login terlebih dahulu.

---

## 🔍 **Penyebab:**

Ada **2 kemungkinan penyebab utama**:

### 1. **localStorage Masih Menyimpan Session Lama**
```javascript
// localStorage masih ada data login dari session sebelumnya
localStorage.getItem('isLoggedIn') === 'true'
```
Ketika page load, aplikasi cek localStorage dan menemukan `isLoggedIn: true`, jadi langsung redirect ke konsumsi.

### 2. **Browser Cache Issue**
Browser menyimpan cache dari session sebelumnya.

---

## ✅ **Solusi:**

### **Solusi 1: Hapus localStorage (CEPAT)**

1. Buka aplikasi di browser
2. Tekan **F12** untuk buka Developer Tools
3. Klik tab **"Application"** (Chrome) atau **"Storage"** (Firefox)
4. Klik **"Local Storage"** di sidebar kiri
5. Klik `http://localhost:3000`
6. **Klik kanan → Clear** atau hapus key:
   - `isLoggedIn`
   - `username`
7. **Refresh page** (F5)

**Atau cepat via Console:**
```javascript
localStorage.clear();
location.reload();
```

---

### **Solusi 2: Clear Browser Cache**

#### Chrome/Edge:
1. Tekan **Ctrl + Shift + Delete**
2. Pilih **"Cached images and files"**
3. Klik **"Clear data"**
4. Refresh page

#### Firefox:
1. Tekan **Ctrl + Shift + Delete**
2. Pilih **"Cache"**
3. Klik **"Clear Now"**
4. Refresh page

---

### **Solusi 3: Hard Refresh**

Tekan kombinasi:
- **Windows**: `Ctrl + Shift + R` atau `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

---

### **Solusi 4: Incognito/Private Mode**

Buka aplikasi di mode incognito:
- **Chrome**: `Ctrl + Shift + N`
- **Firefox**: `Ctrl + Shift + P`
- **Edge**: `Ctrl + Shift + N`

Mode ini tidak menyimpan cache atau localStorage dari session sebelumnya.

---

## 🧪 **Testing:**

### Test Login Dari Awal:

1. **Hapus localStorage:**
   ```javascript
   localStorage.clear();
   ```

2. **Refresh page** (F5)

3. **Buka http://localhost:3000**
   - Expected: Redirect ke `/login` ✅

4. **Jangan isi form, tunggu beberapa detik**
   - Expected: TIDAK ada redirect otomatis ✅
   - Page tetap di login

5. **Isi username & password**
   - Username: `admin`
   - Password: `admin123`

6. **Klik "Masuk"**
   - Expected: Konfeti muncul
   - Redirect ke `/konsumsi` setelah 2 detik ✅

---

## 🔍 **Debug Mode:**

Untuk melihat apa yang terjadi di background:

### 1. Cek localStorage:
```javascript
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
console.log('username:', localStorage.getItem('username'));
```

### 2. Cek semua localStorage:
```javascript
console.log('All localStorage:', {...localStorage});
```

### 3. Monitor redirect:
```javascript
// Paste di Console untuk track redirect
const originalPush = window.history.pushState;
window.history.pushState = function() {
  console.log('Redirect to:', arguments[2]);
  return originalPush.apply(this, arguments);
};
```

---

## 🛠️ **Fix Permanent:**

Jika masalah tetap terjadi setelah clear localStorage, tambahkan button "Logout" di login page:

### Edit `src/pages/login.tsx`:

Tambahkan button di atas form:

```tsx
{/* Debug: Clear localStorage */}
<button
  type="button"
  onClick={() => {
    localStorage.clear();
    window.location.reload();
  }}
  className="text-xs text-red-500 underline"
>
  Clear Cache & Reload
</button>
```

---

## 🎯 **Prevention:**

Untuk mencegah masalah ini di masa depan:

### 1. **Logout Proper:**
Pastikan logout benar-benar menghapus localStorage:

```typescript
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.clear(); // Clear semua
  router.push('/login');
};
```

### 2. **Session Timeout:**
Tambah expiry time untuk auto-logout:

```typescript
// Saat login, simpan timestamp
localStorage.setItem('loginTime', Date.now().toString());

// Saat check auth, cek expiry (contoh: 24 jam)
const loginTime = localStorage.getItem('loginTime');
const currentTime = Date.now();
const twentyFourHours = 24 * 60 * 60 * 1000;

if (currentTime - parseInt(loginTime) > twentyFourHours) {
  // Session expired
  localStorage.clear();
  router.push('/login');
}
```

---

## 📋 **Checklist Debugging:**

- [ ] Clear localStorage via DevTools
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Test di Incognito mode
- [ ] Check console untuk error
- [ ] Verify localStorage kosong setelah logout
- [ ] Test login flow dari awal
- [ ] Confirm tidak ada auto-redirect tanpa login

---

## 🚨 **Jika Masalah Masih Ada:**

Hubungi developer dengan informasi:
1. Browser & version (Chrome 120, Firefox 115, etc.)
2. Screenshot console (F12)
3. Hasil dari: `console.log({...localStorage})`
4. Video recording masalahnya

---

## ✅ **Expected Behavior:**

```
1. Buka app → Redirect ke /login
2. Di /login → TIDAK ada auto-redirect
3. Isi form → Klik "Masuk"
4. Loading → Konfeti → Redirect ke /konsumsi
5. Di /konsumsi → Bisa akses app
6. Refresh → Tetap di /konsumsi (session saved)
7. Logout → Kembali ke /login
```

---

**Silakan coba Solusi 1 terlebih dahulu (Clear localStorage)!**
