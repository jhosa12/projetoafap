
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdDeleteForever, MdEdit, MdPrint } from 'react-icons/md';
import { RiAddCircleFill } from 'react-icons/ri';
import { AuthContext } from '@/store/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AcordoProps } from '@/app/dashboard/admcontrato/_types/acordos'
import { MensalidadeProps } from '@/app/dashboard/admcontrato/_types/mensalidades'
import { ModalAcordos } from './modalAcordos';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Home, Printer } from 'lucide-react';
import { AcordoComprovante } from '@/Documents/associado/acordo/acordoComprovante';
import { useReactToPrint } from 'react-to-print';
import { pageStyle } from '@/utils/pageStyle';
import useActionsAcordos from '../../_hooks/acordo/useActionsAcordos';

export const themeLight = {
    color: {
        light: "border border-gray-300 bg-white text-gray-900 focus:rind-none focus:ring-0 enabled:hover:bg-gray-100"
    }
};

interface DataProps {
    id_empresa: string,
    id_associado: number | undefined,
    id_contrato: number | undefined
    id_contrato_global: number | undefined | null
    id_global: number | undefined | null
    acordos: Array<AcordoProps> | []
    mensalidades: Array<MensalidadeProps> | []
}


export function Acordos({ acordos, mensalidades, id_contrato_global, id_global, id_empresa, id_associado, id_contrato }: DataProps) {
    const { permissoes, consultores, carregarDados } = useContext(AuthContext)
    const [openAcordo, setOpenAcordo] = useState(false)
    const [acordo, setAcordo] = useState<Partial<AcordoProps>>({} as AcordoProps)


    const hookProps = {
        id_empresa: id_empresa,
        carregarDados: carregarDados,
        id_contrato_global: id_contrato_global ?? null,
        id_global: id_global ?? null,
        id_associado: id_associado,
        id_contrato: id_contrato,
        close: close,
        mensalidades: mensalidades,
        consultores: consultores

    }

    const { verificarQuebra, printComprovante, criarAcordo, comprovanteAcordo } = useActionsAcordos(hookProps);


    useEffect(() => {
        setAcordo({})
    }, [id_global])

    return (
        <div className="flex flex-col w-full">

            {openAcordo && <ModalAcordos
                id_associado={id_associado}
                id_contrato={id_contrato}
                id_empresa={id_empresa}
                carregarDados={carregarDados}
                close={() => setOpenAcordo(false)}
                acordo={acordo ?? {}}
                id_contrato_global={id_contrato_global ?? null}
                id_global={id_global ?? null}
                mensalidades={mensalidades}
                open={openAcordo}
                consultores={consultores}

            />}

            <div className="flex w-full gap-2 ml-2">
                <Button
                    variant="outline"
                    size="sm"

                    onClick={() => { setOpenAcordo(true); setAcordo({}) }}
                >
                    <RiAddCircleFill className="h-3.5 w-3.5" />
                    <span>Novo Acordo</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"

                    onClick={() => setOpenAcordo(true)}
                >
                    <MdPrint className="h-3.5 w-3.5" />
                    <span>Imprimir</span>
                </Button>
                {/* <Button 
                    variant="outline" 
                    size="sm" 
                    
                    onClick={()=>{
                        if(!acordo?.id_acordo){
                            return toast.warning('Selecione um acordo')
                        }
                        setOpenAcordo(true)
                    }}
                >
                    <MdEdit className="h-3.5 w-3.5" />
                    <span>Alterar</span>
                </Button> */}
                <Button
                    variant="outline"
                    size="sm"
                    className=" text-destructive hover:text-destructive/90 hover:bg-destructive/5"
                    onClick={() => { }}
                >
                    <MdDeleteForever className="h-3.5 w-3.5" />
                    <span>Excluir</span>
                </Button>
            </div>
            <div className="flex w-full p-2 max-h-[calc(100vh-205px)] overflow-y-auto">
                <Table className="text-xs border rounded-sm">
                    <TableHeader className="sticky top-0 bg-gray-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">DESCRIÇÃO</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">CONSULTOR</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">VALOR</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">MÉTODO DE PAG</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">DATA CRIAÇÃO</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">DATA PREVISTA</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">DATA PAG.</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">HR PAG.</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600 border-r">USUÁRIO</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600  border-r">STATUS</TableHead>
                            <TableHead className="px-2 py-1 font-semibold text-gray-600">AÇÕES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(acordos) && acordos.map((item, index) => (
                            <TableRow
                                key={index}
                                onClick={() => { setAcordo(item); setOpenAcordo(true) }}
                                className={cn(
                                    "cursor-pointer hover:bg-gray-50",
                                    item.id_acordo === acordo?.id_acordo && "bg-blue-50 hover:bg-blue-50"
                                )}
                            >
                                <TableCell className="px-2 py-2 border-r">{item.descricao}</TableCell>
                                <TableCell className="px-2 py-2 border-r">{item.realizado_por}</TableCell>
                                <TableCell className="px-2 py-2 border-r font-medium">
                                    {Number(item.mensalidadeAcordo?.reduce((a, b) => a + Number(b.mensalidade.valor_principal), 0)).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </TableCell>
                                <TableCell className="px-2 py-2 border-r">{item.metodo}</TableCell>
                                <TableCell className="px-2 py-2 border-r whitespace-nowrap">
                                    {item.data_inicio && new Date(item.data_inicio).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="px-2 py-2 border-r whitespace-nowrap">
                                    {item.data_fim && new Date(item.data_fim).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="px-2 py-2 border-r whitespace-nowrap">
                                    {item.dt_pgto && new Date(item.dt_pgto).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="px-2 py-2 border-r whitespace-nowrap">
                                    {item.dt_pgto && new Date(item.dt_pgto).toLocaleTimeString('pt-BR')}
                                </TableCell>
                                <TableCell className="px-2 py-2 border-r">{item.usuario}</TableCell>

                                <TableCell className="px-2 py-2  border-r">
                                    <Badge variant={verificarQuebra(item) === 'CUMPRIDO' ? 'success' : verificarQuebra(item) === 'QUEBRA' ? 'destructive' : 'warning'}>{verificarQuebra(item)}</Badge>

                                </TableCell>
                                <TableCell className="px-2 py-2">
                                    <button onClick={e => { e.stopPropagation(); printComprovante() }}>
                                        <Printer size={16} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!acordos || acordos.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={10} className="px-2 py-4 text-center text-gray-500">
                                    Nenhum acordo encontrado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div style={{ display: 'none' }}>
                <AcordoComprovante
                    ref={comprovanteAcordo}
                    acordo={acordo}
                    associado={
                        {
                            nome: 'JOSE HENRIQUE BATISTA DE FREITAS',
                            cpf: '000.000.000-00',
                            endereco: 'Rua Teste, 123',
                            cidade: 'Teste',
                            uf: 'Teste'
                        }
                    }
                    empresa={
                        {
                            nome: 'AFAP',
                            endereco: 'Rua Teste, 123',
                            cidade: 'Teste',
                            uf: 'Teste',
                            cnpj: '00.000.000/0000-00',
                            telefone: '(00) 0000-0000'
                        }
                    }
                />
            </div>

        </div>
    )
}




