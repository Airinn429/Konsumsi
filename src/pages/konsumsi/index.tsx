"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {Select} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import {
    Calendar as CalendarIcon,
    Loader2,
    ChevronDown,
    Plus,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    MapPin,
    Package,
    User,
    LayoutGrid,
    List,
    Building,
    Phone,
    FileText,
    X,
    FolderClock,
    BadgeCheck,
    ListTodo,
    CakeSlice,
    Truck,
    Activity,
    UserCheck,
    ChevronsUpDown,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CommandList } from "cmdk";

//tipe data
type OrderStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Cancelled';

interface ConsumptionItemData {
    jenisKonsumsi: string;
    qty: number;
    satuan: string;
    lokasiPengiriman: string;
    sesiWaktu: string;
    waktu: string;
}

// Struktur data untuk sub-item (Jenis Konsumsi)
interface ConsumptionSubItem {
    id: string;
    jenisKonsumsi: string;
    qty: number | string;
    satuan: string;
}

// [BARU] Struktur data untuk grup (Lokasi & Waktu)
interface ConsumptionGroup {
    id: string; // ID unik untuk grup
    lokasiPengiriman: string;
    sesiWaktu: string;
    waktu: string;
    subItems: ConsumptionSubItem[]; // Array dari item konsumsi
}


// UPDATED: Order interface (struktur data final) tetap sama
interface Order {
    id: string;
    orderNumber: string; //Order number from database (KSM-001, KSM-002, etc.)
    kegiatan: string;
    tanggalPengiriman: Date;
    status: OrderStatus;
    tanggalPermintaan: Date;
    untukBagian: string;
    yangMengajukan: string;
    noHp: string;
    namaApprover: string;
    tipeTamu: string; // [DIKEMBALIKAN]
    keterangan: string;
    items: ConsumptionItemData[]; // Tetap flat array
    tanggalPembatalan?: Date; // [BARU] Tanggal ketika pesanan dibatalkan
    alasanPembatalan?: string; // [BARU] Alasan pembatalan (opsional)
}

// [DIPERBAIKI] FormData sekarang menggunakan struktur grup yang baru
interface FormData {
    kegiatan: string;
    kegiatanLainnya: string;
    tanggalPermintaan: Date;
    tanggalPengiriman: Date;
    untukBagian: string;
    yangMengajukan: string;
    noHp: string;
    namaApprover: string;
    tipeTamu: string; // [DIKEMBALIKAN]
    keterangan: string;
    groups: ConsumptionGroup[]; // Mengganti 'items' menjadi 'groups'
}
// ... interface FormData selesai ...

// [BARU] Helper untuk format tanggal ke string "YYYY-MM-DD" (untuk value input type="date")
const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// ... const initialFormData ...
// Data diperbarui untuk mencocokkan tanggal saat ini agar filter berfungsi
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const sixDaysAgo = new Date(today);
sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
const eightDaysAgo = new Date(today);
eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);


eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);


// [DIPERBAIKI] initialFormData disesuaikan dengan struktur 'groups' dan 'subItems'
const initialFormData: FormData = {
    kegiatan: '',
    kegiatanLainnya: '',
    tanggalPermintaan: new Date(),
    tanggalPengiriman: new Date(),
    untukBagian: 'Dep. Teknologi Informasi PKC (C001370000)',
    yangMengajukan: typeof window !== 'undefined' 
        ? (localStorage.getItem('name') || localStorage.getItem('username') || 'User')
        : 'User',
    noHp: '',
    namaApprover: 'Jojok Satriadi (1140122)',
    tipeTamu: '', // [DIKEMBALIKAN]
    keterangan: '',
    groups: [{
        id: `group-${Date.now()}`,
        lokasiPengiriman: '',
        sesiWaktu: '',
        waktu: '',
        subItems: [{
            id: `subitem-${Date.now()}`,
            jenisKonsumsi: '',
            qty: '',
            satuan: '',
        }]
    }],
};

const kegiatanOptions = ["Bahan Minum Karyawan", "Baporkes", "BK3N", "Extra Fooding", "Extra Fooding Shift", "Extra Fooding SKJ", "Festival Inovasi", "Halal Bi Halal", "Hari Guru", "Hari Raya Idu Adha", "Hari Raya Idul Fitri", "HUT PKC", "HUT RI", "Jamuan Diluar Kawasan", "Jamuan Tamu Perusahaan", "Jumat Bersih", "Kajian Rutin", "Ketupat Lebaran", "Konsumsi Buka Puasa", "Konsumsi Makan Sahur", "Konsumsi TA", "Lain-lain Jamuan Tamu", "Lain-lain Perayaan", "Lain-lain Rapat Kantor", "Lembur Perta", "Lembur Rutin", "Lembur Shutdown", "Not Defined", "Nuzurul Quran", "Open Storage", "Pengajian Keliling", "Pengantongan Akhir Tahun", "Pengembangan SDM", "PKM Masjid Nahlul Hayat", "Program Akhlak", "Program Makmur", "Program WMS", "Proper Emas", "Proyek Replacament K1A & NZE", "Rakor Direksi Anper PI Group", "Rapat Direksi", "Rapat Distribusi B", "Rapat Distribusi D", "Rapat Gabungan Dekom, Direksi, SVP", "Rapat Internal", "Rapat Komite Audit", "Rapat LKS Bipartit", "Rapat Monitoring Anper PKC", "Rapat Pra RUPS", "Rapat Tamu", "Rumah Tahfidz", "Safari Malam Takbiran", "Safari Ramadhan", "Shutdwon Pabrik", "SP2K", "Srikandi PKC", "Tablig Akbar", "Washing Pabrik"];

const bagianOptions = ["Teknologi Informasi"];

const approverOptions = [
    "Arief Darmawan (3072535)", "Anggita Maya Septianingsih (3082589)", "Agung Gustiawan (3092789)", 
    "Andika Arif Rachman (3082592)", "Ardhimas Yuda Baskoro (3042172)", "Amin Puji Hariyanto (3133210)", 
    "Andi Komara (3072517)", "Desra Heriman (3072531)", "Danang Siswantoro (3052402)", "Dady Rahman (3052404)", 
    "Dian Ramdani (3082628)", "Dede Sopian (3072524)", "Dian Risdiana (3072532)", "Dodi Pramadi (3972081)", 
    "Eka Priyatna (3102904)", "Fika Hikmaturrahman (3123195)", "Fajar Nugraha (3022134)", "Freddy Harianto (3072526)", 
    "Febri Rubragandi N (3052400)", "Flan Adi Nugraha Suhara (3052394)", "Gina Amarilis (3082590)", 
    "Henisya Permata Sari (3072498)", "Hikmat Rachmatullah (3072497)", "Handi Rustian (3072485)", 
    "Iswahyudi Mertosono (3082594)", "Indra Irianto (3022136)", "Ira Purnama Sari (3072489)", 
    "Ibrahim Herlambang (3072488)", "Jojok Satriadi (1140122)", "Jondra (3052403)", "Kholiq Iman Santoso (3253473)", 
    "Kasmadi (3072494)", "Lala (3072542)", "Luthfianto Ardian (3022127)", "Mohammad Arief Rachman (3932032)", 
    "Mulky Wahyudhy (3082590)", "Mita Yasmitahati (3072527)", "Mohammad Gani (3092756)", "Muhammad Ikhsan Anshori (3133237)", 
    "Muhammad Yudi Prasetyo (3072487)", "Muh. Arifin Hakim Nuryadin (3972097)", "Nugraha Agung Wibowo (3133236)", 
    "Probo Condrosari (3072490)", "Raden Sulistyo (3072491)", "R. Idho Pramana Sembada (3072545)", 
    "Rosy Indra Saputra (3072496)", "Refan Anggasatriya (3082597)", "Ronald Irwanto (3123084)", 
    "Rahayu Ginanjar Siwi (3123205)", "Shinta Narulita (3082579)", "Soni Ridho Atmaja (3082583)", 
    "Sundawa (3082583)", "Syarifudin (3052401)", "Toni Gunawan (3042442)", "Yoyon Daryono (3072495)", 
    "Yayan Taryana (3123091)", "Yara Budhi Widowati (3123084)", "Zaki Faishal Aziz (3042168)"
];

const tipeTamuOptions = ["PERTA", "Regular", "Standar", "VIP", "VVIP"]; 

const lokasiOptions = ["Bagging", "CCB", "Club House", "Departemen Riset", "Gedung 101-K", "Gedung Anggrek", " Gedung Bidding Center", "Gedung Contraction Office", "Gedung K3", "Gedung LC", "Gedung Maintanance Office", "Gedung Mawar", "Gedung Melati", "Gedung Purna Bhakti", "Gedung Pusat Administrasi", "Gedung RPK", "Gedung Saorga", "GH-B", "GH-C", "GPA Lt-3", "Gudang Bahan Baku", "Gudang Bulk Material", "Gedung Suku Cadang", "Jakarta", "Kantor SP2K", "Kebon Bibit", "Klinik PT HPH", "Kolam Pancing Type B", "Kolam Renang", "Kujang Kampioen Riset", "Laboraturium/Main Lab", "Lapang Basket Type B", "Lapang Futsal", "Lapang Sepak Bola Type E", "Lapang Tenis Type B", "Lapang Volly Type E", "Lapangan Helipad", "Lapangan Panahan", "Lapangan Volley", "Mekanik K1A", "Mekanik K1B", "Not Defined", "NPK-2", "Pos Selatan 01", "Posko Pengamanan Bawah", "Ruang Rapat NPK-1", "Ruang Rapat NPK-2", "Utility K-1A", "Wisma Kujang"];

const satuanOptions = ["Pax", "Box", "Porsi", "Unit", "Gelas"];

const sesiWaktuOptions = ["Pagi", "Siang", "Sore", "Malam", "Sahur", "Buka Puasa", "Snack Malam", "Tengah Malam"];
   

// Data untuk logika cascading
const menuByTime: Record<string, string[]> = {
    "Pagi": ["Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack Box", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"],
    "Siang": ["Nasi Box", "Prasmanan", "Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"],
    "Sore": ["Snack Box", "Coffee Break", "Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"],
    "Malam": ["Nasi Box", "Prasmanan", "Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"],
    "Sahur": ["Nasi Box", "Ayam Gorenng", "Sate Maranggi Sapi", "Air Mineral", "Buah-buahan"],
    "Buka Puasa": ["Nasi Box", "Prasmanan", "Takjil",],
    "Snack Malam": ["Snack Box", "Nescafe", "Kopi"],
    "Tengah Malam": ["Nasi Box", "Nescafe", "Kopi", "Ayam Goreng"],
};

//  Data menu berdasarkan tipe tamu
const menuByGuestType: Record<string, string[]> = {
    "VVIP": ["Ayam Goreng", "Anggur", "Takjil", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"],
    "VIP": ["Prasmanan", "Nasi Box", "Galon", "Takjil", "Snack", "Ayam Goreng", "Anggur", "Takjil", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack"],
    "Standar": ["Nasi Box", "Snack Box", "Galon", "Bubur Ayam", "Coffee Break", "Galon", "Roti Manis","Ketupat Lebaran"],
    "Regular": ["Nasi Box", "Snack Box", "Bubur Ayam", "Galon", "Ketupat Lebaran", "Roti Manis"],
    "PERTA": ["Nasi Box", "Snack Box", "Coffee Break", "Galon", "Bubur Ayam", "Ketupat Lebaran", "Roti Manis"],
};

// Tipe diubah menjadi Record<string, string[]> dan koma yang hilang ditambahkan
const unitByConsumption: Record<string, string[]> = {
    "Pax": ["Parasmanan", "Prasmanan", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Bubur Ayam", "GKT", "Ketupat Lebaran", "Jamuan Diluar Kawasan"],
    "Box": ["Nasi Box", "Snack Box", "Paket Sembako"],
    "Porsi": ["Ayam Goreng", "Anggur", "Takjil", "Snack Kering", "Snack Pagi", "Roti Manis", "Snack", "Aneka Pepes", "Telor Rebus", "Buah-Buahan", "Jeruk Manis", "Pisang Sunpride"],
    "Unit": ["Air Mineral", "Teh Sariwangi", "Nescafe", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Teh Celup", "Milo", "Creamer", "Mie Instan", "Susu Ultra", "Permen", "Pocari Sweat", "Teh Kotak", "Galon"],
    "Gelas": ["Coffee Break"],
};


// 2. UTILITAS STATUS
const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
        case 'Approved':
            return { icon: CheckCircle, text: 'Disetujui', color: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' };
        case 'Pending':
            return { icon: Clock, text: 'Menunggu', color: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30' };
        case 'Rejected':
            return { icon: XCircle, text: 'Ditolak', color: 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' };
        case 'Cancelled':
            return { icon: XCircle, text: 'Dibatalkan', color: 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30' };
        default:
            return { icon: Clock, text: 'Draft', color: 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800' };
    }
};

// 3. KOMPONEN-KOMPONEN BARU & LAMA

// Komponen Combobox (Searchable Select) yang bisa digunakan kembali
interface SearchableSelectProps {
    options: string[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    notFoundMessage: string;
    className?: string;
    disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onValueChange, placeholder, searchPlaceholder, notFoundMessage, className, disabled = false }) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
                >
                    {value
                        ? options.find((option) => option.toLowerCase() === value.toLowerCase())
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>{notFoundMessage}</CommandEmpty>
                    <CommandList className="max-h-60 overflow-y-auto scrollbar-thin overflow-hidden">
                        {options.map((option) => (
                            <CommandItem
                                key={option}
                                value={option}
                                onSelect={(currentValue : string) => {
                                    onValueChange(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value.toLowerCase() === option.toLowerCase() ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    
    );
};

// [DIPERBAIKI] Komponen Konfeti didefinisikan di luar komponen utama
const ConfettiPiece: React.FC = () => {
    const colors = ['#8b5cf6', '#a78bfa', '#d946ef', '#f472b6', '#fb7185', '#ec4899', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomXStart = Math.random() * 100;
    const randomXEnd = randomXStart + (-20 + Math.random() * 40);
    const randomDelay = Math.random() * 4; 
    const randomDuration = 2 + Math.random() * 3; 
    const randomRotationStart = Math.random() * 360;
    const randomRotationEnd = randomRotationStart + (-360 + Math.random() * 720);

    return (
        <motion.div
            className="absolute top-0 w-2 h-4"
            style={{ left: `${randomXStart}vw`, background: randomColor, borderRadius: '4px' }}
            initial={{ y: '-10vh', rotate: randomRotationStart, opacity: 1 }}
            animate={{
                y: '110vh',
                x: [`${randomXStart}vw`, `${randomXEnd}vw`],
                rotate: randomRotationEnd,
            }}
            transition={{
                duration: randomDuration,
                delay: randomDelay,
                ease: "linear",
            }}
        />
    );
};

// [DIPERBAIKI] Komponen Canvas Konfeti didefinisikan di luar komponen utama
const ConfettiCanvas = () => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999, 
        overflow: 'hidden'
    }}>
        {Array.from({ length: 150 }).map((_, i) => <ConfettiPiece key={i} />)}
    </div>
);


const OrderCard: React.FC<{ order: Order; onViewDetails: (order: Order) => void; }> = ({ order, onViewDetails }) => {
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    const dateFormatted = order.tanggalPengiriman.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const firstItem = order.items[0];

    return (
        <Card className="w-full h-full flex flex-col shadow-md transition-all duration-300 group hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 relative verflow-y-auto border">
            <CardHeader className="p-4 pb-2 flex-row items-start justify-between border-b">
                <div className="flex flex-col space-y-1">
                    <CardTitle className="text-sm font-bold text-violet-600 dark:text-violet-400">{order.id}</CardTitle>
                    <CardDescription className="text-xs">{dateFormatted} | {firstItem?.waktu || ''}</CardDescription>
                </div>
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full", statusDisplay.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusDisplay.text}
                </span>
            </CardHeader>
            <CardContent className="p-4 pt-4 space-y-3 text-sm flex-grow">
                <span className="font-semibold text-base leading-tight text-foreground">{order.kegiatan}</span>
                <div className="flex items-start space-x-3 text-muted-foreground border-t pt-3">
                    <Package className="h-4 w-4 text-violet-500 mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Menu</span>
                        <span className="font-medium text-foreground">{firstItem?.jenisKonsumsi || 'N/A'} ({firstItem?.qty || 0} {firstItem?.satuan || ''})</span>
                        {order.items.length > 1 && (
                            <span className="text-xs text-violet-500 mt-1 font-semibold">+ {order.items.length - 1} item lainnya</span>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 border-t flex justify-end gap-2">
                <Button
                    size="sm"
                    className="bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/60 dark:text-violet-300 dark:hover:bg-violet-900"
                    onClick={() => onViewDetails(order)}
                >
                    Detail
                </Button>
            </CardFooter>
        </Card>
    );
};

const OrderListItem: React.FC<{ order: Order; onViewDetails: (order: Order) => void; }> = ({ order, onViewDetails }) => {
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    const firstItem = order.items[0];
    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                <div className="flex items-center gap-4 mb-2 sm:mb-0 flex-grow min-w-0">
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-base text-violet-600 dark:text-violet-400 truncate">{order.kegiatan}</span>
                        <span className="text-sm text-muted-foreground">{order.id} &bull; {firstItem?.jenisKonsumsi || 'N/A'} {order.items.length > 1 ? `(+${order.items.length - 1} lainnya)` : ''}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full", statusDisplay.color)}><StatusIcon className="h-3 w-3" />{statusDisplay.text}</span>
                    <Button size="sm" className="h-8 bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/60 dark:text-violet-300 dark:hover:bg-violet-900" onClick={() => onViewDetails(order)}
                    > Detail
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// 4. KOMPONEN RIWAYAT
interface OrderHistoryProps {
    history: Order[];
    onViewDetails: (order: Order) => void;
    viewMode: 'grid' | 'list';
    totalHistoryCount: number; // Total history tanpa filter
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ history, onViewDetails, viewMode, totalHistoryCount }) => {
    return (
        <div className="w-full mt-4 min-h-[50vh]">
            {/* Tampilkan empty state jika tidak ada history ATAU tidak ada hasil yang ditampilkan */}
            {history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground rounded-xxl border-2 border-dashed p-8 min-h-[400px]">
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
                        <div className="relative">
                            {/* Gambar dengan animasi goyang halus */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                <motion.img
                                    src="/whale.png"
                                    alt="Belum ada pesanan"
                                    className="h-60 w-60"
                                    animate={{ 
                                        rotate: [0, -4, 4, -3, 3, -2, 2, 0],
                                        y: [0, -3, 0, -2, 0, -1, 0]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        repeatDelay: 1.5,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        transformOrigin: "center center"
                                    }}
                                />
                            </motion.div>
                            
                            {/* Efek Garis Getar untuk menunjukkan goyang */}
                            <motion.div
                                className="absolute left-8 top-1/2 w-1 h-24 bg-violet-300/20 rounded-full blur-sm"
                                animate={{
                                    opacity: [0, 0.6, 0],
                                    x: [-8, 0, 8, 0, -8],
                                    scaleY: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 1.5,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute right-8 top-1/2 w-1 h-24 bg-violet-300/20 rounded-full blur-sm"
                                animate={{
                                    opacity: [0, 0.6, 0],
                                    x: [8, 0, -8, 0, 8],
                                    scaleY: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 1.5,
                                    ease: "easeInOut"
                                }}
                            />
                            
                            {/* Partikel debu/efek goyang dari kardus */}
                            <motion.div
                                className="absolute bottom-20 left-1/4"
                                animate={{
                                    y: [0, -25, -40],
                                    x: [-8, 5, -12],
                                    opacity: [0, 0.6, 0],
                                    scale: [0.3, 1.2, 0.3]
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    repeatDelay: 2.2,
                                    ease: "easeOut"
                                }}
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-400/50 blur-[1px]" />
                            </motion.div>
                            <motion.div
                                className="absolute bottom-20 right-1/4"
                                animate={{
                                    y: [0, -30, -45],
                                    x: [8, -5, 12],
                                    opacity: [0, 0.6, 0],
                                    scale: [0.3, 1.2, 0.3]
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    repeatDelay: 2.2,
                                    delay: 0.4,
                                    ease: "easeOut"
                                }}
                            >
                                <div className="w-2 h-2 rounded-full bg-slate-400/50 blur-[1px]" />
                            </motion.div>
                            <motion.div
                                className="absolute bottom-24 left-1/3"
                                animate={{
                                    y: [0, -20, -35],
                                    x: [0, -8, 0],
                                    opacity: [0, 0.5, 0],
                                    scale: [0.4, 1, 0.4]
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    repeatDelay: 2.2,
                                    delay: 0.2,
                                    ease: "easeOut"
                                }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 blur-[1px]" />
                            </motion.div>
                        </div>
                        
                        {/* Teks dengan animasi shake */}
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0,
                            }}
                            transition={{ delay: 0.3 }}
                        >  
                            <motion.span 
                                className="text-xl font-bold text-foreground/90 block mb-2"
                                animate={{
                                    x: [0, -1.5, 1.5, -1, 1, 0]
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatDelay: 4,
                                    ease: "easeInOut"
                                }}
                            >
                                {totalHistoryCount === 0 ? "Belum Ada Pesanan" : "Tidak Ada Hasil"}
                            </motion.span>
                            <p className="text-muted-foreground max-w-xs text-sm overflow-y-auto scrollbar-thin">
                                {totalHistoryCount === 0 
                                    ? "Tidak ada data pesanan yang cocok dengan filter yang Anda pilih."
                                    : "Tidak ada data pesanan yang cocok dengan filter yang Anda pilih."
                                }
                            </p>
                        </motion.div>
                    </div>
                </div>
            ) : (
        <AnimatePresence>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {history.map(order => (
                <motion.div 
                  key={order.id} 
                  layout 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  transition={{ duration: 0.2 }}
                >
                  <OrderCard order={order} onViewDetails={onViewDetails} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(order => (
                <motion.div 
                  key={order.id} 
                  layout 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.2 }}
                >
                  <OrderListItem order={order} onViewDetails={onViewDetails} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}





// 5. KOMPONEN FORM
interface OrderFormProps {
    initialData: FormData;
    onSubmit: (data: Order) => void;
    onCancel: () => void;
    isSuccessful: boolean;
    setIsSuccessful: (isSuccessful: boolean) => void;
}

const OrderFormContent: React.FC<OrderFormProps> = ({ initialData, onSubmit, onCancel, isSuccessful, setIsSuccessful }) => {
    // --- [MULAI BAGIAN BARU] ---
    
    // 1. Inisialisasi State dengan Logic H+1
    const [formData, setFormData] = useState<FormData>(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return {
            ...initialData,
            tanggalPermintaan: today,    // Default hari ini
            tanggalPengiriman: tomorrow, // Default besok (H+1)
        };
    });

    // 2. State bawaan lainnya (tetap dipertahankan)
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submissionTime, setSubmissionTime] = useState<Date | null>(null);

    // 3. Logic Validasi Tanggal (Min Delivery Date)
    const [minDeliveryDate, setMinDeliveryDate] = useState('');

    useEffect(() => {
        if (formData.tanggalPermintaan) {
            const reqDate = new Date(formData.tanggalPermintaan);
            const minDate = new Date(reqDate);
            minDate.setDate(minDate.getDate() + 1); // Tambah 1 hari dari permintaan
            
            setMinDeliveryDate(formatDate(minDate));
        }
    }, [formData.tanggalPermintaan]);

    // [BARU] Menghapus grup pengiriman
    const handleRemoveGroup = (groupId: string) => {
        setFormData(prev => ({
            ...prev,
            groups: prev.groups.filter(g => g.id !== groupId)
        }));
    };

    // [BARU] Menangani perubahan pada field grup (lokasi, waktu)
    const handleGroupChange = (groupId: string, fieldName: keyof Omit<ConsumptionGroup, 'id' | 'subItems'>, value: string) => {
        setFormData(prev => ({
            ...prev,
            groups: prev.groups.map(group =>
                group.id === groupId ? { ...group, [fieldName]: value } : group
            )
        }));
        // Hapus error jika ada
        const errorKey = `group-${groupId}-${fieldName}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    // [BARU] Menambah sub-item (jenis konsumsi) ke grup tertentu
    const handleAddSubItem = (groupId: string) => {
        setFormData(prev => ({
            ...prev,
            groups: prev.groups.map(group =>
                group.id === groupId
                    ? {
                        ...group,
                        subItems: [
                            ...group.subItems,
                            {
                                id: `subitem-${Date.now()}`,
                                jenisKonsumsi: '',
                                qty: '',
                                satuan: '',
                            }
                        ]
                    }
                    : group
            )
        }));
    };

    // [BARU] Menghapus sub-item (jenis konsumsi) dari grup tertentu
    const handleRemoveSubItem = (groupId: string, subItemId: string) => {
        setFormData(prev => ({
            ...prev,
            groups: prev.groups.map(group =>
                group.id === groupId
                    ? { ...group, subItems: group.subItems.filter(si => si.id !== subItemId) }
                    : group
            )
        }));
    };
    
    // [BARU] Menangani perubahan pada field sub-item (jenis, qty, satuan)
    // [DIPERBAIKI] Tipe 'value' diubah menjadi 'string | number'
    const handleSubItemChange = (id: string, subItemId: string, fieldName: keyof Omit<ConsumptionSubItem, 'id'>, value: string | number) => {
        setFormData(prev => {
            const newGroups = prev.groups.map(group => {
                if (group.id === id) {
                    const newSubItems = group.subItems.map(subItem => {
                        if (subItem.id === subItemId) {
                            const updatedSubItem = { ...subItem, [fieldName]: value };
                            
                            if (fieldName === 'jenisKonsumsi') {
                                let foundSatuan = '';
                                for (const satuan in unitByConsumption) {
                                    if (unitByConsumption[satuan].includes(value as string)) {
                                        foundSatuan = satuan;
                                        break;
                                    }
                                }
                                updatedSubItem.satuan = foundSatuan;
                            }

                            if (fieldName === 'qty' && value !== '') {
                                updatedSubItem.qty = parseInt(value as string, 10) || '';
                            }
                            return updatedSubItem;
                        }
                        return subItem;
                    });
                    return { ...group, subItems: newSubItems };
                }
                return group;
            });
            return { ...prev, groups: newGroups };
        });

        // Error handling
        const errorKey = `group-${id}-subitem-${subItemId}-${fieldName}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };


    const handleChange = (name: keyof Omit<FormData, 'groups'>, value: string | number | Date) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; }); }
    };

    const handleDateChange = (name: keyof FormData, date: Date | undefined) => { if (date) { setFormData(prev => ({ ...prev, [name]: date })); } };

    // [DIPERBAIKI] Validasi disesuaikan dengan struktur 'groups'
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.kegiatan) newErrors.kegiatan = "Kegiatan wajib diisi.";
        if (formData.kegiatan === 'Lainnya' && !formData.kegiatanLainnya) newErrors.kegiatanLainnya = "Harap sebutkan nama kegiatan.";
        if (!formData.namaApprover) newErrors.namaApprover = "Approver wajib dipilih.";
        if (!formData.tipeTamu) newErrors.tipeTamu = "Tipe tamu wajib dipilih."; // [DIKEMBALIKAN]

        formData.groups.forEach(group => {
            if (!group.lokasiPengiriman) newErrors[`group-${group.id}-lokasiPengiriman`] = "Lokasi wajib diisi.";
            
            group.subItems.forEach(subItem => {
                if (!subItem.jenisKonsumsi) newErrors[`group-${group.id}-subitem-${subItem.id}-jenisKonsumsi`] = "Jenis konsumsi wajib diisi.";
                if (Number(subItem.qty) <= 0) newErrors[`group-${group.id}-subitem-${subItem.id}-qty`] = "Jumlah harus lebih dari 0.";
                if (!subItem.satuan) newErrors[`group-${group.id}-subitem-${subItem.id}-satuan`] = "Satuan wajib diisi.";
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReviewSubmit = (e: React.FormEvent) => { e.preventDefault(); if (isSuccessful) setIsSuccessful(false); if (validateForm()) { setIsReviewOpen(true); } };

    // [DIPERBAIKI] Logika submit diubah untuk "meratakan" (flatten) data dari 'groups'
    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Flatten data dari groups ke items
        const itemsToSubmit: ConsumptionItemData[] = [];
        formData.groups.forEach(group => {
            group.subItems.forEach(subItem => {
                itemsToSubmit.push({
                    lokasiPengiriman: group.lokasiPengiriman,
                    sesiWaktu: group.sesiWaktu,
                    waktu: group.waktu,
                    jenisKonsumsi: subItem.jenisKonsumsi,
                    qty: Number(subItem.qty) || 0,
                    satuan: subItem.satuan,
                });
            });
        });

        const finalKegiatan = formData.kegiatan === 'Lainnya' ? formData.kegiatanLainnya : formData.kegiatan;
        const newOrder: Order = {
            id: `ORD${Math.floor(Math.random() * 90000) + 10000}`,
            orderNumber: 'TEMP', // Temporary, will be replaced by API
            kegiatan: finalKegiatan,
            tanggalPermintaan: formData.tanggalPermintaan,
            tanggalPengiriman: formData.tanggalPengiriman,
            untukBagian: formData.untukBagian,
            yangMengajukan: formData.yangMengajukan,
            noHp: formData.noHp,
            namaApprover: formData.namaApprover,
            tipeTamu: formData.tipeTamu, // [DIKEMBALIKAN]
            keterangan: formData.keterangan,
            items: itemsToSubmit, // Data yang sudah di-flatten
            status: 'Pending',
        };

        onSubmit(newOrder);
        setIsSubmitting(false);
        setIsReviewOpen(false);
        setIsSuccessful(true);
        setSubmissionTime(new Date());
    };

    useEffect(() => { if (isSuccessful) { setFormData(initialData); setErrors({}); } }, [isSuccessful, initialData]);

    // [DIPERBAIKI] tipeTamuOptions dikembalikan ke useMemo
    const allOptions = useMemo(() => ({ kegiatanOptions, bagianOptions, approverOptions, tipeTamuOptions, lokasiOptions, satuanOptions, sesiWaktuOptions}), []);

    const ReviewDetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div className="flex justify-between items-start py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-right">{value}</dd>
        </div>
    );

    // [DIPERBAIKI] JSX dibungkus dengan React.Fragment (<>) untuk mengatasi error single root element
    return (
        <>
            <Card className="w-full max-w-3xl shadow-xl border overflow-y-auto scrollbar-thin">
                <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-bold text-foreground">Pemesanan Konsumsi Karyawan</CardTitle>
                    <CardDescription>
                        {isSuccessful ? (<span className="text-green-600 font-medium">Pesanan Anda berhasil dikirim!</span>) : ("Silahkan Isi Pengajuan Pemesanan Konsumsi Anda.")}
                    </CardDescription>
                    
                    {/* Informasi Order dan Transaksi */}
                    {!isSuccessful && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {/* Informasi Order */}
                            <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/50 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white dark:bg-violet-900 rounded-lg">
                                        <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">Informasi Order</h3>
                                        <ul className="space-y-1 text-sm text-violet-700 dark:text-violet-300">
                                            <li>• Order dilakukan minimal H-1 kegiatan</li>
                                            <li>• Order dapat dilakukan pada pukul 07:00 - 14:00</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Informasi Transaksi */}
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white dark:bg-amber-900 rounded-lg">
                                        <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Informasi Transaksi</h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Informasi untuk pemesanan order wajib di approve oleh approval
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>

                {isSuccessful ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <CardContent className="text-center p-8 md:p-12 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/50 dark:to-fuchsia-950/50 relative">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.2,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.08, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                >
                                    <CheckCircle className="mx-auto h-20 w-20 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full p-2 shadow-lg" />
                                </motion.div>
                            </motion.div>
                            <h3 className="mt-6 text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Pemesanan Selesai!</h3>
                            <p className="mt-2 text-muted-foreground">Permintaan Anda telah dibuat dan sedang menunggu persetujuan.</p>
                            {submissionTime && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {submissionTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {submissionTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col sm:flex-row justify-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/50">
                            <Button onClick={() => setIsSuccessful(false)} className="text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105">
                                <Plus className="mr-2 h-4 w-4" /> Buat Pesanan Baru
                            </Button>
                        </CardFooter>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <form onSubmit={handleReviewSubmit}>
                            <CardContent className="grid gap-6 p-6 max-h-[55vh] overflow-y-auto scrollbar-thin">

                                {/* KATEGORI 1: INFORMASI UMUM */}
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-violet-700 dark:text-violet-400">Informasi Umum & Pemesan</h4>
                                    </div>
                                    <div className="space-y-2 overflow-y-auto scrollbar-thin">
                                        <Label htmlFor="kegiatan">Nama Kegiatan / Event</Label>
                                        <SearchableSelect
                                            value={formData.kegiatan}
                                            onValueChange={(value) => handleChange('kegiatan', value)}
                                            options={allOptions.kegiatanOptions}
                                            placeholder="Pilih nama kegiatan/event"
                                            searchPlaceholder="Cari kegiatan..."
                                            notFoundMessage="Kegiatan tidak ditemukan."
                                            className={cn({ "border-red-500": errors.kegiatan })}
                                        />
                                        {errors.kegiatan && <p className="text-xs text-red-600">{errors.kegiatan}</p>}
                                    </div>
                                    <AnimatePresence>
                                        {formData.kegiatan === 'Lainnya' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-2 verflow-y-auto">
                                                <Label htmlFor="kegiatanLainnya">Sebutkan Nama Kegiatan</Label>
                                                <Input id="kegiatanLainnya" placeholder="Contoh: Peresmian Kantor Cabang Baru" value={formData.kegiatanLainnya} onChange={(e) => handleChange('kegiatanLainnya', e.target.value)} className={cn({ "border-red-500": errors.kegiatanLainnya })} />
                                                {errors.kegiatanLainnya && <p className="text-xs text-red-600">{errors.kegiatanLainnya}</p>}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label htmlFor="tanggalPermintaan">Tanggal Permintaan</Label><Popover><PopoverTrigger asChild><Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !formData.tanggalPermintaan && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{formData.tanggalPermintaan ? formData.tanggalPermintaan.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : <span>Pilih tanggal</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.tanggalPermintaan} onSelect={(date) => handleDateChange('tanggalPermintaan', date)} initialFocus /></PopoverContent></Popover></div>
                                        <div className="space-y-2"><Label htmlFor="tanggalPengiriman">Tanggal Pengiriman</Label><Popover><PopoverTrigger asChild><Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !formData.tanggalPengiriman && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{formData.tanggalPengiriman ? formData.tanggalPengiriman.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : <span>Pilih tanggal</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.tanggalPengiriman} onSelect={(date) => handleDateChange('tanggalPengiriman', date)} initialFocus /></PopoverContent></Popover></div>
                                        <div className="space-y-2"><Label htmlFor="yangMengajukan">Yang Mengajukan</Label><Input id="yangMengajukan" value={formData.yangMengajukan} readOnly className="bg-violet-50 dark:bg-violet-900/50 border-violet-200" /></div>
                                        <div className="space-y-2"><Label htmlFor="untukBagian">Untuk Bagian/Unit</Label><Input id="untukBagian" value={formData.untukBagian} readOnly className="bg-violet-50 dark:bg-violet-900/50 border-violet-200" /></div>
                                        <div className="space-y-2"><Label htmlFor="noHp">No. HP Pengaju</Label><Input id="noHp" placeholder="08xxxxxxxxxx" value={formData.noHp} onChange={(e) => handleChange('noHp', e.target.value)} /></div>
                                        {/* [DIKEMBALIKAN] Field Tamu (Tipe) */}
                                        <div className="space-y-2 overflow-y-auto scrollbar-thin">
                                            <Label htmlFor="tipeTamu">Tamu (Tipe)</Label>
                                            <SearchableSelect
                                                value={formData.tipeTamu}
                                                onValueChange={(value) => handleChange('tipeTamu', value)}
                                                options={allOptions.tipeTamuOptions}
                                                placeholder="Pilih Tipe Tamu"
                                                searchPlaceholder="Cari tipe tamu..."
                                                notFoundMessage="Tipe tamu tidak ditemukan."
                                                className={cn({ "border-red-500": errors.tipeTamu })}
                                            />
                                            {errors.tipeTamu && <p className="text-xs text-red-600">{errors.tipeTamu}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* KATEGORI 2: PENGIRIMAN & KONSUMSI [DIPERBAIKI] */}
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-violet-700 dark:text-violet-400">Informasi Pengiriman & Konsumsi</h4>
                                    </div>

                                    <AnimatePresence>
                                        {formData.groups.map((group) => (
                                            <motion.div
                                                key={group.id}
                                                className="grid gap-4 border p-4 pt-6 rounded-lg relative bg-slate-50 dark:bg-slate-900/50"
                                                layout
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                                            >
                                                {formData.groups.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
                                                        onClick={() => handleRemoveGroup(group.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto scrollbar-thin">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`sesiWaktu-${group.id}`}>Sesi Waktu</Label>
                                                        <SearchableSelect
                                                            value={group.sesiWaktu}
                                                            onValueChange={(value) => handleGroupChange(group.id, 'sesiWaktu', value)}
                                                            options={allOptions.sesiWaktuOptions}
                                                            placeholder="Pilih sesi"
                                                            searchPlaceholder="Cari sesi..."
                                                            notFoundMessage="Sesi tidak ditemukan."
                                                        />

                                                    </div>

                                                    <div className="space-y-2 overflow-y-auto scrollbar-thin">
                                                        <Label htmlFor={`lokasiPengiriman-${group.id}`}>Lokasi Pengiriman</Label>
                                                        <SearchableSelect
                                                            value={group.lokasiPengiriman}
                                                            onValueChange={(value) => handleGroupChange(group.id, 'lokasiPengiriman', value)}
                                                            options={allOptions.lokasiOptions}
                                                            placeholder="Pilih lokasi"
                                                            searchPlaceholder="Cari lokasi..."
                                                            notFoundMessage="Lokasi tidak ditemukan."
                                                            className={cn({ "border-red-500": errors[`group-${group.id}-lokasiPengiriman`] })}
                                                        />
                                                        {errors[`group-${group.id}-lokasiPengiriman`] && <p className="text-xs text-red-600">{errors[`group-${group.id}-lokasiPengiriman`]}</p>}
                                                    </div>
                                                </div>

                                                {/* --- BLOK SUB-ITEM (KONSUMSI) --- */}
                                                <div className="pl-4 mt-4 border-l-2 border-violet-200 dark:border-violet-700 space-y-3">
                                                    
                                                    <AnimatePresence>
                                                        {group.subItems.map((subItem) => (
                                                            <motion.div 
                                                                key={subItem.id} 
                                                                layout
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                                                className="relative"
                                                            >
                                                                <div className="grid sm:grid-cols-3 gap-4 overflow-y-auto scrollbar-thin">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`jenisKonsumsi-${subItem.id}`}>Jenis Konsumsi</Label>
                                                                        {/* [DIKEMBALIKAN] Logika disabled dan filter menu diperbarui */}
                                                                        <SearchableSelect
                                                                            value={subItem.jenisKonsumsi}
                                                                            onValueChange={(value) => handleSubItemChange(group.id, subItem.id, 'jenisKonsumsi', value)}
                                                                            options={(() => {
                                                                                if (!group.sesiWaktu || !formData.tipeTamu) return [];
                                                                                const menusForTime = menuByTime[group.sesiWaktu] || [];
                                                                                const menusForGuest = menuByGuestType[formData.tipeTamu] || [];
                                                                                return menusForTime.filter(menu => menusForGuest.includes(menu));
                                                                            })()}
                                                                            placeholder="Pilih jenis"
                                                                            searchPlaceholder="Cari jenis konsumsi..."
                                                                            notFoundMessage="Jenis konsumsi tidak ditemukan."
                                                                            disabled={!group.sesiWaktu || !formData.tipeTamu}
                                                                        />
                                                                        {errors[`group-${group.id}-subitem-${subItem.id}-jenisKonsumsi`] && <p className="text-xs text-red-600">{errors[`group-${group.id}-subitem-${subItem.id}-jenisKonsumsi`]}</p>}
                                                                    </div>
                                                                    <div className="space-y-2"><Label htmlFor={`qty-${subItem.id}`}>Qty</Label><Input id={`qty-${subItem.id}`} type="number" placeholder="Jumlah" value={subItem.qty} onChange={(e) => handleSubItemChange(group.id, subItem.id, 'qty', e.target.value)} className={cn({ "border-red-500": errors[`group-${group.id}-subitem-${subItem.id}-qty`] })} />{errors[`group-${group.id}-subitem-${subItem.id}-qty`] && <p className="text-xs text-red-600">{errors[`group-${group.id}-subitem-${subItem.id}-qty`]}</p>}</div>
                                                                    <div className="flex items-end gap-2">
                                                                        <div className="space-y-2 flex-grow">
                                                                            <Label htmlFor={`satuan-${subItem.id}`}>Satuan</Label>
                                                                            <SearchableSelect
                                                                                value={subItem.satuan}
                                                                                onValueChange={(value) => handleSubItemChange(group.id, subItem.id, 'satuan', value)}
                                                                                options={allOptions.satuanOptions}
                                                                                placeholder="Pilih satuan"
                                                                                searchPlaceholder="Cari satuan..."
                                                                                notFoundMessage="Satuan tidak ditemukan."
                                                                                className={cn({ "border-red-500": errors[`group-${group.id}-subitem-${subItem.id}-satuan`] })}
                                                                            />
                                                                            {errors[`group-${group.id}-subitem-${subItem.id}-satuan`] && <p className="text-xs text-red-600">{errors[`group-${group.id}-subitem-${subItem.id}-satuan`]}</p>}
                                                                        </div>
                                                                        {group.subItems.length > 1 && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
                                                                                onClick={() => handleRemoveSubItem(group.id, subItem.id)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                    {/* [DIPERBAIKI] Tombol "Tambah Jenis Konsumsi" dipindahkan ke sini */}
                                                    <div className="flex justify-end">
                                                        <Button 
                                                            type="button" 
                                                            size="sm" 
                                                            variant="outline" 
                                                            onClick={() => handleAddSubItem(group.id)} 
                                                            className="flex items-center gap-2 border-dashed border-violet-400 text-violet-600 hover:text-violet-700 hover:bg-violet-50 w-full sm:w-auto"
                                                        >
                                                            <Plus className="h-4 w-4" /> Tambah Jenis
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                   
                                    <div className="space-y-2"><Label htmlFor="keterangan">Keterangan</Label><Textarea id="keterangan" placeholder="Silahkan Isi Keterangan Anda" value={formData.keterangan} onChange={(e) => handleChange('keterangan', e.target.value)} /></div>
                                </div>

                                <div className="bg-violet-50 dark:bg-violet-900/50 p-4 rounded-lg border border-violet-200 dark:border-violet-800 space-y-2">
                                    <Label htmlFor="namaApprover" className="text-violet-800 dark:text-violet-200 font-bold text-base">Persetujuan</Label>
                                    <p className="text-sm text-violet-700 dark:text-violet-300 mb-3">Yang Menyetujui Pemesanan Ini.</p>
                                    <SearchableSelect
                                        value={formData.namaApprover}
                                        onValueChange={(value) => handleChange('namaApprover', value)}
                                        options={allOptions.approverOptions}
                                        placeholder="Pilih nama approver"
                                        searchPlaceholder="Cari approver..."
                                        notFoundMessage="Approver tidak ditemukan."
                                        className={cn("bg-background", { "border-red-500": errors.namaApprover })}
                                    />
                                    {errors.namaApprover && <p className="text-xs text-red-600">{errors.namaApprover}</p>}
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-between p-6 bg-violet-50 dark:bg-violet-950/50 rounded-b-lg">
                                <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
                                <Button type="submit" className="text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105">Buat Pesanan <ChevronDown className="h-4 w-4 ml-2 transform rotate-[-90deg]" /></Button>
                            </CardFooter>
                        </form>
                    </motion.div>
                )}

    {/* [DIPERBAIKI] Review Dialog disesuaikan dengan struktur 'groups' */}
    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md p-0 bg-background border-0 gap-0 overflow-y-auto scrollbar-thin">
            <DialogHeader className="p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/50 dark:to-fuchsia-950/50">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Review Pesanan Anda
                </DialogTitle>
                <DialogDescription>Pastikan semua detail sudah benar sebelum mengirim.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 p-6 text-sm text-foreground max-h-[60vh] overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-slate-900">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="bg-background p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-violet-600 mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Detail Acara</h4>
                        <dl className="space-y-1 divide-y divide-violet-100 dark:divide-violet-900">
                            <ReviewDetailRow label="Kegiatan" value={formData.kegiatan === 'Lainnya' ? formData.kegiatanLainnya : formData.kegiatan} />
                            <ReviewDetailRow label="Tgl. Pengiriman" value={formData.tanggalPengiriman.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})} />
                            <ReviewDetailRow label="Tipe Tamu" value={formData.tipeTamu} />{/* [DIKEMBALIKAN] */}
                        </dl>
                    </div>
                </motion.div>

                {/* [DIPERBAIKI] Iterasi melalui groups dan subItems */}
                {formData.groups.map((group, index) => (
                     <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (index * 0.1) }}>
                        <div className="bg-background p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-violet-600 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Pengiriman #{index + 1}</h4>
                             <dl className="space-y-1 divide-y divide-violet-100 dark:divide-violet-900">
                                <ReviewDetailRow label="Lokasi" value={group.lokasiPengiriman} />
                                <ReviewDetailRow label="Waktu" value={group.sesiWaktu} />
                            </dl>
                            
                            <h5 className="font-medium text-foreground mt-3 mb-2 text-sm">Item Konsumsi:</h5>
                            <div className="space-y-2">
                                {group.subItems.map((item) => (
                                    <div key={item.id} className="p-3 rounded-md border bg-slate-50 dark:bg-slate-800/50">
                                        <p className="font-semibold">{item.jenisKonsumsi} ({item.qty} {item.satuan})</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                {formData.keterangan && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="bg-background p-4 rounded-lg shadow-sm">
                             <dl className="space-y-1">
                                <ReviewDetailRow label="Catatan Global" value={<span className="text-left block">{formData.keterangan}</span>} />
                            </dl>
                        </div>
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="bg-background p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-violet-600 mb-2 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Persetujuan</h4>
                        <dl className="space-y-1 divide-y divide-violet-100 dark:divide-violet-900">
                            <ReviewDetailRow label="Approver" value={formData.namaApprover} />
                        </dl>
                    </div>
                </motion.div>
            </div>
            
            <DialogFooter className="p-6 bg-violet-50 dark:bg-violet-900/50">
                <Button type="button" variant="outline" onClick={() => setIsReviewOpen(false)} disabled={isSubmitting}>Edit Kembali</Button>
                <Button onClick={handleFinalSubmit} disabled={isSubmitting} className="text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105">{isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>) : (<>Submit Pesanan</>)}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

            </Card>
        </>
    );
};


// 6. KOMPONEN DIALOG KONFIRMASI & DETAIL

const OrderDetailsDialog: React.FC<{ 
    order: Order | null; 
    isOpen: boolean; 
    onClose: () => void;
    onCancelOrder: (order: Order) => void; // [BARU] Menambahkan prop onCancelOrder
}> = ({ order, isOpen, onClose, onCancelOrder }) => {
    if (!order) return null;
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    
    const detailItem = (Icon: React.ElementType, label: string, value: string | React.ReactNode) => (
        <div className="flex items-start space-x-4">
            <div className="bg-violet-100 dark:bg-violet-900 p-2 rounded-full">
                <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex flex-col text-sm pt-1">
                <span className="font-semibold text-foreground">{label}</span>
                <span className="text-muted-foreground">{value}</span>
            </div>
        </div>
    );

    const timelineEvents = [
        { status: `Pesanan Dibuat oleh ${order.yangMengajukan}`, date: order.tanggalPermintaan, icon: Plus },
    ];

    if (order.status === 'Approved' || order.status === 'Rejected') {
        const approvalDate = new Date(order.tanggalPermintaan);
        approvalDate.setMinutes(approvalDate.getMinutes() + 15);
        timelineEvents.push({ 
            status: `Pesanan ${order.status === 'Approved' ? 'Disetujui' : 'Ditolak'} oleh ${order.namaApprover}`, 
            date: approvalDate,
            icon: order.status === 'Approved' ? CheckCircle : XCircle
        });
    }
    
    // [BARU] Tambahkan event pembatalan jika pesanan dibatalkan
    if (order.status === 'Cancelled' && order.tanggalPembatalan) {
        timelineEvents.push({
            status: order.alasanPembatalan || 'Pesanan Dibatalkan',
            date: order.tanggalPembatalan,
            icon: XCircle
        });
    }
    
    if (order.status === 'Approved') {
        const step3Date = new Date(order.tanggalPermintaan); step3Date.setMinutes(step3Date.getMinutes() + 30);
        const step4Date = new Date(order.tanggalPermintaan); step4Date.setMinutes(step4Date.getMinutes() + 45);
        const step5Date = new Date(order.tanggalPermintaan); step5Date.setMinutes(step5Date.getMinutes() + 60);
        timelineEvents.push({ status: 'Pesanan Dikirim ke Mitra', date: step3Date, icon: Activity });
        timelineEvents.push({ status: 'Pesanan DiProses Mitra', date: step4Date, icon: Clock });
        timelineEvents.push({ status: 'Pesanan dalam Pengiriman', date: step5Date, icon: Truck });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl p-0 bg-background border-0 gap-0 overflow-y-auto scrollbar-thin">
                <DialogHeader className="p-6 rounded-t-lg bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/50 dark:to-fuchsia-950/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                Detail Pesanan: {order.id}
                            </DialogTitle>
                            <DialogDescription>{order.kegiatan}</DialogDescription>
                        </div>
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full", statusDisplay.color)}><StatusIcon className="h-3 w-3" />{statusDisplay.text}</span>
                    </div>
                </DialogHeader>
                
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto scrollbar-thin grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-900">
                    
                    <div className="space-y-6 bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-foreground">Informasi Pesanan</h3>
                        <div className="space-y-4">
                            {detailItem(User, "Yang Mengajukan", order.yangMengajukan)}
                            {detailItem(Building, "Untuk Bagian", order.untukBagian)}
                            {detailItem(Phone, "No. HP Kontak", order.noHp || "-")}
                            {detailItem(CalendarIcon, "Tgl. Pengiriman", `${order.tanggalPengiriman.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`)}
                            {order.keterangan && detailItem(FileText, "Keterangan", order.keterangan)}
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-base text-foreground border-t pt-4">Detail Item</h4>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <Package className="h-4 w-4 text-violet-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">{item.jenisKonsumsi} ({item.qty} {item.satuan})</p>
                                        <p className="text-xs text-muted-foreground">{item.lokasiPengiriman} &bull; {item.sesiWaktu} {item.waktu}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 bg-background p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-foreground">Riwayat Status</h3>
                        <div className="relative pl-6">
                            <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-violet-200 dark:bg-violet-700"></div>
                            {timelineEvents.map((event: { status: string; date: Date; icon: React.ElementType }, index: number) => {
                                const isLast = index === timelineEvents.length - 1;
                                return (
                                    <div key={index} className="relative mb-6">
                                        <div className={cn("absolute -left-[20px] top-1 w-4 h-4 rounded-full", isLast ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 ring-4 ring-violet-200 dark:ring-violet-900/50' : 'bg-violet-300 dark:bg-violet-600')}></div>
                                        <div className="text-xs text-muted-foreground">{event.date.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                        <p className="text-sm font-medium text-foreground">{event.status}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                
                {/* [BARU] Footer Dialog dengan tombol Batalkan Pesanan (kondisional) */}
                {order.status === 'Pending' && (
                    <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900 border-t">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-400">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Batalkan Pesanan Ini
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-slate-950 backdrop-blur-none">
                                <DialogHeader>
                                    <DialogTitle>Anda Yakin?</DialogTitle>
                                    <DialogDescription>
                                        Tindakan ini akan membatalkan pesanan dengan ID <span className="font-medium text-foreground">{order.id}</span>. Anda tidak dapat mengurungkan tindakan ini.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Tutup</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button
                                            className="bg-red-600 text-white hover:bg-red-700"
                                            onClick={() => onCancelOrder(order)}
                                        >
                                            Ya, Batalkan Pesanan
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};
// 7. KOMPONEN FILTER STATUS BARU
interface StatusFilterTabsProps {
    activeFilter: OrderStatus | 'All';
    onFilterChange: (status: OrderStatus | 'All') => void;
    counts: Record<OrderStatus | 'All', number>;
    isMounted?: boolean; // [BARU] Flag untuk hydration
}

const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ activeFilter, onFilterChange, counts, isMounted = true }) => {
    const filters: { label: string; value: OrderStatus | 'All'; icon: React.ElementType }[] = [
        { label: "All", value: "All", icon: ListTodo },
        { label: "Menunggu", value: "Pending", icon: FolderClock },
        { label: "Disetujui", value: "Approved", icon: BadgeCheck },
        { label: "Ditolak", value: "Rejected", icon: XCircle },
        { label: "Dibatalkan", value: "Cancelled", icon: X },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            {filters.map(filter => {
                const Icon = filter.icon;
                return (
                    <Button 
                        key={filter.value} 
                        variant={activeFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "flex items-center gap-2 transition-all duration-300",
                            activeFilter === filter.value 
                                ? "text-white bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                                : "bg-background text-foreground"
                        )}
                        onClick={() => onFilterChange(filter.value)}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{filter.label}</span>
                        {isMounted && (
                            <span className={cn(
                                "ml-1 text-xs font-bold px-2 py-0.5 rounded-full",
                                activeFilter === filter.value 
                                    ? "bg-white text-violet-700"
                                    : "bg-violet-200 dark:bg-violet-700 text-violet-600 dark:text-violet-300"
                            )}>
                                {counts[filter.value]}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}

// 8. KOMPONEN UTAMA HALAMAN
export default function ConsumptionOrderPage() {
    // Load history dari API (bukan localStorage)
    const [history, setHistory] = useState<Order[]>([]);
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // State untuk Dialog
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);

    // State untuk Kalender dan Filter
    const [date, setDate] = React.useState<DateRange | undefined>(undefined); // Tampilkan semua order by default
    const [activeStatusFilter, setActiveStatusFilter] = useState<OrderStatus | 'All'>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    // Set mounted state setelah component mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load orders dari API saat component mount
    useEffect(() => {
        async function loadOrders() {
            try {
                // Get username dari localStorage
                const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
                
                if (!username) {
                    console.warn('⚠️ No username found in localStorage. User might not be logged in.');
                    return;
                }
                
                console.log('🔄 Loading orders for user:', username);
                const response = await fetch(`/api/orders?username=${encodeURIComponent(username)}`);
                
                if (!response.ok) {
                    console.error('❌ Failed to load orders from API. Status:', response.status);
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Error details:', errorData);
                    return;
                }
                
                const orders = await response.json();
                console.log('📦 Raw orders from API:', orders);
                
                // Convert string dates to Date objects
                const formattedOrders: Order[] = orders.map((order: {
                    id: string;
                    orderNumber: string;
                    kegiatan: string;
                    tanggalPermintaan: string;
                    tanggalPengiriman: string;
                    untukBagian: string;
                    yangMengajukan: string;
                    noHp: string;
                    namaApprover: string;
                    tipeTamu?: string;
                    keterangan?: string;
                    status: string;
                    tanggalPembatalan?: string;
                    alasanPembatalan?: string;
                    items?: ConsumptionItemData[];
                }) => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    kegiatan: order.kegiatan,
                    tanggalPermintaan: new Date(order.tanggalPermintaan),
                    tanggalPengiriman: new Date(order.tanggalPengiriman),
                    untukBagian: order.untukBagian,
                    yangMengajukan: order.yangMengajukan,
                    noHp: order.noHp,
                    namaApprover: order.namaApprover,
                    tipeTamu: order.tipeTamu || '',
                    keterangan: order.keterangan || '',
                    status: order.status as OrderStatus,
                    tanggalPembatalan: order.tanggalPembatalan ? new Date(order.tanggalPembatalan) : undefined,
                    alasanPembatalan: order.alasanPembatalan,
                    items: order.items || [],
                }));
                
                setHistory(formattedOrders);
                console.log('✅ Orders loaded for', username, ':', formattedOrders.length, 'orders');
                console.log('📋 Orders:', formattedOrders.map((o: Order) => o.orderNumber).join(', '));
            } catch (error) {
                console.error('❌ Error loading orders:', error);
            }
        }
        
        loadOrders(); // Load langsung tanpa check isMounted
    }, []); // Empty dependency array - hanya run sekali saat mount
    // NOTE: Sebelumnya terdapat logic yang membersihkan data berdasarkan ID yang dimulai dengan "ORD".
    // Itu menyebabkan pesanan yang dibuat oleh user (juga menggunakan prefix "ORD") ikut terhapus saat mount.
    // Untuk menjaga persistensi riwayat user, blok pembersihan ini dihapus. Jika diperlukan pembersihan mock
    // di masa depan, gunakan flag khusus atau pola ID yang berbeda (mis. "MOCK_...") untuk membedakan.

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSuccessful) {
            setShowConfetti(true);
            timer = setTimeout(() => {
                setShowConfetti(false);
            }, 7000); 
        }
        return () => {
            clearTimeout(timer);
        };
    }, [isSuccessful]);

    const filteredHistory = useMemo(() => {
        let orders = history;
        // Filter berdasarkan tanggal
        if (date?.from) {
             orders = orders.filter(order => {
                const orderDate = new Date(order.tanggalPengiriman);
                orderDate.setHours(0, 0, 0, 0); 
                const fromDate = new Date(date.from!);
                fromDate.setHours(0, 0, 0, 0); 
                
                if (date.to) {
                    const toDate = new Date(date.to);
                    toDate.setHours(0, 0, 0, 0); 
                    return orderDate >= fromDate && orderDate <= toDate;
                }
                return orderDate.getTime() === fromDate.getTime();
            });
        }
        
        // Filter berdasarkan status
        if (activeStatusFilter !== 'All') {
            orders = orders.filter(order => order.status === activeStatusFilter);
        }

        return orders;
    }, [history, date, activeStatusFilter]);

    const paginatedHistory = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredHistory.slice(start, start + perPage);
    }, [filteredHistory, currentPage]);

    // reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filteredHistory]);

    const statusCounts = useMemo(() => {
        const counts: Record<OrderStatus | 'All', number> = { All: 0, Pending: 0, Approved: 0, Rejected: 0, Draft: 0, Cancelled: 0 };
        // Logika penghitungan harus berdasarkan tanggal yang difilter juga agar konsisten
        let baseOrders = history;
         if (date?.from) {
            baseOrders = baseOrders.filter(order => {
                const orderDate = new Date(order.tanggalPengiriman);
                orderDate.setHours(0, 0, 0, 0);
                const fromDate = new Date(date.from!);
                fromDate.setHours(0, 0, 0, 0);
                if (date.to) {
                    const toDate = new Date(date.to);
                    toDate.setHours(0, 0, 0, 0);
                    return orderDate >= fromDate && orderDate <= toDate;
                }
                return orderDate.getTime() === fromDate.getTime();
            });
        }
        
        counts.All = baseOrders.length;
        baseOrders.forEach(order => {
            if (counts[order.status] !== undefined) {
                counts[order.status]++;
            }
        });
        return counts;
    }, [history, date]);

    const handleFormSubmit = async (newOrder: Order) => { 
        console.log('📝 Submitting order form...');
        
        try {
            // Get username dari localStorage
            const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'nadia' : 'nadia';
            
            // Prepare payload untuk API
            const payload = {
                kegiatan: newOrder.kegiatan,
                kegiatanLainnya: newOrder.kegiatan === 'Lainnya' ? newOrder.keterangan : undefined,
                tanggalPermintaan: newOrder.tanggalPermintaan.toISOString(),
                tanggalPengiriman: newOrder.tanggalPengiriman.toISOString(),
                untukBagian: newOrder.untukBagian,
                yangMengajukan: newOrder.yangMengajukan,
                noHp: newOrder.noHp,
                namaApprover: newOrder.namaApprover,
                tipeTamu: newOrder.tipeTamu || '',
                keterangan: newOrder.keterangan || '',
                createdBy: username,
                items: newOrder.items.map(item => ({
                    jenisKonsumsi: item.jenisKonsumsi,
                    qty: Number(item.qty) || 0,
                    satuan: item.satuan,
                    lokasiPengiriman: item.lokasiPengiriman,
                    sesiWaktu: item.sesiWaktu,
                    waktu: item.waktu,
                })),
            };
            
            console.log('📤 Payload to API:', payload);
            
            // POST ke API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('❌ API Error:', errorData);
                throw new Error(errorData.error || 'Failed to create order');
            }
            
            const createdOrder = await response.json();
            console.log('✅ Order berhasil dibuat:', createdOrder.orderNumber);
            console.log('📦 Created order data:', createdOrder);
            
            // Update history dengan order baru dari API
            setHistory(prev => [{
                id: createdOrder.id,
                orderNumber: createdOrder.orderNumber,
                kegiatan: createdOrder.kegiatan,
                tanggalPermintaan: new Date(createdOrder.tanggalPermintaan),
                tanggalPengiriman: new Date(createdOrder.tanggalPengiriman),
                untukBagian: createdOrder.untukBagian,
                yangMengajukan: createdOrder.yangMengajukan,
                noHp: createdOrder.noHp,
                namaApprover: createdOrder.namaApprover,
                tipeTamu: createdOrder.tipeTamu || '',
                keterangan: createdOrder.keterangan || '',
                status: createdOrder.status as OrderStatus,
                items: createdOrder.items || [],
            }, ...prev]);
            
            console.log('✅ History updated. New length:', history.length + 1);
            
        } catch (error) {
            console.error('❌ Error creating order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Gagal membuat pesanan: ${errorMessage}\n\nSilakan cek console untuk detail.`);
            throw error; // Re-throw untuk debugging
        }
    };
    
    // Fungsi untuk menangani pembatalan pesanan
    const handleCancelOrder = async (order: Order) => {
        console.log('🚫 Membatalkan pesanan:', order.id);
        
      
        try {
            // PATCH ke API
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Cancelled',
                    tanggalPembatalan: new Date().toISOString(),
                  
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }
            
            const updatedOrder = await response.json();
            console.log('✅ Order berhasil dibatalkan:', updatedOrder.orderNumber);
            
            // Update history
            setHistory(prev => prev.map(item => 
                item.id === order.id 
                    ? { 
                        ...item, 
                        status: 'Cancelled' as OrderStatus,
                        tanggalPembatalan: new Date(updatedOrder.tanggalPembatalan),
                        alasanPembatalan: updatedOrder.alasanPembatalan
                      } 
                    : item
            ));
            
            setOrderDetails(null);
            
        } catch (error) {
            console.error('❌ Error cancelling order:', error);
            alert('Gagal membatalkan pesanan. Silakan coba lagi.');
        }
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <AnimatePresence>
                {showConfetti && <ConfettiCanvas />}
            </AnimatePresence>
            <Card>
                <CardHeader className="p-6">
                    <div className="bg-violet-50 dark:bg-violet-950/50 p-6 rounded-lg border border-violet-200 dark:border-violet-800 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="hidden sm:block"
                            >
                                <CakeSlice className="w-16 h-16 text-violet-400" />
                            </motion.div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-foreground">Konsumsi</CardTitle>
                                <CardDescription>Pengajuan Konsumsi Karyawan.</CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col items-stretch gap-4 w-full md:w-auto">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-auto py-2 px-3 flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="h-5 w-5 text-violet-500" />
                                    <span className="text-sm font-semibold">
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {date.from.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} -{" "}
                                                    {date.to.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </>
                                            ) : (
                                                date.from.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
                                            )
                                        ) : (
                                            "Pilih tanggal"
                                        )}
                                    </span>
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                    />
                                </PopoverContent>
                            </Popover>
                            
                            <div className="relative">
                                <Button 
                                    onClick={() => { setIsFormVisible(true); setIsSuccessful(false); }} 
                                    className="text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105 w-full py-3 px-6"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Pesanan
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="w-full sm:w-auto">
                            <StatusFilterTabs activeFilter={activeStatusFilter} onFilterChange={setActiveStatusFilter} counts={statusCounts} isMounted={isMounted} />
                        </div>
                        
                        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                            <div className="p-1 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center">
                                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-7 w-7 p-0" onClick={() => setViewMode('grid')} aria-label="Grid View"><LayoutGrid className="h-4 w-4" /></Button>
                                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" className="h-7 w-7 p-0" onClick={() => setViewMode('list')} aria-label="List View"><List className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>

                    <OrderHistory 
                        history={paginatedHistory} 
                        onViewDetails={setOrderDetails} 
                        viewMode={viewMode}
                        totalHistoryCount={history.length}
                    />

                    <div className="mt-6">
                        <nav aria-label="Pagination" className="flex justify-center">
                            <button
                                className="btn btn-ghost px-3 py-1 mr-2"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >Previous</button>
                            {Array.from({ length: Math.max(1, Math.ceil(filteredHistory.length / perPage)) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn("mx-1 px-3 py-1 rounded", currentPage === i + 1 ? "bg-violet-600 text-white" : "bg-background border")}
                                >{i + 1}</button>
                            ))}
                            <button
                                className="btn btn-ghost px-3 py-1 ml-2"
                                onClick={() => setCurrentPage(p => Math.min(Math.max(1, Math.ceil(filteredHistory.length / perPage)), p + 1))}
                                disabled={currentPage === Math.max(1, Math.ceil(filteredHistory.length / perPage))}
                            >Next</button>
                        </nav>
                    </div>
                </CardContent>
            </Card>
            
            <OrderDetailsDialog 
                order={orderDetails} 
                isOpen={!!orderDetails} 
                onClose={() => setOrderDetails(null)} 
                onCancelOrder={handleCancelOrder} // [BARU] Melewatkan prop
            />

            {/* Form sekarang berada di dalam Dialog Modal */}
            <Dialog open={isFormVisible} onOpenChange={(isOpen : boolean) => {
                if (!isOpen) { 
                    setIsSuccessful(false); 
                }
                setIsFormVisible(isOpen);
            }}>
                <DialogContent className="p-0 border-0 max-w-3xl bg-transparent shadow-none data-[state=open]:bg-transparent sm:rounded-lg">
                    <DialogTitle className="sr-only">Pemesanan Konsumsi Karyawan</DialogTitle>
                    <DialogDescription className="sr-only">Buka formulir untuk membuat pengajuan konsumsi baru.</DialogDescription>
                    <OrderFormContent
                        initialData={initialFormData}
                        onSubmit={handleFormSubmit}
                        onCancel={() => { setIsFormVisible(false); setIsSuccessful(false); }}
                        isSuccessful={isSuccessful}
                        setIsSuccessful={setIsSuccessful}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}