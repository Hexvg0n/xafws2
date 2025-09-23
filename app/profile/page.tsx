// app/profile/page.tsx

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import FavoritesTab from "@/components/profile/FavoritesTab";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 mt-20">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Twój Profil</h1>
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-white/5 border border-white/10 p-1 h-12 rounded-lg max-w-sm mx-auto">
          <TabsTrigger value="favorites" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md">
            <Heart className="w-5 h-5 mr-2" />
            Polubione
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}