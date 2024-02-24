import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";

interface MensalidadeProps{
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
    data_pgto:Date | string,
    referencia:string,
    index:number
}

export function ModalAcordos({mensalidades}:{mensalidades:Array<Partial<MensalidadeProps>>}){
    const {closeModa,data,usuario,carregarDados,dadosassociado}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    const [componentMounted, setComponentMounted] = useState(false);
    const [status,setStatus]=useState('')

        useEffect(()=>{
        //Faz com que o valor pago/total inicie com o valor principal

        closeModa({mensalidade:{...(data.mensalidade || {}),index:data.mensalidade?.index,data_pgto:new Date(),valor_total:data.mensalidade?.valor_principal}})
      
       
        if(data.mensalidade?.index || data.mensalidade?.index===0){
           closeModa({
               mensalidadeProx:{...dadosassociado?.mensalidade[data.mensalidade.index+1]},
           })
       
       }
      },[])
      useEffect(()=>{
      
          if((data.mensalidade?.index || data.mensalidade?.index===0) && componentMounted && dadosassociado?.mensalidade[data.mensalidade.index+1]){
              closeModa({
                  mensalidade: {
                      ...(status==='P'?dadosassociado?.mensalidade[data.mensalidade?.index +1]:dadosassociado?.mensalidade[data.mensalidade?.index]),
                      valor_total:status==='P'?dadosassociado?.mensalidade[data.mensalidade?.index+1].valor_principal:dadosassociado?.mensalidade[data.mensalidade?.index].valor_principal,
                      index:status==='P'?data.mensalidade?.index+1:data.mensalidade.index,
                      close:status ==='P'?true:false,
                      data_pgto:new Date()
                  },
                
                    mensalidadeProx:{...(dadosassociado?.mensalidade[data.mensalidade.index+2]?dadosassociado.mensalidade[data.mensalidade?.index+2]:{})},
                
              });
         
      
          }
      },[dadosassociado?.mensalidade]) 

   
      async function baixarEstornar(status:string,acao:string) {
        setComponentMounted(true)
        setStatus(status)
        if(data.mensalidade?.status ===status){
            toast.error(`Mensalidade com ${acao} já realizado`)
            return;
        }
        if(dadosassociado?.contrato.situacao==='INATIVO'){
            toast.info(`Contrato inativo, impossivel realizar ${acao}!`)
            return

        }
     
        if(data.mensalidadeAnt?.status==='A'){
            toast.info('A mensalidade anterior encontra-se em Aberto!')
            return
        }
        if(desconto===true && data.mensalidade?.motivo_bonus===''){
            toast.info("Informe o motivo do desconto!")
            return
        }
        try{
            const response = await  toast.promise(
                api.put('/mensalidade',{
                    id_mensalidade:data.mensalidade?.id_mensalidade,
                    status:status,
                    data_pgto:status==='A'?null:data.mensalidade?.data_pgto && new Date(data.mensalidade?.data_pgto).toLocaleDateString()===new Date().toLocaleDateString()?new Date():data.mensalidade?.data_pgto?new Date(data.mensalidade?.data_pgto):null,
                    usuario:status==='A'?null:usuario?.nome.toUpperCase(),
                    valor_total:status==='A'?null:data.mensalidade?.valor_total,
                    motivo_bonus:status==='A'?null:data.mensalidade?.motivo_bonus?.toUpperCase(),
                    estorno_dt:status==='P'?null:new Date(),
                    estorno_user:status==='P'?null:usuario?.nome
                }),
                {
                  pending: `Efetuando ${acao}`,
                  success: `${acao} efetuada com sucesso`,
                  error: `Erro ao efetuar ${acao}`
                 })

                 if((data.mensalidade?.valor_principal ?? 0)<(data.mensalidade?.valor_total ?? 0) && data.mensalidadeProx && status ==='P'){
                    try{
                        const response = await api.put('/mensalidade',{
                            id_mensalidade:data.mensalidadeProx?.id_mensalidade,
                            valor_principal:Number(data.mensalidadeProx?.valor_principal)-(Number(data.mensalidade?.valor_total)-Number(data.mensalidade?.valor_principal))
                        })
                        
                           
                    }catch(err){
                        toast.error('Erro ao Baixar Mensalidade')
                       
                    }  
        }
        if(((data.mensalidade?.valor_principal ?? 0)>(data.mensalidade?.valor_total ?? 0)) && desconto===false && data.mensalidadeProx && status ==='P'){
            try{
                const response = await api.put('/mensalidade',{
                    id_mensalidade:data.mensalidadeProx?.id_mensalidade,
                    valor_principal:Number(data.mensalidadeProx?.valor_principal ?? 0)+Number((data.mensalidade?.valor_principal ?? 0)-Number(data.mensalidade?.valor_total ?? 0))
                })
                    
                    // closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status,valor_principal:response.data.valor_principal}})
            }catch(err){
                toast.error('Erro ao Baixar Mensalidade')
            } 
          
        }
     //closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status}})
        }catch(err){
            toast.error('Erro ao Baixar Mensalidade') 
        }
      
       
 
        await carregarDados();
    }
    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4  max-h-[calc(100vh-150px)] rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={()=>closeModa({mensalidade:{close:false}})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        <div className="p-2  border-b border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold  gap-2 text-white">ADMINISTRAR ACORDO</label>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIO</label>
    <input type="text" value={data.mensalidade?.vencimento? new Date(data?.mensalidade?.vencimento).toLocaleDateString():''} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),vencimento:new Date(e.target.value)}})}  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA FIM</label>
    <input type="text"value={data.mensalidade?.cobranca? new Date(data?.mensalidade?.cobranca).toLocaleDateString():''} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),cobranca:new Date(e.target.value)}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2 border  rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">TOTAL ACORDO</label>
    <input disabled type="text" value={data.mensalidade?.valor_principal} onChange={e=>closeModa({mensalidade:{...(data.mensalidade),valor_principal:Number(e.target.value)}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>


<div className="mb-1 col-span-4">
    <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
    <input type="text" placeholder="Descreva aqui todos os detalhes do acordo" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">
<button type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>SALVAR</button>


</div>
    </div>

</form>
<label className="flex w-full justify-center text-white font-semibold p-1">REFERÊNCIAS</label>
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
            {mensalidades.map((item,index)=>(  
                <tr key={index} 
                className={` border-b "bg-gray-800"} border-gray-700 hover:bg-gray-500 hover:text-black`}>
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