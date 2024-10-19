
import DocumentTemplate from "@/Documents/carteiraAssociado/DocumentTemplate";
import { it } from "node:test";
import { useEffect, useRef, useState } from "react";
import { IoPrint } from "react-icons/io5";
import {useReactToPrint} from "react-to-print";

interface DadosProps{
    dependentes:Array<DependentesProps>
    contrato:number,
    plano:string,
    titular:string,
    endereco:string,
    numero:number|null,
    bairro:string,
    cidade:string,
    celular:string,
    uf:string,
   
  }

  interface DependentesProps{
    nome: string,
    data_nasc: Date|null,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
   
}

export default function CarteirasDep({dependentes,contrato,plano,titular,endereco,numero,bairro,cidade,celular,uf}:DadosProps){
    const [arrayPrint,setArrayPrint]=useState<Array<Partial<DependentesProps>>>([])
    const componentRef = useRef<DocumentTemplate>(null)
    const [todosDep,setTodosDep]=useState(false)
    const [cartTitular,setTitular] =useState(false)
    const [linhasSelecionadas,setLinhasSelecionadas]= useState<Array<Partial<DependentesProps>>>([])
    

    const handlePrint = useReactToPrint({
        content:()=>componentRef.current,
        pageStyle: `
        @page {
            margin: 4px;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
           
          
        }
    `,
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
        <div className="flex flex-col   max-h-[calc(100vh-200px)]  w-full  p-2 ">
            <div className="flex px-2 mb-2 w-full text-black font-semibold">
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>setTitular(!cartTitular)} type="checkbox" checked={cartTitular} />
            <label className="ms-2  text-xs whitespace-nowrap  ">CARTEIRA TITULAR</label>
            </div>
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>setTodosDep(!todosDep)} type="checkbox" checked={todosDep} />
            <label className="ms-2  text-xs whitespace-nowrap ">TODOS DEPENDENTES</label>
            </div>
            <button onClick={()=>ButtonPrintGeral()} className="flex p-1 rounded-lg justify-center bg-gray-500 gap-1 items-center text-xs z-40 text-white"><IoPrint size={18}/> PRINT</button>
            </div>
          
            <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-600 ">
                                    <thead className="sticky top-0  text-xs uppercase bg-gray-100 text-gray-600">
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
                                        {dependentes?.filter(item=>!item.excluido)?.map((item,index)=>(
                                            <tr key={item.id_dependente} onClick={()=>toggleSelecionada(item)} className={`text-black font-semibold cursor-pointer hover:bg-gray-200  border-b  ${linhasSelecionadas.some(linha=>linha.id_dependente===item.id_dependente)?"bg-gray-300":"bg-gray-50"} border-gray-300`}>
                                            <td scope="row" className="px-2 py-1  whitespace-nowrap">{item.nome}</td>
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
                                      <div className="hidden">
            <DocumentTemplate
          ref={componentRef}
          dependentes={arrayPrint}
          plano={plano}
          contrato={contrato}
          titular={titular}
          endereco={endereco}
          celular={celular}
          bairro={bairro}
          cidade={cidade}
          numero={numero}
          uf={uf}
          cartTitular={cartTitular}
          dependentesTitular={dependentes}
          
        
        />

            </div>

     

        
        
    
 


        </div>
    )
}