
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MetasProps, SetorProps } from "./acompanhamento";

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
            <Modal dismissible size={'sm'} show={show} onClose={() => setModalMetas(false)}>

            <Modal.Body>
                <div className='flex flex-col gap-2 '>
                    <div>
                        
                            <Label htmlFor="email1" value="Setor" />
                   
        
                        <Select sizing={'sm'} value={dadosMetas.id_grupo} onChange={e => {
                            const item = arraySetores?.find(item => item.id_grupo === Number(e.target.value))
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
        
                    <div className='flex flex-col w-full'>
                 
        <Label  value="Data inicio" />
     
                        <DatePicker selected={dadosMetas?.date} onChange={e => { e && setarDadosMetas({ ...dadosMetas, date: e }) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    </div>
        
        
                    <div className='flex flex-col w-full' >
                
        <Label  value="Data Fim" />
        
                        <DatePicker selected={dadosMetas.dateFimMeta} onChange={e => { e && setarDadosMetas({ ...dadosMetas, dateFimMeta: e }) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    </div>
        
                    <div className='flex flex-col w-full'>
                 
        <Label  value="Valor" />
        
        
        <TextInput sizing="sm" value={dadosMetas.valor} onChange={e => setarDadosMetas({ ...dadosMetas, valor: Number(e.target.value) })}  type="number" placeholder="Valor" required />
                      
                    </div>
                    <Button onClick={() => novaMeta()} size={'xs'}> Adicionar</Button>
                    
        
                </div>
        
             
        
        
            </Modal.Body>
        </Modal>
        )
   

}