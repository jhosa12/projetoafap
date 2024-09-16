import { useContext, useEffect, useState } from "react"
import {nanoid} from 'nanoid'
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import { MdAdd, MdDelete } from "react-icons/md"
import { IoIosArrowDown, IoIosClose } from "react-icons/io"
import { TbAlertTriangle } from "react-icons/tb"
import { ModalConvEstoque } from "@/components/estoqueConv/modalConv"
import { api } from "@/services/apiClient"
import Head from "next/head"

import { AuthContext } from "@/contexts/AuthContext"
import { toast } from "react-toastify"
import { MdEdit } from "react-icons/md";





interface ConvProps{
    id_produto:number,
    descricao:string
    grupo:string
    estoque:Array<EstoqueProps>
}
interface EstoqueProps{
    id_estoque:number,
    id_produto:number,
    total:number,
    status:string,
    codProd:string,
    data:Date,
    tipo:string
    estado:string,
    produto:string,
    fornecedor:string,
 
}

export default function EstoqueConv(){
    const [excluir,setExcluir]= useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [arrayConv,setArrayConv]= useState<Array<ConvProps>>([]) 
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [tabIndex,setTabIndex] =useState<number>(1);
    const [dadosProduto,setDados] = useState<Partial<EstoqueProps>>({total:1,status:'ABERTO'});
    const {usuario} = useContext(AuthContext);
   



    const setarDados = (fields:Partial<EstoqueProps>)=>{
        setDados((prev:Partial<EstoqueProps>)=>{
            if(prev){
                return {...prev,...fields}
            }else{
                return {...fields}
            }

        })

    }


    async function editarProd() {
        if(!dadosProduto.id_estoque){
            toast.warn('PRODUTO INEXISTENTE!');
            return;
        }

       
     


try {

    const response = await toast.promise(
        api.put("/estoque/editarProd",{
            id_estoque:dadosProduto.id_estoque,
            estado:dadosProduto.estado,
            fornecedor:dadosProduto.fornecedor,
            produto:dadosProduto.produto,
            status:dadosProduto.status,
            total:dadosProduto.total,
            id_produto:dadosProduto.id_produto

        }),
        {
            error:'ERRO NA REQUISIÇÃO',
            pending:'SALVANDO DADOS.....',
            success:'DADOS SALVOS COM SUCESSO'
        }
    )
 
 
  
   reqDadosEstoque()
    
} catch (error) {
    toast.error('Erro ao Alterar')
    
}

      

    }


    async function addFunebre() {
        const arrayProd:Array<Partial<EstoqueProps>> =[]
        arrayProd.push({
            id_produto:dadosProduto.id_produto,
            estado:dadosProduto.estado,
            fornecedor:dadosProduto.fornecedor,
            total:dadosProduto.total,
            produto:dadosProduto.produto,
            status:'ABERTO',
            codProd:'',
          
        })
     const novoProd =   await  toast.promise(
            api.post('/estoque/estoqueConv',{
                array:arrayProd,
                id_usuario:usuario?.id
            }),
            {
                error:'ERRO NA REQUISIÇÃO',
                pending:'SALVANDO DADOS.....',
                success:'DADOS SALVOS COM SUCESSO'
            }
        )
       
     console.log( novoProd.data)
     const novoArray = arrayConv.map(item=>{
        if(novoProd.data[0].id_produto===item.id_produto){
            item.estoque.push(novoProd.data[0])
        }
        return item
     })


     setArrayConv(novoArray)


  
        
    }


    async function salvarDados() {
       // const produto = dadosProduto.produto || ""
        const palavras = dadosProduto.produto?.split(" ")||[];
        let abrev
        if(palavras?.length>0){
            const primeiraLetra = palavras[0][0]||'';
            const ultimaLetra = palavras[palavras.length-1][0]||'';
            abrev = primeiraLetra+ultimaLetra;
        }
        
        const arrayProd:Array<Partial<EstoqueProps>> =[]
        if(dadosProduto.total )
           
        for(let i=0;i<dadosProduto.total;i++){
                const codProd = nanoid(10)
            arrayProd.push({
                estado:dadosProduto.estado,
                codProd: abrev+'-'+codProd,
                produto:dadosProduto.produto,
                total:1,
                status:dadosProduto.status??'',
                fornecedor:dadosProduto.fornecedor,
                tipo:dadosProduto.tipo,
                id_produto:dadosProduto.id_produto
            
            })
    
        }
    
      await  toast.promise(
            api.post('/estoque/estoqueConv',{
                array:arrayProd,
                id_usuario:usuario?.id
            }),
            {
                error:'ERRO NA REQUISIÇÃO',
                pending:'SALVANDO DADOS.....',
                success:'DADOS SALVOS COM SUCESSO'
            }
        )
    
       reqDadosEstoque()
     
    
        
    }

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

          //  const novoArrayConv = response.data.produtos.filter((item:ConvProps)=>item.)
            setArrayConv(response.data.produtos)
           

        } catch (error) {
            console.log(error)
        }
        
    }

    return(


        <>
            <Head>
                <title>Estoque</title>
            </Head>
                <div className="flex  flex-col p-4 w-full mr-2 ">
               <h1 className="text-white">CONTROLE DE ESTOQUE</h1>
                    <div className="flex-col w-full border  rounded-lg shadow  border-gray-700">
                        <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">
                            <li className="me-2">
                                <button type="button" onClick={() => setTabIndex(1)} className={`inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 ${tabIndex===1 && "text-blue-500"} `}>CONVALESCENTE</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setTabIndex(2)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${tabIndex===2 && "text-blue-500"}`}>FUNEBRE</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setTabIndex(3)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${tabIndex===3 && "text-blue-500"}`}>CONSUMO</button>
                            </li>
                           
                          
                        </ul>

                        

                          {tabIndex ===1 && <div className="flex flex-col w-full  pl-10 pr-10 pt-2">
           {openModal && (<ModalConvEstoque setarDados={setarDados} dadosProduto={dadosProduto} salvarDados={salvarDados} atualizarLista={reqDadosEstoque} arrayConv={arrayConv}  setOpenModal={handleOpenModal} editarDados={editarProd}/>)}
      
        <Tooltip className="z-20" id="toolId" />
        <div className="flex flex-row w-full p-2 ">
            
            <div className="flex  items-end w-full ">
             

                <form className="flex w-full">
                 
                  
               
                </form>
                <button
                   onClick={handleOpenModal}
                    className="inline-flex justify-center items-center text-white bg-gray-600 p-1 px-2 rounded-lg">
             
                    <MdAdd size={22} />Add
                </button>
            </div>
            {excluir && (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ">
                <div className="flex items-center justify-center p-2 w-full h-full">
                    <div className="relative rounded-lg shadow bg-gray-800 ">
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

<div className="flex w-full p-2 max-h-[calc(100vh-220px)]">
<table 
         className="block w-full overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  
               
                    <th scope="col" className="px-10 py-1">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        QUANTIDADE
                    </th> 
                   
                    <th scope="col" className="px-10 py-1">
                        AÇÕES
                    </th>
                </tr> 
            </thead>
            <tbody>
                {arrayConv?.map((item,index)=>(
                   <>
            { item.grupo==='cv' &&  <tr key={index} onClick={()=>toogleAberto(index)} className={ `border-b cursor-pointer bg-gray-800 border-gray-700 w-full hover:bg-gray-600`}>
              
                <td className="px-10 py-1 w-full font-semibold whitespace-nowrap">
                   {item.descricao} 
                </td>   
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>  
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
            
                <td className="px-12 py-1 w-full font-semibold ">
                   {item.estoque?.reduce((acumulador,atual)=>{
                    if(item.descricao===atual.produto){
                        acumulador+=1
                    }
                    return acumulador
                        
                   },0)}
                </td>
                <td className="px-10 py-1  gap-2">
                    <button onClick={()=>{}} className="font-semibold rounded-lg w-full px-2 py-1 text-white hover:underline"><IoIosArrowDown /> </button>
                  
                </td>
               </tr>}
              
               
               { item.estoque.map((dados)=>(
                   item.id_produto===dados.id_produto &&  <tr className={ `border-b bg-gray-900 border-gray-700 w-full hover:bg-gray-600 ${abertos[index]?'':"hidden"}`}>
                   
                        <>
                        
                                           <td className="px-10 py-1 w-full whitespace-nowrap">
                                            {dados.codProd} 
                                         </td> 
                                       
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                           ESTADO: {dados.estado} 
                                         </td> 
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                           DATA : {new Date(dados.data).toLocaleDateString()} 
                                         </td> 
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                           FORNECEDOR: {dados.fornecedor} 
                                         </td>
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                            {''} 
                                         </td>
                                         <td className="px-10 py-1 whitespace-nowrap">
                                            {''} 
                                         </td>
                                         <td className="px-10 py-1 whitespace-nowrap">
                                            {''} 
                                         </td>
                                         <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button onClick={()=>{
                        setarDados({
                            ...dados
                        })
                        setOpenModal(!openModal)
                        
                    }} className="font-semibold rounded-lg hover:bg-blue-600 px-2 py-1 text-white hover:underline"><MdEdit size={17}/></button>
                    <button onClick={()=>{}} className=" rounded-lg hover:bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
                </td>
                                         
                                        
                                    
                                       
                                         </>


                
                    </tr>
                    ))}
              

            
               
              
               </>
               
               ))}
    
                
               
            </tbody>
        
        </table>



</div>
      
        </div>}



{/*---------------------------ABA DE ESTOQUE FUNEBRE --------------------------------------------------*/}
{tabIndex ===2 && <div className="flex flex-col w-full  pl-10 pr-10 pt-2 ">
           {openModal && (<ModalConvEstoque  setarDados={setarDados} dadosProduto={dadosProduto} salvarDados={addFunebre} atualizarLista={reqDadosEstoque} arrayConv={arrayConv}  setOpenModal={handleOpenModal} editarDados={editarProd}/>)}
        <Tooltip className="z-20" id="toolId" />
        <div className="flex flex-row w-full p-2 ">
            
            <div className="flex  items-end w-full ">
             

                <form className="flex w-full">
                 
                  
               
                </form>
                <button
                   onClick={handleOpenModal}
                    className="inline-flex justify-center items-center text-white bg-gray-600 p-1 px-2 rounded-lg">
             
                    <MdAdd size={22} />Add
                </button>
            </div>
            {excluir && (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ">
                <div className="flex items-center justify-center p-2 w-full h-full">
                    <div className="relative rounded-lg shadow bg-gray-800 ">
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

<div className="flex w-full p-2 max-h-[calc(100vh-220px)]">
<table 
         className="block w-full overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  
               
                    <th scope="col" className="px-10 py-1">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        {''}
                    </th> 
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        QUANTIDADE
                    </th> 
                   
                    <th scope="col" className="px-10 py-1">
                        AÇÕES
                    </th>
                </tr> 
            </thead>
            <tbody>
                {arrayConv?.map((item,index)=>(
                   <>
            { item.grupo==='fn' &&  <tr key={index} onClick={()=>toogleAberto(index)} className={ `border-b cursor-pointer bg-gray-800 border-gray-700 w-full hover:bg-gray-600`}>
              
                <td className="px-10 py-1 w-full font-semibold whitespace-nowrap">
                   {item.descricao} 
                </td>   
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>  
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                   {''} 
                </td>
            
                <td className="px-12 py-1 w-full ">
                   {item.estoque.reduce((acumulador,atual)=>{
                    return acumulador+=Number(atual.total)

                   },0)}
                </td>
                <td className="px-10 py-1  gap-2">
                    <button onClick={()=>{}} className="font-semibold rounded-lg w-full px-2 py-1 text-white hover:underline"><IoIosArrowDown /> </button>
                  
                </td>
               </tr>}
              
                   
               { item.estoque.map((dados)=>(
                   item.id_produto===dados.id_produto &&  <tr className={ `border-b bg-gray-900 border-gray-700 w-full hover:bg-gray-600 ${abertos[index]?'':"hidden"}`}>
                   
                        <>
                        
                                           <td className="px-10 py-1 w-full whitespace-nowrap">
                                            {dados.produto} 
                                         </td> 
                                       
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                           QUANTIDADE: {dados.total} 
                                         </td> 
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                           DATA : {new Date(dados.data).toLocaleDateString()} 
                                         </td> 
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                           FORNECEDOR: {dados.fornecedor} 
                                         </td>
                                         <td className="px-10 py-1 w-full whitespace-nowrap">
                                            {''} 
                                         </td>
                                         <td className="px-10 py-1 whitespace-nowrap">
                                            {''} 
                                         </td>
                                         <td className="px-10 py-1 whitespace-nowrap">
                                            {''} 
                                         </td>
                                         <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button onClick={()=>{
                        setarDados({
                            ...dados
                        })
                        setOpenModal(!openModal)
                        
                    }} className="font-semibold rounded-lg hover:bg-blue-600 px-2 py-1 text-white hover:underline"><MdEdit size={17}/></button>
                    <button onClick={()=>{}} className=" rounded-lg hover:bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
                </td>
                                         
                                        
                                    
                                       
                                         </>


                
                    </tr>
                    ))}
          
              

            
               
              
               </>
               
               ))}
    
                
               
            </tbody>
        
        </table>



</div>
      
        </div>}










        </div>

                
                    
                    </div>


        </>
     
         














    )

}