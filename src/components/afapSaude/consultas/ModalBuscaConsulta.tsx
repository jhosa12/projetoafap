import { BarraBuscaCliente } from "@/components/barraBuscaCliente";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/axios/apiClient";
import { ConsultaProps } from "@/types/afapSaude";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { UseFormReset } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { MdKeyboardArrowRight } from "react-icons/md";
import { toast } from "sonner";

const arrayParams = [
  
  { value: "nome", label: "Cliente" },

];


export default function ModalBuscaConsulta({reset}:{reset:UseFormReset<ConsultaProps>}) {
    const [visible,setVisible]=useState(false)
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState<ConsultaProps[]>([]);
  


        const buscar = async (tipoBusca: string, termo: string) => {
    try {
      setLoading(true);

      const payload: Record<string, any> = {  };
      //const termoFormatado = termo.toUpperCase().trim();

      switch (tipoBusca) {
        
        case "nome":
          payload.nome = termo;
          break;

        default:
          toast.error("Tipo de busca inválido");
          return;
      }

      const response = await api.post<ConsultaProps[]>("/afapSaude/cliente/busca", payload);
      
      setClientes(response.data || []);
     // setClientes(response.data || []);
    } catch (error) {
      toast.error("Erro na requisição");
    } finally {
      setLoading(false);
    }
  };





    return (
    <Dialog open={visible} onOpenChange={setVisible}>
        <DialogTrigger asChild>
            <Button  variant={'outline'} size={'sm'}>
                <FcRefresh className="mr-2" />
                ADIONAR DADOS POR CONSULTAS ANTERIORES
                </Button>
        </DialogTrigger>
      <DialogContent autoFocus={false} className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
          <DialogDescription>
            Selecione o tipo de busca e insira o termo desejado.
          </DialogDescription>
        </DialogHeader>

        <BarraBuscaCliente onBuscar={buscar} arrayParams={arrayParams} />
        {loading ? (
  <div className="flex justify-center items-center p-6">
    <AiOutlineLoading3Quarters
      size={40}
      className="animate-spin text-blue-600"
    />
  </div>
) : (
  <div className="flex flex-col gap-2 text-sm text-gray-700 mb-2">
    <p className="text-gray-500 font-medium">Selecione o contrato:</p>
    <ul className="overflow-y-auto max-h-[calc(100vh-250px)] space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-300">
       {clientes.map((cliente) => (
        <li
          key={cliente.id_global}
          onClick={() => {
            reset(cliente);
            setVisible(false);
          }}
          className="flex items-center justify-between w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 hover:bg-gray-300 transition-all shadow-sm cursor-pointer"
        >
          <div className="space-y-1">
            <div className="font-semibold ">
              
              {cliente.nome}
            </div>

         

            <div className="text-xs text-gray-500">
              {cliente.endereco}, Nº {cliente.numero} — {cliente.bairro},{" "}
              <span className="font-semibold">
                {cliente.cidade}
              </span>
            </div>
          </div>
          <MdKeyboardArrowRight size={24} className="text-gray-400" />
        </li>
      ))} 
    </ul>
  </div>
)}

      </DialogContent>
    </Dialog>
  );
}