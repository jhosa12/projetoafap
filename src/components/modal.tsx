import { FormEvent, useEffect, useState,useContext} from "react"
import { AuthContext } from "@/contexts/AuthContext";
import { IoIosClose } from "react-icons/io";
import { api } from "@/services/apiClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


interface MensalidadeProps{
    id_acordo:number,
    parcela_n:number,
    vencimento:Date,
    cobranca:Date,
    valor_principal:number,
    close:boolean,
    status:string,
    usuario:string,
    id_mensalidade:number,
    valor_total:number,
    motivo_bonus: string,
    data_pgto:Date,
    referencia:string,
    index:number
}


interface ConvProps {
    editar: boolean
    id_conv: number | null,
    id_contrato: number | null,
    id_associado: number | null,
    id_dependente: number | null,
    id_contrato_st: string,
    tipo_entrada: string,
    nome: string,
    cpf_cnpj: string,
    data: Date,
    status: string,
    forma_pag: string,
    logradouro: string,
    numero: number | null,
    complemento: string,
    bairro: string,
    cep: string,
    cidade: string,
    uf: string,
    subtotal: number | null,
    descontos: number | null,
    total: number | null,
    logradouro_r: string,
    numero_r: number | null,
    complemento_r: string,
    bairro_r: string,
    cep_r: string,
    cidade_r: string,
    uf_r: string,
    data_inc: Date,
    hora_inc: Date,
    usuario: string,
    obs: string,
    convalescenca_prod: Partial<{
        id_conv: number,
        id_produto: number,
        descricao: string,
        unidade: string,
        grupo: string,
        data: Date,
        data_dev: Date,
        quantidade: number,
        valor: number,
        descontos: number,
        total: number,
        hora: Date,
        cortesia: string,
        retornavel: string,
        status: string
    }>,
    contrato: {
        situacao: string,
        carencia: string,
        associado: {
            nome: string
        }

    }

}

interface ContratoProps{
    id_contrato: number,
    plano: string,
    id_plano: number,
    valor_mensalidade: number,
    dt_adesao: Date,
    dt_carencia: Date,
    situacao: string,
    anotacoes: string,
    consultor: string,
    cobrador: string,
    data_vencimento: Date,
    n_parcelas: number,
    origem: string,
    supervisor: string,
    convalescencia: Array<ConvProps>,
    categoria_inativo: string,
    motivo_inativo: string,
    dt_cancelamento: true,
}
interface AcordoProps{
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo: string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}

interface DependentesProps {
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    close: boolean,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
    convalescenca: {
        convalescenca_prod: Partial<{
            id_conv: number,
            id_produto: number,
            descricao: string,
            unidade: string,
            grupo: string,
            data: Date,
            data_dev: Date,
            quantidade: number,
            valor: number,
            descontos: number,
            total: number,
            hora: Date,
            cortesia: string,
            retornavel: string,
            status: string
        }>,
    }
}
interface ContratoProps{
    id_contrato:number
}
interface DependentesProps{
    nome:string
}
interface DadosProps{
    id_associado:number,
    nome:string,
    numero:number,
    bairro:string,
    uf:string
    cidade:string,
    endereco:string,
    contrato:ContratoProps,
    dependentes:Array<DependentesProps>
}


export function ModalBusca(){
    const {carregarDados,data,closeModa}= useContext(AuthContext)
    const [loading,setLoading] = useState(false)
    const [input,setInput] =useState('')
    const [array,setarray]=useState<DadosProps[]>([])
    const [dropOpen,setDrop] = useState(0)
    const [criterio,setCriterio]=useState("Contrato")
    const [componentMounted,setMounted]= useState<boolean>(false)
   
  
 async function onSubmit(event:FormEvent){
    event.preventDefault()
   
    setLoading(true)
   await buscar()
   setLoading(false)
  }
  function dadosAssociado(id_associado:number) {
   closeModa({...data,id_associado,closeModalPlano:false})

  }
//  useEffect(()=>{
//   componentMounted && carregarDados()
//   setMounted(true)
//  },[data.id_associado])

  async function buscar(){

    if(criterio ==="Contrato"){
        const response =  await api.post('/buscar',{
            id_contrato:Number(input),
            empresa:data.empresa
        })
        setarray(response.data)

      }
      if(criterio ==="Titular"){
        const response =  await api.post('/buscar',{
            nome:input.toUpperCase(),
            empresa:data.empresa
        })
        setarray(response.data)
      }
      if(criterio ==="Dependente"){
        const response =  await api.post('/buscar',{
            dependente:input.toUpperCase(),
            empresa:data.empresa
        })
        setarray(response.data)
      }
      if(criterio ==="Endereço"){
        const response =  await api.post('/buscar',{
            endereco:input.toUpperCase(),
            empresa:data.empresa
        })
        setarray(response.data)
      }
      if(criterio ==="Bairro"){
        const response =  await api.post('/buscar',{
            bairro:input.toUpperCase(),
            empresa:data.empresa
        })
        setarray(response.data)
      }
    }
    
    return(
        <div  className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
  
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-10 bg-gray-50 ">
      
        <div className="fixed flex flex-col  w-2/4 max-h-[500px] min-h-min rounded-lg shadow bg-gray-700">
            <div className="flex w-full items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
            <form onSubmit={onSubmit} className="flex w-3/4">
    <div className="flex w-full">
    <button onClick={()=>setDrop(1)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-s-lg focus:outline-none border-e-2 border-gray-700  bg-gray-600 hover:bg-gray-600 focus:ring-gray-700 text-white" type="button">{data.empresa} 
    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
  </svg></button>
    <button onClick={()=>setDrop(2)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center  focus:outline-none  bg-gray-600 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600" type="button">{criterio} 
    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
  </svg></button>
 
      {dropOpen===2 && (
          <div className="absolute top-[80px] divide-gray-100 rounded-lg shadow w-44 bg-gray-700">
          <ul className="py-2 text-sm text-gray-200">
          <li >
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Contrato'),setDrop(0)}}>Contrato</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Titular'),setDrop(0)}}>Titular</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Dependente'),setDrop(0)}}>Dependente</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white"  onClick={()=>{setCriterio('Endereço'),setDrop(0)}}>Endereço</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white"  onClick={()=>{setCriterio('Bairro'),setDrop(0)}}>Bairro</a>
          </li>
          </ul>
      </div>
      )}
   {dropOpen ===1 && (
          <div className="absolute top-[80px] divide-gray-100 rounded-lg shadow w-44 bg-gray-700">
          <ul className="py-2 text-sm text-gray-200">
          <li >
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{closeModa({...data,empresa:'AFAP CEDRO'}),setDrop(0)}}>AFAP CEDRO</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{closeModa({...data,empresa:'AFAP LAVRAS'}),setDrop(0)}}>AFAP LAVRAS</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{closeModa({...data,empresa:'ÓTICA FREITAS'}),setDrop(0)}}>ÓTICA FREITAS</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white"  onClick={()=>{closeModa({...data,empresa:'AFAP VIVA MAIS'}),setDrop(0)}}>AFAP VIVA MAIS</a>
          </li>
         
          </ul>
      </div>
      )}












        <div className="relative  w-full">
            <input   value={input} onChange={e=>setInput(e.target.value)} type={criterio==="Contrato"?"number":"search"} autoComplete="off"  className="uppercase flex justify-center  p-2.5 w-full z-20 text-sm  rounded-e-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " placeholder="Search" required/>
            <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
  </svg></button>
        </div>
    </div>
</form>
                <button  type="button" onClick={()=>closeModa({closeModalPlano:false})} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
               <IoIosClose size={30}/>
                </button>
            </div>
            {loading?((<div className="flex flex-col h-full justify-center items-center p-2"><AiOutlineLoading3Quarters color='white' size={40} className="animate-spin"/></div>)):(
                <div className="flex flex-col overflow-y-auto mb-1 p-2 md:p-2">
                <p className="text-gray-400 mb-2">Selecione o Contrato:</p>
                <ul className="overflow-y-visible space-y-2 mb-2">
                                {array.map((item,index)=>(
                                     <li onClick={()=>dadosAssociado(Number(item.id_associado))}>
                                     <label  className="inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                                    <div className="block">
                                     <div className="w-full text-sm font-semibold"><span className="pr-2">{item?.contrato?.id_contrato}</span>{item.nome}<span className="flex flex-col gap-1">{item?.dependentes?.map((i,id)=>(<span>DEPENDENTE: {i.nome}</span>))}</span></div>
                                     <div className="w-full text-sm text-gray-400">
                                         <span className="pr-2">{item.endereco}{item.id_associado}</span>
                                         Nº:<span className="pr-2">{item.numero}</span>
                                         BAIRRO:<span className="pr-2"> {item.bairro}</span>
                                         CIDADE:<span className="pr-2">{item.cidade}/{item.uf}</span>
                                         </div>
                                         </div>
                                         <svg className="w-4 h-4 ms-3 rtl:rotate-180  text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                                     </label>
                                     </li>
                                ))}     
                </ul>
            </div>
            )}
            
        </div>
    </div>
</div> 


    
    )
}