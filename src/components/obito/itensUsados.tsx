import { api } from "@/services/apiClient";
import { FormEvent,useEffect,useState } from "react"
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

interface EstoqueProps{
    id_produto:number,
    id_estoque:number,
    data:Date,
    estado:string,
    produto:string,
    total:number
    fornecedor:string
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
    taxa_conval: number,
    estoque:Array<EstoqueProps>
}

interface ProdutosProps{
    id_ob_itens:number|null
    id_produto: number | null,
    id_estoque:number|null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface DadosProps{
    id_obito:number,
    selectProdutos:Array<ListaProdutos>,
   atualizarProdutos:()=>Promise<void>,
    obito_itens:Array<Partial<ProdutosProps>>
    setarServico:(fields:Partial<{obito_itens:Array<Partial<ProdutosProps>>}>)=>void
    deletarProduto:(index:number)=>void
    //setSelectListaProdutos:Array<ListaProdutos>
}

interface ItensProps{
    id_estoque:number
    produto:string,
    quantidade:number,
    valor_custo:number,
    valor_total:number,
    total_estoque:number,
}


export function ItensUsados({selectProdutos,obito_itens,setarServico,deletarProduto,id_obito,atualizarProdutos}:DadosProps) {
        const [itens,setItens] = useState<ItensProps>({produto:'',quantidade:1,id_estoque:0,valor_custo:0,valor_total:0,total_estoque:0})
        const [total,setTotal] = useState<number>(0)



        const setarItens = (fields:ItensProps)=>{
            setItens((prev:ItensProps)=>{
                if(prev){
                    return {...prev,...fields}
                }else{
                    return {...fields}
                }

            })
        }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        adionarObitoItens()
        

    }

    useEffect(()=>{

        setItens({...itens,valor_total:itens.quantidade*itens.valor_custo})


    },[itens.quantidade,itens.produto])


    async function adionarObitoItens() {
        if(!id_obito){
            toast.info('Salve os dados do Obito para acrescentar produtos!');
            return;
        }
        if(itens.total_estoque<itens.quantidade){
            toast.warn('Estoque insuficiente')
            return;
        }
        try {
            const response = await toast.promise(
                api.post('/obitos/adicionarProduto',{
                    id_obito,
                    descricao_item:itens.produto,
                    valor_unit:itens.valor_custo,
                    valor_total:itens.valor_total,
                    quantidade:itens.quantidade,
                    desconto:undefined,
                    acrescimo:undefined,
                    id_estoque:itens.id_estoque
                    
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
            atualizrEstoque()
        } catch (error) {
            toast.error('Erro ao salvar dados')
        }
        
    }

    async function atualizrEstoque() {


        try {
            const response = await toast.promise(
                api.put('/estoque/reduzirProd',{
                    id_estoque:itens.id_estoque,
                    quantidade:itens.quantidade
                }),
                {error:'Erro ao atualizar estoque',
                    pending:'Atualizando estoque....',
                    success:'Estoque atualizado'
                }
            )
            console.log(response.data)
           atualizarProdutos()
            
        } catch (error) {
            toast.info('Erro ao Atualizar estoque')
        }

        setItens({id_estoque:0,produto:'',quantidade:1,total_estoque:0,valor_custo:0,
            valor_total:0
        })
        
    }


    return (
        <div className="flex flex-col w-full rounded-lg p-6   gap-5">
            <form onSubmit={handleSubmit} className="flex flex-row text-white gap-6 w-full">

                <div>
                    <label className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">Descrição</label>
                    <select defaultValue={''} onChange={e => {
                            const item = selectProdutos?.find(it=>it.estoque.some(atual=>atual.id_estoque===Number(e.target.value)))
                            const index = item?.estoque.findIndex(it=>it.id_estoque===Number(e.target.value))
                            
                           index!==-1 && setItens({...itens,id_estoque:Number(e.target.value),produto:item?.descricao??'',valor_custo:Number(item?.valor_custo),total_estoque:Number(item?.estoque[index??0]?.total)})
                        
                        }} className="block w-full pb-1 pt-1 pr-2 pl-2 appearance-none text-xs  border  rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                        <option value={''}></option>
                        {selectProdutos?.map(item=>{
                          return (
                            item.grupo==='fn' &&  item.estoque.map(atual=>(
                                <option key={atual.id_estoque} value={atual.id_estoque}>{atual.produto} - {atual.total} - {atual.fornecedor}</option>
                            )) 
                            )
                        })}
                    </select>
                </div>

                <div>
            <label className="block mb-1 text-xs font-medium  text-white">Valor Unit.</label>
            <input disabled value={Number(itens.valor_custo)} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>

                <div>
            <label className="block mb-1 text-xs font-medium  text-white">Quantidade</label>
            <input value={Number(itens.quantidade)} onChange={(e) => {
                setarItens({...itens, quantidade: Number(e.target.value) })
                   

            }} autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>

        <div>
            <label className="block mb-1 text-xs font-medium  text-white">Total</label>
            <input disabled value={Number(itens.valor_total)} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
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


                    return (item.id_estoque && <tr key={item.id_ob_itens} className={`border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
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
                    <td className="px-4 py-1 text-green-500 text-start font-semibold" colSpan={2} >R${obito_itens.reduce((acumulador,atual)=>{
                        if(atual.id_estoque){
                            acumulador+=Number(atual.valor_total)
                        }
                        return acumulador
                    },0)}</td>
                </tr>
            </tfoot>

        </table>

    </div>

        </div>
    )
}
