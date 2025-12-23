//Formulir pemesanan yang kompleks.

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2, ChevronDown, Plus, Trash2, CheckCircle, X, Activity, MapPin, UserCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";

import { SearchableSelect } from "@/components/ui/searchable-select";
import {
    KEGIATAN_OPTIONS, BAGIAN_OPTIONS, APPROVER_OPTIONS, TIPE_TAMU_OPTIONS,
    LOKASI_OPTIONS, SATUAN_OPTIONS, SESI_WAKTU_OPTIONS, MENU_BY_TIME, MENU_BY_GUEST_TYPE, UNIT_BY_CONSUMPTION
} from "@/constants/consumption";
import { Order, FormData, ConsumptionGroup, ConsumptionSubItem, ConsumptionItemData, OrderStatus } from "@/types/consumption";

interface OrderFormProps {
    initialData: FormData;
    onSubmit: (data: Order) => void;
    onCancel: () => void;
    isSuccessful: boolean;
    setIsSuccessful: (isSuccessful: boolean) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData, onSubmit, onCancel, isSuccessful, setIsSuccessful }) => {

    const [formData, setFormData] = useState<FormData>(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return {
            ...initialData,
            tanggalPermintaan: today,
            tanggalPengiriman: tomorrow,
        };
    });

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submissionTime, setSubmissionTime] = useState<Date | null>(null);

    const todayAtMidnight = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const minDeliveryDateObj = useMemo(() => {
        const minDate = new Date(formData.tanggalPermintaan);
        minDate.setHours(0, 0, 0, 0);
        const latestMinDate = (minDate.getTime() > todayAtMidnight.getTime() ? minDate : todayAtMidnight);
        return latestMinDate;
    }, [formData.tanggalPermintaan, todayAtMidnight]);

    const handleRemoveGroup = (groupId: string) => {
        setFormData(prev => ({
            ...prev,
            groups: prev.groups.filter(g => g.id !== groupId)
        }));
    };

    const handleGroupChange = (groupId: string, fieldName: keyof Omit<ConsumptionGroup, 'id' | 'subItems'>, value: string) => {
        setFormData(prev => ({
            ...prev,
            groups: prev.groups.map(group =>
                group.id === groupId ? { ...group, [fieldName]: value } : group
            )
        }));
        const errorKey = `group-${groupId}-${fieldName}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

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

    const handleSubItemChange = (id: string, subItemId: string, fieldName: keyof Omit<ConsumptionSubItem, 'id'>, value: string | number) => {
        setFormData(prev => {
            const newGroups = prev.groups.map(group => {
                if (group.id === id) {
                    const newSubItems = group.subItems.map(subItem => {
                        if (subItem.id === subItemId) {
                            const updatedSubItem = { ...subItem, [fieldName]: value };

                            if (fieldName === 'jenisKonsumsi') {
                                let foundSatuan = '';
                                for (const satuan in UNIT_BY_CONSUMPTION) {
                                    if (UNIT_BY_CONSUMPTION[satuan].includes(value as string)) {
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

    const handleDateChange = (name: keyof FormData, date: Date | undefined) => {
        if (date) {
            setFormData(prev => ({ ...prev, [name]: date }));
        }

        if (name === 'tanggalPermintaan' && date) {
            const minDeliveryDate = new Date(date);
            minDeliveryDate.setHours(0, 0, 0, 0);

            const currentDeliveryDate = new Date(formData.tanggalPengiriman);
            currentDeliveryDate.setHours(0, 0, 0, 0);

            if (currentDeliveryDate.getTime() < minDeliveryDate.getTime()) {
                setFormData(prev => ({ ...prev, tanggalPengiriman: minDeliveryDate }));
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.kegiatan) newErrors.kegiatan = "Kegiatan wajib diisi.";
        if (formData.kegiatan === 'Lainnya' && !formData.kegiatanLainnya) newErrors.kegiatanLainnya = "Harap sebutkan nama kegiatan.";
        if (!formData.namaApprover) newErrors.namaApprover = "Approver wajib dipilih.";
        if (!formData.tipeTamu) newErrors.tipeTamu = "Tipe tamu wajib dipilih.";

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

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);

        try {
            const itemsToSubmit: ConsumptionItemData[] = [];

            formData.groups.forEach(group => {
                group.subItems.forEach(subItem => {
                    const quantity = typeof subItem.qty === 'string'
                        ? parseInt(subItem.qty)
                        : subItem.qty;

                    itemsToSubmit.push({
                        lokasiPengiriman: group.lokasiPengiriman,
                        sesiWaktu: group.sesiWaktu,
                        waktu: group.waktu || '',
                        jenisKonsumsi: subItem.jenisKonsumsi,
                        qty: quantity || 0,
                        satuan: subItem.satuan,
                    });
                });
            });

            const finalKegiatan = formData.kegiatan === 'Lainnya' ? formData.kegiatanLainnya : formData.kegiatan;
            const actualUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

            const payload = {
                kegiatan: finalKegiatan,
                kegiatanLainnya: formData.kegiatan === 'Lainnya' ? formData.kegiatanLainnya : undefined,
                tanggalPermintaan: formData.tanggalPermintaan,
                tanggalPengiriman: formData.tanggalPengiriman,
                untukBagian: formData.untukBagian,
                yangMengajukan: formData.yangMengajukan,
                noHp: formData.noHp,
                namaApprover: formData.namaApprover,
                tipeTamu: formData.tipeTamu,
                keterangan: formData.keterangan,
                createdBy: actualUsername || formData.yangMengajukan,
                items: itemsToSubmit
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Gagal mengirim pesanan');
            }

            const createdOrder = await response.json();

            const formattedOrderForState: Order = {
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
            };

            onSubmit(formattedOrderForState);
            setIsReviewOpen(false);
            setIsSuccessful(true);
            setSubmissionTime(new Date());

        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Terjadi kesalahan saat menyimpan pesanan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => { if (isSuccessful) { setFormData(initialData); setErrors({}); } }, [isSuccessful, initialData]);

    const allOptions = useMemo(() => ({ KEGIATAN_OPTIONS, BAGIAN_OPTIONS, APPROVER_OPTIONS, TIPE_TAMU_OPTIONS, LOKASI_OPTIONS, SATUAN_OPTIONS, SESI_WAKTU_OPTIONS }), []);

    const ReviewDetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div className="flex justify-between items-start py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-right">{value}</dd>
        </div>
    );

    return (
        <>
            <Card className="w-full max-w-3xl shadow-xl border h-full flex flex-col overflow">
                <CardHeader className="p-6 flex-shrink-0">
                    <CardTitle className="text-2xl font-bold text-foreground">Pemesanan Konsumsi Karyawan</CardTitle>
                    <CardDescription>
                        {isSuccessful ? (<span className="text-green-600 font-medium">Pesanan Anda berhasil dikirim!</span>) : ("Silahkan Isi Pengajuan Pemesanan Konsumsi Anda.")}
                    </CardDescription>

                    {!isSuccessful && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                            <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/50 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-1 bg-white dark:bg-violet-900 rounded-lg">
                                        <div className="p-2 bg-white dark:bg-violet-900 rounded-lg shrink-0 flex items-center justify-center">
                                            <IoIosInformationCircleOutline className="w-6 h-6 text-violet-600 dark:text-violet-400" />                                                                </div>
                                    </div>
                                    <div className="flex-4">
                                        <h3 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">Informasi Order</h3>
                                        <ul className="space-y-1 text-sm text-violet-700 dark:text-violet-300">
                                            <li>• Order dilakukan minimal H-1 kegiatan</li>
                                            <li>• Order dapat dilakukan pada pukul 07:00 - 14:00</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-1 bg-white dark:bg-amber-900 rounded-lg">
                                        <div className="p-2 bg-white dark:bg-violet-900 rounded-lg shrink-0 flex items-center justify-center">
                                            <IoWarningOutline className="w-6 h-6 text-amber-600 dark:text-amber-400" />                                                                </div>
                                    </div>
                                    <div className="flex-4">
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col overflow-y-auto">
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
                        <CardFooter className="flex-col sm:flex-row justify-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
                            <Button onClick={() => setIsSuccessful(false)} className="text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105">
                                <Plus className="mr-2 h-4 w-4" /> Buat Pesanan Baru
                            </Button>
                        </CardFooter>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                        <form onSubmit={handleReviewSubmit} className="flex flex-col h-full">
                            <CardContent
                                className="grid gap-6 p-6 flex-1 overflow-y-auto scrollbar-thin"
                            >

                                {/* KATEGORI 1: INFORMASI UMUM */}
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-violet-700 dark:text-violet-400">Informasi Umum & Pemesan</h4>
                                    </div>
                                    <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin">
                                        <SearchableSelect
                                            value={formData.kegiatan}
                                            onValueChange={(value) => handleChange('kegiatan', value)}
                                            options={allOptions.KEGIATAN_OPTIONS}
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
                                        <div className="space-y-2">
                                            <Label htmlFor="tanggalPermintaan">Tanggal Permintaan</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !formData.tanggalPermintaan && 'text-muted-foreground')}>
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formData.tanggalPermintaan ? formData.tanggalPermintaan.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : <span>Pilih tanggal</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={formData.tanggalPermintaan}
                                                        onSelect={(date) => handleDateChange('tanggalPermintaan', date)}
                                                        initialFocus
                                                        disabled={{ before: todayAtMidnight }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tanggalPengiriman">Tanggal Pengiriman</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !formData.tanggalPengiriman && 'text-muted-foreground')}>
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formData.tanggalPengiriman ? formData.tanggalPengiriman.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : <span>Pilih tanggal</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={formData.tanggalPengiriman}
                                                        onSelect={(date) => handleDateChange('tanggalPengiriman', date)}
                                                        initialFocus
                                                        disabled={{ before: minDeliveryDateObj }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="space-y-2"><Label htmlFor="yangMengajukan">Yang Mengajukan</Label><Input id="yangMengajukan" value={formData.yangMengajukan} readOnly className="bg-violet-50 dark:bg-violet-900/50 border-violet-200" /></div>
                                        <div className="space-y-2"><Label htmlFor="untukBagian">Untuk Bagian/Unit</Label><Input id="untukBagian" value={formData.untukBagian} readOnly className="bg-violet-50 dark:bg-violet-900/50 border-violet-200" /></div>
                                        <div className="space-y-2"><Label htmlFor="noHp">No. HP Pengaju</Label><Input id="noHp" placeholder="08xxxxxxxxxx" value={formData.noHp} onChange={(e) => handleChange('noHp', e.target.value)} /></div>
                                        <div className="space-y-2 overflow-y-auto scrollbar-thin">
                                            <Label htmlFor="tipeTamu">Tamu (Tipe)</Label>
                                            <SearchableSelect
                                                value={formData.tipeTamu}
                                                onValueChange={(value) => handleChange('tipeTamu', value)}
                                                options={allOptions.TIPE_TAMU_OPTIONS}
                                                placeholder="Pilih Tipe Tamu"
                                                searchPlaceholder="Cari tipe tamu..."
                                                notFoundMessage="Tipe tamu tidak ditemukan."
                                                className={cn({ "border-red-500": errors.tipeTamu })}
                                            />
                                            {errors.tipeTamu && <p className="text-xs text-red-600">{errors.tipeTamu}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* KATEGORI 2: PENGIRIMAN & KONSUMSI */}
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
                                                            options={allOptions.SESI_WAKTU_OPTIONS}
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
                                                            options={allOptions.LOKASI_OPTIONS}
                                                            placeholder="Pilih lokasi"
                                                            searchPlaceholder="Cari lokasi..."
                                                            notFoundMessage="Lokasi tidak ditemukan."
                                                            className={cn({ "border-red-500": errors[`group-${group.id}-lokasiPengiriman`] })}
                                                        />
                                                        {errors[`group-${group.id}-lokasiPengiriman`] && <p className="text-xs text-red-600">{errors[`group-${group.id}-lokasiPengiriman`]}</p>}
                                                    </div>
                                                </div>

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
                                                                        <SearchableSelect
                                                                            value={subItem.jenisKonsumsi}
                                                                            onValueChange={(value) => handleSubItemChange(group.id, subItem.id, 'jenisKonsumsi', value)}
                                                                            options={(() => {
                                                                                if (!group.sesiWaktu || !formData.tipeTamu) return [];
                                                                                const menusForTime = MENU_BY_TIME[group.sesiWaktu] || [];
                                                                                const menusForGuest = MENU_BY_GUEST_TYPE[formData.tipeTamu] || [];
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
                                                                                options={allOptions.SATUAN_OPTIONS}
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
                                                                                className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
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
                                        options={allOptions.APPROVER_OPTIONS}
                                        placeholder="Pilih nama approver"
                                        searchPlaceholder="Cari approver..."
                                        notFoundMessage="Approver tidak ditemukan."
                                        className={cn("bg-background", { "border-red-500": errors.namaApprover })}
                                    />
                                    {errors.namaApprover && <p className="text-xs text-red-600">{errors.namaApprover}</p>}
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-between p-6 bg-violet-50 dark:bg-violet-950/50 rounded-b-lg flex-shrink-0">
                                <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
                                <Button type="submit" className="text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105">Buat Pesanan <ChevronDown className="h-4 w-4 ml-2 transform rotate-[-90deg]" /></Button>
                            </CardFooter>
                        </form>
                    </motion.div>
                )}

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
                                        <ReviewDetailRow label="Tgl. Pengiriman" value={formData.tanggalPengiriman.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                        <ReviewDetailRow label="Tipe Tamu" value={formData.tipeTamu} />
                                    </dl>
                                </div>
                            </motion.div>

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