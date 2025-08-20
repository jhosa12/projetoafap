import { AuthContext } from "@/store/AuthContext"
import { useContext, useState } from "react"
import { Combobox } from "./ui/combobox"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"
import { api } from "@/lib/axios/apiClient"



interface Props {
    value: string | null,
    onChange: (value: string | null) => void
}

export const SelectBairroEmpresa = (props: Props) => {
    const { bairrosUnicos, selectEmp,cidades,getBairrosUnicos } = useContext(AuthContext)
    const [newBairro, setNewBairro] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [cidade, setCidade] = useState("")

    const handleAddBairro = async () => {
        if (!newBairro.trim()) {
            toast.error("Por favor, insira um nome para o bairro")
            return
        }

        setIsLoading(true)
        try {
            await api.post("/bairro/post", {
                cidade: cidade,
                nome_bairro: newBairro.trim(),
                id_empresa: selectEmp
            })
            toast.success("Bairro adicionado com sucesso!")
            setNewBairro("")
            setIsOpen(false)
            // You might want to refresh the bairros list here
           // const res = await api.post("/bairro/listar", { id_empresa: selectEmp })
           // setBairrosEmpresa(res.data)
          await getBairrosUnicos()
        } catch (error) {
            console.error("Erro ao adicionar bairro:", error)
            toast.error("Erro ao adicionar bairro. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <Combobox
                items={bairrosUnicos?.map((bairro) => ({
                    label: bairro ?? '',
                    value: bairro ?? ''
                }))}
                value={props.value}
                onChange={props.onChange}
               classNameInput="h-9"    
            />
            
            <Dialog  open={isOpen} onOpenChange={setIsOpen} modal={false}>
                <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Bairro</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Nome do bairro"
                                value={newBairro}
                                onChange={(e) => setNewBairro(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddBairro()
                                }}
                            />

<Combobox
                items={cidades?.filter((cidade)=>cidade.uf ==='CE').map((cidade) => ({
                    label: cidade.cidade ?? '',
                    value: cidade.cidade ?? ''
                }))}
                value={cidade}
                onChange={(value)=>setCidade(value ??'')}
                classNameInput="h-9"
                
            />
                    
                        </div>
                        <Button 
                            onClick={handleAddBairro} 
                            disabled={isLoading || !newBairro.trim()}
                        >
                            {isLoading ? "Salvando..." : "Adicionar"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

