export interface PlanoContasProps {

  conta: string;
  id_grupo?: number;
  descricao: string;
  tipo: string;
  saldo?: number;
  perm_lanc: string;
  data: Date;
  hora?: Date;
  usuario?: string;
  contaf?: string;
  custo?: string;
  check?: boolean;

}