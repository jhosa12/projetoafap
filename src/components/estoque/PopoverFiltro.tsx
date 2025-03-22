import {   Popover, Select, TextInput } from "flowbite-react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi";
import { FormProps, ProdutosProps } from "@/pages/dashboard/estoque";
import { useState } from "react";
import { EmpresaProps } from "@/types/empresa";
import { Button } from "../ui/button";


interface DataProps {
  produtos: Array<Partial<ProdutosProps>>
  loading: boolean,
  id_empresa:string|undefined
  filtroEstoque: (dados:FormProps)=>Promise<void>
}


export function FiltroEstoque({ produtos, loading, filtroEstoque,id_empresa}: DataProps) {
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const [formData,setFormData] = useState<FormProps>({grupo:'',descricao:'',id_produto:null,id_empresa:undefined})


  return (
    <Popover
      theme={{ content: 'flex w-full z-10 overflow-hidden rounded-[7px]' }}
      aria-labelledby="area-popover"
      open={openFilter}
      onOpenChange={setOpenFilter}
      content={
        <div className="flex w-96 flex-col gap-4 p-2 text-sm ">

          <h2 id="area-popover" className="text-base text-gray-500">Filtro</h2>


         
          <Select onChange={e => setFormData({ ...formData, grupo: e.target.value })} className="font-semibold" sizing={'sm'}>
                        <option value={''}>CATEGORIA</option>
                        <option value={'cs'} className="font-semibold">CONSUMO</option>
                        <option value={'cv'} className="font-semibold">CONVALESCENTE</option>
                        <option value={'fn'}  className="font-semibold">FUNEBRE</option>
                        <option  value={'ot'} className="font-semibold">ÓTICA</option>

                    </Select>
          <Select onChange={e => setFormData({ ...formData, id_produto: Number(e.target.value) })} className="font-semibold" sizing={'sm'}>
                        <option>PRODUTO</option>
                       {produtos.map(item=>(
                        <option value={item.id_produto} className="font-semibold" key={item.id_produto}>{item.descricao}</option>
                       ))}
                    </Select>
                 
                    <TextInput value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value.toUpperCase() })} className=" font-semibold" placeholder="DESCRIÇÃO" sizing={'sm'}/>

          <Button color="success"  onClick={() => filtroEstoque({...formData,id_empresa})}>
            Aplicar Filtro
          </Button>

        </div>
      }
    >
      <Button color={'light'} variant={'outline'} size={'sm'}>
        <HiFilter  />   Filtrar
      </Button>
    </Popover>
  )
}