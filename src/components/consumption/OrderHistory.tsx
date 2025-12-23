"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Order } from "@/types/consumption";
import { getStatusDisplay } from "@/utils/consumption";
import Lottie from "lottie-react";

// [UPDATE] Import file animasi baru (pastikan file sudah direname jadi 'empty-status.json')
import emptyStatusAnimation from "@/assets/lottie/empty-status.json";

// --- Komponen Kartu Pesanan (Grid View) ---
const OrderCard: React.FC<{ order: Order; onViewDetails: (order: Order) => void; }> = ({ order, onViewDetails }) => {
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    const dateFormatted = new Date(order.tanggalPengiriman).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

    return (
        <Card className="w-full h-full flex flex-col shadow-md transition-all duration-300 group hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 relative overflow-hidden border">
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
                <span className="font-semibold text-base leading-tight text-foreground line-clamp-2" title={order.kegiatan}>{order.kegiatan}</span>

                <div className="flex items-start space-x-3 text-muted-foreground border-t pt-3">
                    <Package className="h-4 w-4 text-violet-500 mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Menu</span>
                        <span className="font-medium text-foreground">{firstItem?.jenisKonsumsi || 'N/A'} ({firstItem?.qty || 0} {firstItem?.satuan || ''})</span>
                        {order.items && order.items.length > 1 && (
                            <span className="text-xs text-violet-500 mt-1 font-semibold">+ {order.items.length - 1} item lainnya</span>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 border-t flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
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

// --- Komponen List Item (List View) ---
const OrderListItem: React.FC<{ order: Order; onViewDetails: (order: Order) => void; }> = ({ order, onViewDetails }) => {
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    
    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                <div className="flex items-center gap-4 mb-2 sm:mb-0 flex-grow min-w-0">
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-base text-violet-600 dark:text-violet-400 truncate">{order.kegiatan}</span>
                        <span className="text-sm text-muted-foreground">
                            {order.id} &bull; {firstItem?.jenisKonsumsi || 'N/A'} 
                            {order.items && order.items.length > 1 ? ` (+${order.items.length - 1} lainnya)` : ''}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full", statusDisplay.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusDisplay.text}
                    </span>
                    <Button 
                        size="sm" 
                        className="h-8 bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/60 dark:text-violet-300 dark:hover:bg-violet-900" 
                        onClick={() => onViewDetails(order)}
                    > 
                        Detail
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// --- Komponen Utama History ---
interface OrderHistoryProps {
    history: Order[];
    onViewDetails: (order: Order) => void;
    viewMode: 'grid' | 'list';
    totalHistoryCount: number;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ history, onViewDetails, viewMode, totalHistoryCount }) => {
    return (
        <div className="w-full mt-4 min-h-[50vh]">
            {history.length === 0 ? (
                // --- TAMPILAN KOSONG DENGAN ANIMASI BARU (Empty Status) ---
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 min-h-[400px]">
                    
                    {/* Container Animasi Lottie */}
                    <div className="w-64 h-64 mb-4">
                        <Lottie 
                            animationData={emptyStatusAnimation} 
                            loop={true} 
                            autoplay={true} 
                        />
                    </div>

                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {totalHistoryCount === 0 ? "Belum Ada Pesanan" : "Tidak Ada Hasil"}
                        </h3>
                        <p className="text-slate-500 max-w-xs text-sm mx-auto">
                            {totalHistoryCount === 0
                                ? "Anda belum pernah membuat pesanan konsumsi. Silakan buat pesanan baru."
                                : "Tidak ada data pesanan yang cocok dengan filter yang Anda pilih."
                            }
                        </p>
                    </motion.div>
                </div>
            ) : (
                // --- TAMPILAN DATA ADA ---
                <AnimatePresence mode="popLayout">
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
};