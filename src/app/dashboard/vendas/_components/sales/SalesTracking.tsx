import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Printer, Goal, BadgePercent, TrendingUp } from 'lucide-react';
import { CompactMetricCard } from './CompactMetricCard';
import { SalesDataTable } from './SalesDataTable';
import { SalesChart } from './SalesChart';
import { FilterModal } from './FilterModal';
import { ajustarData } from '@/utils/ajusteData';
import { api } from '@/lib/axios/apiClient';
import { ModalVendedor } from '../modalVendedor';
import { getDiasUteisMes } from '@/utils/getDiasUteisMes';


// Interfaces mantidas do código original
export interface VendasProps {
  id_consultor: number | null;
  consultor: string;
  _sum: { valor_mensalidade: number };
  _count: { dt_adesao: number };
  situacao: string;
}



export interface SetorProps {
  id_grupo: number;
  descricao: string;
}

export interface ConsultoresProps {
  funcao: string;
  nome: string;
  id_consultor: number;
}

export interface ConsultorLeads {
  id_consultor: number;
  status: string;
  _count: {
    id_lead: number;
  };
}

export interface ChatProps {
  x: string;
  y: number;
  fill?: string;
}

interface ResponseProps {
  grupos: VendasProps[];
  //metas: MetasProps[];
  setores: SetorProps[];
  consultores: ConsultoresProps[];
  leads: Array<ConsultorLeads>;
  metaAtual: number;
  startFilter: Date;
  endFilter: Date;
}

interface SalesTrackingProps {
  empresa: string;
  logoUrl: string;
}
export interface ReqLeadsProps {
  id?: string;
  statusSelected?: string;
  status?: Array<string>;
  nome?: string;
  startDate?: string;
  endDate?: string;
  consultores?: Array<string> | [];
}
// Dados fictícios para demonstração


export const SalesTracking: React.FC<SalesTrackingProps> = ({
  empresa,
}) => {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [filtro, setFiltro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVend, setModalVend] = useState<boolean>(false);
  const [vendedor, setVendedor] = useState<VendasProps | null>(null);
  const [reqData, setData] = useState<ResponseProps>({} as ResponseProps);
  const [chartData, setChartData] = useState<Array<ChatProps>>([]);
  const [periodo, setPeriodo] = useState<{
    start: string | undefined;
    end: string | undefined;
  }>({ 
    start: new Date().toISOString(), 
    end: new Date().toISOString() 
  });

  const diasUteis = getDiasUteisMes(startDate, endDate)

  useEffect(() => {
    const chartTrat = reqData?.grupos?.map((item, index) => ({
      x: item.consultor,
      y: Number(item._sum.valor_mensalidade),
      fill: `hsl(${index * 60}, 70%, 50%)`
    }));
    setChartData(chartTrat ?? []);
  }, [reqData?.grupos]);

const dadosVendas = async () => {
    const { dataIni, dataFim } = ajustarData(startDate, endDate);
    try {
      setLoading(true);

      const response = await api.post<ResponseProps>("/vendas/filtro", {
        dataInicio: dataIni,
        dataFim: dataFim,
        id_empresa: empresa,
      });

      setData(response.data);
      setPeriodo({ start: dataIni, end: dataFim });

      setFiltro(false);
      //  console.log(response.data)
    } catch (error) {
      //console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dadosVendas();
  }, [empresa]);

  const getPercentual = () => {
    const totalMeta = (reqData?.metaAtual??0) * (reqData?.consultores?.length??0);
    const totalProduzido = (reqData?.grupos?.reduce(
      (acc, curr) => acc + Number(curr._sum.valor_mensalidade),
      0
    )??0);
    const percentual = totalMeta ? (totalProduzido / totalMeta) * 100 : 0;
    return {
      value: `${percentual.toFixed(1)}%`,
      percentage: percentual,
      isPositive: percentual >= 75
    };
  };

  const getTotalProduzido = () => {
    const total = (reqData?.grupos?.reduce(
      (acc, curr) => acc + Number(curr._sum.valor_mensalidade),
      0
    )??0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getTotalVendas = () => {
    return (reqData?.grupos?.reduce(
      (acc, curr) => acc + Number(curr._count.dt_adesao),
      0
    )??0);
  };

  const percentualData = getPercentual();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
            <p className="text-sm text-gray-600">Performance da equipe</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltro(true)}
              disabled={loading}
              className="flex items-center gap-1.5"
            >
              <Filter className="w-3 h-3" />
              Filtros
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Printer className="w-3 h-3" />
              Imprimir
            </Button>
          </div>
        </div>

        {/* Compact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CompactMetricCard
            title="Meta Total"
            value={(reqData?.metaAtual??0 * (reqData?.consultores?.length??0)).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
            icon={<Goal className="w-4 h-4" />}
          />

<CompactMetricCard
            title="Meta Diária"
            value={(Number(reqData?.metaAtual??0) / diasUteis).toLocaleString('pt-BR',{
              style:'currency',
              currency:'BRL'
            })}
            icon={<TrendingUp className="w-4 h-4" />}
          
          />
          
          <CompactMetricCard
            title="% Atingido"
            value={percentualData.value}
            icon={<BadgePercent className="w-4 h-4" />}
            progress={percentualData.percentage}
            trend={{
              value: Math.abs(percentualData.percentage - 75),
              isPositive: percentualData.isPositive
            }}
          />
          
          <CompactMetricCard
            title="Produzido"
            value={`${getTotalProduzido()}`}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{
              value: 12.5,
              isPositive: true
            }}
          />
        </div>

        {/* Compact Content Grid */}
        {reqData && reqData?.grupos?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesDataTable
              dados={reqData?.grupos??[]}
              meta={reqData?.metaAtual??0}
              onConsultorClick={(vendedor) => {
                setVendedor(vendedor);
                setModalVend(true);
              }}
            />
            
            {chartData?.length > 0 && (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Gráfico de Vendas</CardTitle>
                  {periodo.start && periodo.end && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(periodo.start).toLocaleDateString('pt-BR')} - {new Date(periodo.end).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-3">
                  <SalesChart
                    data={chartData}
                    periodo={periodo}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Carregando...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && reqData && reqData?.grupos?.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Sem dados</h3>
            <p className="text-sm text-gray-600">Ajuste os filtros para ver resultados.</p>
          </Card>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        show={filtro}
        setFiltro={setFiltro}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        filtrar={dadosVendas}
        loading={loading}
      />

    {modalVend && <ModalVendedor
      show={modalVend}
      setModalVend={setModalVend}
      vendedor={vendedor??{} as VendasProps}
      startDate={startDate}
      endDate={endDate}
      leads={reqData?.leads??[]}
      usuario={''}
      logoUrl={'logoUrl'}
      id_empresa={empresa}
      />}
    </div>
  );
};
