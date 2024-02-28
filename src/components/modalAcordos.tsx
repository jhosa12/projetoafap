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



export function ModalAcordos(){
    const {closeModa,data,usuario,carregarDados,dadosassociado}=useContext(AuthContext)


    function adicionarProxima(){
        let ultimoIndex =-1;
            if(dadosassociado?.mensalidade){
            for (let i = dadosassociado?.mensalidade.length -1;i>=0;i--){
                if(dadosassociado.mensalidade[i].status==='E'){
                    ultimoIndex =i;
                    break;
                }
            }
        }
        if(ultimoIndex!==-1 && dadosassociado?.mensalidade){
            const novoArray = data.acordo?.mensalidade
      novoArray && novoArray.push(dadosassociado?.mensalidade[ultimoIndex+1])
         
            closeModa({acordo:{...data.acordo,mensalidade:novoArray,total_acordo:novoArray && novoArray.reduce((total,mensalidade)=>total+Number(mensalidade.valor_principal),0)}})
        }
    }

        useEffect(()=>{
            
        
       const valor_total =data.acordo?.mensalidade && data.acordo?.mensalidade.reduce((total,mensalidade)=>total+Number(mensalidade.valor_principal),0)
        if(!data.acordo?.total_acordo && !data.acordo?.data_inicio)  closeModa({acordo:{...data.acordo,total_acordo:valor_total,data_inicio:new Date()}});
      },[])

      async function criarAcordo() {

        const novasMensalidades = data.acordo?.mensalidade?.map(mensal=>{
            return {...mensal,status:'E',cobranca:data.acordo?.data_fim}
        })
        if(!data.acordo?.mensalidade){
        toast.info("Selecione as referências do acordo!")
        return;
        }
        if(!data.acordo.data_inicio||!data.acordo.data_fim||!data.acordo.descricao||!data.acordo.realizado_por){
            toast.info("Preencha todos os campos!")
            return;
        }
        try{
            const response = await toast.promise(
                api.post('/novoAcordo',{
                    id_contrato:dadosassociado?.contrato.id_contrato,
                    status:'A',
                    id_associado:dadosassociado?.id_associado,
                    data_inicio:data.acordo?.data_inicio,
                    data_fim:data.acordo?.data_fim,
                    total_acordo:data.acordo?.total_acordo,
                    realizado_por:data.acordo?.realizado_por ,
                    descricao:data.acordo.descricao,
                    dt_criacao:new Date() ,
                    user_criacao:usuario?.nome,
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
        const novasMensalidades = data.acordo?.mensalidade?.map(mensal=>{
            return {...mensal,status:'P',data_pgto:new Date(),usuario:usuario?.nome,valor_total:mensal.valor_principal}
        }
        )
        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:data.acordo?.id_acordo,
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
        const novasMensalidades = data.acordo?.mensalidade?.map(mensal=>{
            return {...mensal,status:'E'}
        }
        )

        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:data.acordo?.id_acordo,
                status:'A',
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
        
      }
     
    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4  max-h-[calc(100vh-150px)] rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={()=>closeModa({acordo:{closeAcordo:false,mensalidade:[]}})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        <div className="p-2  border-b border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold  gap-2 text-white">ADMINISTRAR ACORDO</label>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIO</label>
    <DatePicker   dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={data.acordo?.data_inicio} onChange={(e)=>e && closeModa({acordo:{...data.acordo,data_inicio:e}})}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA FIM</label>
    <DatePicker   dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={data.acordo?.data_fim} onChange={(e)=>e && closeModa({acordo:{...data.acordo,data_fim:e}})}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">TOTAL ACORDO</label>
    <input disabled type="text" value={data.acordo?.total_acordo}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">REALIZADO POR</label>
    <input type="text" value={data.acordo?.realizado_por} onChange={e=>closeModa({acordo:{...data.acordo,realizado_por:e.target.value}})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>


<div className="mb-1 col-span-4">
    <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
    <input value={data.acordo?.descricao} onChange={e=>closeModa({acordo:{...data.acordo,descricao:e.target.value}})} type="text" placeholder="Descreva aqui todos os detalhes do acordo" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">
{!data.acordo?.visibilidade?(
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
  <button onClick={()=>adicionarProxima()}  type="button" className="inline-flex items-center px-2 py-1 gap-1 text-sm font-medium  border  rounded-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
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
            {data.acordo?.mensalidade && data.acordo?.mensalidade.map((item,index)=>(  
                <tr key={index} 
                className={` border-b "bg-gray-800"} border-gray-700 `}>
                <th scope="row" className={`px-5 py-1 font-medium  whitespace-nowrap  `}>
                    {item.parcela_n}
                </th>
                <td className={`px-2 py-1 `}>
                   {new Date(item.vencimento || '').toLocaleDateString()}
                   
                </td>
                <td className="px-2 py-1">
                   {item.referencia}
                </td>
                <td className="px-5 py-1">
                {new Date(item.cobranca || '').toLocaleDateString()}
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