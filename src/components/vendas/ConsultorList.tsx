
import { Avatar } from "flowbite-react"
import { VendasProps } from "./acompanhamento"



interface DataProps{
    dados:Array<VendasProps>
    setModalVend:(open:boolean)=>void
    setVendedor:(fields:VendasProps)=>void
    meta:number
}





export function ConsultorList({dados,meta,setModalVend,setVendedor}:DataProps){
    return(
        <div className="flex flex-col w-full text-black bg-gray-100 rounded-lg overflow-y-auto max-h-[calc(100vh-204px)]  ">
        <ul className=' flex flex-col pt-4  '>
            <li className='flex flex-col w-full  text-sm px-4'>
                <div className="flex w-full px-2 gap-8  items-center">
                    <span className="flex w-2/12 text-start whitespace-nowrap ">#</span>
                    <span className="flex w-full text-start whitespace-nowrap ">CONSULTOR</span>
                    <span className="flex w-full text-start whitespace-nowrap">PROD.</span>
                    <span className="flex w-full text-start whitespace-nowrap ">QUANT</span>
                    <span className="flex w-full text-start whitespace-nowrap ">META</span>
                    <span className="flex w-full text-start whitespace-nowrap ">PERCENTUAL</span>
                </div>
            </li>
            {dados?.map((item, index) => {
                return (
                    <li onClick={()=>{setModalVend(true),setVendedor({...item})}} className='flex flex-col w-full py-2  text-base px-4  '>
                        <div className="flex w-full gap-8 px-2 items-center py-1.5 rounded-lg bg-slate-200 cursor-pointer hover:bg-slate-300">
                            <span className="flex w-2/12 text-start whitespace-nowrap ">{index + 1}</span>

                         
                               
                                <span className="flex w-full gap-2 text-start whitespace-nowrap items-center" >
                                    {item.consultor}
                                </span>


                           

                            <span className="flex w-full text-start whitespace-nowrap">{Number(item._sum.valor_mensalidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <span className="flex w-full text-start whitespace-nowrap ">{item._count.dt_adesao}</span>
                            <span className="flex w-full text-start whitespace-nowrap ">{Number(meta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <div className='flex flex-col w-full leading-none'>
                                <div className="flex justify-between mb-1 leading-none">

                                    <span className="text-sm font-medium  leading-none">{meta && ((item._sum.valor_mensalidade * 100) / meta).toFixed(2)}%</span>
                                </div>
                                <div className="w-full rounded-full h-2.5 bg-gray-400">
                                    <div style={{ width: `${(meta && ((item._sum.valor_mensalidade * 100) / meta) > 100 ? '100' : meta && ((item._sum.valor_mensalidade * 100) / meta))}%` }} className="bg-blue-600 h-2.5 rounded-full" ></div>
                                </div>

                            </div>

                        </div>
                    </li>
                )

            })}

        </ul>
    </div>
    )
}