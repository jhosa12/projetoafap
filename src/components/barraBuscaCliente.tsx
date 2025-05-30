

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { LucideSearch } from "lucide-react"

interface BarraBuscaClienteProps {
  onBuscar: (tipoBusca: string, termo: string) => Promise<void>
  arrayParams:Array<{value:string,label:string}>
}

export function BarraBuscaCliente({ onBuscar,arrayParams }: BarraBuscaClienteProps) {
  const [tipoBusca, setTipoBusca] = useState(arrayParams[0].value)
  const [termo, setTermo] = useState("")


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBuscar(tipoBusca, termo)
  }
  

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl">
      <Select required value={tipoBusca} onValueChange={setTipoBusca}>
        <SelectTrigger  className="rounded-r-none w-32">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
         {arrayParams.map((item)=>(<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Buscar..."
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        className="rounded-none"
        required
      />

      <Button
        type="submit"
        className="rounded-l-none"
        variant="default"
      >
        <LucideSearch className="w-4 h-4" />
      </Button>
    </form>
  )
}
