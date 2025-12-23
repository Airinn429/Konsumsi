//Dialog untuk melihat detail dan pembatalan pesanan.

"use client";

import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, CheckCircle, Clock, FileText, Phone, Plus, User, XCircle, Building, Package, Truck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/consumption";
import { getStatusDisplay } from "@/utils/consumption";

const OrderDetailsDialog: React.FC<{
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onCancelOrder: (order: Order) => void;
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

    // LOGIKA RIWAYAT STATUS DINAMIS
    const timelineEvents = useMemo(() => {
        const events = [];

        // 1. Selalu ada status Pembuatan
        events.push({
            status: `Pesanan Dibuat oleh ${order.yangMengajukan}`,
            date: order.tanggalPermintaan,
            icon: Plus
        });

        // 2. Jika Status Approved/Rejected, masukkan event ke-2
        if (order.status === 'Approved' || order.status === 'Rejected') {
            const approvalDate = new Date(order.tanggalPermintaan);
            approvalDate.setMinutes(approvalDate.getMinutes() + 15);
            events.push({
                status: `Pesanan ${order.status === 'Approved' ? 'Disetujui' : 'Ditolak'} oleh ${order.namaApprover}`,
                date: approvalDate,
                icon: order.status === 'Approved' ? CheckCircle : XCircle
            });
        }

        // 3. Status Pembatalan
        if (order.status === 'Cancelled' && order.tanggalPembatalan) {
            events.push({
                status: order.alasanPembatalan || 'Pesanan Dibatalkan',
                date: order.tanggalPembatalan,
                icon: XCircle
            });
        }

        return events;
    }, [order]);

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

export default OrderDetailsDialog;