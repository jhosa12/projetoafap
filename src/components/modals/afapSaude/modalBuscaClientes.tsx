'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,

} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { DialogDescription } from '@radix-ui/react-dialog'
import { BarraBuscaCliente } from '@/components/barraBuscaCliente'
import useApiGet from '@/hooks/useApiGet'
import { ClienteFormProps, ConsultaProps } from '@/types/afapSaude'
import { UseFormSetValue } from 'react-hook-form'



interface ModalBuscaClientesProps {
   // onBuscar: (tipoBusca: string, termo: string) => Promise<void>
    tiposBusca: Array<{ value: string; label: string }>
    open:boolean,
    setOpen:(open:boolean) => void,
    setValue:UseFormSetValue<ConsultaProps>
}

export default function BuscarClienteModal({tiposBusca,open,setOpen,setValue}: ModalBuscaClientesProps) {
  const {data,postData} = useApiGet<Array<ClienteFormProps>,{tipoBusca:string,termo:string}>('/afapSaude/cliente/busca')


  const onBuscar=async(tipoBusca:string,termo:string)=>{

    if(!termo) return

    await postData({tipoBusca,termo})

  }

  const handleSelectItem = async(item:ClienteFormProps)=>{

    setValue('bairro',item.bairro??'')
    setValue('cidade',item.cidade??'')
    setValue('endereco',item.endereco??'')
    setValue('nome',item.nome)
    setValue('numero',item.numero??null)
    setValue('celular',item.celular??'')
    setValue("cpf",item.cpf??'')
    setValue('identidade',item.identidade??'')
    setValue('nascimento',item.data_nasc?new Date(item.data_nasc):undefined)
    setValue('id_client',item.id_client??null)


    setOpen(false)
    //setValue('uf',item.uf)

  }
  




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
          <DialogDescription>
            Selecione o tipo de busca e insira o termo desejado.
          </DialogDescription>
        </DialogHeader>
       
        <BarraBuscaCliente arrayParams={tiposBusca} onBuscar={onBuscar}/>
        
        <ul className='space-y-2'>
          {data?.map((item,index)=>
            <li onClick={()=>handleSelectItem(item)} className='bg-gray-200 p-2 hover:bg-gray-300 rounded-sm cursor-pointer'>
             <p className='text-sm font-medium'>{item.nome}</p> 
             <p className='text-xs'>{item.endereco} {item.numero}, {item.bairro}, {item.cidade}-{item.uf}</p>
              </li>
          )}
        </ul>
       
      
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
    
      </DialogContent>
    </Dialog>
  )
}
