import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";


export function ModalMensalidade(){
    const {closeModa,data,usuario,carregarDados}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    
    
  
        useEffect(()=>{ // Faz com que o valor pago/total inicie com o valor principal
            if(!data.mensalidade?.valor_total){
            closeModa({mensalidade:{...(data.mensalidade),valor_total:data.mensalidade?.valor_principal}})
            }
        },[])

      async function baixarEstornar(status:string,acao:string) {
        if(data.mensalidade?.status ===status){
            toast.error(`Mensalidade com ${acao} já realizado`)
            return;
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
                    data_pgto:status==='A'?null:new Date(),
                    usuario:status==='A'?null:usuario?.nome.toUpperCase(),
                    valor_total:status==='A'?null:data.mensalidade?.valor_total,
                    motivo_bonus:status==='A'?null:data.mensalidade?.motivo_bonus,
                    estorno_dt:status==='P'?null:new Date(),
                    estorno_user:status==='P'?null:usuario?.nome
                }),
                {
                  pending: `Efetuando ${acao}`,
                  success: `${acao} efetuada com sucesso`,
                  error: `Erro ao efetuar ${acao}`
                 })
                 closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status}})
        }catch(err){
            toast.error('Erro ao Baixar Mensalidade')
            console.log(data.mensalidade?.id_mensalidade)
        }

        if((data.mensalidade?.valor_principal ?? 0)<(data.mensalidade?.valor_total ?? 0) && data.mensalidadeProx && status ==='P'){
            try{
                const response = await api.put('/mensalidade',{
                    id_mensalidade:data.mensalidadeProx?.id_mensalidade,
                    valor_principal:(data.mensalidadeProx?.valor_principal ?? 0)-((data.mensalidade?.valor_total ?? 0)-(data.mensalidade?.valor_principal?? 0))
                })
                
                     closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status}})
            }catch(err){
                toast.error('Erro ao Baixar Mensalidade')
                console.log(data.mensalidadeProx?.id_mensalidade)
            }  
}
if(((data.mensalidade?.valor_principal ?? 0)>(data.mensalidade?.valor_total ?? 0)) && desconto===false && data.mensalidadeProx && status ==='P'){
    try{
        const response = await api.put('/mensalidade',{
            id_mensalidade:data.mensalidadeProx?.id_mensalidade,
            valor_principal:Number(data.mensalidadeProx?.valor_principal ?? 0)+Number((data.mensalidade?.valor_principal ?? 0)-Number(data.mensalidade?.valor_total ?? 0))
        })
            
             closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status}})
    }catch(err){
        toast.error('Erro ao Baixar Mensalidade')
        console.log(data.mensalidadeProx?.id_mensalidade)
    } 
  
}
if(data.mensalidadeProx && status==='P'){
    closeModa({mensalidade:{...(data.mensalidadeProx),close:true,cobranca:data?.mensalidadeProx?.cobranca}})
}
   await carregarDados()
      }
    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4  rounded-lg shadow-2xl border-gray-600 border  bg-[#0f172a]">
    <button  type="button" onClick={()=>closeModa({mensalidade:{close:false}})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        <div className="p-2  border-b border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold  gap-2 text-white">EDITAR MENSALIDADE</label>
</div>
<div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-white">Referencia</label>
<input disabled type="text" value={data.mensalidade?.referencia} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),referencia:e.target.value}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">VENCIMENTO</label>
    <input type="text" value={data.mensalidade?.vencimento? new Date(data?.mensalidade?.vencimento).toLocaleDateString():''} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),vencimento:new Date(e.target.value)}})}  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">COBRANÇA</label>
    <input type="text"value={data.mensalidade?.cobranca? new Date(data?.mensalidade?.cobranca).toLocaleDateString():''} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),cobranca:new Date(e.target.value)}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2 border  rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">VALOR</label>
    <input disabled type="text" value={data.mensalidade?.valor_principal} onChange={e=>closeModa({mensalidade:{...(data.mensalidade),valor_principal:Number(e.target.value)}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">STATUS</label>
    <input type="text" disabled value={data.mensalidade?.status}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">BAIXADA POR</label>
    <input disabled type="text" value={data.mensalidade?.usuario} onChange={e=>closeModa({mensalidade:{usuario:e.target.value}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">AGENDADA POR</label>
    <input disabled type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2 border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">
<button type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>SALVAR</button>


</div>
    </div>
    <div className="p-2  grid gap-2 grid-flow-row-dense grid-cols-4">
    <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold p-2 gap-2 text-white">BAIXA/STORNO</label>
</div>
<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-white">VALOR PAGO</label>
<input type="text" value={data.mensalidade?.valor_total} onChange={(e) =>closeModa({mensalidade: { ...(data.mensalidade || {}), valor_total: Number(e.target.value) },
    })}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">RECEBIDO POR</label>
    <input type="text"  className="block w-full pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">FORMA PAG.</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-white">DATA PAG.</label>
<input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
{((data.mensalidade?.valor_total ?? 0)<(data.mensalidade?.valor_principal ?? 0) && data.mensalidade?.valor_total!==undefined)&& data.mensalidade.valor_total>0?(
 <div className="col-span-4 gap-1 mt-1 inline-flex ">
    <div className="flex items-top w-2/12 ">
    <input  onClick={()=>setDesconto(!desconto)} type="checkbox" value="" className="w-4 h-4 mt-[2px] text-blue-600  rounded  focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"/>
    <label  className="ms-2 text-sm font-medium text-gray-300">Desconto</label>
</div>
    <div className="mb-1 w-full">
  <label  className="block mb-1 text-xs font-medium  text-white">INFORME O MOTIVO DO DESCONTO</label>
  <input value={data.mensalidade.motivo_bonus} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),motivo_bonus:e.target.value}})} disabled={desconto===false || data.mensalidade.status==='P'} type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
  </div>
 </div> 
):''}
  
<button  type='button' onClick={()=>baixarEstornar('P','Baixa')} className="col-span-2 flex flex-row justify-center items-center bg-green-600 rounded-lg p-2 gap-2 text-white"><IoIosArrowDropdownCircle size={25}/>BAIXAR</button>
<button type="button" onClick={()=>baixarEstornar('A','Estorno')} className="col-span-2 flex flex-row justify-center items-center  bg-red-600 rounded-lg p-2 gap-2 text-white"><GiReturnArrow size={22}/> ESTORNAR</button>
</div>
</form>
</div>
</div>
</div>)
}