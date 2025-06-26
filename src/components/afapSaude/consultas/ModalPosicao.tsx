import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface ModalPosicaoProps{
    open: boolean;
    onClose:(open:boolean)=>void;
    handleConfirmarPosicao:(posicao:number)=>void;
    posicao?:number;
}

export default function ModalPosicao({open,onClose,handleConfirmarPosicao,posicao}:ModalPosicaoProps){
    const [posicaoModal, setPosicao] = useState<{posicao?:number}>();

useEffect(()=>{
  setPosicao({posicao})
},[posicao])


    return(
          <Dialog
                open={open}
                onOpenChange={onClose}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Posição</DialogTitle>
                    <DialogDescription>
                      Informe a nova posição para esta consulta
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                   
                    
                      <div className="flex justify-center items-center">
                        <div className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center">
                          <input
                            id="posicao"
                            value={posicaoModal?.posicao || ""}
                            onChange={(e) =>
                              setPosicao({ ...posicaoModal, posicao: Number(e.target.value) })
                            }
                            className="w-full h-full text-3xl text-center bg-transparent border-none text-white focus:ring-0 focus:outline-none appearance-none"
                          
                          />
                        </div>
                      </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={()=>onClose(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={()=> handleConfirmarPosicao(posicaoModal?.posicao || 1)}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
    )
}
    