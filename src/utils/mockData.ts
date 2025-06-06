


// Mock data para demonstração

export interface DashboardStats {
  totalConsultas: number;
  totalExames: number;
  receitaMensal: number;
  consultasHoje: number;
  examesHoje: number;
  consultasPorStatus: Record<string, number>;
  examesPorStatus: Record<string, number>;
  tendenciaMensal: Array<{ mes: string; consultas: number; exames: number; receita: number }>;
}



export const mockDashboardStats: DashboardStats = {
  totalConsultas: 1247,
  totalExames: 892,
  receitaMensal: 156780.50,
  consultasHoje: 12,
  examesHoje: 8,
  consultasPorStatus: {
    'AGENDADO': 45,
    'CONFIRMADO': 38,
    'AGUARDANDO DATA': 23,
    'CANCELADO': 12,
    'RECEBIDO': 128
  },
  examesPorStatus: {
    'ORÇAMENTO': 34,
    'RECEBIDO': 67
  },
  tendenciaMensal: [
    { mes: 'Jan', consultas: 98, exames: 67, receita: 12450.00 },
    { mes: 'Fev', consultas: 112, exames: 78, receita: 14230.00 },
    { mes: 'Mar', consultas: 95, exames: 85, receita: 13780.00 },
    { mes: 'Abr', consultas: 134, exames: 92, receita: 16890.00 },
    { mes: 'Mai', consultas: 125, exames: 89, receita: 15640.00 },
    { mes: 'Jun', consultas: 143, exames: 98, receita: 18230.00 }
  ]
};
