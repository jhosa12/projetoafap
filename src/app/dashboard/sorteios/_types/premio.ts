export interface PremioProps {

  id_premio: number,
  status: string,
  ordem: number,
  id_conveniados: number,
  conveniado: string,
  id_empresa: string,
  descricao: string,
  data: Date,
  conveniados: { filename: string }

}