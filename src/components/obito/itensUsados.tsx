import { api } from "@/lib/axios/apiClient";
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
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

export function ItensUsados({selectProdutos,obito_itens,setarServico,id_obito,atualizarProdutos}:DadosProps) {
        const [itens,setItens] = useState<ItensProps>({produto:'',quantidade:1,id_estoque:0,valor_custo:0,valor_total:0,total_estoque:0})
        

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



   async function deletarProduto({id_ob_itens,index}:{id_ob_itens:number,index:number}) {

const id_estoque =Number(obito_itens[index].id_estoque)
const quantidade =Number(obito_itens[index].quantidade)
   



       try {
        await toast.promise(
            api.delete(`/obitoItens/deletar/${String(id_ob_itens)}`),
            {
                error:'Erro ao deletar dado',
                success:'Dado deletado',
                pending:'Deletando dado....'
                
            }
        )
     
      
       await atualizarEstoque({acao:false,id_estoque,quantidade})
       const novoArray = [...obito_itens]
      novoArray.splice(index,1)
       setarServico({obito_itens:novoArray})
        
       } catch (error) {
        toast.error('ERRO DESCONHECIDO')
       }
      

      

       
      
    }
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
            atualizarEstoque({acao:true,id_estoque:itens.id_estoque,quantidade:itens.quantidade})
        } catch (error) {
            toast.error('Erro ao salvar dados')
        }
        
    }
    

    async function atualizarEstoque({acao,id_estoque,quantidade}:{acao:boolean,id_estoque:number,quantidade:number}) {


        try {
            const response = await toast.promise(
                api.put('/estoque/reduzirProd',{
                    id_estoque:id_estoque,
                    quantidade:quantidade,
                    acao:acao
                }),
                {error:'Erro ao atualizar estoque',
                    pending:'Atualizando estoque....',
                    success:'Estoque atualizado'
                }
            )
            setItens({
                id_estoque:0,
                produto:'',
                quantidade:1,
                total_estoque:0,
                valor_custo:0,
                valor_total:0
            })
          await atualizarProdutos()
        
            
        } catch (error) {
            console.log(error)
        }

     
     
      
        
    }


    return (
        <div className="flex flex-col w-full rounded-lg p-6   gap-5">
            <form onSubmit={handleSubmit} className="flex flex-row  gap-6 w-full">

                <div>
                    <Label value="Descrição"/>
                    <Select sizing={'sm'} value={itens.id_estoque} onChange={e => {
                            const item = selectProdutos?.find(it=>it.estoque.some(atual=>atual.id_estoque===Number(e.target.value)))
                            const index = item?.estoque.findIndex(it=>it.id_estoque===Number(e.target.value))
                            
                           index!==-1 && setItens({...itens,id_estoque:Number(e.target.value),produto:item?.descricao??'',valor_custo:Number(item?.valor_custo),total_estoque:Number(item?.estoque[index??0]?.total)})
                        
                        }} >
                        <option value={''}></option>
                        {selectProdutos?.map(item=>{
                          return (
                            item.grupo==='fn' &&  item.estoque.map(atual=>(
                                <option key={atual.id_estoque} value={atual.id_estoque}>{atual.produto} - {atual.total} - {atual.fornecedor}</option>
                            )) 
                            )
                        })}
                    </Select>
                </div>

                <div>
            <Label value="Valor Unit."/>
            <TextInput sizing={'sm'} disabled value={Number(itens.valor_custo)} autoComplete='off' type="number" />
        </div>

                <div>
            <Label value="Quantidade" />
            <TextInput sizing={'sm'} value={Number(itens.quantidade)} onChange={(e) => {
                setarItens({...itens, quantidade: Number(e.target.value) })
                   

            }} autoComplete='off' type="number"  />
        </div>

        <div>
            <Label value="Total" />
            <TextInput sizing={'sm'} disabled value={Number(itens.valor_total)} autoComplete='off' type="text"  />
        </div>


        <div className="flex items-end text-sm">
            <Button color={'blue'} size={'sm'} type="submit">Adicionar</Button>
        </div>

            </form>

            <div className="overflow-x-auto">
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


                    return (item.id_estoque && <Table.Row key={item.id_ob_itens} >
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
                        <Table.Cell >
                            {item.acrescimo && `R$${item.acrescimo}`}
                        </Table.Cell>
                        <Table.Cell >
                            R${item.valor_total}
                        </Table.Cell>
                        <Table.Cell >
                            <button onClick={() =>{
                                deletarProduto({id_ob_itens:Number(item.id_ob_itens),index:Number(index)})}} className=" flex justify-center items-center rounded-lg  px-1 py-1  hover:bg-red-600"><MdClose /></button>
                        </Table.Cell>

                    </Table.Row>)
                })}

            </Table.Body>

            <tfoot >
                <tr className={`border-b  border-gray-700  hover:bg-gray-600`}>
                    <td className="px-4 py-1 text-start font-semibold" colSpan={5}>Total Geral</td>
                    <td className="px-4 py-1 text-green-500 text-start font-semibold" colSpan={2} >{Number(obito_itens.reduce((acumulador,atual)=>{
                        if(atual.id_estoque){
                            acumulador+=Number(atual.valor_total)
                        }
                        return acumulador
                    },0)).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                </tr>
            </tfoot>

        </Table>

    </div>

        </div>
    )
}
