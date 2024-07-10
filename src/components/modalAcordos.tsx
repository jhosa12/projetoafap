import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';





interface MensalidadeProps {
    id_acordo: number,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    close: boolean,
    status: string,
    usuario: string,
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number
}

interface AcordoProps {
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
interface DadosAcordoProps{
    closeModal:(fields:{open:boolean,visible:boolean})=>void,
    openModal:{open:boolean,visible:boolean}
    acordo:Partial<AcordoProps>,
    usuario:{nome:string,id:number},
    mensalidade:Array<MensalidadeProps>
    contrato:number
    associado:number
    carregarDados:()=>Promise<void>
}
export function ModalAcordos({closeModal,acordo,usuario,mensalidade,contrato,associado,carregarDados,openModal}:DadosAcordoProps){
 
    const [arrayAcordo,setArrayAcordo] = useState<Partial<AcordoProps>>(acordo)


    const setarDadosAcordo = (fields:Partial<AcordoProps>)=>{
        setArrayAcordo((prev:Partial<AcordoProps>)=>{
            if(prev){
                return {...prev,...fields}
            }
            else{
                return{...fields}

            }
        })

    }


    function adicionarProxima(){
     //   let ultimoIndex:number|undefined =-1;
         //   if(dadosassociado?.mensalidade){
          //  for (let i = dadosassociado?.mensalidade.length -1;i>=0;i--){
            //    if(dadosassociado.mensalidade[i].status==='E'){
                //    ultimoIndex =i;
                 //   break;
             //   }
           // }
       // }
     const ultimoIndex = mensalidade.findLastIndex(item=>item.status==='E')
        if(ultimoIndex){
            const novoArray = arrayAcordo.mensalidade && [...arrayAcordo.mensalidade]
      novoArray && novoArray.push(mensalidade[ultimoIndex+1])
         
            setarDadosAcordo({...arrayAcordo,mensalidade:novoArray,total_acordo:novoArray?.reduce((total,mensalidade)=>total+Number(mensalidade.valor_principal),0)})
        }
    }

        useEffect(()=>{
            
            
        
       const valor_total =arrayAcordo?.mensalidade?.reduce((total,mensalidade)=>total+Number(mensalidade.valor_principal),0)
       // if(!arrayAcordo.total_acordo && !arrayAcordo?.data_inicio) 
          //   closeModa({acordo:{...data.acordo, mensalidade:data.acordo?.mensalidade,total_acordo:valor_total,//data_inicio:new Date()}});
      },[])

      async function criarAcordo() {

        const novasMensalidades = arrayAcordo.mensalidade?.map(mensal=>{
            return {...mensal,status:'E',cobranca:arrayAcordo.data_fim}
        })
        if(!arrayAcordo.mensalidade){
        toast.info("Selecione as referências do acordo!")
        return;
        }
        if(!arrayAcordo.data_inicio||!arrayAcordo.data_fim||!arrayAcordo.descricao||!arrayAcordo.realizado_por){
            toast.info("Preencha todos os campos!")
            return;
        }
        try{
            const response = await toast.promise(
                api.post('/novoAcordo',{
                    id_contrato:contrato,
                    status:'A',
                    id_associado:associado,
                    data_inicio:arrayAcordo.data_inicio,
                    data_fim:arrayAcordo?.data_fim,
                    total_acordo:arrayAcordo?.total_acordo,
                    realizado_por:arrayAcordo?.realizado_por ,
                    descricao:arrayAcordo.descricao,
                    metodo:arrayAcordo.metodo,
                    dt_criacao:new Date() ,
                    user_criacao:usuario,
                    mensalidades:novasMensalidades
                }),
                {
                    error:'Erro ao Criar Acordo!',
                    pending:'Adicionando novo acordo!',
                    success:'Acordo Adicionado com Sucesso'
            }
            )
            

        }catch(err){console.log(err)}
     
        await carregarDados()
      }

      async function baixarAcordo(){
        const novasMensalidades = arrayAcordo.mensalidade?.map(mensal=>{
            return {...mensal,status:'P',data_pgto:new Date(),usuario:usuario,valor_total:mensal.valor_principal}
        }
        )
        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:arrayAcordo?.id_acordo,
               id_usuario:usuario?.id,
               id_contrato:contrato,
                status:'P',
                dt_pgto:new Date(),
                mensalidade:novasMensalidades
                }),
                {
                error:'Erro ao efetuar baixa',
                pending:'Efetuando Baixa',
                success:'Baixa Efetuada com sucesso!'
                }
            )

        }catch(err){

            console.log(err)
            
        }
        await carregarDados();
    
      
      }

      async function editarAcordo(){
        const novasMensalidades = arrayAcordo.mensalidade?.map(mensal=>{
            return {...mensal,status:'E'}
        }
        )

        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:arrayAcordo.id_acordo,
                status:'A',
                dt_pgto:new Date(),
                data_inicio:arrayAcordo?.data_inicio,
                data_fim:arrayAcordo?.data_fim,
                descricao:arrayAcordo?.descricao,
                total_acordo:arrayAcordo?.total_acordo,
                mensalidade:novasMensalidades
                }),
                {
                error:'Erro ao efetuar atualização',
                pending:'Efetuando atualização',
                success:'Atualização Efetuada com sucesso!'
                }
            )


        }catch(err){
            console.log(err)
            
        }
        
      }
     
    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4  max-h-[calc(100vh-150px)] rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={()=>closeModal({open:false,visible:false})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        <label className="flex w-full flex-row px-4 py-2 border-b-[1px] rounded-t-lg  text-lg col-start-1 font-semibold whitespace-nowrap gap-2 text-white">ADMINISTRAR ACORDO</label>
        <div className="p-2  border-b border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
       



<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIO</label>
    <DatePicker   dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={arrayAcordo.data_inicio} onChange={(e)=>e && setarDadosAcordo({...arrayAcordo,data_inicio:e})}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA FIM</label>
    <DatePicker   dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={arrayAcordo.data_fim} onChange={(e)=>e && setarDadosAcordo({...arrayAcordo,data_fim:e})}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">TOTAL ACORDO</label>
    <input disabled type="text" value={arrayAcordo.total_acordo}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">REALIZADO POR</label>
    <input type="text" value={arrayAcordo.realizado_por} onChange={e=>setarDadosAcordo({...arrayAcordo,realizado_por:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>


<div className="mb-1 col-span-3">
    <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
    <input value={arrayAcordo.descricao} onChange={e=>setArrayAcordo({...arrayAcordo,descricao:e.target.value})} type="text" placeholder="Descreva aqui todos os detalhes do acordo" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">MÉTODO</label>
    <input type="text" value={arrayAcordo.metodo} onChange={e=>setarDadosAcordo({...arrayAcordo,metodo:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">
{openModal.visible?(
<button onClick={()=>criarAcordo()} type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>APLICAR</button>):(
<div className=" inline-flex w-full justify-between">
<button onClick={()=>editarAcordo()} type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>SALVAR</button>
<button onClick={()=>baixarAcordo()} type="button" className="flex flex-row justify-center  bg-green-600 rounded-lg p-2 gap-2 text-white"><IoIosArrowDropdownCircle size={22}/>BAIXAR ACORDO</button>
</div>
)}
</div>
    </div>

</form>
<label className="flex w-full justify-center text-white font-semibold pt-1">REFERÊNCIAS</label>
<div className="inline-flex w-full justify-start  rounded-md shadow-sm pl-2 pb-2">
  <button disabled={!!!arrayAcordo.id_acordo} onClick={adicionarProxima}  type="button" className="inline-flex items-center px-2 py-1 gap-1 text-sm font-medium  border  rounded-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
    Adicionar Próxima
  </button>

 
</div>
<div className="flex-col overflow-auto w-full justify-center items-center max-h-[350px] bg-gray-800 rounded-lg mb-4 pl-2 pr-2">
    <table 
    className="flex-col w-full p-2 overflow-y-auto overflow-x-auto  text-xs text-center rtl:text-center border-collapse  rounded-lg text-gray-400">
    <thead className=" text-xs uppercase bg-gray-700 text-gray-400">
            <tr >
                <th scope="col" className="px-2 py-1">
                    NP
                </th>
                <th scope="col" className=" px-2 py-1">
                    DATA VENC.
                </th>
                <th scope="col" className=" px-2 py-1">
                    REF
                </th>
                <th scope="col" className="px-4 py-1">
                    DATA AGEND.
                </th>
                <th scope="col" className="px-2 py-1">
                    VALOR
                </th>
                <th scope="col" className="px-2 py-1">
                    status
                </th>
            </tr>
        </thead>
        <tbody  >
            {arrayAcordo.mensalidade?.map((item,index)=>(  
                <tr key={index} 
                className={` border-b "bg-gray-800"} border-gray-700 `}>
                <th scope="row" className={`px-5 py-1 font-medium  whitespace-nowrap  `}>
                    {item.parcela_n}
                </th>
                <td className={`px-2 py-1 `}>
                   {new Date(item.vencimento || '').toLocaleDateString('pt',{timeZone:'UTC'})}
                   
                </td>
                <td className="px-2 py-1">
                   {item.referencia}
                </td>
                <td className="px-5 py-1">
                {new Date(item.cobranca || '').toLocaleDateString('pt',{timeZone:'UTC'})}
                </td>
                <td className="px-3 py-1">
               {`R$${item.valor_principal}`}
                </td>
                <td className={`px-4 py-1 font-bold text-red-600`}>
                  {item.status}
                </td>

            </tr>
                
            ))}
            
        </tbody>
    
    </table>
    </div>
</div>
</div>
</div>)
}