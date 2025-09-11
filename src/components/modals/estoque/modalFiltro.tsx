import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { EmpresaProps } from "@/types/empresa";

interface DataProps{
    empresas:Array<EmpresaProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    handleFiltro:({startDate,endDate,id_empresa}:{startDate:Date,endDate:Date,id_empresa:string})=>Promise<void>
   
}

export function ModalFiltroMov({empresas,openModal,setOpenModal,handleFiltro}:DataProps){
    const [startDate,setStartDate] = useState<Date>(new Date())
    const [endDate,setEndDate] = useState(new Date())
    const [id_empresa,setId] = useState<string>('')

    return(
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Filtro</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="empresa">Empresa</Label>
                        <Select onValueChange={(v)=>setId(v)}>
                            <SelectTrigger id="empresa" className="font-semibold">
                                <SelectValue placeholder="EMPRESA" />
                            </SelectTrigger>
                            <SelectContent>
                                {empresas.map(item=> (
                                    <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="inline-flex gap-4">
                        <div className="grid gap-2">
                            <Label>Data início</Label>
                            <DatePicker selected={startDate} onChange={e => { e && setStartDate(e) }} dateFormat={"dd/MM/yyyy"} required className="flex w-full uppercase font-semibold text-xs border rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Data fim</Label>
                            <DatePicker selected={endDate} onChange={e => { e && setEndDate(e) }} dateFormat={"dd/MM/yyyy"} required className="flex w-full uppercase font-semibold text-xs border rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button size={'sm'} onClick={async ()=>{ await handleFiltro({endDate,id_empresa,startDate}); setOpenModal(false)}}>Aplicar Filtro</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}