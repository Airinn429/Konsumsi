//Daftar riwayat pesanan (Card & List).

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Order } from "@/types/consumption";
import { getStatusDisplay } from "@/utils/consumption";

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
                <div className="h-full flex items-center justify-center text-center text-muted-foreground rounded-xxl border-2 border-dashed p-8 min-h-[400px]">
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
                        <div className="relative">
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

                            {/* Animations for bubbles omitted for brevity but should be included if desired */}
                        </div>

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