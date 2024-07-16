import { FormEvent,useState } from "react"

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

interface DadosProps{
    selectProdutos:Array<ListaProdutos>,
    //setSelectListaProdutos:Array<ListaProdutos>
}

interface ItensProps{
    id_estoque:number
    produto:string,
    quantidade:number
}


export function ItensUsados({selectProdutos}:DadosProps) {
        const [itens,setItens] = useState<ItensProps>({produto:'',quantidade:0,id_estoque:0})



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

    }

    async function editarEstoque() {
        
    }


    return (
        <div className="flex flex-col w-full rounded-lg p-6   gap-5">
            <form onSubmit={handleSubmit} className="flex flex-row text-white gap-6 w-full">

                <div>
                    <label className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">Descrição</label>
                    <select defaultValue={''} onChange={e => {e.target.tabIndex }} className="block w-full pb-1 pt-1 pr-2 pl-2 appearance-none text-xs  border  rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
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
            <label className="block mb-1 text-xs font-medium  text-white">Quantidade</label>
            <input value={Number(itens.quantidade)} onChange={(e) => {
                setarItens({...itens, quantidade: Number(e.target.value) })
                   

            }} autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
        </div>

            </form>

        </div>
    )
}
