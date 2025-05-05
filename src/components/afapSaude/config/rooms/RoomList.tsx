import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Folder } from "lucide-react";
import { Room } from "./RoomManagement";

interface RoomListProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

const RoomList = ({ rooms, onEdit, onDelete }: RoomListProps) => {
  const getStatusBadge = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Disponível</Badge>;
      case "occupied":
        return <Badge className="bg-blue-500">Ocupada</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-500">Em Manutenção</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="">
      <Table>
        <TableHeader className="uppercase text-xs">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Capacidade</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhuma sala cadastrada. Adicione uma nova sala.
              </TableCell>
            </TableRow>
          ) : (
            rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.capacity} pessoas</TableCell>
                <TableCell>{room.location}</TableCell>
                <TableCell>{getStatusBadge(room.status)}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {room.description || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(room)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja excluir a sala "${room.name}"?`)) {
                          onDelete(room.id);
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoomList;