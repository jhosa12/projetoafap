import { useContext, useEffect, useState } from "react"
import {nanoid} from 'nanoid'
import { Tooltip } from "react-tooltip"
import { MdAccessTimeFilled, MdAdd, MdDelete } from "react-icons/md"
import { IoIosArrowDown, IoIosClose, IoMdSettings } from "react-icons/io"
import { TbAlertTriangle } from "react-icons/tb"
import { ModalConvEstoque } from "@/components/estoque/modalConv"
import { api } from "@/services/apiClient"
import Head from "next/head"

import { AuthContext } from "@/contexts/AuthContext"
import { toast } from "react-toastify"
import { MdEdit } from "react-icons/md";
import { Table, Tabs } from "flowbite-react"
import { FaCalendarAlt, FaProductHunt, FaStore } from "react-icons/fa"
import { HiClipboardList } from "react-icons/hi"
import { Estoque } from "@/components/estoque/estoque"



export interface ConvProps{
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

export default function AdministrarEstoque(){
    const [excluir,setExcluir]= useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [arrayConv,setArrayConv]= useState<Array<ConvProps>>([]) 
  
    const [dadosProduto,setDados] = useState<Partial<EstoqueProps>>({total:1,status:'ABERTO'});
    const {usuario} = useContext(AuthContext);
   



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
    toast.error('Erro ao alterar')
    
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

            <div className="flex flex-col px-4 w-full text-white">
      <Tabs theme={{tabpanel:'py-1',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-400 "
      }}}}}}}  variant="underline">

      <Tabs.Item  active title="Estoque" icon={FaStore}>
        <Estoque arrayEstoque={arrayConv}/>
     
      </Tabs.Item>
      <Tabs.Item title="Produtos" icon={FaProductHunt}>
      
      </Tabs.Item>
    </Tabs>
      </div>
               
             














       

                
                    
                 
              

        </>
     
         














    )

}