
import DocumentTemplate from "@/Documents/carteiraAssociado/DocumentTemplate";
import { ObitoProps } from "@/types/associado";
import { IoPrint } from "react-icons/io5";
import {useReactToPrint} from "react-to-print";








interface DadosProps{
    obitos:Array<Partial<ObitoProps>>,
   
  }









export default function ObitosAssociado({obitos}:DadosProps){
   
    
    
    return (
        <div className="flex flex-col w-full p-2">
         
        
          
            <div className="flex max-h-[calc(100vh-250px)]" id="DIV DA TABELA">
            <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-600">
                                    <thead className="sticky top-0  text-xs uppercase bg-gray-100 ">
                                       <tr>
                                            <th scope="col" className=" px-2 py-1">
                                                FALECIDO
                                            </th>
                                          
                                            <th scope="col" className="px-12 py-1">
                                                DATA NASC.
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                DATA FALECIMENTO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                HORA FALECIMENTO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                LOCAL FALECIMENTO
                                            </th>
                                            
                                        </tr>
                                      </thead> 
                                      <tbody>
                                        {obitos.map((item,index)=>(
                                            <tr  className={`cursor-pointer hover:bg-gray-200  border-b  bg-gray-50 border-gray-300`}>
                                           
                                            <td className="px-2 py-1">
                                            {item.nome_falecido}
                                        </td>
                                            <td className="px-12 py-1">
                                                        {item.data_nascimento
                                                         && new Date(item.data_nascimento).toLocaleDateString()}
                                                    </td>
                                          
                                        <td className="px-12 py-1">
                                        {item.end_data_falecimento
                                                         && new Date(item.end_data_falecimento).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-12 py-1">
                                                        {item.end_hora_falecimento && new Date(item.end_hora_falecimento).toLocaleTimeString()}
                                                    </td>
                                                    <td className="px-12 py-1">
                                        {item.end_local_falecimento}
                                                    </td>
                                             
                                                   
                                                  

                                        </tr>
                                        ))}
                                      </tbody>
                                      </table>
                                      <div className="hidden">
        

            </div>

            </div>

        
        
    
 


        </div>
    )
}