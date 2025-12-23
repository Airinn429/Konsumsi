"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, User, Building, Package, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, DuplicateStatus } from "@/types/consumption";
import { getStatusDisplay } from "@/utils/consumption";

interface ApproverCardProps {
    order: Order;
    duplicateStatus: DuplicateStatus;
    onViewDetails: (order: Order) => void;
    onAction: (order: Order, action: 'Approved' | 'Rejected') => void;
}

export const ApproverCard: React.FC<ApproverCardProps> = ({ order, duplicateStatus, onViewDetails, onAction }) => {
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

    // Style berdasarkan status duplikasi
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
                                <span className="text-xs text-slate-500">{new Date(order.tanggalPengiriman).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
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
                                <p className="font-medium text-slate-700 dark:text-slate-200">{firstItem?.jenisKonsumsi || '-'}</p>
                                <p className="text-xs text-slate-500">{firstItem?.qty} {firstItem?.satuan} • {firstItem?.sesiWaktu}</p>
                            </div>
                         </div>
                         {order.items && order.items.length > 1 && (
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
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => onAction(order, 'Rejected')}
                            >
                                <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                            </Button>
                            <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                onClick={() => onAction(order, 'Approved')}
                            >
                                <CheckCircle className="w-4 h-4 mr-1.5" /> Setujui
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};