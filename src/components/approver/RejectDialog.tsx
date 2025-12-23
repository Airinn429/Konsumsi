"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";

interface RejectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isProcessing?: boolean; // Jadikan opsional
}

export const RejectDialog: React.FC<RejectDialogProps> = ({ isOpen, onClose, onConfirm, isProcessing = false }) => {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason);
        setReason(""); // Reset form
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-l-4 border-l-red-500 bg-white dark:bg-slate-900">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3 text-red-600">
                         <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                         </div>
                         <DialogTitle className="text-xl">Tolak Pengajuan?</DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-slate-600 dark:text-slate-300">
                        Anda akan menolak pengajuan ini. Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Alasan Penolakan <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            placeholder="Contoh: Dokumen pendukung kurang lengkap, Anggaran tidak mencukupi, dll."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="resize-none focus-visible:ring-red-500"
                            disabled={isProcessing}
                        />
                        <p className="text-xs text-muted-foreground">Alasan ini akan dikirimkan kepada pengaju.</p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} disabled={isProcessing}>Batal</Button>
                    <Button 
                        onClick={handleConfirm} 
                        disabled={isProcessing || !reason.trim()} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Konfirmasi Penolakan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};