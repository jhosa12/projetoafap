import { Button, Checkbox, Dropdown, Label, Popover, Select, TextInput } from "flowbite-react"
import { IoIosArrowDown } from "react-icons/io"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi";
import { FormProps, ProdutosProps } from "@/pages/estoque";
import { useState } from "react";
import { EmpresaProps } from "@/types/empresa";


interface DataProps {
  produtos: Array<Partial<ProdutosProps>>
  loading: boolean,
  filtroEstoque: (dados:FormProps)=>Promise<void>
}


export function FiltroLeads({ produtos, loading, filtroEstoque }: DataProps) {
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const [formData,setFormData] = useState<FormProps>({grupo:'',descricao:'',id_produto:null,id_empresa:undefined})


  return (
    <Popover
      theme={{ content: 'flex w-full z-10 overflow-hidden rounded-[7px]' }}
      aria-labelledby="area-popover"
      open={openFilter}
      onOpenChange={setOpenFilter}
      content={
        <div className="flex w-72 flex-col gap-4 p-2 text-sm ">

          <h2 id="area-popover" className="text-base text-gray-500">Filtro</h2>


          <Select onChange={e => setFormData({ ...formData, id_empresa: e.target.value })} className="font-semibold" sizing={'sm'}>
                        <option value={''}>VENDEDOR</option>
                       {/*empresas.map(item=>(
                        <option value={item.id} className="font-semibold" key={item.id}>{item.nome}</option>
                       ))*/}

                    </Select>


          <Select onChange={e => setFormData({ ...formData, grupo: e.target.value })} className="font-semibold" sizing={'sm'}>
                        <option value={''}>STATUS</option>
                        <option value={'LEAD'} className="font-semibold">LEAD</option>
                        <option value={'PROSPECCAO'} className="font-semibold">PROSPECÇÃO</option>
                        <option value={'PRE VENDA'}  className="font-semibold">PRÉ VENDA</option>
                    </Select>
         
                 
                    <TextInput value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value.toUpperCase() })} className=" font-semibold" placeholder="NOME" sizing={'sm'}/>

          <Button color="success" isProcessing={loading} onClick={() => filtroEstoque(formData)}>
            Aplicar Filtro
          </Button>

        </div>
      }
    >
      <Button color={'light'} theme={{ color: { light: 'border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100' } }} size={'sm'}>
        <HiFilter className="mr-2 w-5 h-5" />   Filtrar
      </Button>
    </Popover>
  )
}