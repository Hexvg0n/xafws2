// components/profile/PreferencesModal.tsx

"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PreferencesForm } from "./PreferencesForm";

interface PreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-morphism border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Witaj w XaffReps!</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Zanim zaczniesz, ustaw swoje preferencje. Pomoże to nam spersonalizować Twoje doświadczenie.
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                   <PreferencesForm onSave={onClose} />
                </div>
            </DialogContent>
        </Dialog>
    );
}