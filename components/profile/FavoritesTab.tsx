// app/profile/components/FavoritesTab.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function FavoritesTab() {
  // W przyszłości: logika pobierania polubionych itemów z API

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Twoje Polubione Przedmioty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-white/20 rounded-lg">
            <Info className="w-8 h-8 text-white/50 mb-2" />
            <p className="text-white/70">Nie masz jeszcze żadnych polubionych przedmiotów.</p>
            <p className="text-sm text-white/50">Przeglądaj W2C i klikaj serduszka, aby dodać je tutaj.</p>
        </div>
      </CardContent>
    </Card>
  );
}