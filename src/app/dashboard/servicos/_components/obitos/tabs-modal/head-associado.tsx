import { AuthContext } from "@/store/AuthContext"
import { useContext } from "react"
import { Badge } from "@/components/ui/badge"
import { TbWheelchair } from "react-icons/tb"
import { ConvProps } from "../../../_types/convalescente"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"


interface Props {
  situacao: string,
  associado: string
  id_contrato: number,
  plano: string,
  convalescencia: Array<ConvProps>
}

export const HeadAssociado = ({
  associado,
  convalescencia,
  id_contrato,
  plano,
  situacao

}: Partial<Props>) => {

  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ATIVO':
        return <Badge variant="success" className=" text-xs">{status}</Badge>
      case 'INATIVO':
        return <Badge variant="destructive" className=" text-xs">{status}</Badge>
      case 'SUSPENSO':
        return <Badge variant="warning" className=" text-xs">{status}</Badge>
      default:
        return <Badge variant="outline" className=" text-xs">{status}</Badge>
    }
  }

  return (
    <div className="inline-flex space-x-1 items-center text-sm font-semibold divide-x-2">
      <span className="px-2">
        {id_contrato} - {associado}
      </span>

      <div className="px-2">
        CATEGORIA:
        <span className="pl-3 text-[#c5942b]">
          {plano}
        </span>
      </div>
      <div className="px-2">
        {getStatusBadge(situacao)}
      </div>
      {convalescencia?.map((item) => (
        <>
          {item.convalescenca_prod?.map(
            (dados, index) =>
              !item.id_dependente &&
              item.status === "ABERTO" && (
                <button
                  key={index}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={dados?.descricao ?? ""}
                  className="text-yellow-500"
                >
                  <TbWheelchair size={20} />
                </button>
              )
          )}
        </>
      ))}
      
    </div>
  )
}