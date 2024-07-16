import { api } from "@/services/apiClient";
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
    <form onSubmit={handleSubmit} className="flex flex-row text-white gap-6 w-full">
        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Descrição</label>
            <select defaultValue={listaProduto.descricao_item ? listaProduto.descricao_item : ''} onChange={e => {
                const item = selectProdutos.find((item) => item.id_produto === Number(e.target.value))
                setarProdutos({ descricao_item: item?.descricao, valor_unit: item?.valor_venda, id_produto: item?.id_produto })

            }} className="block w-full pb-1 pt-1 pr-2 pl-2 appearance-none text-xs  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                <option value={''}></option>
                {selectProdutos.map((item, index) => {
                    return (
                        <option key={item.id_produto} value={item.id_produto}>{item.descricao}</option>
                    )

                })}

            </select>
        </div>
        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Valor Unit.</label>
            <input disabled value={Number(listaProduto.valor_unit)} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>
        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Quantidade</label>
            <input value={Number(listaProduto.quantidade)} onChange={(e) => {
                setarProdutos({ quantidade: Number(e.target.value) }),
                    setarProdutos({ valor_total: listaProduto.valor_unit && listaProduto.quantidade && listaProduto.valor_unit * listaProduto.quantidade })

            }} autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>
        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Desconto</label>
            <input value={Number(listaProduto.desconto)} onChange={(e) => setarProdutos({ desconto: Number(e.target.value) })} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>
        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Acrescimo</label>
            <input value={Number(listaProduto.acrescimo)} onChange={(e) => setarProdutos({ acrescimo: Number(e.target.value) })} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>
        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Total</label>
            <input disabled value={Number(listaProduto.valor_total)} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>
        <div className="flex items-end text-sm">
            <button type="submit"
            
                className="flex bg-blue-600 p-1 pl-2 pr-2 rounded-lg ">Adicionar</button>
        </div>

    </form>
    <div className="flex">
        <table
            className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" className=" px-2 py-1">
                        Descrição Item
                    </th>

                    <th scope="col" className="px-4 py-1">
                        Valor Unit.
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Quant.
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Desconto
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Acrescimo
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Valor Total
                    </th>
                    <th scope="col" className="px-4 py-1">
                        <span >AÇÕES</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {obito_itens?.map((item, index) => {


                    return (<tr key={index} className={`border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                        <td className="px-2 py-1">
                            {item.descricao_item}
                        </td>
                        <td className="px-4 py-1">
                            R${item.valor_unit}
                        </td>
                        <td className="px-4 py-1">
                            {item.quantidade}
                        </td>
                        <td className="px-4 py-1">
                            {item.desconto && `R$${item.desconto}`}
                        </td>
                        <td className="px-4 py-1">
                            {item.acrescimo && `R$${item.acrescimo}`}
                        </td>
                        <td className="px-4 py-1">
                            R${item.valor_total}
                        </td>
                        <td className="px-4 py-1 flex justify-center text-center ">
                            <button onClick={() => deletarProduto(index)} className=" flex justify-center items-center rounded-lg  px-1 py-1 text-white hover:bg-red-600"><MdClose /></button>
                        </td>

                    </tr>)
                })}

            </tbody>

            <tfoot >
                <tr className={`border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                    <td className="px-4 py-1 text-start font-semibold" colSpan={5}>Total Geral</td>
                    <td className="px-4 py-1 text-green-500 text-start font-semibold" colSpan={2} >R${total}</td>
                </tr>
            </tfoot>

        </table>

    </div>
    <div className="flex justify-end w-full">
        {total !== undefined && total > 0 && <button onClick={() => lancarCaixa()} className="flex bg-gray-600 rounded-lg p-2 text-white">Confirmar Pagamento</button>}
    </div>

</div>
  )
}
