import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // ajuste o caminho se necessário
import { HiAdjustments, HiClipboardList } from "react-icons/hi";
import { HiUserCircle } from "react-icons/hi2";
import { MdMedicalServices } from "react-icons/md";
import { AddEditExames } from "./examesConfig/addEditExames";
import AdmMedico from "./medicosConfig/admMedico";
import { ExamesProps, MedicoProps } from "@/types/afapSaude";
import { FaHouseMedicalCircleCheck } from "react-icons/fa6";
import RoomManagement from "@/components/afapSaude/config/rooms/RoomManagement";
import { Button } from "@/components/ui/button";
import DropDownConfigs from "./DropDownConfigs";

interface DataProps {
  exames: Array<ExamesProps>;
  setExames: (array: Array<ExamesProps>) => void;
  medicos: Array<MedicoProps>;
  setMedicos: (arr: Array<MedicoProps>) => void;
 
}

export default function Configuracoes({
  exames,
  setExames,
  medicos,
  setMedicos,
}: DataProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Tabs defaultValue="exames" className="w-full justify-between">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="exames" className="flex items-center gap-2">
            <HiUserCircle className="h-4 w-4" />
            Exames
          </TabsTrigger>
          <TabsTrigger value="medicos" className="flex items-center gap-2">
            <MdMedicalServices className="h-4 w-4" />
            Administrar Médicos/Especialidades
          </TabsTrigger>
          <TabsTrigger  value="salas" className="flex items-center gap-2">
            <FaHouseMedicalCircleCheck  className="h-4 w-4" />
            Salas
          </TabsTrigger>
          <TabsTrigger asChild value="settings" className="flex items-center gap-2">
           <DropDownConfigs />
            
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exames">
          <AddEditExames exames={exames} setExames={setExames} />
        </TabsContent>
        <TabsContent value="medicos">
          <AdmMedico medicos={medicos} setArray={setMedicos} />
        </TabsContent>
       
        <TabsContent value="salas">
          <RoomManagement />
        </TabsContent>
       
      </Tabs>
    </div>
  );
}
