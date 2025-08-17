// app/profile/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Settings } from "lucide-react";
import FavoritesTab from "@/components/profile/FavoritesTab";
import SettingsTab from "@/components/profile/SettingsTab";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Twój Profil</h1>
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 h-12 rounded-lg">
          <TabsTrigger value="favorites" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md">
            <Heart className="w-5 h-5 mr-2" />
            Polubione
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md">
            <Settings className="w-5 h-5 mr-2" />
            Ustawienia
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesTab />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}