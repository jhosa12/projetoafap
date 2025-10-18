import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { IoSearch } from "react-icons/io5";
import { ChevronDown, Printer, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import DocumentTemplate from "@/Documents/sorteados/DocumentTemplate";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { useActionsSorteios } from "../../../_hooks/useActionsSorteios";
import { DataTable } from "@/components/ui/data-table";
import { GanhadoresProps } from "../../../_types/ganhadores";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getColunasGanhadores } from "./colunas-ganhadores";




export default function ConsultarGanhadores() {

  const { empresas, usuario, signOut } = useContext(AuthContext)
  const [dataSorteio, setDataSorteio] = useState<Date | undefined>(new Date())
  const [id_empresa, setid_empresa] = useState<string>('')
  const [arrayGanhadores, setGanhadores] = useState<Array<Partial<GanhadoresProps>>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const componentRef = useRef<HTMLDivElement>(null);

  const impressao = useReactToPrint({
    pageStyle: `
            @page {
                margin: 1rem;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                @page {
                    size: auto;
                    margin: 1rem;
                }
                @page {
                    @top-center {
                        content: none;
                    }
                    @bottom-center {
                        content: none;
                    }
                }
            }
        `,
    documentTitle: 'Relatório de Ganhadores',
    contentRef: componentRef,
  });

  const { listarGanhadores, ganhadores } = useActionsSorteios()



  useEffect(() => {
    if (!usuario) {
      return signOut()

    }

    listarGanhadores({})

  }, [usuario])

  const colunasGanhadores = useMemo(() => {
    return getColunasGanhadores;
  }, []);



  return (
    <div className="flex flex-col w-full h-screen lg:p-6 gap-4">
      <div style={{ display: 'none' }}>
        <DocumentTemplate ref={componentRef} winners={arrayGanhadores} />
      </div>

      <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Lista de Ganhadores
        </h3>

        <div className="flex justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] flex items-center justify-between">
                {id_empresa
                  ? empresas.find(e => String(e.id) === id_empresa)?.nome
                  : "Selecione a empresa"}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuLabel>Empresas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {empresas.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setid_empresa(String(item.id))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioGroup value={String(item.id)} className="flex justify-between">
                    <RadioGroupItem
                      value={String(item.id)}
                      checked={id_empresa === String(item.id)}
                      aria-label={item.nome}
                      className="accent-black"
                      tabIndex={-1}
                    /><span>{item.nome}</span>
                  </RadioGroup>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setid_empresa("")}
                className="text-red-500 cursor-pointer flex items-center gap-2 mt-2"
              >
                <X size={16} /> Limpar seleção
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[150px] justify-start text-left font-normal"
              >
                {dataSorteio
                  ? format(dataSorteio, "dd/MM/yyyy", { locale: ptBR })
                  : "DATA SORTEIO"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dataSorteio}
                onSelect={setDataSorteio}
                locale={ptBR}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            disabled={loading}
            size="sm"
            onClick={() => listarGanhadores({
              date: dataSorteio || undefined,
              id_empresa: id_empresa || undefined
            })}
          >
            <IoSearch className="mr-1 h-5 w-5" /> Buscar
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={impressao}
          >
            <Printer className="mr-2 h-5 w-5" /> Imprimir
          </Button>
        </div>
      </div>

      <DataTable
        columns={colunasGanhadores}
        data={ganhadores}
      />
    </div>
  )
}