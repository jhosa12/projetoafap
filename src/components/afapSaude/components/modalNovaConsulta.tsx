import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import ReactInputMask from "react-input-mask";
import { IoAddCircle } from "react-icons/io5";
import { ChangeEvent, useState } from "react";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";

interface DataProps{
    openModal:boolean,
    setOpenModal:(toogle:boolean)=>void
    medicos:Array<MedicoProps>
    exames:Array<ExamesProps>
    data:ConsultaProps,
    setData:(consulta:ConsultaProps)=>void

}

export function ModalConsulta({openModal,setOpenModal,medicos,exames,data,setData}:DataProps) {
    const [dataExame,setDataExam] =useState<ExamesData>({
        data:new Date,
        desconto:0,
        id_exame:null,
        nome:'',
        valorBruto:0,
        valorFinal:0,
        porcFun:0,
        porcPart:0,
        porcPlan:0
    })




const handleCadastrar = async()=>{
    try {

        const response = await toast.promise(
            api.post("/afapSaude/consultas/cadastro",{
                nome:data.nome,
                data:new Date(),
                espec:data.espec,
                exames:data.exames,
                id_med:data.id_med,
                tipoDesc:data.tipoDesc,
                vl_consulta:data.vl_consulta,
                vl_desc:data.vl_desc,
                vl_final:data.vl_final,
                celular:data.celular,
                cpf:data.cpf
            }),
            {
                error:'Erro ao Cadastrar Dados',
                pending:'Cadastrando Consulta.....',
                success:'Consulta Cadastrada com sucesso'
            }
        ) 
        
    } catch (error) {
        console.log(error)
    }
}

  const handleExame=  (event:ChangeEvent<HTMLSelectElement>)=>{

    if(!event.target.value){
        setDataExam({
            data:new Date,
            desconto:0,
            id_exame:null,
            nome:'',
            valorBruto:0,
            valorFinal:0,
            porcFun:0,
            porcPart:0,
            porcPlan:0
        })
        return
    }
            const item = exames.find(atual=>atual.id_exame===Number(event.target.value))
           
               
         item?.id_exame && setDataExam({
                desconto:0,
                data:new Date(),
                id_exame:item?.id_exame,
                nome:item?.nome??'',
                valorBruto:item?.valorBruto??0,
                valorFinal: item.valorBruto,
                porcFun:item.porcFun,
                porcPart:item.porcPart,
                porcPlan:item.porcPlan
            })
    }

    return(
        <Modal show={openModal} size="3xl" popup dismissible onClose={() => setOpenModal(false)} >
        <Modal.Header>Cadastrar Consulta</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
        
            <div>
              <div className="mb-1 block">
                <Label htmlFor="email" value="Nome" />
              </div>
              <TextInput value={data.nome} onChange={(e)=>setData({...data,nome:e.target.value})} className="focus:outline-none" id="email" placeholder="Nome" required />
            </div>
<div className="inline-flex w-full gap-4 ">
<div className="w-full">
                
                <div className="mb-1 block ">
                  <Label htmlFor="celular" value="Celular" />
                </div>
               <ReactInputMask value={data.celular} onChange={e=>setData({...data,celular:e.target.value})} id="celular" placeholder="Celular" className="px-2 py-2 focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'(99) 9 9999-9999'}/>
              </div>
              <div className="w-full">
                
                <div className="mb-1 block w-full">
                  <Label htmlFor="cpf" value="CPF" />
                </div>
               <ReactInputMask value={data.cpf} onChange={e=>setData({...data,cpf:e.target.value})} id="cpf" placeholder="CPF" className="px-2 py-2 focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'999.999.999-99'}/>
              </div>

</div>
<div>
              <div className="mb-1 block">
                <Label htmlFor="espec" value="Especialidade" />
              </div>
              <Select value={data.id_med??''} onChange={e=>
              {      
                const item = medicos.find(med=>med.id_med===Number(e.target.value))
                setData({...data,id_med:Number(e.target.value),espec:`${item?.nome}-(${item?.espec})`}
)}} id='espec' className="focus:outline-none"   required >
                    <option value={''}></option>
                    {medicos.map((item,index)=>(
                        <option value={item.id_med} key={item.id_med}>{`${item.nome}-(${item.espec})`}</option>
                    ))}
              </Select>
            </div>
            <div className="w-full">
              <div className="mb-1 block">
                <Label  value="Tipo de Desconto" />
              </div>
              <Select value={data.tipoDesc} onChange={e=>setData({...data,tipoDesc:e.target.value})} className="focus:outline-none"   required >
                    <option value={''}></option>
                    <option value={'Particular'}>Particular</option>
                    <option value={'Funeraria'}>Funerária</option>
                    <option value={'Plano'}>Plano</option>
              </Select>
            </div>

            {
                <div>
              <div className="inline-flex w-full gap-3 items-end">
           

            <div className="w-full">
              <div className="mb-1 block">
                <Label  value="Exame" />
              </div>
              <Select   onChange={e=>handleExame(e)} className="focus:outline-none"   required >
                    <option value={''}></option>
                    {exames.map((item,index)=>(
                        <option value={item.id_exame} key={item.nome}>{`${item.nome}-(${item.nome})`}</option>
                    ))}
              </Select>
            </div>

            <button onClick={()=>{
                if(!dataExame.id_exame|| !data.tipoDesc){
                    return
                }
                let valorDesc:number =0
          
                if(data.tipoDesc==='Funeraria'){
                    valorDesc= dataExame.valorBruto*(dataExame.porcFun/100)
                }
    
               else if(data.tipoDesc==='Plano'){
                    valorDesc= dataExame.valorBruto*(dataExame.porcPlan/100)
               }
    
                       
                setData({...data,exames:[...data.exames,{...dataExame,desconto:valorDesc,valorFinal:dataExame.valorBruto-valorDesc}]})
            }} className="mb-1"><IoAddCircle color="blue" size={32}/></button>
              </div>
              <div className="overflow-x-auto">



      <Table striped >
        <Table.Head>
          <Table.HeadCell>Exame</Table.HeadCell>
          <Table.HeadCell>Valor Bruto</Table.HeadCell>
          <Table.HeadCell>Valor Desc.</Table.HeadCell>
          <Table.HeadCell>Valor Final</Table.HeadCell>
       
        </Table.Head>
        <Table.Body className="divide-y">
            {data.exames.map((item,index)=>(
                 <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                     <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item.nome}
            </Table.Cell>
            <Table.Cell>{Number(item.valorBruto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{Number(item.desconto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{Number(item.valorFinal).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
         
</Table.Row>


            ))}
           
        
         
       

        <Table.Row  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                     <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Total
            </Table.Cell>
          
            <Table.Cell>{}</Table.Cell>
            <Table.Cell>{}</Table.Cell>
            <Table.Cell>{Number(data.exames.reduce((acumulador,atual)=>{
                acumulador+=Number(atual.valorFinal)
                return acumulador},0)).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
</Table.Row>
       
       
        </Table.Body>
       
      </Table>
    </div>

              </div>
               
            }

      
            <div className="w-full">
              <Button onClick={handleCadastrar}>Salvar</Button>
            </div>
       
          </div>
        </Modal.Body>
      </Modal>

    )
}