"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle, XCircle, Clock, Package, User, Building, FileText, Loader2, List, Search, Activity, AlertTriangle, AlertCircle, MapPin, CalendarDays, Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type OrderStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
type DuplicateStatus = 'NONE' | 'DUPLICATE_EVENT' | 'SAME_DEPT_DIFF_EVENT';

interface ConsumptionItemData {
    jenisKonsumsi: string;
    qty: number;
    satuan: string;
    lokasiPengiriman: string;
    sesiWaktu: string;
    waktu: string;
}

interface Order {
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
    alasanPenolakan?: string;
}

// --- Helper Functions ---
const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
        case 'Approved':
            return { icon: CheckCircle, text: 'Disetujui', color: 'text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800' };
        case 'Pending':
            return { icon: Clock, text: 'Menunggu', color: 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800' };
        case 'Rejected':
            return { icon: XCircle, text: 'Ditolak', color: 'text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800' };
        case 'Cancelled':
            return { icon: XCircle, text: 'Dibatalkan', color: 'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700' };
        default:
            return { icon: Clock, text: 'Draft', color: 'text-gray-700 bg-gray-100 border-gray-200' };
    }
};

const checkDuplicateStatus = (currentOrder: Order, allOrders: Order[]): DuplicateStatus => {
    const otherPendingOrders = allOrders.filter(o => 
        o.id !== currentOrder.id && 
        o.status === 'Pending' &&
        o.untukBagian === currentOrder.untukBagian
    );

    if (otherPendingOrders.length === 0) return 'NONE';

    const hasSameEvent = otherPendingOrders.some(o => 
        o.kegiatan.trim().toLowerCase() === currentOrder.kegiatan.trim().toLowerCase()
    );

    if (hasSameEvent) return 'DUPLICATE_EVENT';
    return 'SAME_DEPT_DIFF_EVENT';
};

// 1. Kartu Pesanan (ApproverCard)
const ApproverCard: React.FC<{ 
    order: Order; 
    duplicateStatus: DuplicateStatus;
    onViewDetails: (order: Order) => void; 
    onAction: (order: Order, action: 'Approved' | 'Rejected') => void; 
}> = ({ order, duplicateStatus, onViewDetails, onAction }) => {
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    const firstItem = order.items[0];

    let cardBorderClass = "";
    let duplicateBadge = null;

    if (order.status === 'Pending') {
        if (duplicateStatus === 'DUPLICATE_EVENT') {
            cardBorderClass = "border-red-400 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10";
            duplicateBadge = (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-md border border-red-200 dark:border-red-800 mb-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Duplikat: Ada pengajuan lain untuk acara ini!</span>
                </div>
            );
        } else if (duplicateStatus === 'SAME_DEPT_DIFF_EVENT') {
            cardBorderClass = "border-yellow-400 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-900/10";
            duplicateBadge = (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-md border border-yellow-200 dark:border-yellow-800 mb-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Info: Dept. ini mengajukan acara lain.</span>
                </div>
            );
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn("w-full shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full border-2", cardBorderClass)}>
                <CardHeader className="p-5 pb-3 border-b bg-white/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">{order.orderNumber}</span>
                                <span className="text-xs text-slate-500">{order.tanggalPengiriman.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                            </div>
                            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1" title={order.kegiatan}>
                                {order.kegiatan}
                            </CardTitle>
                        </div>
                        <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5", statusDisplay.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {statusDisplay.text}
                        </span>
                    </div>
                </CardHeader>
                
                <CardContent className="p-5 space-y-4 text-sm flex-grow">
                    {duplicateBadge}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> Pengaju</p>
                            <p className="font-medium truncate" title={order.yangMengajukan}>{order.yangMengajukan.split('(')[0]}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Building className="h-3 w-3" /> Bagian</p>
                            <p className="font-medium truncate" title={order.untukBagian}>{order.untukBagian}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                         <div className="flex items-start gap-2">
                            <Package className="h-4 w-4 text-violet-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-slate-700 dark:text-slate-200">{firstItem?.jenisKonsumsi}</p>
                                <p className="text-xs text-slate-500">{firstItem?.qty} {firstItem?.satuan} • {firstItem?.sesiWaktu}</p>
                            </div>
                         </div>
                         {order.items.length > 1 && (
                            <p className="text-xs text-violet-600 dark:text-violet-400 font-medium pl-6">
                                + {order.items.length - 1} item lainnya
                            </p>
                         )}
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between gap-2 border-t bg-slate-50/30 dark:bg-slate-900/30 mt-auto items-center pt-4">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(order)} className="text-slate-600">
                        Detail
                    </Button>
                    
                    {order.status === 'Pending' && (
                        <div className="flex gap-2">
                            <RejectDialog order={order} onReject={(reason) => onAction(order, 'Rejected')} />
                            <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                onClick={() => onAction(order, 'Approved')}
                            >
                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                Setujui
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

// 2. Modal Tolak (RejectDialog)
const RejectDialog: React.FC<{ order: Order; onReject: (reason: string) => void; }> = ({ order, onReject }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRejectSubmit = () => {
        if (!reason.trim()) return;
        setIsSubmitting(true);
        setTimeout(() => {
             onReject(reason);
             setIsSubmitting(false);
             setIsOpen(false);
             setReason('');
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950">
                    Tolak
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-l-4 border-l-red-500 bg-white dark:bg-slate-900">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3 text-red-600">
                         <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                         </div>
                         <DialogTitle className="text-xl">Tolak Pengajuan?</DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-slate-600 dark:text-slate-300">
                        Anda akan menolak pengajuan <strong>{order.orderNumber}</strong> untuk kegiatan <strong>{order.kegiatan}</strong>. 
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Alasan Penolakan <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            placeholder="Alasan penolakan..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="resize-none focus-visible:ring-red-500"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Batal</Button>
                    <Button 
                        onClick={handleRejectSubmit} 
                        disabled={isSubmitting || !reason.trim()} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Konfirmasi Penolakan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// 3. Modal Detail Pesanan (OrderDetailViewer)
const OrderDetailViewer: React.FC<{ order: Order | null; isOpen: boolean; onClose: () => void; }> = ({ order, isOpen, onClose }) => {
    if (!order) return null;
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    
    const tglPermintaan = order.tanggalPermintaan.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const tglPengiriman = order.tanggalPengiriman.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const DetailItem = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: any }) => (
        <div className="flex gap-3 items-start">
            {Icon && <Icon className="w-4 h-4 text-slate-400 mt-0.5" />}
            <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{value}</div>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl p-0 bg-slate-50/50 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="p-6 bg-white dark:bg-slate-900 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Detail Pesanan</h2>
                            <span className="font-mono text-sm px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600">{order.orderNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays className="w-4 h-4" />
                            <span>Diajukan pada: {tglPermintaan}</span>
                        </div>
                    </div>
                    <div className={cn("px-4 py-1.5 rounded-full border flex items-center gap-2 font-medium text-sm", statusDisplay.color)}>
                        <StatusIcon className="w-4 h-4" />
                        {statusDisplay.text}
                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-violet-500" /> Informasi Acara
                            </h3>
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <DetailItem label="Nama Kegiatan" value={order.kegiatan} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <DetailItem label="Tanggal Acara" value={tglPengiriman} />
                                        <DetailItem label="Tipe Tamu" value={order.tipeTamu} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                <User className="w-4 h-4 text-violet-500" /> Informasi Pemesan
                            </h3>
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <DetailItem label="Nama Pengaju" value={order.yangMengajukan} />
                                    <DetailItem label="Departemen" value={order.untukBagian} />
                                    <DetailItem label="Kontak" value={order.noHp} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-violet-500" /> Daftar Item
                        </h3>
                        <div className="rounded-lg border bg-white dark:bg-slate-900 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Item</th>
                                        <th className="px-4 py-3 font-medium">Jumlah</th>
                                        <th className="px-4 py-3 font-medium">Waktu</th>
                                        <th className="px-4 py-3 font-medium">Lokasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 font-medium">{item.jenisKonsumsi}</td>
                                            <td className="px-4 py-3 font-semibold">{item.qty} {item.satuan}</td>
                                            <td className="px-4 py-3">{item.sesiWaktu}</td>
                                            <td className="px-4 py-3 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{item.lokasiPengiriman}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-white dark:bg-slate-900">
                    <DialogClose asChild><Button variant="outline">Tutup</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- Status Filter Tabs ---
interface StatusFilterTabsProps {
    activeFilter: OrderStatus | 'All';
    onFilterChange: (status: OrderStatus | 'All') => void;
    counts: Record<OrderStatus | 'All', number>;
    isMounted?: boolean;
}

const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ activeFilter, onFilterChange, counts, isMounted = true }) => {
    const filters: { label: string; value: OrderStatus | 'All'; icon: React.ElementType }[] = [
        { label: "All", value: "All", icon: List },
        { label: "Menunggu", value: "Pending", icon: Clock },
        { label: "Disetujui", value: "Approved", icon: CheckCircle },
        { label: "Ditolak", value: "Rejected", icon: XCircle },
    ];

    return (
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
            {filters.map(filter => {
                const isActive = activeFilter === filter.value;
                const count = counts[filter.value as keyof typeof counts];
                return (
                    <Button 
                        key={filter.value} 
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={cn("flex items-center gap-2 rounded-full px-4 h-9", isActive ? "bg-slate-900 text-white" : "bg-white text-slate-600")}
                        onClick={() => onFilterChange(filter.value as any)}
                    >
                        <filter.icon className="h-4 w-4" />
                        <span>{filter.label}</span>
                        {isMounted && count > 0 && <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{count}</span>}
                    </Button>
                );
            })}
        </div>
    );
}

// --- Main Page Component ---
export default function ApproverDashboard() {
    const [approverName, setApproverName] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('Pending');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const name = localStorage.getItem('username');
            setApproverName(name || 'Approver');
        }
    }, []);

    const fetchOrders = async () => {
        if (!approverName || approverName === 'Approver') return; 
        setIsLoading(true);
        try {
            const response = await fetch(`/api/orders?username=${encodeURIComponent(approverName)}&role=approver`);
            if (!response.ok) return;
            const data = await response.json();
            setOrders(data.map((order: any) => ({
                ...order,
                tanggalPengiriman: new Date(order.tanggalPengiriman),
                tanggalPermintaan: new Date(order.tanggalPermintaan),
            })));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isMounted && approverName) fetchOrders();
    }, [isMounted, approverName]);

    const handleAction = async (order: Order, action: 'Approved' | 'Rejected', reason: string = '') => {
        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action })
            });
            if (!response.ok) throw new Error('Gagal update status');
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: action, alasanPenolakan: reason } : o));
            
            // PICU EVENT: Memberitahu Navbar untuk memperbarui angka lonceng secara otomatis
            window.dispatchEvent(new Event('refresh-pending-count'));

        } catch (error) {
            console.error(error);
        }
    };
    
    const filteredOrders = useMemo(() => {
        let result = orders;
        if (activeFilter !== 'All') result = result.filter(o => o.status === activeFilter);
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(o => o.orderNumber.toLowerCase().includes(lowerQuery) || o.kegiatan.toLowerCase().includes(lowerQuery) || o.yangMengajukan.toLowerCase().includes(lowerQuery));
        }
        return result;
    }, [orders, activeFilter, searchQuery]);

    const statusCounts = useMemo(() => {
        const counts = { Pending: 0, Approved: 0, Rejected: 0, Cancelled: 0, All: orders.length };
        orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });
        return counts;
    }, [orders]);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Dashboard Persetujuan</h1>
                        <p className="text-slate-500 mt-1">Halo, <span className="font-semibold text-violet-600">{approverName}</span>! Ada <span className="font-bold text-amber-600">{statusCounts.Pending}</span> pesanan menunggu.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Cari..." className="pl-9 bg-slate-50 dark:bg-slate-800" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <StatusFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={statusCounts} isMounted={isMounted} />

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-3"><Loader2 className="h-10 w-10 animate-spin text-violet-500" /></div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-slate-50/50">
                        <List className="h-8 w-8 text-slate-400 mb-4" /><h3 className="text-lg font-semibold text-slate-900">Tidak ada pesanan</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map(order => (
                                <ApproverCard key={order.id} order={order} duplicateStatus={checkDuplicateStatus(order, orders)} onViewDetails={setSelectedOrder} onAction={handleAction} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <OrderDetailViewer order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
}