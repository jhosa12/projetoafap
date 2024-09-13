import { api } from "@/services/apiClient";
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import { FormEvent } from "react";
import { MdClose } from "react-icons/md"
import { toast } from "react-toastify";

interface ProdutosProps{
    id_produto: number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}
interface ListaProdutos {

    id_produto: number,
    descricao: string,
    unidade: string,
    valor_custo: number,
    valor_venda: number,
    quantidade: number,
    margem_lucro: number,
    valor_aluguel: number,
    est_inicial: number,
    est_entradas: number,
    est_saidas: number,
    est_saldo: number,
    situacao: string,
    data_inc: Date,
    grupo: string,
    tipo: string,
    taxa_conval: number
}



interface DadosProps{
listaProduto:Partial<ProdutosProps>
setarProdutos:(fields:Partial<ProdutosProps>)=>void
selectProdutos:Array<ListaProdutos>
obito_itens:Array<Partial<ProdutosProps>>
setarServico:(fields:Partial<{obito_itens:Array<Partial<ProdutosProps>>}>)=>void
deletarProduto:(index:number)=>void
total:number
lancarCaixa:()=>Promise<void>
id_obito:number

}

export function ProdutosServicos({id_obito,listaProduto,setarProdutos,selectProdutos,obito_itens,setarServico,deletarProduto,total,lancarCaixa}:DadosProps) {



    const handleSubmit=(event:FormEvent)=>{
        event.preventDefault();
        adicionarProduto();

    }

    async function adicionarProduto() {

        if(!id_obito){
            toast.info('Salve os dados do Obito para acrescentar produtos!');
            return;
        }
        try {
            const response = await toast.promise(
                api.post('/obitos/adicionarProduto',{
                    id_obito,
                    descricao_item:listaProduto.descricao_item,
                    valor_unit:listaProduto.valor_unit,
                    valor_total:listaProduto.valor_total,
                    quantidade:listaProduto.quantidade,
                    desconto:listaProduto.desconto,
                    acrescimo:listaProduto.acrescimo,
                    
                }),
                {   
                    error:'Erro ao Salvar Dados!',
                    pending:'Salvando Dados....',
                    success:'Dados Salvos com sucesso!'
                }
            )  
            
            const novoArray = [...obito_itens]
            novoArray.push(response.data)
            setarServico({obito_itens:novoArray})

        } catch (error) {
            toast.error('Erro ao salvar dados')
        }
    }

  return (
    <div className="flex flex-col w-full rounded-lg p-6   gap-5">
    <form onSubmit={handleSubmit} className="flex flex-row  gap-6 w-full">
        <div>
            <Label value="Descrição" />
            <Select sizing={'sm'} defaultValue={listaProduto.descricao_item ? listaProduto.descricao_item : ''} onChange={e => {
                const item = selectProdutos.find((item) => item.id_produto === Number(e.target.value))
                setarProdutos({ descricao_item: item?.descricao, valor_unit: item?.valor_venda, id_produto: item?.id_produto })

            }} >
                <option value={''}></option>
                {selectProdutos.map((item, index) => {
                    return (
                        <option key={item.id_produto} value={item.id_produto}>{item.descricao}</option>
                    )

                })}

            </Select>
        </div>
        <div>
            <Label value="Valor Unit." />
            <TextInput sizing={'sm'} disabled value={Number(listaProduto.valor_unit)} autoComplete='off' type="text"  />
        </div>
        <div>
            <Label value="Quantidade" />
            <TextInput sizing={'sm'} value={Number(listaProduto.quantidade)} onChange={(e) => {
                setarProdutos({ quantidade: Number(e.target.value) }),
                    setarProdutos({ valor_total: listaProduto.valor_unit && listaProduto.quantidade && listaProduto.valor_unit * listaProduto.quantidade })

            }} autoComplete='off' type="number" />
        </div>
        <div>
            <Label value="Desconto" />
            <TextInput sizing={'sm'} value={Number(listaProduto.desconto)} onChange={(e) => setarProdutos({ desconto: Number(e.target.value) })} autoComplete='off' type="text"  />
        </div>
        <div>
            <Label value="Acrescimo"/>
            <TextInput sizing={'sm'} value={Number(listaProduto.acrescimo)} onChange={(e) => setarProdutos({ acrescimo: Number(e.target.value) })} autoComplete='off' type="text"  />
        </div>
        <div>
            <Label value="Total" />
            <TextInput sizing={'sm'} disabled value={Number(listaProduto.valor_total)} autoComplete='off' type="number" />
        </div>
        <div className="flex items-end text-sm">
            <Button type="submit" size={'sm'}>Adicionar</Button>
        </div>

    </form>
    <div className="overflow-x-auto overflow-y-auto">
        <Table  hoverable theme={{ body: { cell: { base: "px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-gray-700" } } }}>
            <Table.Head >
               
                    <Table.HeadCell >
                        Descrição Item
                    </Table.HeadCell>

                    <Table.HeadCell >
                        Valor Unit.
                    </Table.HeadCell>
                    <Table.HeadCell >
                        Quant.
                    </Table.HeadCell>
                    <Table.HeadCell >
                        Desconto
                    </Table.HeadCell>
                    <Table.HeadCell >
                        Acrescimo
                    </Table.HeadCell>
                    <Table.HeadCell >
                        Valor Total
                    </Table.HeadCell>
                    <Table.HeadCell >
                        AÇÕES
                    </Table.HeadCell>
                
            </Table.Head>
            <Table.Body>
                {obito_itens?.map((item, index) => {


                    return (<Table.Row key={index} >
                        <Table.Cell >
                            {item.descricao_item}
                        </Table.Cell>
                        <Table.Cell >
                            R${item.valor_unit}
                        </Table.Cell>
                        <Table.Cell >
                            {item.quantidade}
                        </Table.Cell>
                        <Table.Cell >
                            {item.desconto && `R$${item.desconto}`}
                        </Table.Cell>
                        <Table.Cell>
                            {item.acrescimo && `R$${item.acrescimo}`}
                        </Table.Cell>
                        <Table.Cell >
                            R${item.valor_total}
                        </Table.Cell>
                        <Table.Cell >
                            <button onClick={() => deletarProduto(index)} className=" flex justify-center items-center rounded-lg  px-1 py-1  hover:bg-red-600"><MdClose /></button>
                        </Table.Cell>

                    </Table.Row>)
                })}

            </Table.Body>

            <tfoot >
                <tr className={`border-b  border-gray-700  hover:bg-gray-600`}>
                    <td className=" text-gray-600 font-semibold " colSpan={5}>Total Geral</td>
                    <td className=" text-green-500 text-start font-semibold" colSpan={2} >{Number(total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                </tr>
            </tfoot>

        </Table>

    </div>
    <div className="flex justify-end w-full">
        {total !== undefined && total > 0 && <button onClick={() => lancarCaixa()} className="flex bg-gray-600 rounded-lg p-2 ">Confirmar Pagamento</button>}
    </div>

</div>
  )
}
