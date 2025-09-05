'use client';

import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalFiltro } from "@/app/dashboard/renovacao/components/modalFiltro";
import { ParcelasDialog } from "@/app/dashboard/renovacao/components/ParcelasDialog";
import { api } from "@/lib/axios/apiClient";
import { useReactToPrint } from "react-to-print";
import DocumentTemplate from "@/Documents/renovacao/impressao";
import { AuthContext } from "@/store/AuthContext";
import { toast } from "sonner";
import { pageStyle } from "@/utils/pageStyle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IoPrint, IoRefresh, IoSearch } from "react-icons/io5";
import { FaFilter, FaFileExport, FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";

interface MensalidadeProps {
    n_doc: string,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    id_contrato:number,
    id_mensalidade: number,
   // valor_total: number,
    referencia: string,
}
export interface DadosImpressao{
    nome:string,
    endereco:string,
    bairro:string,
    numero:number,
    cidade:string
    uf:string,
    
    mensalidade:Array<MensalidadeProps>
}


export interface FiltroProps{
 
    contratoInicial:number|null,
    contratoFinal:number|null,
    mensAberto:number|null
}

export interface ListaProps{
        planos:{acrescimo:number,valor:number},
        id_contrato: number,
        id_contrato_global: number,
        id_empresa:string
        mensalidade: Array< {vencimento: Date}>,
        associado: {
            id_global: number,
            nome: string,
            endereco: string,
            bairro: string,
            id_associado:number,
            _count:{dependentes:number}
        }
    }


export default function Renovacao(){
const {infoEmpresa} = useContext(AuthContext)
const [openModalFiltro, setModalFiltro] = useState<boolean>(false);
const [openParcelasDialog, setOpenParcelasDialog] = useState<boolean>(false);
const [loading, setLoading] = useState<boolean>(false);
const [dataFiltro, setFiltro] = useState<FiltroProps>({ contratoInicial: null, mensAberto: null, contratoFinal: null });
const [array, setArray] = useState<Array<ListaProps>>([]);
const [MensImp, setMensImp] = useState<Array<DadosImpressao>>([]);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 20;
const componentRef = useRef<DocumentTemplate>(null);



const imprimirCarne =useReactToPrint({
    pageStyle:pageStyle,
    documentTitle:'CARNÊ ASSOCIADO',
    content:()=>componentRef.current,
    onAfterPrint() {
        setMensImp([])
       
    },
    onBeforeGetContent(){
       
    },
    onBeforePrint(){
        setLoading(false)
    }
 

})







const handleImpressao =async ()=>{
    if(array.length===0){
        toast.info('Nenhum contrato no grid!')
        return

    }
    setLoading(true)
    try {
        const response = await api.post('/renovacao/impressao',{
            contratos:array.map(item=>{return item.id_contrato})
        })
       setMensImp(response.data)
    } catch (error) {
            toast.error('erro na busca')
    }

   
}


useEffect(()=>{

   
MensImp.length>0 && imprimirCarne()



},[MensImp])



const handleRenovacao = async () => {
  if (array.length === 0) {
    toast.error("Nenhum contrato selecionado para renovação");
    return;
  }
  setOpenParcelasDialog(true);
};

const confirmRenovacao = async (numParcelas: number) => {
  setOpenParcelasDialog(false);
  
  try {
    await toast.promise(
      api.post('/renovacao', {
        contratos: array?.map(item => ({
          id_contrato: item.id_contrato,
          valor_mensalidade: item.planos.valor,
          id_associado: item.associado.id_associado,
          acrescimo: item.planos.acrescimo,
          dependentes: item.associado._count.dependentes,
          id_global: item.associado.id_global,
          id_contrato_global: item.id_contrato_global,
          id_empresa: item.id_empresa
        })),
        quantidade: numParcelas
      }),
      {
        loading: `Gerando ${numParcelas} parcelas...`,
        success: (response) => {
          // Recarregar os dados após a renovação
          filtrar();
          return response.data || "Renovação realizada com sucesso!";
        },
        error: (error) => {
          console.error("Erro na renovação:", error);
          return error.response?.data?.message || "Erro ao realizar a renovação";
        }
      }
    );
  } catch (error) {
    console.error("Erro na requisição de renovação:", error);
    toast.error("Ocorreu um erro ao processar a renovação");
  }
};



const filtrar = async()=>{
    setLoading(true)
    
    try {

        const response = await api.post('/renovacao/filtro',{
            contratoInicial:dataFiltro.contratoInicial,
            contratoFinal:dataFiltro.contratoFinal,
            quant:dataFiltro.mensAberto,
            id_empresa:infoEmpresa?.id
        })

        setArray(response.data)
 
    } catch (error) {
        console.log(error)
    }
    setLoading(false)
    setModalFiltro(false)
}

    return (
        <>
            {/* Hidden print template */}
            <div style={{ display: 'none' }}>
                <DocumentTemplate ref={componentRef} arrayMensalidade={MensImp} />
            </div>

            {/* Parcelas Dialog */}
            <ParcelasDialog 
                open={openParcelasDialog}
                onOpenChange={setOpenParcelasDialog}
                onConfirm={confirmRenovacao}
                loading={loading}
            />

            {/* Filter Modal */}
            {openModalFiltro && (
                <ModalFiltro 
                    setFiltro={setFiltro}
                    dataFiltro={dataFiltro}
                    filtrar={filtrar} 
                    openModal={openModalFiltro} 
                    setModal={setModalFiltro} 
                    loading={loading}
                />
            )}

            <div className="container mx-auto px-4 py-2 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Renovação de Contratos</h1>
                        <p className="text-muted-foreground">Gerencie e renove contratos de forma eficiente</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setModalFiltro(true)}>
                            <FaFilter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                            <IoRefresh className="mr-2 h-4 w-4" />
                            Atualizar
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contratos Encontrados</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">📋</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{array.length}</div>
                            {/* <p className="text-xs text-muted-foreground">Total de contratos</p> */}
                        </CardContent>
                    </Card>
                    <Card >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">💰</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(array.reduce((sum, item) => sum + Number(item.planos?.valor??0), 0))}
                            </div>
                            {/* <p className="text-xs text-muted-foreground">Valor total dos contratos</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Média por Contrato</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">📊</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {array.length > 0 
                                    ? new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(array.reduce((sum, item) => sum + Number(item.planos?.valor??0), 0) / array.length)
                                    : 'R$ 0,00'
                                }
                            </div>
                            {/* <p className="text-xs text-muted-foreground">Valor médio por contrato</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ações</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">⚡</div>
                        </CardHeader>
                        <CardContent className="space-x-2 inline-flex items-center">
                            <Button 
                                size="sm" 
                                className="w-full"
                                onClick={handleImpressao}
                                disabled={array.length === 0 || loading}
                            >
                                <IoPrint className="mr-2 h-4 w-4" />
                                Imprimir
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full"
                                        disabled={array.length === 0 || loading}
                                    >
                                        <FaFileExport className="mr-2 h-4 w-4" />
                                        Exportar
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <RiFileExcel2Line className="mr-2 h-4 w-4" />
                                        Excel
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <span className="mr-2">📄</span>
                                        PDF
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </Card>
                </div>
                {/* Data Table */}
                <Card>
                    {/* <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Contratos para Renovação</CardTitle>
                                <CardDescription>
                                    {array.length} contratos encontrados
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <IoSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Pesquisar..."
                                        className="pl-8 w-[200px]"
                                        // Add search functionality here
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader> */}
                    <CardContent className="pb-0 px-2 py-1 m-0" >
                      <div className="max-h-[calc(100vh-320px)] mt-2 overflow-y-auto ">
                            <Table>
                                <TableHeader className="[&_tr]:h-6">
                                    <TableRow className="[&_th]:py-1 [&_th]:px-2">
                                        <TableHead className="w-[80px]">Contrato</TableHead>
                                        <TableHead className="min-w-[150px]">Associado</TableHead>
                                        <TableHead className="min-w-[200px]">Endereço</TableHead>
                                        <TableHead className="w-[100px]">Valor</TableHead>
                                        <TableHead className="w-[100px]">Vencimento</TableHead>
                                        <TableHead className="w-[100px]">Dependentes</TableHead>
                                        <TableHead className="w-[80px] px-2">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {array.length > 0 ? (
                                        array.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                            <TableRow className="text-[10px] [&_td]:py-1 [&_td]:px-2 font-semibold" key={item.id_contrato}>
                                                <TableCell className="font-medium">{item.id_contrato}</TableCell>
                                                <TableCell>{item.associado.nome}</TableCell>
                                                <TableCell>{item.associado.endereco}, {item.associado.bairro}</TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(item.planos?.valor)}
                                                </TableCell>
                                                <TableCell>
                                                    {item?.mensalidade?.length > 0 
                                                        ? format(new Date(item?.mensalidade[0].vencimento), "dd/MM/yyyy", { locale: ptBR })
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {item?.associado?._count.dependentes} dep.
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">Ver detalhes</span>
                                                            <IoSearch className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => {
                                                                setMensImp([{
                                                                    nome: item?.associado?.nome,
                                                                    endereco: item?.associado?.endereco,
                                                                    bairro: item?.associado?.bairro,
                                                                    numero: 0,
                                                                    cidade: '',
                                                                    uf: '',
                                                                    mensalidade: [{
                                                                        n_doc: '',
                                                                        parcela_n: 1,
                                                                        vencimento: new Date(),
                                                                        cobranca: new Date(),
                                                                        valor_principal: item?.planos?.valor,
                                                                        id_contrato: item?.id_contrato,
                                                                        id_mensalidade: 0,
                                                                        referencia: 'REF'
                                                                    }]
                                                                }]);
                                                            }}
                                                        >
                                                            <span className="sr-only">Imprimir</span>
                                                            <IoPrint className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                Nenhum contrato encontrado. Aplique os filtros para visualizar os dados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            </div>
                            {/* Rodapé com paginação e botão de renovar */}
                            <div className="flex items-center justify-between px-2 py-2 border-t">
                                <div className="flex items-center space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleRenovacao}
                                        disabled={array.length === 0 || loading}
                                    >
                                        <FaSyncAlt className="mr-2 h-4 w-4" />
                                        Renovar Selecionados
                                    </Button>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="text-xs text-muted-foreground">
                                        Mostrando <span className="font-medium">
                                            {array.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                        </span> a <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, array.length)}
                                        </span> de <span className="font-medium">{array.length}</span> contratos
                                    </div>
                                    
                                    <Pagination className="m-0">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">Página anterior</span>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </Button>
                                            </PaginationItem>
                                            
                                            {/* Mostra apenas alguns números de página ao redor da página atual */}
                                            {(() => {
                                                const totalPages = Math.ceil(array.length / itemsPerPage);
                                                if (totalPages <= 0) return null;
                                                
                                                return Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                                    // Calcula o número da página para exibir
                                                    let pageNum;
                                                    
                                                    if (totalPages <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage === 1) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage === totalPages) {
                                                        pageNum = totalPages - 2 + i;
                                                    } else {
                                                        pageNum = currentPage - 1 + i;
                                                    }
                                                    
                                                    if (pageNum > totalPages) return null;
                                                    
                                                    return (
                                                        <PaginationItem key={pageNum}>
                                                            <PaginationLink
                                                                isActive={currentPage === pageNum}
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className="h-8 w-8 p-0 text-xs"
                                                            >
                                                                {pageNum}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                });
                                            })()}
                                            
                                            <PaginationItem>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(array.length / itemsPerPage)))}
                                                    disabled={currentPage === Math.ceil(array.length / itemsPerPage) || array.length === 0}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">Próxima página</span>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Button>
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}