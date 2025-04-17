
import { api } from "@/lib/axios/apiClient";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "@/store/AuthContext";
import { ModalAdministrarExame } from "./modalAdministrarExame";
import Orcamento from "@/Documents/afapSaude/orcamento";
import { FiltroExames } from "../../../afapSaude/exames/filtro";
import { ModalConfirmar } from "../../../modals/modalConfirmar";
import { ajustarData } from "@/utils/ajusteData";
import handleWhatsAppClick from "@/utils/openWhats";
import pageStyle from "@/utils/pageStyle";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { ExameRealizadoProps, ExamesData, ExamesProps } from "@/types/afapSaude";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamesToolbar } from "@/components/afapSaude/exames/ExamesToolbar";
import { ExamesTable } from "@/components/afapSaude/exames/ExamesTable";




interface DataProps{
  exames:Array<ExamesProps>
}


interface FiltroForm {
  endDate?: Date;
  nome?: string;
  startDate?: Date;
  status: string;
}




export default function Exames({ exames }: DataProps) {
  const valorInicial = {id_exame:null,celular:'',data_orcamento:new Date(),data_realizado:new Date(),exames:[],coleta:'',tipoDesc:'',cpf:'',data_nasc:new Date(),nome_responsavel:'',parentesco:'',nome:'',status:'',user:'',endereco:'',id_selected:null,numero:null,bairro:'',cidade:'',exame:''}
    const [examesRealizados,setExames] = useState<Array<ExameRealizadoProps>>([])
    const [exameSelected, setExameSelected] = useState<ExameRealizadoProps>(valorInicial)
  const {usuario} = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false)
  const currentPage = useRef<Orcamento>(null)
  const [filtro,setFiltro] = useState<boolean>(false)
  const [openModalReceber, setOpenModalReceber] = useState(false)
  const [formPag,setFormPag] = useState<string>('')
  const [openModalDeletar, setOpenModalDeletar] = useState(false)
  const currentRecibo = useRef<ReciboMensalidade>(null)







  const handleReceberExame = useCallback(async ()=>{


    if (!formPag){
      toast.warning('Selecione a forma de pagamento')
      return}

    if(!exameSelected.id_exame){
      toast.warning('Selecione um exame para receber consulta')
      return
    }
    if(exameSelected.status==='RECEBIDO'){
      toast.warning('Exame já recebido')
      return
    }


      const dataAtual = new Date()
      dataAtual.setHours(dataAtual.getHours() - dataAtual.getTimezoneOffset() / 60)
       toast.promise(
        api.put('/afapSaude/receberExame',{
          id_exame: exameSelected?.id_exame,
       // id_usuario:usuario?.id,
        datalanc:dataAtual.toISOString(),
        descricao:"EXAME",
        historico:`EXAME.${exameSelected?.id_exame}-${exameSelected?.nome}-${exameSelected?.tipoDesc}`,
        valor:exameSelected?.exames?.reduce((acc, item) => acc + item.valorFinal, 0),
       // usuario:usuario?.nome,
        forma_pagamento:formPag
        }),
        {
          error: 'Erro ao receber exame',
          loading: 'Recebendo exame....',
          success:()=>{
            listarExamesRealizados({endDate:new Date(),nome:'',startDate:new Date(),status:''})
            
            return 'exame recebido com sucesso!'}
        }
      )
    
 
    },[exameSelected.id_exame,formPag])


  const imprimirOrcamento = useCallback(
    
    useReactToPrint({
    pageStyle:pageStyle,
    content: () => currentPage.current,
    onBeforeGetContent:()=>{
      if(!exameSelected?.id_exame){
        toast.error('Selecione um exame para imprimir')
        return Promise.reject();
      }
      Promise.resolve();
    
    }
  }), [exameSelected?.id_exame]);


  const imprimirRecibo = useCallback(useReactToPrint({
    pageStyle: pageStyle,
    content: () => currentRecibo.current,
    onBeforeGetContent: () => {
      if (!exameSelected?.id_exame) {
        toast.error('Selecione um exame para imprimir');
        return Promise.reject();
      }
      if(exameSelected?.status!=='RECEBIDO'){
          toast.error('Exame ainda não recebido')
        return Promise.reject();
      }
      Promise.resolve();
    }
  }), [exameSelected?.id_exame]);


  const handleDeletar = useCallback(async () => {
    if (!exameSelected?.id_exame) {
      toast.warning('Selecione um exame para deletar');
      return;
    }

     toast.promise(
        api.delete(`/afapSaude/deletarExame/${exameSelected?.id_exame}`),
        {
          error: 'Erro ao deletar exame',
          loading: 'Deletando exame....',
          success: ()=>{

            setExames(examesRealizados.filter(item => item.id_exame !== exameSelected.id_exame))
            return 'Exame deletado com sucesso!'}
        }
      )
    

    
  },[exameSelected.id_exame])





 
 useEffect(() => {
    listarExamesRealizados({endDate:new Date(),nome:'',startDate:new Date(),status:''})
  }, []);



const listarExamesRealizados =useCallback( async ({endDate,nome,startDate,status}:FiltroForm) => {
 
  if(startDate && endDate && startDate>endDate){
    toast.error('Data inicial maior que data final')
    return
  }

const {dataFim,dataIni} = ajustarData(startDate,endDate)

/* if(startDate && endDate){  dataIn = new Date(startDate)
  //dataIn.setHours(dataIn.getHours() - dataIn.getTimezoneOffset() / 60)
 //  dataOut = new Date(endDate)
 // dataOut.setHours(dataOut.getHours() - dataOut.getTimezoneOffset() / 60)
dataIn = new Date(startDate)
dataOut = new Date(endDate)

 //dataIn.setHours(0,0,0,0)
// dataOut.setHours(23,59,59,999)
dataIn.setTime(dataIn.getTime() - dataIn.getTimezoneOffset()*60*1000)
//dataOut.setTime(dataOut.getTime() - dataOut.getTimezoneOffset()*60*1000)
dataIn.setUTCHours(0,0,0,0)
dataOut.setUTCHours(23,59,59,999)


//console.log(dataIn.toISOString(),dataOut.toISOString())

 
}*/

  try {
    const response = await api.post("/afapSaude/examesRealizados/listar",{
      endDate:dataFim,
      nome,
      startDate:dataIni,
      status
    });
    setExames(response.data)
  } catch (error) {
    console.log(error);
  }
},[]);

const handleNovoExame = useCallback(async(data:ExameRealizadoProps) => {
  const dataAtual = new Date()
  dataAtual.setHours(dataAtual.getHours() - dataAtual.getTimezoneOffset() / 60)

if(data.exames.length===0){
  toast.error('Adicione ao menos um exame!')
    return
}

  

toast.promise(
          api.post("/afapSaude/examesRealizados/novoExame",
            {...data,user:usuario?.nome,data_orcamento:dataAtual.toISOString(),data_realizado:undefined}
         ),
         {
          error:'Erro ao gerar novo exame',
          loading:'Gerando novo exame.....',
          success:(response)=>{
            setExames([...examesRealizados,response.data])
            setExameSelected(valorInicial)
            setOpenModal(false)
            
            return 'Exame gerado com sucesso!'}
         }
        )

      
  
 
}, [examesRealizados,exameSelected.id_exame]);


const handleEditarExame = useCallback(async(data:ExameRealizadoProps)=>{
  
  if(!data.id_exame){
    toast.error('Selecione um exame para editar')
    return
  }
 toast.promise(
      api.put("/afapSaude/examesRealizados/editar",
        {...data}
     ),
     {
      error:'Erro ao editar exame',
      loading:'Editando exame.....',
      success:(response)=> {
        setExames([...examesRealizados.filter(item=>item.id_exame!==Number(data.id_exame)),response.data])
        setExameSelected(valorInicial)
        setOpenModal(false)
        
        return 'Exame editado com sucesso!'}
     }
    )

   

},[exameSelected.id_exame])


/*const handleDeletar = useCallback(async () => {
  try {
    const response = await toast.promise(
      api.delete(`/afapSaude/consultas/deletarCadastro/${data?.id_consulta}`),
      {
        error: 'Erro ao deletar dados',
        loading: 'Deletando dados....',
        success: 'Dados deletados com sucesso!',
      }
    );
      setConsultas(consultas.filter(atual => atual.id_consulta !== data?.id_consulta));
 
  } catch (error) {
    console.log(error);
  }
}, [consultas, data, setConsultas]);
*/


  

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="flex w-full justify-between items-center gap-4 flex-wrap">
        <FiltroExames
          filtroExames={listarExamesRealizados}
          loading={false}
          openModal={filtro}
          setOpenModal={() => setFiltro(!filtro)}
        />

        <ExamesToolbar
          onAdd={() => {
            setOpenModal(true);
            setExameSelected(valorInicial);
          }}
          onEdit={() => setOpenModal(true)}
          onPrintBudget={imprimirOrcamento}
          onPrintReceipt={imprimirRecibo}
          onReceive={() => setOpenModalReceber(true)}
          onRevert={() => {}}
          onWhatsApp={() => handleWhatsAppClick(exameSelected?.celular)}
          onDelete={() => setOpenModalDeletar(true)}
        />
      </div>

      <div className="overflow-x-auto h-[calc(100vh-200px)]">
        <ExamesTable
          exames={examesRealizados}
          selectedExame={exameSelected}
          onSelectExame={setExameSelected}
        />
      </div>

       { openModal &&  <ModalAdministrarExame handleEditarExame={handleEditarExame}  handleNovoExame={handleNovoExame} arraySelectExames={exames} openModal={openModal} setOpenModal={()=>setOpenModal(false)} registro={exameSelected}/>}

{openModalReceber && <ModalConfirmar
  pergunta="Realmente deseja receber essa consulta?"
  handleConfirmar={handleReceberExame}
  openModal={openModalReceber}
  setOpenModal={()=>setOpenModalReceber(false)}
>

  <Select  value={formPag} onValueChange={(e) => { setFormPag(e)}} >
      <SelectTrigger className={`  shadow-none font-semibold  focus:ring-0  `}  >
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent className="shadow-none" >
        <SelectGroup className="shadow-none">
         
      <SelectItem className="text-xs" value="DINHEIRO"  >
        DINHEIRO
      </SelectItem>
      <SelectItem className="text-xs" value="CARTAO"  >
        CARTÃO
      </SelectItem>
      <SelectItem className="text-xs" value="PIX"  >
        PIX
      </SelectItem>
      <SelectItem className="text-xs" value="TRANSFERENCIA"  >
        TRANSFERÊNCIA
      </SelectItem>

        
        </SelectGroup>
      </SelectContent>
    </Select>
        
  </ModalConfirmar>}

<ModalConfirmar 
handleConfirmar={handleDeletar}
 openModal={openModalDeletar}
  pergunta="Tem certeza que deseja excluir esse exame?"
  setOpenModal={setOpenModalDeletar}
/>
        <div style={{display:'none'}}>
          <Orcamento dados={exameSelected} usuario={usuario?.nome ??''} ref={currentPage} />
          <ReciboMensalidade
                 cidade_uf="CEDRO/CE"
                 endereco="RUA VER. SALUSTIANO MOURA, 394 - CENTRO"
                 logoUrl="/afapsaude.png"
                associado={exameSelected.nome_responsavel?exameSelected?.nome_responsavel:exameSelected?.nome}
                contrato={exameSelected?.id_exame??null}
                data_pgto={exameSelected?.data_realizado??null}
                n_doc=""
                referencia=""
                valor={exameSelected?.exames.reduce((total, exame) => total + exame.valorFinal, 0)}
                vencimento={new Date()}
                ref={currentRecibo}
                referente={`Exames`}
               />
        </div>

    </div>
  );
}