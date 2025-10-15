'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CadastroPremio from "../_components/configuracao-parametros/premios/cadastroPremio";
import ConsultarGanhadores from "../_components/configuracao-parametros/ganhadores/consultar-ganhadores";
import { Medal, Trophy } from "lucide-react";

export default function ConfigSort() {
  return (
    <div className="flex flex-col w-full">
      <Tabs defaultValue="premios" className="bg-white rounded-lg p-4">

        <TabsList className="inline-flex gap-2 bg-gray-100 rounded-lg w-fit p-1">
          <TabsTrigger value="premios"
            className="gap-2 px-3 py-1 text-sm font-medium rounded-md 
            data-[state=active]:bg-white data-[state=active]:text-black 
            data-[state=active]:shadow-sm data-[state=active]:border 
            data-[state=active]:border-gray-200 transition-colors">
            <Trophy size={18} /> Prêmios
          </TabsTrigger>
          <TabsTrigger value="ganhadores"
            className="gap-2 px-3 py-1 text-sm font-medium rounded-md 
            data-[state=active]:bg-white data-[state=active]:text-black
            data-[state=active]:shadow-sm data-[state=active]:border 
            data-[state=active]:border-gray-200 transition-colors">
            <Medal size={18} /> Ganhadores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="premios" className="bg-white rounded-b-lg h-[calc(100vh-105px)] mt-4 shadow-md">
          <CadastroPremio />
        </TabsContent>
        <TabsContent value="ganhadores" className="bg-white rounded-b-lg h-[calc(100vh-105px)] mt-4 shadow-md">
          <ConsultarGanhadores />
        </TabsContent>

      </Tabs>
    </div>
  );
}

