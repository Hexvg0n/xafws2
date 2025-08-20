// app/dashboard/components/HistoryView.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, History, Plus, Edit, Trash2 } from "lucide-react";

const ActionIcon = ({ action }: { action: string }) => {
    switch (action) {
        case 'add': return <Plus className="w-4 h-4 text-green-400" />;
        case 'edit': return <Edit className="w-4 h-4 text-blue-400" />;
        case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
        default: return <History className="w-4 h-4 text-gray-400" />;
    }
};

export function HistoryView() {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/history');
            if (!res.ok) throw new Error("Błąd pobierania historii");
            setHistory(await res.json());
        } catch (error) {
            console.error(error);
            setHistory([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <Card className="glass-morphism border-white/10 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Historia Operacji</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                    {history.length > 0 ? (
                        history.map(entry => (
                            <div key={entry._id} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                                <div className="mt-1"><ActionIcon action={entry.action} /></div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-white">
                                        {entry.user.name} <span className="text-white/60 font-normal">{entry.details}</span>
                                    </p>
                                    <p className="text-xs text-white/50">
                                        {new Date(entry.createdAt).toLocaleString('pl-PL')}
                                    </p>
                                </div>
                                <div className="text-xs text-white/60 capitalize bg-white/10 px-2 py-1 rounded-full">
                                    {entry.entity}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white/70 py-8">Brak historii operacji.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}