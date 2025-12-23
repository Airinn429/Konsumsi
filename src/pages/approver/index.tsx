"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// Sesuaikan path import animasi JSON Anda
import noDataAnimation from "@/assets/lottie/no-data.json";

// Import Type & Utils
import { Order, OrderStatus } from "@/types/consumption";
import { checkDuplicateStatus } from "@/utils/consumption";

// Import Shared Component
import { StatusFilterTabs } from "@/components/shared/StatusFilterTabs";

// Import Approver Components
import { ApproverCard } from "@/components/approver/ApproverCard";
import { RejectDialog } from "@/components/approver/RejectDialog";
import { OrderDetailViewer } from "@/components/approver/OrderDetailViewer";

export default function ApproverDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('Pending');
    const [approverName, setApproverName] = useState<string>('Approver');
    
    // State Aksi
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [targetRejectOrder, setTargetRejectOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const name = localStorage.getItem('username');
            setApproverName(name || 'Approver');
        }
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            // Sesuaikan endpoint API Anda
            const response = await fetch(`/api/orders?username=${encodeURIComponent(approverName)}&role=approver`);
            if (response.ok) {
                const data = await response.json();
                const formattedOrders: Order[] = data.map((order: any) => ({
                    ...order,
                    tanggalPengiriman: new Date(order.tanggalPengiriman),
                    tanggalPermintaan: new Date(order.tanggalPermintaan),
                }));
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (approverName) fetchOrders();
    }, [approverName]);

    const handleAction = async (order: Order, action: 'Approved' | 'Rejected', reason: string = '') => {
        if (action === 'Rejected') {
            setTargetRejectOrder(order);
            setIsRejectOpen(true);
            return;
        }

        // Logic Approve langsung
        if(!confirm("Setujui pesanan ini?")) return;
        
        try {
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: action } : o));
            }
        } catch (error) {
            alert("Gagal menyetujui pesanan.");
        }
    };

    const handleConfirmReject = async (reason: string) => {
        if (!targetRejectOrder) return;
        try {
            const res = await fetch(`/api/orders/${targetRejectOrder.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Rejected', alasanPenolakan: reason })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === targetRejectOrder.id ? { ...o, status: 'Rejected', alasanPenolakan: reason } : o));
                setIsRejectOpen(false);
            }
        } catch (error) {
            alert("Gagal menolak pesanan.");
        }
    };

    const filteredOrders = useMemo(() => {
        let result = orders;
        if (activeFilter !== 'All') {
            result = result.filter(o => o.status === activeFilter);
        }
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(o => 
                o.orderNumber?.toLowerCase().includes(lowerQuery) ||
                o.kegiatan.toLowerCase().includes(lowerQuery) ||
                o.yangMengajukan.toLowerCase().includes(lowerQuery)
            );
        }
        return result;
    }, [orders, activeFilter, searchQuery]);

    const statusCounts = useMemo(() => {
        const counts: any = { Pending: 0, Approved: 0, Rejected: 0, Cancelled: 0, All: orders.length };
        orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });
        return counts;
    }, [orders]);

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Dashboard Persetujuan</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Halo, <span className="font-semibold text-violet-600">{approverName}</span>! Ada <span className="font-bold text-amber-600">{statusCounts.Pending}</span> pesanan menunggu.
                        </p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Cari pesanan..." 
                            className="pl-9" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <StatusFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={statusCounts} />

                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-violet-500" /></div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 min-h-[400px]">
                        {/* Container untuk Lottie */}
                        <div className="w-64 h-64 mb-4">
                            <Lottie 
                                animationData={noDataAnimation} 
                                loop={true} 
                                autoplay={true}
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Tidak ada pesanan {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-sm mt-1">
                            {activeFilter === 'Pending' 
                                ? "Kerja bagus! Semua pesanan sudah Anda proses." 
                                : "Belum ada data pesanan yang sesuai dengan filter ini."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map(order => (
                                <ApproverCard
                                    key={order.id}
                                    order={order}
                                    duplicateStatus={checkDuplicateStatus(order, orders)}
                                    onViewDetails={(o) => { setSelectedOrder(o); setIsDetailOpen(true); }}
                                    onAction={handleAction}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <OrderDetailViewer 
                order={selectedOrder} 
                isOpen={isDetailOpen} 
                onClose={() => setIsDetailOpen(false)} 
            />

            <RejectDialog 
                isOpen={isRejectOpen} 
                onClose={() => setIsRejectOpen(false)} 
                onConfirm={handleConfirmReject} 
            />
        </div>
    );
}