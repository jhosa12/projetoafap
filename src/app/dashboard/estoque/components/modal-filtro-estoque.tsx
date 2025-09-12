import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import "react-datepicker/dist/react-datepicker.css";
import { HiFilter } from "react-icons/hi";

import { useState } from "react";
import { FormProps, ProdutosProps } from "../page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <Dialog open={openFilter} onOpenChange={setOpenFilter}>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'}>
          <HiFilter className="mr-2" /> Filtrar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Filtro</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm">
          <div className="grid gap-2">
            <Label className="text-xs">Categoria</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, grupo: v })}>
              <SelectTrigger className="font-semibold">
                <SelectValue placeholder="CATEGORIA" />
              </SelectTrigger>
              <SelectContent>
               
                <SelectItem value="cs">CONSUMO</SelectItem>
                <SelectItem value="cv">CONVALESCENTE</SelectItem>
                <SelectItem value="fn">FUNEBRE</SelectItem>
                <SelectItem value="ot">ÓTICA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs">Produto</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, id_produto: Number(v) })}>
              <SelectTrigger className="font-semibold">
                <SelectValue placeholder="PRODUTO" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map(item => (
                  <SelectItem key={item.id_produto} value={String(item.id_produto)}>
                    {item.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs" htmlFor="descricao">Descrição</Label>
            <Input id="descricao" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value.toUpperCase() })} className="font-semibold" placeholder="DESCRIÇÃO" />
          </div>
          <div className="flex justify-end">
            <Button onClick={async () => { await filtroEstoque({ ...formData, id_empresa }); setOpenFilter(false); }}>
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}