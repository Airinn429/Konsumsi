// Menyimpan semua definisi tipe data agar bisa digunakan di berbagai komponen.


//export untuk status pemesan
export type OrderStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Cancelled';

//export untuk bagian approver
export type DuplicateStatus = 'NONE' | 'DUPLICATE_EVENT' | 'SAME_DEPT_DIFF_EVENT';

export interface ConsumptionItemData {
    jenisKonsumsi: string;
    qty: number;
    satuan: string;
    lokasiPengiriman: string;
    sesiWaktu: string;
    waktu: string;
}

export interface ConsumptionSubItem {
    id: string;
    jenisKonsumsi: string;
    qty: number | string;
    satuan: string;
}

export interface ConsumptionGroup {
    id: string;
    lokasiPengiriman: string;
    sesiWaktu: string;
    waktu: string;
    subItems: ConsumptionSubItem[];
}

export interface Order {
    id: string;
    orderNumber: string;
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
    tanggalPembatalan?: Date;
    alasanPembatalan?: string;
    alasanPenolakan?: string; // [BARU] Field opsional untuk alasan penolakan approver
}

export interface FormData {
    kegiatan: string;
    kegiatanLainnya: string;
    tanggalPermintaan: Date;
    tanggalPengiriman: Date;
    untukBagian: string;
    yangMengajukan: string;
    noHp: string;
    namaApprover: string;
    tipeTamu: string;
    keterangan: string;
    groups: ConsumptionGroup[];
}