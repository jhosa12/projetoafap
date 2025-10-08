import { useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import { toast } from "sonner";
import { BarraBuscaCliente } from "@/components/barraBuscaCliente";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface ContratoProps {
  id_contrato: number;
  situacao?: string; // Adicionado para permitir checagem de inativo
}

interface Dependente {
  nome: string;
}

interface Cliente {
  id_associado: number;
  id_global: number;
  nome: string;
  numero: number;
  bairro: string;
  uf: string;
  cidade: string;
  endereco: string;
  contrato: ContratoProps;
  dependentes: Dependente[];
}

interface ModalBuscaProps {
  visible: boolean;
  setVisible: () => void;
 // carregarDados: (id: number) => Promise<void>;
  selectEmp: string;
  filtros?: { value: string; label: string }[];
  onSelecionar: (id: number) => Promise<void>;
}

const filtrosPadrao = [
  { value: "Contrato", label: "Contrato" },
  { value: "Titular", label: "Titular" },
  { value: "Dependente", label: "Dependente" },
  { value: "Endereço", label: "Endereço" },
  { value: "Bairro", label: "Bairro" },
];

export function ModalBuscaConv({
  visible,
  setVisible,
 // carregarDados,
  selectEmp,
  filtros = filtrosPadrao,
  onSelecionar,
}: ModalBuscaProps) {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const buscar = async (tipoBusca: string, termo: string) => {
    try {
      setLoading(true);
      const payload: Record<string, any> = { id_empresa: selectEmp };
      const termoFormatado = termo.toUpperCase().trim();
      switch (tipoBusca) {
        case "Contrato":
          if (isNaN(Number(termo))) {
            toast.info("Digite apenas números");
            setLoading(false);
            return;
          }
          payload.id_contrato = Number(termo);
          break;
        case "Titular":
          payload.nome = termoFormatado;
          break;
        case "Dependente":
          payload.dependente = termoFormatado;
          break;
        case "Endereço":
          payload.endereco = termoFormatado;
          break;
        case "Bairro":
          payload.bairro = termoFormatado;
          break;
        default:
          toast.error("Tipo de busca inválido");
          setLoading(false);
          return;
      }
      const response = await api.post<Cliente[]>("/buscar", payload);
      setClientes(response.data || []);
    } catch (error) {
      toast.error("Erro na requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogContent autoFocus={false} className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
          <DialogDescription>
            Selecione o tipo de busca e insira o termo desejado.
          </DialogDescription>
        </DialogHeader>

        <BarraBuscaCliente onBuscar={buscar} arrayParams={filtros} />
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
              {clientes.map((cliente) => {
                const situacao = cliente?.contrato?.situacao?.toUpperCase().trim();
                const isInativo = situacao === "INATIVO";
                return (
                  <li
                    key={cliente.id_global}
                    onClick={() =>onSelecionar(cliente.id_global)}
                    className={`flex items-center justify-between w-full px-4 py-2 
                      rounded-md border border-gray-300 transition-all shadow-sm ${isInativo
                        ? 'bg-gray-50 opacity-50 cursor-not-allowed border-gray-200'
                        : 'bg-gray-100 hover:bg-gray-300 cursor-pointer'
                      }`}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold">
                        <span className="text-blue-600 pr-2">{cliente?.contrato?.id_contrato}</span>
                        {cliente.nome}
                        {cliente?.dependentes?.length > 0 && (
                          <div className="mt-1 space-y-0.5 text-xs text-gray-700 font-semibold">
                            {cliente.dependentes.map((dep, index) => (
                              <div key={index}>DEPENDENTE: {dep.nome}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cliente.endereco}, Nº {cliente.numero} — {cliente.bairro},{' '}
                        <span className="font-semibold">{cliente.cidade}/{cliente.uf}</span>
                      </div>
                      {isInativo && (
                        <div className="text-[10px] uppercase tracking-wide font-medium text-red-600">{situacao}</div>
                      )}
                    </div>
                    <MdKeyboardArrowRight size={24} className="text-gray-400" />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
