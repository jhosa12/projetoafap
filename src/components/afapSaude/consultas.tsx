

import { ConsultaProps, ExamesData, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Button, Table, Modal, Label, TextInput, Checkbox,Select} from "flowbite-react";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";




interface DataProps{
    medicos:Array<MedicoProps>,
    consultas:Array<ConsultaProps>
}
export default function Consultas({medicos,consultas}:DataProps) {
    const [openModal, setOpenModal] = useState(false);
  



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

    <Modal show={openModal} size="2xl" popup dismissible onClose={() => setOpenModal(false)} >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Cadastrar Consulta</h3>
            <div>
              <div className="mb-1 block">
                <Label htmlFor="email" value="Nome" />
              </div>
              <TextInput className="focus:outline-none" id="email" placeholder="Nome" required />
            </div>
<div className="inline-flex w-full gap-4 ">
<div className="w-full">
                
                <div className="mb-1 block ">
                  <Label htmlFor="celular" value="Celular" />
                </div>
               <ReactInputMask id="celular" placeholder="Celular" className="px-2 py-2 focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'(99) 9 9999-9999'}/>
              </div>

              <div className="w-full">
                
                <div className="mb-1 block w-full">
                  <Label htmlFor="password" value="CPF" />
                </div>
               <ReactInputMask placeholder="CPF" className="px-2 py-2 focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'999.999.999-99'}/>
              </div>


</div>

<div>
              <div className="mb-1 block">
                <Label htmlFor="email" value="Especialidade" />
              </div>
              <Select className="focus:outline-none"   required >
                    <option value={''}></option>
                    {medicos.map((item,index)=>(
                        <option key={item.id_med}>{`${item.nome}-(${item.espec})`}</option>
                    ))}
              </Select>
            </div>

      
            <div className="w-full">
              <Button>Log in to your account</Button>
            </div>
       
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}
