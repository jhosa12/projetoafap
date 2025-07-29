
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
  [bairro:string]:{
    totalContratos:number,
    valorTotal:number,
  }
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
    id_global:number
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
      id_contrato:number
      observacoes?:string,
      valor_forma:number
  }
  
  
  interface DataClientes {
    filtered: InadimplenciaRotaProps[];
  }

  export interface Solicitacao {
    id_global: number;
    id_contrato: number;
    nome_cliente: string;
    descricao: string;
    categoria: string;
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
  id_empresa:string
   cobranca :Array<InadimplenciaRotaProps> 
   parametros :{
      bairros:Array<string>,
      periodo:{
        start:Date|null,
        end:Date|null
      },
      criterio:{
        operator:string,
        value:number
      },
      consultor:string
   } 
   status:string
   dt_created :Date
   dt_updated :Date
   updated_by :string
   created_by :string
   pagamentos :Array<MensalidadePagaProps>
   agendamentos:AgendamentoCobranca[]
   solicitacoes :Array<Solicitacao>
   atualizacaoCadastral:Array<ClientUpdateProps>,
   observacao :string
  }
  

