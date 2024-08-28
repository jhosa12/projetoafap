

import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Button, Table, Modal, Label, TextInput, Checkbox,Select} from "flowbite-react";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { ModalConsulta } from "./components/modalNovaConsulta";




interface DataProps{
    medicos:Array<MedicoProps>,
    consultas:Array<ConsultaProps>
    exames:Array<ExamesProps>
}
export default function Consultas({medicos,consultas,exames}:DataProps) {
    const [openModal, setOpenModal] = useState(false);
    const [data,setData] = useState<ConsultaProps>({
      data:new Date(),espec:'',exames:[],id_consulta:null,id_med:null,nome:'',tipoDesc:'',vl_consulta:0,vl_desc:0,vl_final:0,celular:'',cpf:''
    })
  



  return (
    <div className="flex flex-col py-2 gap-2">
<div className="inline-flex w-full bg-white rounded-sm p-2">
    <Button onClick={()=>setOpenModal(true)} className="ml-auto">Adicionar Consulta</Button>

</div>
  
    <div className="overflow-x-auto">
      <Table striped >
        
        <Table.Head>
          <Table.HeadCell>Nome</Table.HeadCell>
          <Table.HeadCell>Especialidade</Table.HeadCell>
          <Table.HeadCell>Data</Table.HeadCell>
          <Table.HeadCell>Valor Bruto</Table.HeadCell>
          <Table.HeadCell>Tipo Desc.</Table.HeadCell>
          <Table.HeadCell>Valor Desc.</Table.HeadCell>
          <Table.HeadCell>Valor Final</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
            {consultas.map((item,index)=>(
              <Table.Row key={item.id_consulta} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item.nome}
            </Table.Cell>
            <Table.Cell>{item.espec}</Table.Cell>
            <Table.Cell>{new Date(item.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
            <Table.Cell>{Number(item.vl_consulta).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{item.tipoDesc}</Table.Cell>
            <Table.Cell>{Number(item.vl_desc).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{Number(item.vl_final).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Edit
              </a>
            </Table.Cell>

</Table.Row>
            ))}      
        </Table.Body>
      </Table>
    </div>

   <ModalConsulta  data={data} setData={setData} exames={exames} medicos={medicos} openModal={openModal} setOpenModal={setOpenModal}/>
    </div>
  );
}
