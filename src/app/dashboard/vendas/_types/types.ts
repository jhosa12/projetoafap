import { DependentesProps } from "@/app/dashboard/admcontrato/_types/dependentes";


            
export type StatusLead = 'VENDA' | 'INDEFERIDO' | 'PRE VENDA' | 'LEAD' | 'PROSPECCAO'
    



export interface LeadProps {
  id_empresa:string,
  index: number;
  id_lead: number;
  visita: Date;
  consultor: string;
  id_usuario: string;
  id_plano: number;
  plano: string;
  origem: string;
  uf: string;
  valor_mensalidade: number;
  nome: string;
  endereco: string;
  n_parcelas: number;
  possuiPet: string;
  planoPet: string;
  status: StatusLead;
  bairro: string;
  numero: number;
  data_nasc: Date;
  cep: string;
  rg: string;
  cpfcnpj: string;
  guia_rua: string;
  cidade: string;
  celular1: string;
  vencimento: Date | undefined;
  celular2: string;
  empresaAtual: string;
  servicosUsados: string;
  motivo: string;
  planodesaude: string;
  indicacao: string;
  usuario: string;
  data: Date;
  dependentes: Array<Partial<DependentesProps>>;
  form_pag?: string;
  adesao?: Date;
  dataVenda: Date;
  acrescimo:number|null;
  cobrador: string;
  motivo_indeferido : string 
}