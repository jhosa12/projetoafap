
import { ColumnDef } from "@tanstack/react-table";
import { MedicoProps } from "@/types/afapSaude";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button"; // shadcn button
import { Edit, FolderOpenDot, Trash, Trash2 } from "lucide-react";

type ActionsProps = {
  onEdit: (medico: MedicoProps) => void;
  onProced: (medico: MedicoProps) => void;
  onDelete: (medico: MedicoProps) => void;
  verify:(permission:string)=>boolean
};

export function getMedicosColumns({ onEdit, onDelete,verify,onProced }: ActionsProps): ColumnDef<MedicoProps>[] {
  return [

        {
      accessorKey: "imageUrl",
      header: "Exame",
      cell: ({ row }) => {
        const medico = row.original;
        return (
         
            <img
             src={`${process.env.NEXT_PUBLIC_API_URL}/file/${medico.imageUrl}`}
              alt={medico.imageUrl}
              className="h-6 w-6 rounded-full"
            />
         
        );
      }
    },
    {
      accessorKey: "nome",
      header: "Exame",
    },
       {
      accessorKey: "espec",
      header: "Especialidade",
    },
    

    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const medico = row.original;

        return (
          <div className="flex gap-2">
            <Button
              disabled={verify('AFS4.1.2')}
              variant="outline"
              size="icon"
              onClick={() => onEdit(medico)}
              className="h-6 w-6 "
            >
              <Edit className="h-3 w-3" />
            </Button>

             <Button
              variant="secondary"
              size="icon"
              onClick={() => onProced(medico)}
              className="h-6 w-6"
            >
              <FolderOpenDot className="h-3 w-3" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() =>{}}
              className="h-6 w-6"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ];
}
