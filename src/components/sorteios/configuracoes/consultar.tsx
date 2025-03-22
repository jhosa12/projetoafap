import { useContext, useEffect, useRef, useState } from "react"
import { MdDelete } from "react-icons/md";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoIosArrowDown, IoIosPrint } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import React from 'react';
import PrintButton from "@/Documents/sorteados/PrintButton";
import { Button, Select } from "flowbite-react";
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient";
import DocumentTemplate from "@/Documents/sorteados/DocumentTemplate";
import { useReactToPrint } from "react-to-print";
interface GanhadoresProps{
    id_contrato:number,
    titular:string,
    endereco:string,
    bairro:string,
    numero:number,
    premio:string,
    data_sorteio:Date,
    status:string
}


export default function ConsultarGanhadores(){

  const {empresas} = useContext(AuthContext)
  const [dataSorteio,setDataSorteio] = useState<Date>(new Date())
  const [id_empresa,setid_empresa] = useState<string>('')
  const [arrayGanhadores,setGanhadores] = useState<Array<Partial<GanhadoresProps>>>([])
  const [loading,setLoading] = useState<boolean>(false)
  const componentRef = useRef<DocumentTemplate>(null);

const impressao = useReactToPrint({
  pageStyle: `
            @page {
                margin: 1rem;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                @page {
                    size: auto;
                    margin: 1rem;
                }
                @page {
                    @top-center {
                        content: none;
                    }
                    @bottom-center {
                        content: none;
                    }
                }
            }
        `,
        documentTitle: 'Relatório de Ganhadores',
  content: () => componentRef.current,
});

  useEffect(()=>{
    
    listarGanhadores({date:new Date(),id_empresa:undefined})
},[])

  async function listarGanhadores({date,id_empresa}:{date:Date|undefined,id_empresa:string|undefined}) {
    setLoading(true)
    try {
        const response = await api.post('/sorteio/listarGanhadores',
            {
                data_sorteio:date,
                id_empresa
            }
        ) 
        setGanhadores(response.data)
    } catch (error) {
        console.log('erro na requisição')
    }
    setLoading(false)
    
}


  
    return (
        <div className="">

          <div style={{display:'none'}}>
              <DocumentTemplate ref={componentRef}  winners={arrayGanhadores} />
          </div>
      {//dadosPremio.openModal &&   <ModalNovoPremio cadastroPremio={cadastroPremio} setarDadosPremios={setarDadosPremios} dadosPremio={dadosPremio}/>
      }
       <div className="flex  w-full bg-gray-200 px-4 mb-1 py-2 text-xs items-center justify-end gap-4 rounded-sm text-black ">

        <Select onChange={e=>setid_empresa(e.target.value)} className="font-semibold" sizing={'sm'}>
          <option value={''}>Empresa</option>
            {empresas.map((item, index) =>(
              <option key={index} value={item.id}>{item.nome}</option>
            ))}


        </Select>
          
                <DatePicker
                placeholderText="DATA SORTEIO"
                 // disabled
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                 selected={dataSorteio}
                  onChange={(date) => date && setDataSorteio(date)}
                  selectsStart
                 // startDate={startDate}
                 // endDate={endDate}
                  className="flex py-2 pl-2 text-xs  border rounded-lg   bg-gray-50 border-gray-300  "
                />
             

           

            <Button isProcessing={loading} size="sm" color='blue' className="" onClick={()=>listarGanhadores({date:dataSorteio,id_empresa:id_empresa})}><IoSearch className="mr-2 h-5 w-5" /> BUSCAR</Button>

            <Button 
           
              size="sm" 
              color='green' 
              onClick={impressao}
              className=""
               ><IoIosPrint  className="mr-2 h-5 w-5"/> Imprimir
               </Button>
              
           
            </div>
       
             <ul className="flex flex-col w-full px-2 mt-1 gap-1 text-sm text-black overflow-y-auto font-semibold max-h-[calc(100vh-180px)]">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full gap-8  items-center">
                    <span className="flex w-full font-semibold">GANHADOR</span>
                      <span className="flex w-full font-semibold">PRÊMIO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">ENDERECO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">BAIRRO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">STATUS</span>
                      <span className="flex w-full text-start whitespace-nowrap ">DATA SORTEIO</span>
                   
                    </div>
                  </div>
                </li>
                {
                  arrayGanhadores?.map((item, index) => {
                    return (
                      <li className={`flex flex-col w-full p-2 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-200" : "bg-slate-300"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <div className="flex w-full gap-8  items-center">
                          <span className="flex w-full font-semibold ">{item.titular}</span>
                            <span className="flex w-full font-semibold">{item.premio}</span>
                            <span className="flex w-full text-start  font-semibold">{item.endereco} Nº {item.numero}</span>
                            <span className="flex w-full text-start  font-semibold">{item.bairro}</span>
                            <span className="flex w-full text-start  text-yellow-400 font-semibold">{item.status}</span>
                            <span className="flex w-full text-start  font-semibold">{item.data_sorteio && new Date(item.data_sorteio).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                          

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