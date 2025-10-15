export interface DadosSorteiosProps {

  id_sorteio: number
  id_empresa: string,
  id_contrato_global: number,
  id_contrato: number,
  associado: {
    nome: string,
    endereco: string,
    bairro: string,
    numero: number | null,
    cidade: string
  },

}