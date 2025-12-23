"use client";

import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Activity, FileText, User, XCircle, Utensils, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/consumption";
import { getStatusDisplay } from "@/utils/consumption";

// --- Sub-komponen kecil untuk baris detail ---
const DetailItem = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: any }) => (
    <div className="flex gap-3 items-start">
        {Icon && <Icon className="w-4 h-4 text-slate-400 mt-0.5" />}
        <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</p>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{value}</div>
        </div>
    </div>
);

// --- Komponen Utama (Gunakan export const) ---
export const OrderDetailViewer: React.FC<{ order: Order | null; isOpen: boolean; onClose: () => void; }> = ({ order, isOpen, onClose }) => {
    if (!order) return null;
    const statusDisplay = getStatusDisplay(order.status);
    const StatusIcon = statusDisplay.icon;
    
    // Format tanggal
    const tglPermintaan = new Date(order.tanggalPermintaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const tglPengiriman = new Date(order.tanggalPengiriman).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl p-0 bg-slate-50/50 bg-white dark:bg-slate-950 overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-white dark:bg-slate-900 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Detail Pesanan</h2>
                            <span className="font-mono text-sm px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                                {order.orderNumber}
                            </span>
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

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Kiri: Info Acara */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-violet-500" /> Informasi Acara
                            </h3>
                            <Card><CardContent className="p-4 space-y-4">
                                <DetailItem label="Nama Kegiatan" value={order.kegiatan} />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Tanggal Acara" value={tglPengiriman} />
                                    <DetailItem label="Tipe Tamu" value={order.tipeTamu} />
                                </div>
                                {order.keterangan && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Catatan Tambahan</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{order.keterangan}"</p>
                                    </div>
                                )}
                            </CardContent></Card>
                        </div>

                        {/* Kolom Kanan: Info Pemesan */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                <User className="w-4 h-4 text-violet-500" /> Informasi Pemesan
                            </h3>
                            <Card><CardContent className="p-4 space-y-4">
                                <DetailItem label="Nama Pengaju" value={order.yangMengajukan} />
                                <DetailItem label="Departemen / Bagian" value={order.untukBagian} />
                                <DetailItem label="Kontak (HP)" value={order.noHp} />
                            </CardContent></Card>

                            {order.status === 'Rejected' && order.alasanPenolakan && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-2"><XCircle className="w-4 h-4" /> Alasan Penolakan</h4>
                                    <p className="text-sm text-red-600 dark:text-red-300">{order.alasanPenolakan}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Daftar Item */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-violet-500" /> Daftar Pesanan Konsumsi
                        </h3>
                        <div className="rounded-lg border bg-white dark:bg-slate-900 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Menu / Item</th>
                                        <th className="px-4 py-3 font-medium">Jumlah</th>
                                        <th className="px-4 py-3 font-medium">Waktu & Sesi</th>
                                        <th className="px-4 py-3 font-medium">Lokasi Pengiriman</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-slate-800">
                                    {order.items && order.items.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.jenisKonsumsi}</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-semibold">{item.qty} {item.satuan}</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">
                                                    <Clock className="w-3 h-3" /> {item.sesiWaktu} ({item.waktu})
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.lokasiPengiriman}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-white dark:bg-slate-900">
                    <DialogClose asChild><Button variant="outline" className="w-full sm:w-auto">Tutup</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};