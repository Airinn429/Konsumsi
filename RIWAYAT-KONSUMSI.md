# 📋 Dokumentasi Logika Riwayat Pengajuan Konsumsi

## 🎯 Tujuan
Sistem riwayat dirancang untuk menyimpan setiap pengajuan konsumsi secara **persisten** (permanen) di browser, sehingga data tidak hilang meskipun:
- Browser ditutup ✅
- Halaman di-refresh ✅
- Komputer di-restart ✅
- Tab ditutup dan dibuka kembali ✅

## 🔧 Teknologi yang Digunakan
- **localStorage API** - Penyimpanan data di browser secara persisten
- **React useState** - State management untuk data riwayat
- **React useEffect** - Auto-save setiap perubahan data

## 📊 Struktur Data

### Order Interface
```typescript
interface Order {
  id: string;                    // ID unik (ORD12345)
  kegiatan: string;              // Nama kegiatan
  tanggalPermintaan: Date;       // Tanggal permintaan dibuat
  tanggalPengiriman: Date;       // Tanggal pengiriman konsumsi
  untukBagian: string;           // Departemen/bagian
  yangMengajukan: string;        // Nama pengaju
  noHp: string;                  // Nomor HP
  namaApprover: string;          // Nama approver
  tipeTamu: string;              // Tipe tamu (Internal/Eksternal)
  keterangan: string;            // Keterangan tambahan
  items: ConsumptionItemData[];  // Detail item konsumsi
  status: OrderStatus;           // Status: Pending/Approved/Rejected
}
```

### ConsumptionItemData Interface
```typescript
interface ConsumptionItemData {
  lokasiPengiriman: string;  // Lokasi pengiriman
  sesiWaktu: string;         // Sesi waktu (Pagi/Siang/Sore)
  waktu: string;             // Waktu spesifik
  jenisKonsumsi: string;     // Jenis makanan/minuman
  qty: number;               // Jumlah
  satuan: string;            // Satuan (Porsi/Box/Pax)
}
```

## 🔄 Alur Kerja (Workflow)

### 1. **Inisialisasi - Load Data dari localStorage**
```typescript
const [history, setHistory] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
        const savedHistory = localStorage.getItem('consumptionOrderHistory');
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            return parsed.map((order: Order) => ({
                ...order,
                tanggalPengiriman: new Date(order.tanggalPengiriman),
                tanggalPermintaan: new Date(order.tanggalPermintaan)
            }));
        }
    }
    return [];
});
```

**Penjelasan:**
- ✅ Cek apakah `window` tersedia (server-side rendering safe)
- ✅ Ambil data dari `localStorage` dengan key `'consumptionOrderHistory'`
- ✅ Parse JSON string menjadi array object
- ✅ Convert string tanggal kembali ke Date object
- ✅ Return array kosong jika tidak ada data

**Console Output:**
```
📂 Memuat riwayat dari localStorage: 5 items
✅ Riwayat berhasil dimuat
```

### 2. **Submit Pengajuan Baru**
```typescript
const handleFormSubmit = (newOrder: Order) => { 
    setHistory(prev => [newOrder, ...prev]);
};
```

**Flow:**
1. User mengisi form pengajuan
2. User klik "Review Pesanan"
3. User review data di dialog
4. User klik "Konfirmasi Pesanan"
5. Sistem generate ID unik: `ORD12345`
6. Sistem buat object `newOrder` dengan semua data
7. Sistem panggil `handleFormSubmit(newOrder)`
8. State `history` update dengan order baru di posisi pertama
9. Auto-save ke localStorage (via useEffect)

**Console Output:**
```
📝 Menambahkan pesanan baru: { id: "ORD12345", ... }
📦 Total pesanan sekarang: 6
💾 Menyimpan riwayat ke localStorage: 6 items
✅ Riwayat berhasil disimpan
```

### 3. **Auto-Save ke localStorage**
```typescript
useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
        localStorage.setItem('consumptionOrderHistory', JSON.stringify(history));
    }
}, [history]);
```

**Penjelasan:**
- ✅ Trigger setiap kali `history` berubah
- ✅ Cek ketersediaan `window` dan `history` tidak kosong
- ✅ Serialize array menjadi JSON string
- ✅ Simpan ke localStorage dengan key `'consumptionOrderHistory'`

### 4. **Delete Order**
```typescript
const handleDelete = (order: Order) => { 
    setHistory(prev => prev.filter(item => item.id !== order.id)); 
};
```

**Flow:**
1. User klik "Delete" pada order tertentu
2. Sistem filter array, hapus order dengan ID matching
3. State `history` update
4. Auto-save ke localStorage

### 5. **Delete All (Filtered)**
```typescript
const handleDeleteAll = () => {
    const remainingOrders = history.filter(order => !filteredHistory.includes(order));
    setHistory(remainingOrders);
};
```

**Penjelasan:**
- ✅ Hanya hapus order yang **terlihat** di filter saat ini
- ✅ Order yang tidak terfilter tetap tersimpan
- ✅ Contoh: Filter "Pending" → Delete All → Hanya Pending yang dihapus

## 🎨 Fitur Riwayat

### Filter Status
```typescript
const [activeStatusFilter, setActiveStatusFilter] = useState<OrderStatus | 'All'>('All');

const filteredHistory = useMemo(() => {
    let orders = history;
    
    // Filter by status
    if (activeStatusFilter !== 'All') {
        orders = orders.filter(order => order.status === activeStatusFilter);
    }
    
    return orders;
}, [history, activeStatusFilter]);
```

**Status Available:**
- 🟡 **All** - Tampilkan semua
- ⏳ **Pending** - Menunggu approval
- ✅ **Approved** - Disetujui
- ❌ **Rejected** - Ditolak

### Filter Tanggal
```typescript
const [date, setDate] = React.useState<DateRange | undefined>({ 
    from: new Date(), 
    to: undefined 
});

// Filter by date range
if (date?.from) {
    orders = orders.filter(order => {
        const orderDate = new Date(order.tanggalPengiriman);
        orderDate.setHours(0, 0, 0, 0);
        // Compare logic...
    });
}
```

### View Mode
- 🎴 **Grid View** - Card layout (default)
- 📋 **List View** - Table layout

### Pagination
- 📄 **6 items per page**
- ⬅️➡️ Navigation dengan nomor halaman

## 🔒 Data Persistence

### Keuntungan localStorage:
1. ✅ **Persistent** - Data tidak hilang saat browser ditutup
2. ✅ **Fast** - Akses data instant tanpa network request
3. ✅ **Simple** - No server setup required
4. ✅ **Privacy** - Data tersimpan lokal di device user

### Keterbatasan localStorage:
1. ⚠️ **Device-specific** - Data tidak sync antar device
2. ⚠️ **Browser-specific** - Chrome vs Firefox = beda storage
3. ⚠️ **Clear cache** - Data hilang jika user clear browser cache
4. ⚠️ **5-10MB limit** - Terbatas ukuran storage
5. ⚠️ **No backup** - Tidak ada cloud backup

## 🧪 Testing Checklist

### ✅ Test Scenario 1: Create & Persist
1. Buka aplikasi `/konsumsi`
2. Buat pengajuan baru
3. Submit form
4. **✅ Check**: Order muncul di riwayat
5. Close browser
6. Buka lagi `/konsumsi`
7. **✅ Check**: Order masih ada di riwayat

### ✅ Test Scenario 2: Multiple Orders
1. Buat 3 pengajuan berbeda
2. **✅ Check**: Semua 3 muncul di riwayat
3. Refresh halaman (F5)
4. **✅ Check**: Semua 3 masih ada

### ✅ Test Scenario 3: Delete Order
1. Klik delete pada 1 order
2. **✅ Check**: Order hilang dari list
3. Refresh halaman
4. **✅ Check**: Order tetap terhapus (tidak muncul lagi)

### ✅ Test Scenario 4: Filter
1. Buat order dengan status berbeda
2. Filter "Pending"
3. **✅ Check**: Hanya Pending yang muncul
4. Refresh halaman
5. **✅ Check**: Filter reset, semua muncul

### ✅ Test Scenario 5: Browser Storage
1. Buka Developer Tools (F12)
2. Go to Application → Local Storage
3. Find key: `consumptionOrderHistory`
4. **✅ Check**: Value berisi JSON array orders
5. Edit value manually (ubah status)
6. Refresh halaman
7. **✅ Check**: Perubahan terupdate di UI

## 🐛 Debugging

### Cara Cek Data di Browser:
```javascript
// Console Browser (F12)
localStorage.getItem('consumptionOrderHistory')

// Output:
'[{"id":"ORD12345","kegiatan":"Meeting","status":"Pending",...}]'
```

### Cara Hapus Data Manual:
```javascript
localStorage.removeItem('consumptionOrderHistory')
// atau
localStorage.clear()
```

### Console Logs:
Sistem menampilkan log otomatis:
```
📂 Memuat riwayat dari localStorage: 5 items
✅ Riwayat berhasil dimuat
📝 Menambahkan pesanan baru: {...}
📦 Total pesanan sekarang: 6
💾 Menyimpan riwayat ke localStorage: 6 items
✅ Riwayat berhasil disimpan
```

## 🚀 Upgrade Path (Future)

### Opsi 1: IndexedDB
- ✅ Storage lebih besar (>50MB)
- ✅ Support complex queries
- ✅ Better performance untuk large data

### Opsi 2: Backend API + Database
- ✅ Multi-device sync
- ✅ Cloud backup
- ✅ User authentication
- ✅ Real-time updates
- ✅ Admin dashboard

### Opsi 3: Firebase/Supabase
- ✅ Real-time sync
- ✅ User auth built-in
- ✅ No backend code needed
- ✅ Free tier available

## 📝 Summary

**Saat ini sistem menggunakan localStorage yang:**
- ✅ Menyimpan data secara **permanen** di browser
- ✅ Data **tidak hilang** saat browser ditutup
- ✅ **Instant access** tanpa loading
- ✅ **Simple** dan mudah di-maintain
- ⚠️ Terbatas pada device & browser yang sama
- ⚠️ Rentan terhadap clear cache

**Untuk production dengan multiple users, disarankan upgrade ke backend database.**

---

**Last Updated:** 28 Oktober 2025
**Version:** 1.0.0
