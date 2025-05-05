import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoomModal from "./RoomModal";
import RoomList from "./RoomList";
import {toast} from "sonner";


export type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  status: "available" | "occupied" | "maintenance";
  description?: string;
};

const RoomManagement = () => {
 // const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  
  // Exemplo de dados iniciais
  const [rooms, setRooms] = useState<Room[]>([
    { 
      id: "1", 
      name: "Sala de Conferência A", 
      capacity: 20, 
      location: "1º Andar", 
      status: "available",
      description: "Sala equipada com projetor e sistema de áudio" 
    },
    { 
      id: "2", 
      name: "Sala de Reuniões B", 
      capacity: 8, 
      location: "2º Andar", 
      status: "occupied" 
    },
    { 
      id: "3", 
      name: "Auditório Principal", 
      capacity: 100, 
      location: "Térreo", 
      status: "maintenance",
      description: "Em manutenção até 15/05" 
    },
  ]);

  const handleSaveRoom = (roomData: Room | Omit<Room, "id">) => {
    // Verificar se é uma edição (tem ID) ou adição
    if ('id' in roomData) {
      // Edição
      setRooms(rooms.map(room => room.id === roomData.id ? roomData as Room : room));
      toast(
        "Sala atualizada",
        {description: `A sala ${roomData.name} foi atualizada com sucesso.`},
      );
    } else {
      // Adição
      const id = Date.now().toString();
      const newRoom = { ...roomData, id };
      setRooms([...rooms, newRoom]);
      toast(
        "Sala adicionada",
        {description: `A sala ${roomData.name} foi adicionada com sucesso.`},
      );
    }
    
    // Fechar modal e limpar seleção
    setIsModalOpen(false);
    setSelectedRoom(undefined);
  };

  const handleDeleteRoom = (id: string) => {
    const roomToDelete = rooms.find(room => room.id === id);
    setRooms(rooms.filter(room => room.id !== id));
    toast(
     "Sala removida",
     { description: `A sala ${roomToDelete?.name} foi removida com sucesso.`},
    );
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedRoom(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className=" w-full py-2">
      <Card className="w-full border-none shadow-none ">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Gerenciamento de Salas</CardTitle>
            <CardDescription>
              Visualize, adicione, edite e remova salas do sistema.
            </CardDescription>
          </div>
          <Button size={"sm"} onClick={openAddModal}>
            <Plus  />
            Adicionar Sala
          </Button>
        </CardHeader>
        <CardContent>
          <RoomList 
            rooms={rooms} 
            onEdit={openEditModal} 
            onDelete={handleDeleteRoom} 
          />
        </CardContent>
      </Card>

      <RoomModal 
        room={selectedRoom}
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoom(undefined);
        }}
        onSave={handleSaveRoom}
      />
    </div>
  );
};

export default RoomManagement;