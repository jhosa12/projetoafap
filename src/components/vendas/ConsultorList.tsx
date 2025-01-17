
import { Avatar, Table } from "flowbite-react"
import { VendasProps } from "./acompanhamento"



interface DataProps {
    dados: Array<VendasProps>
    setModalVend: (open: boolean) => void
    setVendedor: (fields: VendasProps) => void
    meta: number
}





export function ConsultorList({ dados, meta, setModalVend, setVendedor }: DataProps) {
    return (

  
        <div className="flex flex-col w-full text-black overflow-y-auto max-h-[calc(100vh-204px)]  ">
            <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-6 py-2  text-xs text-black font-semibold" } } }}>
                <Table.Head theme={{base:"bg-gray-100",cell:{base:"px-6 py-2 text-xs text-black font-semibold"}}}>

                    <Table.HeadCell >#</Table.HeadCell>
                    <Table.HeadCell >CONSULTOR</Table.HeadCell>
                    <Table.HeadCell >PROD.</Table.HeadCell>
                    <Table.HeadCell >QUANT</Table.HeadCell>
                    <Table.HeadCell >META</Table.HeadCell>
                    <Table.HeadCell >PERCENTUAL</Table.HeadCell>

                </Table.Head>
                <Table.Body className="text-black divide-y">

                    {dados?.map((item, index) => {
                        return (
                            <Table.Row className="cursor-pointer" onClick={() => { setModalVend(true), setVendedor({ ...item }) }} >

                                <Table.Cell >{index + 1}</Table.Cell>
                                <Table.Cell  >
                                    {item.consultor}
                                </Table.Cell>
                                <Table.Cell >{Number(item._sum.valor_mensalidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                <Table.Cell >{item._count.dt_adesao}</Table.Cell>
                                <Table.Cell >{Number(meta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                <Table.Cell >
                                    <div className="flex justify-between pb-1 leading-none">

                                        <span className="text-xs font-medium  leading-none">{meta && ((item._sum.valor_mensalidade * 100) / meta).toFixed(2)}%</span>
                                    </div>
                                    <div className="w-full rounded-full h-2.5 bg-gray-400">
                                        <div style={{ width: `${(meta && ((item._sum.valor_mensalidade * 100) / meta) > 100 ? '100' : meta && ((item._sum.valor_mensalidade * 100) / meta))}%` }} className="bg-blue-600 h-2.5 rounded-full" ></div>
                                    </div>

                                </Table.Cell>

                            </Table.Row>
                        )

                    })}


                </Table.Body>

            </Table>
        </div>
     
    )
}