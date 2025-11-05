# 🚫 Fitur Pembatalan Pesanan

## 📋 Overview
Fitur pembatalan pesanan memungkinkan user untuk membatalkan pesanan yang masih berstatus **Pending**. Pesanan yang dibatalkan tidak akan dihapus, tetapi statusnya akan diubah menjadi **"Dibatalkan"** dan akan tercatat dalam riwayat timeline.

## ✨ Fitur Utama

### 1. Status "Dibatalkan" (Cancelled)
- Pesanan yang dibatalkan akan memiliki status **Cancelled**
- Ditampilkan dengan badge warna abu-abu
- Icon: `XCircle` 
- Label: "Dibatalkan"

### 2. Riwayat Pembatalan
Setiap pembatalan pesanan akan tercatat dengan informasi:
- ✅ **Tanggal & waktu pembatalan** (`tanggalPembatalan`)
- ✅ **Alasan pembatalan** (`alasanPembatalan`) - default: "Dibatalkan oleh pengguna"
- ✅ **Timeline event** - Muncul di detail pesanan

### 3. Filter Tab "Dibatalkan"
- Tab baru di filter status untuk melihat semua pesanan yang dibatalkan
- Icon: `X`
- Menghitung jumlah pesanan dengan status Cancelled

## 🎯 Cara Menggunakan

### Membatalkan Pesanan
1. Buka detail pesanan dengan status **Pending**
2. Klik tombol **"Batalkan Pesanan Ini"** (merah)
3. Konfirmasi pembatalan pada dialog
4. Pesanan akan berubah status menjadi **Dibatalkan**

### Melihat Riwayat Pembatalan
1. Klik tab **"Dibatalkan"** di filter status
2. Atau buka detail pesanan yang sudah dibatalkan
3. Lihat timeline untuk melihat kapan pembatalan dilakukan

## 🔒 Aturan & Batasan

### Kapan Pesanan Bisa Dibatalkan?
✅ **BISA dibatalkan:**
- Status: **Pending** (Menunggu approval)

❌ **TIDAK BISA dibatalkan:**
- Status: **Approved** (Sudah disetujui)
- Status: **Rejected** (Sudah ditolak)
- Status: **Cancelled** (Sudah dibatalkan)

### Tombol yang Tersedia per Status

| Status | Tombol Detail | Tombol Hapus | Tombol Batalkan |
|--------|---------------|--------------|-----------------|
| **Pending** | ✅ | ✅ | ✅ |
| **Approved** | ✅ | ❌ | ❌ |
| **Rejected** | ✅ | ❌ | ❌ |
| **Cancelled** | ✅ | ❌ | ❌ |
| **Draft** | ✅ | ✅ | ❌ |

## 💾 Persistence (localStorage)

Pesanan yang dibatalkan akan **tetap tersimpan** di localStorage dengan struktur:
```json
{
  "id": "ORD12345",
  "status": "Cancelled",
  "tanggalPembatalan": "2025-11-05T10:30:00.000Z",
  "alasanPembatalan": "Dibatalkan oleh pengguna",
  ...
}
```

Data tidak akan hilang meskipun:
- Browser ditutup ✅
- Halaman di-refresh ✅
- Komputer di-restart ✅

## 📊 Interface & Types

### Updated OrderStatus
```typescript
type OrderStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Cancelled';
```

### Updated Order Interface
```typescript
interface Order {
  id: string;
  kegiatan: string;
  tanggalPengiriman: Date;
  status: OrderStatus;
  tanggalPermintaan: Date;
  untukBagian: string;
  yangMengajukan: string;
  noHp: string;
  namaApprover: string;
  tipeTamu: string;
  keterangan: string;
  items: ConsumptionItemData[];
  tanggalPembatalan?: Date;      // [BARU] Timestamp pembatalan
  alasanPembatalan?: string;     // [BARU] Alasan pembatalan
}
```

## 🎨 UI Components

### Status Badge
```tsx
case 'Cancelled':
  return { 
    icon: XCircle, 
    text: 'Dibatalkan', 
    color: 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30' 
  };
```

### Timeline Event
Saat pesanan dibatalkan, timeline akan menampilkan:
```
📝 Pesanan Dibuat oleh [Nama User]
   [Tanggal Permintaan]

❌ Dibatalkan oleh pengguna
   [Tanggal Pembatalan]
```

### Dialog Konfirmasi Pembatalan
```tsx
<Dialog>
  <DialogHeader>
    <DialogTitle>Anda Yakin?</DialogTitle>
    <DialogDescription>
      Tindakan ini akan membatalkan pesanan dengan ID {order.id}. 
      Anda tidak dapat mengurungkan tindakan ini.
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button variant="outline">Tutup</Button>
    <Button onClick={() => handleCancelOrder(order)}>
      Ya, Batalkan Pesanan
    </Button>
  </DialogFooter>
</Dialog>
```

## 🔧 Functions

### handleCancelOrder
```typescript
const handleCancelOrder = (order: Order) => {
  // Update status menjadi Cancelled dan tambahkan timestamp pembatalan
  setHistory(prev => prev.map(item => 
    item.id === order.id 
      ? { 
          ...item, 
          status: 'Cancelled' as OrderStatus,
          tanggalPembatalan: new Date(),
          alasanPembatalan: 'Dibatalkan oleh pengguna'
        } 
      : item
  ));
  setOrderDetails(null); // Menutup dialog
};
```

**Perbedaan dengan handleDelete:**
- ❌ `handleDelete`: Menghapus pesanan dari riwayat (permanent)
- ✅ `handleCancelOrder`: Mengubah status (tetap ada di riwayat)

## 📈 Future Improvements

Fitur yang bisa ditambahkan di masa depan:
1. 🗨️ **Custom reason input** - User bisa menulis alasan pembatalan sendiri
2. 📧 **Email notification** - Notifikasi pembatalan ke approver
3. 🔄 **Reaktivasi pesanan** - Kembalikan status dari Cancelled ke Pending
4. 📊 **Laporan pembatalan** - Statistik pembatalan per periode
5. 👤 **User tracking** - Catat siapa yang membatalkan

## 🧪 Testing Checklist

### ✅ Test Scenario: Pembatalan Normal
1. Buat pesanan baru (status: Pending)
2. Buka detail pesanan
3. Klik "Batalkan Pesanan Ini"
4. Konfirmasi pembatalan
5. **✅ Check**: Status berubah menjadi "Dibatalkan"
6. **✅ Check**: Timeline menampilkan event pembatalan
7. **✅ Check**: Tombol "Batalkan" hilang
8. **✅ Check**: Tombol "Hapus" hilang
9. Refresh halaman
10. **✅ Check**: Pesanan tetap ada dengan status Dibatalkan

### ✅ Test Scenario: Filter Dibatalkan
1. Batalkan beberapa pesanan
2. Klik tab "Dibatalkan" di filter
3. **✅ Check**: Hanya pesanan Cancelled yang muncul
4. **✅ Check**: Counter menampilkan jumlah yang benar

### ✅ Test Scenario: Persistence
1. Batalkan pesanan
2. Close browser
3. Buka kembali aplikasi
4. **✅ Check**: Pesanan masih berstatus Dibatalkan
5. **✅ Check**: Tanggal pembatalan tersimpan

## 📞 Support

Jika menemukan bug atau ada pertanyaan:
1. Cek console browser (F12) untuk error logs
2. Verifikasi data di localStorage (Application → Local Storage)
3. Pastikan menggunakan browser modern (Chrome, Firefox, Edge)

---

**Dibuat:** 5 November 2025  
**Versi:** 1.0.0
