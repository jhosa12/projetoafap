
import { api } from "@/services/apiClient";
import { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import InputMask from 'react-input-mask'
import { ModalBusca } from "@/components/modal";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Item } from "@/components/dadosTitular";


interface ArrayProps {
    id_produto:number ,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface ListaMaterial {
    id_conv:number,
    id_produto:number,
    descricao:string,
    unidade:string,
    grupo:string,
    data:Date,
    data_dev:Date,
    quantidade:number,
    valor:number,
    descontos:number,
    total:number,
    hora:Date,
    cortesia:string,
    retornavel :string,
    status :string
}




export default function GerarOS() {

    const {usuario,dadosassociado,carregarDados,listaConv,data,closeModa,signOut,setarListaConv } = useContext(AuthContext)
    const [usuarioMaterial, setUsuarioMaterial] = useState(true);
    const [material, setDeclarante] = useState(false);
    const [dadosObito, setObito] = useState(false);
    const [componenteMounted,setMounted]=useState(false);
    const [titular,setTitular] =useState(false);
    const [dependente,setDependente]=useState(false);
    const [modalDependente,setModalDependente]=useState(false)
    const [listaMaterial,setMaterial] = useState<Partial<ListaMaterial>>({})




    useEffect(() => {
        if(data.id_associado && componenteMounted){
            carregarDados();

        }
     
        
        setMounted(true)
          }, [data.id_associado])

    function setarMaterialLista(fields:Partial<ListaMaterial>){
        setMaterial((prev:Partial<ListaMaterial>)=>{
            if(prev){
                return {...prev,...fields}
            }
            else{
                return {...fields}
            }

        })


    }
    

    useEffect(()=>{

        if(titular){
            setarListaConv({
                nome:dadosassociado?.nome,
                data:dadosassociado?.data_nasc,
                logradouro:dadosassociado?.endereco,
                bairro:dadosassociado?.bairro,
                numero:dadosassociado?.numero,
                cidade:dadosassociado?.cidade
            })
           
        }

    },[titular])



    









  
    
 
    return (
        <>
         {data.closeModalPlano && <ModalBusca />}
         {modalDependente && dependente && (
                <div  className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
  
                <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-10 bg-gray-50 ">
                  
                    <div className="fixed flex flex-col p-4 max-h-96  rounded-lg shadow bg-gray-700">
                        <div className="inline-flex border-b-[1px] text-white">
                        <h1>SELECIONE O DEPENDENTE</h1>
                        <button  type="button" onClick={()=>setModalDependente(false)} className="text-gray-400 bg-transparent rounded-lg text-sm h-4 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <IoIosClose size={30}/>
                </button>
                        </div>
                        <ul className="flex flex-col pt-2 overflow-y-auto text-gray-300 gap-2 ">
                        {dadosassociado?.dependentes.map((item,index)=>{
                            return(
                            item.excluido!==true && <li onClick={()=>{setarListaConv({nome:item.nome,data:item.data_nasc});setModalDependente(false)}} className="flex cursor-pointer hover:bg-gray-700 bg-gray-600 p-1 pl-2 pr-2 rounded-lg ">
                                    {item.nome}
                                </li>
                            )

                        })}
                        </ul>
                      

                </div>
                </div>
                </div>
            )}
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Solicitar Convalescente</h1> 
                    <div className="flex flex-row gap-8">
                    
                        <button onClick={() => closeModa({ closeModalPlano: true })} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                            <IoMdSearch size={20} />
                            Buscar
                        </button>
                    </div>
                </div>
                <div className="flex-col w-full border mt-2 rounded-lg shadow  border-gray-700">

                    <ul className="flex flex-wrap w-full text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">

                      
                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(true), setDeclarante(false), setObito(false) }} className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Usuário</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(false), setDeclarante(true), setObito(false) }} className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Material</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(false), setDeclarante(false), setObito(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Documentação</button>
                        </li>
                        <li className="ml-auto flex items-center mr-2">
                        <button  type="button" onClick={()=>{}}  className="inline-flex p-2 text-white font-semibold rounded-lg bg-green-600 gap-1">Salvar<HiOutlineSave size={22}/></button>
                        </li>
                        
                    </ul>


                  

                    {usuarioMaterial &&<>
                 {dadosassociado?.id_associado &&   <div className="flex w-full p-2  text-lg  text-white">
                        <h1 className="flex w-full p-1 border-b-[1px] border-gray-500">ASSOCIADO: {dadosassociado?.contrato.id_contrato} - {dadosassociado?.nome} / CATEGORIA: {dadosassociado?.contrato.plano}</h1>
                    </div>}
                        <div className="inline-flex gap-8 pl-4 pt-1">
                        <div className="flex items-center ">
                            <input type="checkbox" checked={titular} onClick={()=>{setTitular(!titular),setDependente(false)}} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">TITULAR</label>
                        </div>
                        <div className="flex items-center ">
                            <input type="checkbox"  onClick={()=>{setDependente(!dependente),setTitular(false),setModalDependente(true)}}  checked={dependente} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">DEPENDENTE</label>
                        </div>
                        </div>
             
                     <div className="rounded-lg p-6 grid grid-flow-row-dense max-h-[calc(100vh-200px)] grid-cols-5 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Nome do Usuário</label>
                            <input value={listaConv.nome} onChange={e=>setarListaConv({nome:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Data Nasc</label>
                            <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={listaConv.data} onChange={e=>e && setarListaConv({data:e})}  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                        </div>
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">CPF</label>
                            <input value={listaConv.cpf_cnpj} onChange={e=>setarListaConv({cpf_cnpj:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço</label>
                            <input value={listaConv.logradouro} onChange={e=>setarListaConv({logradouro:e.target.value})}    className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Número</label>
                            <input value={listaConv.numero} onChange={e=>setarListaConv({numero:Number(e.target.value)})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Complemento</label>
                            <input value={listaConv.complemento} onChange={e=>setarListaConv({complemento:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                     
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input value={listaConv.bairro} onChange={e=>setarListaConv({bairro:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CEP</label>
                            <input value={listaConv.cep} onChange={e=>setarListaConv({cep:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-2 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input value={listaConv.cidade} onChange={e=>setarListaConv({cidade:e.target.value})} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input value={listaConv.uf} onChange={e=>setarListaConv({uf:e.target.value})} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                        </div>
                      
                        <div className="flex flex-col text-white col-span-5 ">
                            <h1 className="border-b-[1px] border-gray-500">Endereço de Retirada</h1>

                        </div>
                    
                     
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço</label>
                            <input value={listaConv.logradouro_r} onChange={e=>setarListaConv({logradouro_r:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Número</label>
                            <input value={listaConv.numero_r} onChange={e=>setarListaConv({numero_r:Number(e.target.value)})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input value={listaConv.bairro_r} onChange={e=>setarListaConv({bairro_r:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-2 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input value={listaConv.cidade_r} onChange={e=>setarListaConv({cidade_r:e.target.value})} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input value={listaConv.uf_r} onChange={e=>setarListaConv({uf_r:e.target.value})} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                        </div>
                    </div></>}





                    {material && <div className="flex flex-col w-full rounded-lg p-6   gap-5">
                        <div className="flex flex-row text-white gap-6 w-full">

                        <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Material</label>
                                <input  value={(listaMaterial.descricao)} onChange={e=>setarMaterialLista({descricao:e.target.value.toUpperCase()})} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                       
                            <div className="flex flex-col w-1/12">
                                <label className="block mb-1 text-sm font-medium  text-white">Quant.</label>
                                <input  value={Number(listaMaterial.quantidade)} onChange={e=>setarMaterialLista({quantidade:Number(e.target.value)})} autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div className="flex flex-col w-1/12" >
                                <label className="block mb-1 text-sm font-medium  text-white">Valor</label>
                                <input value={Number(listaMaterial.valor)} onChange={(e) =>setarMaterialLista({valor:Number(e.target.value)})}
                               autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                          
                          
                        
                            <div className="flex items-end">
                                <button onClick={() => {
                                    const novoArray =listaConv.convalescenca_prod ?[...listaConv.convalescenca_prod]:[];
                                    novoArray.push(listaMaterial)
                                    setarListaConv({convalescenca_prod:novoArray})}
                                }
                                    className="flex bg-blue-600 p-1 pl-2 pr-2 rounded-lg ">Adicionar</button>
                            </div>

                        </div>
                        <div className="flex">
                            <table
                                className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                                <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                                    <tr>
                                        <th scope="col" className=" px-2 py-1">
                                            Descrição Item
                                        </th>

                                        <th scope="col" className="px-4 py-1">
                                           Quant.
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                           
                                            Valor Unit.
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Status
                                        </th>
                                        
                                        <th scope="col" className="px-4 py-1">
                                            <span >AÇÕES</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaConv.convalescenca_prod?.map((item, index) => {


                                        return (<tr key={index} className={`border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                                            <td className="px-2 py-1">
                                                {item.descricao}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.quantidade}
                                            </td>
                                            <td className="px-4 py-1">
                                                R${item.valor}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.status}
                                            </td>
                                            <td className="px-4 py-1 flex justify-center text-center ">
                                                <button onClick={() => {}} className=" flex justify-center items-center rounded-lg  px-1 py-1 text-white hover:bg-red-600"><MdClose /></button>
                                            </td>

                                        </tr>)
                                    })}

                                </tbody>

                                <tfoot >
                                    <tr className={`border-b bg-gray-700 border-gray-700  hover:bg-gray-600`}>
                                        <td className="px-4 py-1 text-start font-semibold" colSpan={2}>Total Geral</td>
                                        <td className="px-4 py-1 text-green-500 text-start font-semibold" colSpan={3} >R${}</td>
                                    </tr>
                                </tfoot>

                            </table>
                          
                        </div>
                    
                        
                    </div>

                    }








                </div>



            </div>
        </>
    )
}