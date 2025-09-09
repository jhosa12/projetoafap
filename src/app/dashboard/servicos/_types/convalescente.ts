export interface ConvProps {
  editar: boolean
  id_conv: number | null,
  id_contrato: number | null,
  id_associado: number | null,
  id_dependente: number | null,
  id_contrato_st: string,
  tipo_entrada: string,
  nome: string,
  cpf_cnpj: string,
  data?: Date | null,
  status: string,
  forma_pag: string,
  logradouro: string,
  numero: number | null,
  complemento: string,
  bairro: string,
  cep: string,
  cidade: string,
  uf: string,
  subtotal: number | null,
  descontos: number | null,
  total: number | null,
  logradouro_r: string,
  numero_r: number | null,
  complemento_r: string,
  bairro_r: string,
  cep_r: string,
  cidade_r: string,
  uf_r: string,
  data_inc: Date,
  hora_inc: Date,
  usuario: string,
  obs: string,
  convalescenca_prod: Array<Partial<{
    id_conv_prod: number,
    id_conv: number,
    id_produto: number,
    descricao: string,
    unidade: string,
    grupo: string,
    data: Date,
    data_dev: Date,
    quantidade: number,
    valor: number,
    descontos: number,
    total: number,
    hora: Date,
    cortesia: string,
    retornavel: string,
    status: string
  }>>,
  contrato: {
    situacao: string,
    carencia: string,
    associado: {
      nome: string
    }

  }

}