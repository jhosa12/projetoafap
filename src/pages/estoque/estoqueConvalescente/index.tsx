import { useEffect, useState } from "react"

import Link from "next/link"
import { Tooltip } from "react-tooltip"
import { MdAdd } from "react-icons/md"
import { IoIosArrowDown, IoIosClose } from "react-icons/io"
import { TbAlertTriangle } from "react-icons/tb"
import { ModalConvEstoque } from "@/components/estoqueConv/modalConv"
import { api } from "@/services/apiClient"




interface ConvProps{
    id_produto:number,
    descricao:string

}
interface EstoqueProps{
    id_estoque:number,
    codProd:string,
    data:Date,
    estado:string,
    produto:string,
}

export default function EstoqueConv(){
    const [excluir,setExcluir]= useState(false)
    const [openModal,setOpenModal] = useState(false)
    const [arrayConv,setArrayConv]= useState<Array<ConvProps>>([]) 
    const [arrayEstoque,setArrayEstoque] = useState<Array<EstoqueProps>>([])
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});


    const toogleAberto = (index: number) => {
        setAbertos((prev: { [key: number]: boolean }) => ({
          ...Object.keys(prev).reduce((acc, key) => {
            acc[Number(key)] = false;
            return acc;
          }, {} as { [key: number]: boolean }),
          [index]: !prev[index]
        }));
      };


    



    const handleOpenModal=()=>{
        setOpenModal(!openModal)
    }

    useEffect(()=>{
        reqDadosEstoque()
    },[])

    async function reqDadosEstoque() {
        try {
            const response =await api.get('/estoque/listar')
            console.log(response.data)
            setArrayConv(response.data.produtos)
            setArrayEstoque(response.data.estoque)

        } catch (error) {
            console.log(error)
        }
        
    }

    return(
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
           {openModal && (<ModalConvEstoque arrayConv={arrayConv} openModal={openModal} setOpenModal={handleOpenModal}/>)}
        <Tooltip className="z-20" id="toolId" />
        <div className="flex flex-row w-full p-2 border-b-[1px]  border-gray-600">
            <h1 className="flex w-full items-end  text-gray-300 font-semibold text-2xl ">Estoque Convalescente</h1>
            <div className="flex  items-end w-full gap-8">
                <div className="inline-flex gap-6">
                    <div className="flex items-center ">
                        <input type="checkbox" checked onChange={() => { }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">ENTREGA PENDENTE</label>
                    </div>
                    <div className="flex items-center ">
                        <input type="checkbox" checked onChange={() => {}} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">ABERTO</label>
                    </div>
                    <div className="flex items-center ">
                        <input type="checkbox" checked onChange={() => { }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">ENTREGUE</label>
                    </div>

                </div>

                <form className="flex w-full">
                 
                  
               
                </form>
                <button
                   onClick={handleOpenModal}
                    className="inline-flex justify-center items-center text-white bg-green-600 p-1 px-2 rounded-lg">
             
                    <MdAdd size={22} />Add
                </button>
            </div>
            {excluir && (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="flex items-center justify-center p-2 w-full h-full">
                    <div className="relative rounded-lg shadow bg-gray-800">
                        <button type="button" onClick={() => setExcluir(!excluir)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                            <button type="button" onClick={() => { }} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                <IoIosClose size={30} />
                            </button>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <div className="flex w-full justify-center items-center">
                                <TbAlertTriangle className='text-gray-400' size={60} />
                            </div>
                            <h3 className="mb-5 text-lg font-normal  text-gray-400">Realmente deseja deletar esse lançamento?</h3>

                            <button onClick={() => {}} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                Sim, tenho certeza
                            </button>
                            <button onClick={() => setExcluir(!excluir)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
        <ul className="flex flex-col gap-2 text-white p-2">
        <li className="flex flex--col w-full items-center gap-8 border-b-[1px] text-white p-2 rounded-lg">
        
                      <span className="flex w-full text-start whitespace-nowrap ">PRODUTO</span>
                      <span className="flex w-full text-start whitespace-nowrap">QUANTIDADE</span>
                      <span className="flex w-full text-start whitespace-nowrap ">META</span>
                      <span className="flex w-full text-start whitespace-nowrap ">EQV. DE DESPESAS</span>
                      <span className="flex w-full justify-end  "></span>
                   
                
                  </li>
            {arrayConv.map((item,index)=>(
                <li onClick={()=>toogleAberto(index)} className="flex flex-col w-full items-center   bg-gray-600 text-white p-2 rounded-lg" key={item.id_produto}>
                  <div className="flex w-full items-center gap-8 ">
                  <span className="flex w-full font-semibold">{item.descricao}</span>
                    <span className="flex w-full text-start whitespace-nowrap ">{arrayEstoque.reduce((acumulador,atual)=>{if(atual.produto===item.descricao){return acumulador+=1}return acumulador},0)}</span>
                    <span className="flex w-full text-start whitespace-nowrap">LIM. DE GASTOS</span>
                    <span className="flex w-full text-start whitespace-nowrap ">META</span>
                    <span className="flex w-full justify-end  "><IoIosArrowDown /></span>
                  </div>
                

                    {abertos[index] && <ul className="flex flex-col w-full gap-2 p-2  ">
                          {arrayEstoque.map((it) => (
                            it.produto===item.descricao ? (
                              <li className="flex w-full text-xs items-center p-2 gap-8 border-b-[1px] ">
                                
                                
                                <span className="flex w-full text-start">{it.codProd}</span> 
                                <span className="flex w-full text-start">{it.estado}</span>
                                <span className="flex w-full text-start"></span>
                                <span className="flex w-full text-start"></span>
                                <span className="flex w-full text-start"></span>
                                </li>
                            ):''
                          ))

                          }
                        </ul>}
                 
           
                    </li>
            ))}
        </ul>
        </div>
    )

}