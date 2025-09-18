export type ProdutosProps = {

    id_produto: number,
    id_conv: number,
    id_estoque: number,
    descricao: string,
    unidade: string,
    valor_custo: number,
    valor_venda: number
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