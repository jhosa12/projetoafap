
import DocumentTemplate from "@/Documents/carteiraAssociado/DocumentTemplate";
import { useEffect, useRef, useState } from "react";
import { IoPrint } from "react-icons/io5";
import {useReactToPrint} from "react-to-print";

interface DadosProps{
    dependentes:Array<DependentesProps>
    contrato:number,
    plano:string
  }

  interface DependentesProps{
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    close: boolean,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
   
}

export default function CarteirasDep({dependentes,contrato,plano}:DadosProps){
    const [arrayPrint,setArrayPrint]=useState<Array<Partial<DependentesProps>>>([])
    const componentRef = useRef<DocumentTemplate>(null)
    const [todosDep,setTodosDep]=useState(false)
    const [cartTitular,setTitular] =useState(false)
    const [linhasSelecionadas,setLinhasSelecionadas]= useState<Array<Partial<DependentesProps>>>([])
    

    const handlePrint = useReactToPrint({
        content:()=>componentRef.current
    })
    const toggleSelecionada = (item:DependentesProps)=>{
        const index =linhasSelecionadas.findIndex((linha)=>linha.id_dependente===item.id_dependente);
        if(index===-1){
            setLinhasSelecionadas([...linhasSelecionadas,item])
        }else{
            const novasLinhasSelecionadas = [...linhasSelecionadas];
            novasLinhasSelecionadas.splice(index,1);
            setLinhasSelecionadas(novasLinhasSelecionadas)
        }
    }

    const ButtonPrintGeral = ()=>{
        if(todosDep) {setArrayPrint(dependentes);}
        else if(linhasSelecionadas){
            setArrayPrint(linhasSelecionadas)
        }


        handlePrint()
       

    }


    function handleArrayPrint(id:number){
        const novoArray = dependentes.filter(item=>item.id_dependente===id)
        setArrayPrint(novoArray)
    }
    useEffect(()=>{

        if(arrayPrint.length!==0){
            handlePrint()

        }
    },[arrayPrint])
    
    return (
        <div className="flex flex-col w-full p-2">
            <div className="flex p-2">
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>setTitular(!cartTitular)} type="checkbox" checked={cartTitular} />
            <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">CARTEIRA TITULAR</label>
            </div>
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>setTodosDep(!todosDep)} type="checkbox" checked={todosDep} />
            <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODOS DEPENDENTES</label>
            </div>
            <button onClick={()=>ButtonPrintGeral()} className="flex p-1 rounded-lg justify-center bg-gray-500 gap-1 items-center text-xs z-40 text-white"><IoPrint size={18}/> PRINT</button>
            </div>
            <div className="flex max-h-[calc(100vh-250px)]" id="DIV DA TABELA">
            <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                                    <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                                       <tr>
                                            <th scope="col" className=" px-2 py-1">
                                                NOME
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                ADESÃO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                CARÊNCIA
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                NASC.
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                PARENTESCO
                                            </th>
                                            <th scope="col" className="px-4 py-1">
                                                <span className="">Ações</span>
                                            </th>
                                        </tr>
                                      </thead> 
                                      <tbody>
                                        {dependentes.map((item,index)=>(
                                            <tr onClick={()=>toggleSelecionada(item)} className={`cursor-pointer hover:bg-gray-500 text-white border-b  ${linhasSelecionadas.some(linha=>linha.id_dependente===item.id_dependente)?"bg-gray-600":"bg-gray-800"} border-gray-700`}>
                                            <th scope="row" className="px-2 py-1 font-medium  whitespace-nowrap">{item.nome}</th>
                                            <td className="px-10 py-1">
                                                        {new Date(item.data_adesao).toLocaleDateString()}
                                                    </td>
                                            <td className="px-10 py-1">
                                            {new Date(item.carencia).toLocaleDateString()??''}
                                        </td>
                                        <td className="px-8 py-1">
                                                        {item?.data_nasc ? new Date(item.data_nasc).toLocaleDateString() : ''}
                                                    </td>
                                                    <td className="px-12 py-1">
                                                        {item.grau_parentesco}
                                                    </td>
                                                    <td className="px-6 py-1">

                                                    { //   <ReactToPrint
                                                    //    onBeforePrint={()=>handleArrayPrint(item.id_dependente)}
                                                       // trigger={()=>
                                                             <button onClick={(event)=>{event.stopPropagation(),handleArrayPrint(item.id_dependente)}} className="object-contain z-40 text-blue-500"><IoPrint size={18}/></button>
                                                            // }
                                                       // content={()=>componentRef.current}
                                                        
                                                     //   />
                                                     }
                                                     
                                                    </td>
                                                   
                                                  

                                        </tr>
                                        ))}
                                      </tbody>
                                      </table>

            </div>

            <div className="hidden">
            <DocumentTemplate
          ref={componentRef}
          dependentes={arrayPrint}
          plano={plano}
          contrato={contrato}
        
        />

            </div>
        
    
 


        </div>
    )
}