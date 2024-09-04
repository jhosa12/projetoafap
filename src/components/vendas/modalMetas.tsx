import { MetasProps, SetorProps } from "@/pages/vendas"
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';

interface DataProps{
    show:boolean,
    setModalMetas:(open:boolean)=>void
    arraySetores:Array<SetorProps>
    setarDadosMetas:(fields:Partial<MetasProps>)=>void
    novaMeta:()=>Promise<void>
    dadosMetas:Partial<MetasProps>
    arrayMetas :Array<MetasProps>
}

export function ModalMetas({show,setModalMetas,novaMeta,dadosMetas,arraySetores,arrayMetas,setarDadosMetas}
:DataProps){


        return(
            <Modal dismissible size={'3xl'} show={show} onClose={() => setModalMetas(false)}>
            <Modal.Header> Nova Meta</Modal.Header>
            <Modal.Body>
                <div className='flex flex-row gap-2 items-end mb-2'>
                    <div>
                        <div className="mb-1 block">
                            <Label htmlFor="email1" value="Setor" />
                        </div>
        
                        <Select sizing={'sm'} value={dadosMetas.id_grupo} onChange={e => {
                            const item = arraySetores.find(item => item.id_grupo === Number(e.target.value))
                            setarDadosMetas({ ...dadosMetas, id_grupo: item?.id_grupo, descricao_grupo: item?.descricao })
        
                        }}>
                            <option value={0}>SETOR (TODOS)</option>
        
                            {arraySetores?.map((item, index) => (
                                <option className="text-xs" key={index} value={item.id_grupo}>
                                    {item.descricao}
                                </option>
        
                            ))}
                        </Select>
                    </div>
        
                    <div >
                    <div className="mb-1 block">
        <Label  value="Data inicio" />
        </div>
                        <DatePicker selected={dadosMetas.date} onChange={e => { e && setarDadosMetas({ ...dadosMetas, date: e }) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    </div>
        
        
                    <div  >
                    <div className="mb-1 block">
        <Label  value="Data Fim" />
        </div>
                        <DatePicker selected={dadosMetas.dateFimMeta} onChange={e => { e && setarDadosMetas({ ...dadosMetas, dateFimMeta: e }) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    </div>
        
                    <div className='w-1/6'>
                    <div className="mb-1 block">
        <Label  value="Valor" />
        </div>
        
        <TextInput sizing="sm" value={dadosMetas.valor} onChange={e => setarDadosMetas({ ...dadosMetas, valor: Number(e.target.value) })}  type="number" placeholder="Valor" required />
                      
                    </div>
                    <Button onClick={() => novaMeta()} size={'xs'}> Adicionar</Button>
                    
        
                </div>
        
                <div className="w-full  max-h-[350px]">
                    <Table>
                       
                        <Table.Head >
                         
        
                                <Table.HeadCell>
                                    DESCRIÇÃO
                                </Table.HeadCell>
                                <Table.HeadCell >
                                    DATA INICIO
                                </Table.HeadCell>
                                <Table.HeadCell >
                                    DATA FIM.
                                </Table.HeadCell>
                                <Table.HeadCell >
                                    VALOR
                                </Table.HeadCell>
                                <Table.HeadCell >
                                    AÇÕES
                                </Table.HeadCell>
                            
                        </Table.Head>
                        <Table.Body  >
                            {arrayMetas.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell >
                                        {item.descricao}
                                    </Table.Cell>
                                    <Table.Cell >
                                        {new Date(item.date || '').toLocaleDateString()}
        
                                    </Table.Cell>
        
                                    <Table.Cell >
                                        {new Date(item.dateFimMeta || '').toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell >
                                        {Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                                    </Table.Cell>
                                    <Table.Cell >
                                        {item.id_grupo}
                                    </Table.Cell>
        
                                </Table.Row>
        
                            ))}
        
                        </Table.Body>
        
                    </Table>
                </div>
        
        
            </Modal.Body>
        </Modal>
        )
   

}