import { DateRange } from "react-day-picker";


export type ConsultantStatus = "NÃO LOCALIZADO" | "NÃO QUER VISITA" | "NÃO ESTAVA EM CASA" | "LOCALIZADO"|"NAO DEFINIDO"

export const CONSULTANT_STATUS_OPTIONS: { value: ConsultantStatus|"NAO DEFINIDO"; label: string }[] = [
  { value: "LOCALIZADO", label: "Cliente Localizado" },
  { value: "NÃO LOCALIZADO", label: "Não Localizado" },
  { value: "NÃO QUER VISITA", label: "Não Quer Visita" },
  { value: "NÃO ESTAVA EM CASA", label: "Não Estava em Casa" },
]


export interface InadimplenciaProps{
    id_contrato:number,
    associado:{
      nome:string,
      endereco:string,
      bairro:string,
      telefone:string,
      celular1:string,
      celular2:string,
      numero:string,
      cidade:string,
      guia_rua:string
    },
    mensalidade:Array<{valor_principal:number,referencia:string}>
    overdueCount:number,//numero de mensalidades vencidas
    totalOverdueAmount:number // Valor total das mensalidades vencidas
    lastPaidPayment:Date,
    cobranca:Date,
  }
  
  
  
  export interface InadimplenciaBairroProps{
   bairro:string,
   totalContratos:number,
   valorTotal:number,
   cidade:string
  }
  
  
  export interface ResInadimplenciaApiProps{
      filtered:Array<InadimplenciaProps>, 
      active:number|null
      inadResumoBairro:InadimplenciaBairroProps
  }
  
  
  
  
    
  interface MensalidadeProps{
    id_mensalidade_global:number,
      id_mensalidade:number|null,
      valor_principal: number,
      referencia: string,
      status?: string,
      vencimento?:Date,
      pix_por?:string
      data_pgto:Date
    }
     interface InadimplenciaRotaProps {
      id_global: number,
      id_contrato: number,
      cobrador: string,
      status_visita?: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada',
      check_in?: {
        data: Date;
        coordenadas: {
          latitude: number;
          longitude: number;
        };
      };
      check_out?: {
        data: Date;
        coordenadas: {
          latitude: number;
          longitude: number;
        };
        observacoes?: string;
      };
      consultorRegistro?:{
        nome_consultor:string,
        status_consultor:ConsultantStatus,
        dt_consultor:Date,
      };
      associado: {
        nome: string,
        endereco: string,
        bairro: string,
        telefone: string,
        celular1: string,
        celular2: string,
        numero: string,
        cidade: string,
        guia_rua: string
      },
      mensalidade: Array<MensalidadeProps>,
      overdueCount: number,
      totalOverdueAmount: number,
      lastPaidPayment: Date,
      cobranca: Date,
    }
  
    
    export interface CobrancaStats {
      totalClientes: number;
      totalMensalidades: number;
      valorTotal: number;
      clientesVisitados: number;
      mensalidadesPagas: number;
      valorRecebido: number|undefined;
    }
    
    
    export interface AgendamentoCobranca {
      cliente_nome:string,
      data: string;
      mensalidades: {id_mensalidade_global:number,valor:number,referencia:string}[];
      contrato: number;
      id_global:number,
      status:string
    }
    
    
    
    export interface FiltrosCobranca {
      status: 'todos' | 'pendentes' | 'pagos';
      valorMin?: number;
      valorMax?: number;
      bairro?: string;
      urgencia?: 'todos' | 'urgente' | 'normal';
      periodo?: 'hoje' | 'semana' | 'mes' | 'todos';
    }
    
    
    
    export interface MensalidadePagaProps extends MensalidadeProps{
      cliente_nome:string,
      id_global:number,
      id_contrato:number,
      observacoes?:string,
      valor_forma:number,
      pix_por?:string,
      forma_pagto:string,
      valor_pix?:number,
      aut?:string
  }
    
    
    interface DataClientes {
      filtered: InadimplenciaRotaProps[];
    }
  
    export interface SolicitacaoCobradorProps {
      id_global: number;
      id_contrato: number;
      nome_cliente: string;
      descricao: string;
      categoria: string;
      status:string
    }
  
  
  export interface ClientUpdateProps {
      endereco: string;
      bairro: string;
      numero?: number;
      cidade: string;
      dataVencimento?: Date;
      id_global:number,
      id_contrato:number,
      nome:string,
      celular:string,
      dt_created:Date
    }
  
  
    export interface AcordoProps {
      id_acordo:number
      id_global:number
      id_contrato_global:number
      id_empresa:string
      id_contrato:number
      id_consultor:number
      id_associado:number
      data_inicio:Date
      data_fim:Date
      metodo:string
      status:string
      descricao:string
      total_acordo:number
      realizado_por:string
      usuario:string
      id_usuario:string
      dt_criacao:Date
      user_criacao:string
      dt_pgto:Date
      edit_por:string
      dt_edit:Date
      mensalidade: Array<MensalidadeProps>
    }
  
    export const categorias = ['CONVALESCENTE', 'CANCELAMENTO', 'EXCLUSÃO E ACRESCIMO DE DEPENDENTES']
    
  
  
  
  
  
  
  export interface RouteProps{
    id_cobranca :number
    consultor:string
    id_empresa:string,
    empresa:string
     cobranca :Array<InadimplenciaRotaProps> 
     parametros :{
      statusReagendamento:string
      cobrador:Array<string>,
      cidade:string,
        bairros:Array<string>,
        periodo:{
          start:Date|null,
          end:Date|null
        },
        criterio:{
          operator:string,
          value:number
        },
        consultor:string,
        listar_por_cobranca:boolean
     } 
     status:string
     dt_charge:Date
     dt_created :Date
     dt_updated :Date
     updated_by :string
     created_by :string
     pagamentos :Array<MensalidadePagaProps>
     agendamentos:AgendamentoCobranca[]
     solicitacoes :Array<SolicitacaoCobradorProps>
     atualizacaoCadastral:Array<ClientUpdateProps>,
     observacao :string,
     dt_sinc:Date
   
    }
    
  
export interface RotaFilterProps {
    consultor: string;
    status: string;
    bairro: string;
    dateRange: DateRange | undefined;
  }