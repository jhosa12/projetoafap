import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Room } from "./RoomManagement";


interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Room, "id"> | Room) => void;
  room?: Room; // Optional, if present we're editing, if not we're adding
}

const RoomModal = ({ room, isOpen, onClose, onSave }: RoomModalProps) => {
  const isEditing = !!room;
  
  const defaultFormData: Omit<Room, "id"> = {
    name: "",
    capacity: 0,
    location: "",
    status: "available",
    description: ""
  };
  
  const [formData, setFormData] = useState<Omit<Room, "id"> | Room>(
    isEditing ? room : defaultFormData
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when room changes (when editing different rooms)
  useEffect(() => {
    if (isEditing && room) {
      setFormData(room);
    } else {
      setFormData(defaultFormData);
    }
  }, [room, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório";
    if (formData.capacity <= 0) newErrors.capacity = "A capacidade deve ser maior que zero";
    if (!formData.location.trim()) newErrors.location = "A localização é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Omit<Room, "id">) => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Para campos numéricos, converter para número
      const processedData = {
        ...formData,
        capacity: Number(formData.capacity),
      };
      
      onSave(processedData);
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData(defaultFormData);
      }
      
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Sala" : "Adicionar Nova Sala"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Sala *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Sala de Reuniões A"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity || ""}
                onChange={handleChange}
                placeholder="Ex: 10"
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: 1º Andar, Bloco B"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => 
                  setFormData((prev:  Omit<Room, "id">) => ({
                    ...prev,
                    status: value as Room["status"]
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="occupied">Ocupada</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Adicione detalhes sobre a sala (opcional)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;