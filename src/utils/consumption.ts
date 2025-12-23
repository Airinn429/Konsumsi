import { CheckCircle, Clock, XCircle } from "lucide-react";
import { OrderStatus, Order, DuplicateStatus } from "@/types/consumption";

// Helper function untuk menampilkan status (Warna & Icon)
export const getStatusDisplay = (status: OrderStatus) => {
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

// Helper function untuk mengecek duplikasi (Khusus halaman Approver)
export const checkDuplicateStatus = (currentOrder: Order, allOrders: Order[]): DuplicateStatus => {
    // 1. Filter pesanan lain yang statusnya 'Pending' dan dari Departemen/Bagian yang sama
    const otherPendingOrders = allOrders.filter(o => 
        o.id !== currentOrder.id && 
        o.status === 'Pending' &&
        o.untukBagian === currentOrder.untukBagian
    );

    // Jika tidak ada pesanan lain dari departemen ini, aman (NONE)
    if (otherPendingOrders.length === 0) return 'NONE';

    // 2. Cek apakah ada yang nama kegiatannya sama persis (indikasi duplikat kuat)
    const hasSameEvent = otherPendingOrders.some(o => 
        o.kegiatan.trim().toLowerCase() === currentOrder.kegiatan.trim().toLowerCase()
    );

    if (hasSameEvent) return 'DUPLICATE_EVENT';

    // 3. Jika tidak ada kegiatan sama, tapi dari departemen sama (indikasi multiple request dalam satu waktu)
    return 'SAME_DEPT_DIFF_EVENT';
};