import { FiltroProps } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";

interface DataProps{
  
    loading:boolean
    openModal:boolean,
    setModal:(open:boolean)=>void
    filtrar:()=>Promise<void>
    dataFiltro:FiltroProps
    setFiltro:(fields:FiltroProps)=>void
}

export function ModalFiltro({ loading, openModal, setModal, filtrar, dataFiltro, setFiltro }: DataProps) {
    return (
        <Dialog open={openModal} onOpenChange={setModal}>
            <DialogContent className="sm:max-w-[425px] md:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <DialogTitle>Filtro de Contratos</DialogTitle>
                    </div>
                </DialogHeader>
                <Separator />
                
                <div className="space-y-6 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="contrato-range">Intervalo de Contratos</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Input
                                    id="contrato-inicial"
                                    type="number"
                                    placeholder="Número inicial"
                                    value={dataFiltro.contratoInicial || ''}
                                    onChange={(e) => setFiltro({ ...dataFiltro, contratoInicial: Number(e.target.value) })}
                                />
                            </div>
                            <span className="text-muted-foreground">até</span>
                            <div className="flex-1">
                                <Input
                                    id="contrato-final"
                                    type="number"
                                    placeholder="Número final"
                                    value={dataFiltro.contratoFinal || ''}
                                    onChange={(e) => setFiltro({ ...dataFiltro, contratoFinal: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mensalidades-aberto">Número máximo de mensalidades em aberto</Label>
                        <Input
                            id="mensalidades-aberto"
                            type="number"
                            value={dataFiltro.mensAberto || ''}
                            onChange={(e) => setFiltro({ ...dataFiltro, mensAberto: Number(e.target.value) })}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button 
                            onClick={filtrar} 
                            disabled={loading}
                            className="min-w-[120px]"
                        >
                            {loading ? 'Aplicando...' : 'Aplicar Filtro'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}