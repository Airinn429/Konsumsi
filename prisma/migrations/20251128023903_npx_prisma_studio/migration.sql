/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cancelReason` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `jamMulai` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `jamSelesai` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `jenisAcara` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahPeserta` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tempatPelaksana` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kegiatan` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaApprover` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noHp` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalPengiriman` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalPermintaan` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `untukBagian` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yangMengajukan` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "cancelReason",
DROP COLUMN "cancelledAt",
DROP COLUMN "jamMulai",
DROP COLUMN "jamSelesai",
DROP COLUMN "jenisAcara",
DROP COLUMN "jumlahPeserta",
DROP COLUMN "tanggal",
DROP COLUMN "tempatPelaksana",
DROP COLUMN "userId",
DROP COLUMN "userName",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "kegiatan" TEXT NOT NULL,
ADD COLUMN     "kegiatanLainnya" TEXT,
ADD COLUMN     "namaApprover" TEXT NOT NULL,
ADD COLUMN     "noHp" TEXT NOT NULL,
ADD COLUMN     "tanggalPembatalan" TIMESTAMP(3),
ADD COLUMN     "tanggalPengiriman" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tanggalPermintaan" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tipeTamu" TEXT,
ADD COLUMN     "untukBagian" TEXT NOT NULL,
ADD COLUMN     "yangMengajukan" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'Pending',
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "OrderItem";

-- CreateTable
CREATE TABLE "ConsumptionItem" (
    "id" TEXT NOT NULL,
    "jenisKonsumsi" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "lokasiPengiriman" TEXT NOT NULL,
    "sesiWaktu" TEXT NOT NULL,
    "waktu" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "ConsumptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisKegiatan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisKegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bagian" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bagian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approver" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "jabatan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lokasi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lokasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisKonsumsi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT,
    "satuanDefault" TEXT NOT NULL DEFAULT 'Porsi',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisKonsumsi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JenisKegiatan_nama_key" ON "JenisKegiatan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Bagian_nama_key" ON "Bagian"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Approver_nip_key" ON "Approver"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Lokasi_nama_key" ON "Lokasi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "JenisKonsumsi_nama_key" ON "JenisKonsumsi"("nama");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumptionItem" ADD CONSTRAINT "ConsumptionItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
