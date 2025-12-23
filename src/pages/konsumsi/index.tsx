"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, CakeSlice, LayoutGrid, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { DateRange } from "react-day-picker";

// Import komponen yang telah dipecah
import { OrderForm } from "@/components/consumption/OrderForm";
import { OrderHistory } from "@/components/consumption/OrderHistory";
import OrderDetailsDialog from "@/components/consumption/OrderDetailsDialog";
import { StatusFilterTabs } from "@/components/shared/StatusFilterTabs";
import { ConfettiCanvas } from "@/components/ui/confetti";

import { Order, OrderStatus, FormData } from "@/types/consumption";

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
    tipeTamu: '',
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

export default function ConsumptionOrderPage() {
    const [history, setHistory] = useState<Order[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: undefined,
    });
    const [activeStatusFilter, setActiveStatusFilter] = useState<OrderStatus | 'All'>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        async function loadOrders() {
            try {
                const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
                if (!username) return;
                const response = await fetch(`/api/orders?username=${encodeURIComponent(username)}`);
                if (!response.ok) return;
                const orders = await response.json();
                const formattedOrders: Order[] = orders.map((order: any) => ({
                    ...order,
                    tanggalPermintaan: new Date(order.tanggalPermintaan),
                    tanggalPengiriman: new Date(order.tanggalPengiriman),
                    tanggalPembatalan: order.tanggalPembatalan ? new Date(order.tanggalPembatalan) : undefined,
                    items: order.items || [],
                }));
                setHistory(formattedOrders);
            } catch (error) {
                console.error('❌ Error loading orders:', error);
            }
        }
        loadOrders();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSuccessful) {
            setShowConfetti(true);
            timer = setTimeout(() => {
                setShowConfetti(false);
            }, 7000);
        }
        return () => clearTimeout(timer);
    }, [isSuccessful]);

    const filteredHistory = useMemo(() => {
        let orders = history;
        if (date?.from) {
            orders = orders.filter(order => {
                const orderDate = new Date(order.tanggalPermintaan);
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
        if (activeStatusFilter !== 'All') {
            orders = orders.filter(order => order.status === activeStatusFilter);
        }
        return orders;
    }, [history, date, activeStatusFilter]);

    const paginatedHistory = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredHistory.slice(start, start + perPage);
    }, [filteredHistory, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filteredHistory]);

    const statusCounts = useMemo(() => {
        const counts: Record<OrderStatus | 'All', number> = { All: 0, Pending: 0, Approved: 0, Rejected: 0, Draft: 0, Cancelled: 0 };
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
            if (counts[order.status] !== undefined) counts[order.status]++;
        });
        return counts;
    }, [history, date]);

    const handleFormSubmit = async (newOrder: Order) => {
        setHistory(prev => [newOrder, ...prev]);
    };

    const handleCancelOrder = async (order: Order) => {
        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Cancelled',
                    tanggalPembatalan: new Date().toISOString(),
                }),
            });
            if (!response.ok) throw new Error('Failed to cancel order');
            const updatedOrder = await response.json();
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
                onCancelOrder={handleCancelOrder}
            />

            <Dialog open={isFormVisible} onOpenChange={(isOpen: boolean) => {
                if (!isOpen) setIsSuccessful(false);
                setIsFormVisible(isOpen);
            }}>
                <DialogContent className="flex flex-col p-0 border-0 bg-transparent shadow-none data-[state=open]:bg-transparent sm:rounded-lg h-[85vh] sm:max-w-3xl w-full max-w-full">
                    <DialogTitle className="sr-only">Pemesanan Konsumsi Karyawan</DialogTitle>
                    <DialogDescription className="sr-only">Buka formulir untuk membuat pengajuan konsumsi baru.</DialogDescription>
                    <div className="flex-1 h-full min-h-0">
                        <OrderForm
                            initialData={initialFormData}
                            onSubmit={handleFormSubmit}
                            onCancel={() => { setIsFormVisible(false); setIsSuccessful(false); }}
                            isSuccessful={isSuccessful}
                            setIsSuccessful={setIsSuccessful}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}