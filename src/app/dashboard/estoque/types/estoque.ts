export type EstoqueNovoRegistroProps = {
  id_estoque: number,
  codProd: string,
  data: Date,
  estado: string,
  produto: string,
}

export type EstoqueProps = {
  id_produto: number,
  descricao: string,
  quantidade: number,
  empresa: string
  produtos: { grupo: string, descricao: string, cod_prod: true, tipo: string },

}