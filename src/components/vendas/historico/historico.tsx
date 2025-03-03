import useApiGet from "@/hooks/useApiGet";
import { Label, Modal, Select, Spinner, Table, TextInput } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { ModalItem } from "./modalItem/modalItem";
import { ModalConfirmar } from "@/components/afapSaude/components/modalConfirmar";
import useApiPost from "@/hooks/useApiPost";
import { Button } from "@/components/ui/button";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Control, Controller, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { Sub } from "@radix-ui/react-menubar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCheck, MdCheckCircle, MdCreateNewFolder } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { gerarMensalidade, ParcelaData } from "@/utils/gerarArrayMensal";
import { AssociadoProps, ContratoProps, DependentesProps } from "@/types/associado";
import  Router  from "next/router";
import { ajustarData } from "@/utils/ajusteData";
import { ModalLoading } from "@/components/loading/modalLoading";

export interface ReqLeadsProps{
    id?:string,
    statusSelected?:string,
    status?:Array<string>,
    nome?:string,
    startDate?:string,
    endDate?:string
}


interface CadastroRequest {
  dataPlano: Partial<{ id_empresa:string,
    nome: string;
    cpfcnpj: string;
    rg:string;
    cep: string;
    endereco: string;
    bairro: string;
    numero: number;
    cidade: string;
    uf: string;
    guia_rua: string;
    email: string;
    data_nasc: Date;
    data_cadastro: Date;
    celular1: string;
    celular2: string;
    telefone: string;
    cad_usu: string;
    cad_dh: Date;
    edi_usu: string;
    edi_dh: Date;
    profissao: string;
    sexo: string;
    situacao:string;
    contrato: Partial<ContratoProps & {
        form_pag: string,
        adesao: Date
    }>;
    dependentes:Array<Partial<DependentesProps>>;
    mensalidades: Array<Partial<ParcelaData>>;
    empresa:string}>,
    id_lead:number
}

export interface LeadProps {
    index: number,
    id_lead: number,
    visita: Date,
    consultor: string,
    id_usuario: string,
    id_plano: number,
    plano: string,
    origem: string,
    uf:string,
    valor_mensalidade: number
    nome: string,
    endereco: string,
    n_parcelas: number,
    possuiPet: string
    planoPet: string,
    status: string,
    bairro: string,
    numero: number,
    data_nasc: Date,
    cep: string,
    rg: string,
    cpfcnpj: string,
    guia_rua: string,
    cidade: string,
    celular1: string,
    vencimento: Date | undefined,
    celular2: string,
    empresaAtual: string,
    servicosUsados: string,
    motivo: string,
    planodesaude: string,
    indicacao: string,
    usuario: string,
    data: Date,
    dependentes: Array<Partial<DependentesProps>>,
    form_pag?: string,
    adesao?: Date
}

export function Historico() {
    const { postData, data,loading:loadingLeads } = useApiGet<Array<LeadProps>, ReqLeadsProps>("/lead/lista")
    const [lead, setLead] = useState<Partial<LeadProps>>()
    const [categoria, setCategoria] = useState("")
    const { postData: postCategoria } = useApiPost<LeadProps, { id_lead: number | undefined, categoriaAtual: string, categoriaAnt: string | undefined, usuario: string | undefined }>("/leads/alterarCategoria")
    const {selectEmp,carregarDados} = useContext(AuthContext)
    const [modal,setModal] = useState<{[key:string]:boolean}>({
        lead:false,
        confirmaCategoria:false,
        filtro:false,
        novo:false,
        confirmaPlano:false
    })

    const {data:associado,loading,postData:postAssociado}= useApiPost<{  
        id_contrato: number,
        id_global: number,
        id_contrato_global: number},Partial<CadastroRequest>>("/leads/gerarPlano")
        const {register,handleSubmit,control,watch} = useForm<ReqLeadsProps>({
            defaultValues:{
                startDate:new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
                endDate:new Date().toISOString(),   
            }
        })

    const onChangeCategoria = (e: React.ChangeEvent<HTMLSelectElement>, lead: Partial<LeadProps>) => {
        if (lead.status === e.target.value) {
            return;
        };
        setCategoria(e.target.value);
        setLead(lead);
        setModal({confirmaCategoria:true})
    }



    const handleGerarContrato = async() => {
      
        
        if(lead?.status!== 'VENDA'){
            toast.warning('Selecione uma venda para gerar contrato!')
            return
        }
        if(!lead.endereco||!lead.bairro||!lead.cep||!lead.cidade||!lead.id_plano||!lead.plano||!lead.valor_mensalidade||!lead.vencimento||!lead.origem||!lead.cpfcnpj||!lead.n_parcelas){
            toast.warning('Preencha todos os campos obrigatorios para gerar contrato!')
            return
        }
        let adesao
      if(lead.adesao) {  adesao = new Date(lead.adesao)
        adesao.setTime(adesao.getTime() - adesao.getTimezoneOffset() * 60 * 1000)}
     let dtVencimento
        if(lead.vencimento){
            dtVencimento = new Date(lead.vencimento)
            dtVencimento.setTime(dtVencimento.getTime() - dtVencimento.getTimezoneOffset() * 60 * 1000)
        }
      

        try {

            await postAssociado({
                dataPlano: {dependentes:lead.dependentes,
                     bairro:lead.bairro,
                     celular1:lead.celular1,
                     celular2:lead.celular2,
                     cep:lead.cep,
                     cidade:lead.cidade,
                     cpfcnpj:lead.cpfcnpj,
                     data_nasc:lead.data_nasc,
                     endereco:lead.endereco,
                     id_empresa:selectEmp,
                     nome:lead.nome,
                     numero:lead.numero,
                     uf:lead.uf,
                     rg:lead.rg,
                     contrato:{
                         id_plano:lead.id_plano,
                         plano:lead.plano,
                         valor_mensalidade:lead.valor_mensalidade,
                         n_parcelas:lead.n_parcelas,
                         data_vencimento:dtVencimento,
                         dt_adesao:adesao,
                         dt_carencia:new Date(),
                         origem:lead.origem,
                         consultor:lead.consultor,
                        // form_pag: lead.form_pag,
                        
                     },
                     mensalidades:gerarMensalidade({vencimento:dtVencimento,n_parcelas:lead.n_parcelas,valorMensalidade:Number(lead.valor_mensalidade)})},
                     id_lead:lead.id_lead
                  
                 })
                 
                await reqDados({})
                 setModal({novo:true})
            
        } catch (error) {
            
        }
     
    }


    const handleAtualizarCategoria = useCallback(async () => {
        try {
            await postCategoria({ categoriaAtual: categoria, categoriaAnt: lead?.status, usuario: lead?.usuario, id_lead: lead?.id_lead })

            postData({})
            reqDados({})
            setModal({confirmaCategoria:false})

        } catch (error) {
            console.log(error)
        }
    }, [categoria, lead?.id_lead])



    const reqDados:SubmitHandler<ReqLeadsProps> = useCallback(async (data) => {
      // const start =watch('startDate')
      //const  end = watch('endDate')

      if(data.startDate&&data.endDate&&new Date(data.startDate)>new Date(data.endDate)){
        toast.warning('Data inicial não pode ser maior que a data final')
      }
       const {dataIni,dataFim} = ajustarData(data.startDate?new Date(data.startDate):undefined,
       data.endDate?new Date(data.endDate):undefined
    )
        try {
           await postData({...data,
                status:data.statusSelected?data?.statusSelected?.split(','):[],
                startDate:dataIni,
                endDate:dataFim
            })

            setModal({filtro:false})

        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
       // const start =watch('startDate')
       // const  end = watch('endDate')
       //  const {dataIni,dataFim} = ajustarData(start?new Date(start):undefined,
       //  end?new Date(end):undefined)
        reqDados({
           statusSelected:'VENDA',
        })
    }, [])

    return (
        <div className="flex-col w-full px-2 bg-white   ">
            <ModalFiltro loading={loadingLeads} handleSubmit={handleSubmit} register={register} control={control} handleOnSubmit={reqDados} show={modal.filtro} onClose={() => setModal({filtro:false})} />
           {modal.lead && <ModalItem  handleLoadLeads={()=>reqDados({})} item={lead ?? {}} open={modal.lead} onClose={() => setModal({lead:false})} />}
            <ModalConfirmar pergunta={`Tem certeza que deseja alterar o(a) ${lead?.status} para um(a) ${categoria} ? Essa alteração será contabilizada na faturação!`} handleConfirmar={handleAtualizarCategoria} openModal={modal.confirmaCategoria} setOpenModal={()=>setModal({confirmaCategoria:false})} />

      {  modal.confirmaPlano &&   <ModalConfirmar pergunta={`Tem certeza que deseja Transformar essa venda em Plano ?`} handleConfirmar={handleGerarContrato} openModal={modal.confirmaPlano} setOpenModal={()=>setModal({confirmaPlano:false})} />}




{modal.novo &&
         <ModalNovoContrato id_global={associado?.id_global} carregarDados={carregarDados} id_contrato={associado?.id_contrato} loading={loading} show={modal.novo} onClose={() => setModal({novo:false})} />}
            <div className="flex flex-row w-full ">
`
                <Button onClick={() => setModal({filtro:true})} className="ml-auto" size={'sm'} variant={'outline'}>FILTRAR</Button>
            </div>


           {loadingLeads ? <ModalLoading show={loadingLeads} /> : <div className="overflow-y-auto mt-2  h-[calc(100vh-145px)]   ">
                <Table  hoverable theme={{root:{shadow:'none'}, body: { cell: { base: " px-2 py-0  text-[11px] text-black" } } }}  >
                    <Table.Head theme={{ cell: { base: "px-3 py-1 text-xs text-black font-bold bg-gray-50" } }} >
                        <Table.HeadCell >
                            Nome
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Previsão de Visita
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Data
                        </Table.HeadCell>
                        <Table.HeadCell >
                            categoria
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Vendedor
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Celular1
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Vencimento
                        </Table.HeadCell>

                        <Table.HeadCell >
                            
                        </Table.HeadCell>

                    </Table.Head>
                    <Table.Body className="divide-y">
                        {data?.map((item, index) => (

                            <>
                                <Table.Row className="cursor-pointer " key={index} onClick={() => { setLead(item), setModal({lead:true}) }} >

                                    <Table.Cell className="">
                                        {item?.nome}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {item?.visita && new Date(item?.visita).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </Table.Cell>

                                    <Table.Cell className="">
                                        {item?.data && new Date(item?.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </Table.Cell>

                                    <Table.Cell onClick={e => { e.stopPropagation() }} className={`${item?.status === 'LEAD' ? 'text-blue-600' : item.status === 'PROSPECCAO' ? 'text-yellow-500' : 'text-green-500'}`} >
                                        <select onChange={e => onChangeCategoria(e, item)} className="appearance-none border-none text-xs" value={item?.status}>
                                            <option>LEAD</option>
                                            <option>PROSPECCAO</option>
                                            <option>PRE VENDA</option>
                                            <option>VENDA</option>
                                        </select>
                                    </Table.Cell>
                                    <Table.Cell >
                                        {item?.consultor}
                                    </Table.Cell>

                                    <Table.Cell >
                                        {item?.celular1}
                                    </Table.Cell>

                                    <Table.Cell >
                                        {item?.vencimento?new Date(item?.vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }):''}
                                    </Table.Cell>


                                    
                                    <Table.Cell >
                                      {item.status==='VENDA' && <button type="button" data-tooltip-id="tooltipAcoes" data-tooltip-content={'Criar Plano'} onClick={e => { e.stopPropagation();setLead(item), setModal({confirmaPlano:true})}}>
                                        <MdCreateNewFolder size={20} />
                                       </button>}
                                    </Table.Cell>


                                </Table.Row>

                            </>
                        ))}



                    </Table.Body>

                </Table>

                        <Tooltip id="tooltipAcoes"/>

            </div>}

        </div>
    )
}



interface DataProps {
    show: boolean,
    onClose: () => void
    loading: boolean
    handleOnSubmit: SubmitHandler<ReqLeadsProps>
    register: UseFormRegister<ReqLeadsProps>
    control:Control<ReqLeadsProps,any>
    handleSubmit:UseFormHandleSubmit<ReqLeadsProps>
}




export const ModalFiltro = ({ onClose, show, handleOnSubmit,register,control,handleSubmit,loading }: DataProps) => {
 




    return (
        <Modal size="sm" popup show={show} onClose={onClose}>
            <Modal.Header />
            <Modal.Body>
                <form  onSubmit={handleSubmit(handleOnSubmit)}  className="flex flex-col gap-2 mt-1" >
                    <div>
                        <Label className="text-xs" value="Nome" />
                        <TextInput {...register('nome')} className="uppercase" sizing={'sm'} placeholder="NOME" />
                    </div>

                    <div>
                        <Label className="text-xs" value="Categoria" />
                        <Select {...register('statusSelected')} sizing={'sm'}>
                        <option value={undefined}></option>
                            <option value={"LEAD"}>LEAD</option>
                            <option value={"PROSPECCAO"}>PROSPECÇÃO</option>
                            <option value={"PRE VENDA"}>PRE VENDA</option>
                            <option value={"VENDA"}>VENDA</option>
                        </Select>
                    </div>
                    <div className="inline-flex w-full justify-between gap-2">
                        <div >

                            <Label className="text-xs" value="Data inicio" />
                            <Controller
                                control={control}
                                name='startDate'
                                render={({field: {onChange, value}}) => (
                                    <DatePicker selected={value?new Date(value):null} onChange={e => onChange(e)} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                                )}
                            />
                            
                        </div>

                        <div >

                            <Label className="text-xs" value="Data fim" />
                            <Controller
                                control={control}
                                name='endDate'
                                render={({field: {onChange, value}}) => (
                                         <DatePicker selected={value?new Date(value):null} onChange={e => onChange(e)} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                                )}
                            />
                           
                        </div>
                    </div>
                    <Button type="submit">{loading?<Spinner size="sm" />:'Aplicar'}</Button>
                </form>
            </Modal.Body>

        </Modal>
    )
}


interface ModalNovoContratoProps {
    show: boolean,
    onClose: () => void
    loading: boolean,
    id_contrato: number|undefined
    id_global: number|undefined
    carregarDados:Function
    
}
export const ModalNovoContrato = ({id_contrato,loading,onClose,show,carregarDados,id_global}: ModalNovoContratoProps) =>{

    return(
        <Modal size="sm" popup show={show} onClose={onClose}>
           
            <Modal.Body>
                <div className="flex flex-col justify-center items-center w-full gap-2 mt-6" >
                   {loading ? <Spinner size="xl" /> : <div className="flex flex-col w-full gap-4">
                    <div className="inline-flex items-center gap-1">
                        <MdCheckCircle size={24} className="text-green-500" />
                        <span className="font-semibold">Sucesso</span>
                    </div>
                    <h1 className="text-md font-semibold">Novo Contrato: {id_contrato?.toString()}</h1>
                    <div className="flex w-full justify-between">
                        <Button onClick={()=>{Router.push(`/admcontrato`); carregarDados(id_global)}} variant={'outline'}>Acessar Contrato</Button>
                        <Button variant={'destructive'} onClick={onClose}>Fechar</Button>
                    </div>
                    </div>
                 }
                </div>
            </Modal.Body>
        </Modal>
    )
}