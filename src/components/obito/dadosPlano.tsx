import { Card } from "flowbite-react"

interface PlanoProps{
id_associado:number,
id_contrato:number,
nome:string,
categoria:string,
situacao:string

}

interface DadosProps{
    dados:Partial<PlanoProps>
}


export function DadosPlano({dados}:DadosProps) {
  return (
    <div className="flex flex-col w-full rounded-lg p-4">

    {dados.id_associado && (<><h1 className="text-lg">{dados.id_contrato} - {dados.nome} - CATEGORIA: {dados.categoria}</h1>
        <h3 className="text-sm">SITUAÇÃO: {dados.situacao}</h3>
        <div>
            <span className="text-xs">OBSERVAÇÕES:</span>
            <ul className="pl-4 text-xs list-disc">
                <li>Contrato Possui Convalescencia</li>
                <li>Contrato Possui 2 mensalidades vencidas</li>
                <li>Contrato em Carência</li>
            </ul>
        </div>
        <Card>
            <h2>BENEFÍCIOS DO PLANO</h2>
            <ul className="list-decimal  pl-4 text-sm">
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
                <li>ASSISTÊNCIA DE VELÓRIO</li>
            </ul>
            </Card>
    </>
    )


    }


</div>
  )
}





