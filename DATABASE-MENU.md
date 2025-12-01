# Database Menu Documentation

## 📊 Tabel Baru yang Ditambahkan

### 1. **Tabel `SesiWaktu`**
Menyimpan data sesi waktu untuk pemesanan konsumsi.

**Struktur:**
```prisma
model SesiWaktu {
  id        String   @id
  nama      String   @unique
  urutan    Int?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Data yang tersimpan:**
- Pagi (urutan: 1)
- Siang (urutan: 2)
- Sore (urutan: 3)
- Malam (urutan: 4)
- Sahur (urutan: 5)
- Buka Puasa (urutan: 6)
- Snack Malam (urutan: 7)
- Tengah Malam (urutan: 8)

---

### 2. **Tabel `Menu`**
Menyimpan data menu konsumsi berdasarkan sesi waktu.

**Struktur:**
```prisma
model Menu {
  id          String   @id
  nama        String
  sesiWaktu   String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([nama, sesiWaktu])
}
```

**Constraint:**
- Kombinasi `nama` dan `sesiWaktu` harus unik (satu menu bisa muncul di beberapa sesi waktu)

---

## 📋 Data Menu yang Tersimpan

### **Menu Pagi** (31 items)
Ayam Goreng, Anggur, Air Mineral, Snack Kering, Snack Pagi, GKT, Ketupat Lebaran, Permen, Mie Instan, Teh Sariwangi, Nescafe, Roti Manis, Snack Box, Kopi Kapal Api Special Mix, Indocafe Coffemix, Paket Sembako, Buah-Buahan, Creamer, Teh Celup, Milo, Telor Rebus, Jamuan Diluar Kawasan, Susu Ultra, Jeruk Manis, Pisang Sunpride, Nasi Putih/Timbel, Sate Maranggi Sapi, Parasmanan, Pocari Sweat, Teh Kotak, Aneka Pepes

### **Menu Siang** (33 items)
Nasi Box, Prasmanan, Ayam Goreng, Anggur, Air Mineral, Snack Kering, Snack Pagi, GKT, Ketupat Lebaran, Permen, Mie Instan, Teh Sariwangi, Nescafe, Roti Manis, Snack, Kopi Kapal Api Special Mix, Indocafe Coffemix, Paket Sembako, Buah-Buahan, Creamer, Teh Celup, Milo, Telor Rebus, Jamuan Diluar Kawasan, Susu Ultra, Jeruk Manis, Pisang Sunpride, Nasi Putih/Timbel, Sate Maranggi Sapi, Parasmanan, Pocari Sweat, Teh Kotak, Aneka Pepes

### **Menu Sore** (33 items)
Snack Box, Coffee Break, Ayam Goreng, Anggur, Air Mineral, Snack Kering, Snack Pagi, GKT, Ketupat Lebaran, Permen, Mie Instan, Teh Sariwangi, Nescafe, Roti Manis, Snack, Kopi Kapal Api Special Mix, Indocafe Coffemix, Paket Sembako, Buah-Buahan, Creamer, Teh Celup, Milo, Telor Rebus, Jamuan Diluar Kawasan, Susu Ultra, Jeruk Manis, Pisang Sunpride, Nasi Putih/Timbel, Sate Maranggi Sapi, Parasmanan, Pocari Sweat, Teh Kotak, Aneka Pepes

### **Menu Malam** (33 items)
Nasi Box, Prasmanan, Ayam Goreng, Anggur, Air Mineral, Snack Kering, Snack Pagi, GKT, Ketupat Lebaran, Permen, Mie Instan, Teh Sariwangi, Nescafe, Roti Manis, Snack, Kopi Kapal Api Special Mix, Indocafe Coffemix, Paket Sembako, Buah-Buahan, Creamer, Teh Celup, Milo, Telor Rebus, Jamuan Diluar Kawasan, Susu Ultra, Jeruk Manis, Pisang Sunpride, Nasi Putih/Timbel, Sate Maranggi Sapi, Parasmanan, Pocari Sweat, Teh Kotak, Aneka Pepes

### **Menu Sahur** (5 items)
Nasi Box, Ayam Gorenng, Sate Maranggi Sapi, Air Mineral, Buah-buahan

### **Menu Buka Puasa** (3 items)
Nasi Box, Prasmanan, Takjil

### **Menu Snack Malam** (3 items)
Snack Box, Nescafe, Kopi

### **Menu Tengah Malam** (4 items)
Nasi Box, Nescafe, Kopi, Ayam Goreng

---

## 🔍 Query Examples

### Mendapatkan semua menu untuk sesi tertentu
```typescript
const menuPagi = await prisma.menu.findMany({
  where: { 
    sesiWaktu: "Pagi",
    isActive: true 
  },
  orderBy: { nama: 'asc' }
});
```

### Mendapatkan semua sesi waktu
```typescript
const sesiWaktu = await prisma.sesiWaktu.findMany({
  where: { isActive: true },
  orderBy: { urutan: 'asc' }
});
```

### Mendapatkan menu dengan sesi waktu
```typescript
const menuWithSesi = await prisma.menu.findMany({
  where: { isActive: true },
  select: {
    id: true,
    nama: true,
    sesiWaktu: true
  }
});
```

### Mencari menu berdasarkan nama
```typescript
const menu = await prisma.menu.findMany({
  where: {
    nama: {
      contains: "Nasi Box",
      mode: 'insensitive'
    },
    isActive: true
  }
});
```

---

## 📈 Statistik Data

- **Total Sesi Waktu:** 8
- **Total Menu:** 145 items
- **Menu Terbanyak:** Siang, Sore, Malam (masing-masing 33 items)
- **Menu Tersedikit:** Buka Puasa (3 items)

---

## ⚙️ Maintenance

### Menambah Menu Baru
```typescript
await prisma.menu.create({
  data: {
    id: randomUUID(),
    nama: "Nama Menu Baru",
    sesiWaktu: "Pagi"
  }
});
```

### Menonaktifkan Menu
```typescript
await prisma.menu.update({
  where: { id: "menu_id" },
  data: { isActive: false }
});
```

### Menambah Sesi Waktu Baru
```typescript
await prisma.sesiWaktu.create({
  data: {
    id: randomUUID(),
    nama: "Sesi Baru",
    urutan: 9
  }
});
```

---

## 🔄 Migration

Migration file: `prisma/migrations/20251201104310_add_menu_and_sesi_waktu_tables/migration.sql`

Status: ✅ Applied via `prisma db push`

---

## 📝 Notes

- Data seed sudah dijalankan dan tersimpan di database
- Constraint unique pada kombinasi (nama, sesiWaktu) memastikan tidak ada duplikasi menu pada sesi yang sama
- Field `isActive` memungkinkan soft delete untuk menu yang tidak lagi tersedia
- Field `urutan` pada SesiWaktu memudahkan sorting tampilan sesi waktu
