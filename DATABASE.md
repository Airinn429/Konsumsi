# Database Prisma - Dokumentasi

## 📚 Overview
Database aplikasi konsumsi DEMPLON menggunakan Prisma ORM dengan PostgreSQL.

## 🗄️ Database Schema

### Tables:

#### 1. **User** - Data pengguna/pegawai
- `id` (Int) - Primary key, auto increment
- `username` (String) - Username unik untuk login
- `passwordHash` (String) - Password yang sudah di-hash (bcrypt)
- `name` (String) - Nama lengkap user
- `email` (String?) - Email (unique)
- `role` (String) - Role user (user, admin)
- `createdAt` (DateTime) - Waktu pembuatan
- `updatedAt` (DateTime) - Waktu update terakhir

#### 2. **Order** - Data pesanan konsumsi
- `id` (Int) - Primary key, auto increment
- `orderNumber` (String) - Nomor order unik (ORD-001, ORD-002, dll)
- `userId` (Int) - Foreign key ke User
- `userName` (String) - Nama pembuat order
- `tanggal` (String) - Tanggal acara
- `jamMulai` (String) - Jam mulai acara
- `jamSelesai` (String) - Jam selesai acara
- `jumlahPeserta` (Int) - Jumlah peserta
- `jenisAcara` (String) - Jenis acara (Rapat, Pelatihan, dll)
- `tempatPelaksana` (String) - Lokasi acara
- `keterangan` (String?) - Keterangan tambahan
- `status` (String) - Status order (pending, approved, cancelled)
- `createdAt` (DateTime) - Waktu pembuatan
- `updatedAt` (DateTime) - Waktu update terakhir
- `cancelledAt` (DateTime?) - Waktu pembatalan
- `cancelReason` (String?) - Alasan pembatalan

#### 3. **OrderItem** - Item dalam pesanan
- `id` (Int) - Primary key, auto increment
- `orderId` (Int) - Foreign key ke Order
- `itemName` (String) - Nama menu/item
- `quantity` (Int) - Jumlah
- `unit` (String) - Satuan (Porsi, Paket, dll)
- `notes` (String?) - Catatan khusus

#### 4. **MenuItem** - Template menu (opsional)
- `id` (Int) - Primary key, auto increment
- `name` (String) - Nama menu
- `category` (String) - Kategori (Makanan Utama, Snack, Minuman)
- `unit` (String) - Satuan
- `isActive` (Boolean) - Status aktif
- `createdAt` (DateTime) - Waktu pembuatan
- `updatedAt` (DateTime) - Waktu update terakhir

## 🚀 Commands

### Development:
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name nama_migrasi

# Reset database (HATI-HATI!)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio
```

### Production:
```bash
# Apply migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## 📡 API Endpoints

### Authentication:
- `POST /api/auth/login` - Login user

### Orders:
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PATCH /api/orders/[id]` - Update order (status, cancel)

### Users:
- `GET /api/users/[username]` - Get user by username

## 💾 Sample Data

Database sudah terisi dengan data awal:

### Users:
- **admin** / Administrator (role: admin)
- **nadia** / Nadia Addnan (role: user)

### Menu Items:
- Nasi Kotak, Nasi Tumpeng (Makanan Utama)
- Snack Box, Kue Tradisional (Snack)
- Air Mineral, Teh/Kopi, Jus Buah (Minuman)

### Sample Order:
- ORD-001 oleh Nadia Addnan
- Rapat Internal, 30 peserta
- Items: Nasi Kotak, Air Mineral, Snack Box

## 🔍 Prisma Studio

Untuk membuka GUI database:
```bash
npx prisma studio
```

Akan membuka browser di `http://localhost:5555` untuk mengelola data secara visual.

## 📝 Usage Example

```typescript
import { prisma } from '@/lib/prisma';

// Get all orders
const orders = await prisma.order.findMany({
  include: {
    items: true,
    user: true,
  },
});

// Create new order
const order = await prisma.order.create({
  data: {
    orderNumber: 'ORD-002',
    userId: 1,
    userName: 'Admin',
    tanggal: '2025-11-20',
    jamMulai: '10:00',
    jamSelesai: '14:00',
    jumlahPeserta: 50,
    jenisAcara: 'Workshop',
    tempatPelaksana: 'Aula',
    items: {
      create: [
        {
          itemName: 'Nasi Kotak',
          quantity: 50,
          unit: 'Porsi',
        },
      ],
    },
  },
});

// Update order status
const updated = await prisma.order.update({
  where: { id: 1 },
  data: {
    status: 'approved',
  },
});

// Cancel order
const cancelled = await prisma.order.update({
  where: { id: 1 },
  data: {
    status: 'cancelled',
    cancelledAt: new Date(),
    cancelReason: 'Acara dibatalkan',
  },
});
```

## 🔒 Environment Variables

File `.env`:
```
DATABASE_URL="your-database-url"
```

## 📦 Files Structure

```
prisma/
  ├── schema.prisma      # Database schema
  ├── seed.ts           # Seed file
  └── migrations/       # Migration files
src/
  ├── lib/
  │   └── prisma.ts     # Prisma client instance
  └── pages/
      └── api/
          ├── auth/
          │   └── login.ts
          ├── orders/
          │   ├── index.ts
          │   └── [id].ts
          └── users/
              └── [username].ts
```

## ⚠️ Important Notes

1. **Development Mode**: API login saat ini menerima username apa saja dan otomatis membuat user baru
2. **Production**: Implementasikan proper authentication dengan password hashing (bcrypt)
3. **Database Backup**: Selalu backup database sebelum menjalankan migration
4. **Seed Data**: Gunakan hanya untuk development, jangan di production

## 🛠️ Troubleshooting

### Error: "Can't reach database server"
- Pastikan DATABASE_URL di `.env` sudah benar
- Cek koneksi internet untuk Prisma Accelerate

### Error: "Table doesn't exist"
- Jalankan: `npx prisma migrate dev`

### Error: "Prisma Client not generated"
- Jalankan: `npx prisma generate`

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
