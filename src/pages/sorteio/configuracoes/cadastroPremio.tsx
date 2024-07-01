import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { FaRepeat } from "react-icons/fa6";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { ModalNovoPremio } from "./modalNovoPremio";
interface PremiosProps{
    id_produto:string,
    descricao: string,
    unidade: string,
    valor_custo: number,
    quantidade: number,
    situacao: string,
    grupo: string,
    tipo: string,
    openModal:boolean
}

interface DataProps{
    listarPremios : ()=>Promise<void>,
    arrayPremios:Array<Partial<PremiosProps>>
}


export function CadastroPremio({listarPremios,arrayPremios}:DataProps){
   
    const [excluir, setExcluir] = useState<number>(0)
    const [dadosPremio,setDadosPremio] =useState<Partial<PremiosProps>>({openModal:false})


    const setarDadosPremios = (fields:Partial<PremiosProps>)=>{
        setDadosPremio((prev:Partial<PremiosProps>)=>{
                if(prev){
                    return {...prev,...fields}
                }
                else{
                    return {...fields}
                }
        })

    }




   

    async function cadastroPremio() {
        try {
           const response = await toast.promise(
            api.post('/sorteio/cadastroPremio',{
                descricao:dadosPremio.descricao,
                quantidade:dadosPremio.quantidade,
                grupo:'sorteio',
                situacao:dadosPremio.situacao

            }),
            {
                error:'ERRO AO CADASTRAR PRÊMIO',
                pending:'REALIZANDO CADASTRO',
                success:'CADASTRADO COM SUCESSO!'
            }

           ) 
           listarPremios()
        } catch (error) {
            
        }
        
    }
    return(
        <div className="text-white">
         {dadosPremio.openModal &&   <ModalNovoPremio cadastroPremio={cadastroPremio} setarDadosPremios={setarDadosPremios} dadosPremio={dadosPremio}/>}
         <button onClick={()=>setarDadosPremios({...dadosPremio,openModal:true})} className="flex text-sm ml-auto bg-green-600 rounded-lg p-2">ADICIONAR PRÊMIO</button>
             <ul className="flex flex-col w-full p-2 mt-1 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full gap-8  items-center">
                    <span className="flex w-full font-semibold">ORDEM DE SORTEIO</span>
                      <span className="flex w-full font-semibold">DESCRIÇÃO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">QUANTIDADE</span>
                      <span className="flex w-full text-start whitespace-nowrap ">EMPRESA</span>
                      <span className="flex w-full text-start whitespace-nowrap justify-end ">AÇÕES</span>
                    </div>
                  </div>
                </li>
                {
                  arrayPremios?.map((item, index) => {
                    return (
                      <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <div className="flex w-full gap-8  items-center">
                          <span className="flex w-full font-semibold">{index+1}º</span>
                            <span className="flex w-full font-semibold">{item.descricao}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.quantidade}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.situacao}</span>
                            <div className="inline-flex w-full text-start justify-end whitespace-nowrap">
                              <button onClick={() => { }} className="rounded-lg text-red-600 hover:bg-gray-300 p-1"><MdDelete size={18} /></button>
                              <button className="rounded-lg text-blue-500 hover:bg-gray-300 p-1"><MdModeEditOutline size={18} /></button>
                              <button onClick={() => {
                             
                                 setExcluir(2)
                              

                              }}
                                className="rounded-lg text-yellow-500 hover:bg-gray-300 p-1">
                                <FaRepeat size={15} />
                              </button> 
                           
                            </div>

                          </div>
                        </div>

                      </li>
                    )
                  })
                }
              </ul>
            
        </div>
    )
}