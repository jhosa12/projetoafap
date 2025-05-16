import { useEffect, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { GoGoal } from "react-icons/go";
import { GiStairsGoal } from "react-icons/gi";
import { FaFilter } from "react-icons/fa6";
import "react-datepicker/dist/react-datepicker.css";
import { ModalVendedor } from "@/components/vendas/modalVendedor";
import { ConsultorList } from "@/components/vendas/ConsultorList";
import { IoPrint } from "react-icons/io5";
import { FaPercentage } from "react-icons/fa";
import { ModalFiltroMetas } from "./modalFiltro";
import { ajustarData } from "@/utils/ajusteData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";
import { ChartConfig } from "../ui/chart";
import { arrayColors } from "@/utils/arrayColors";
import { BarChartInfo } from "../layouts/charts/bar";

export interface VendasProps {
  id_consultor: number | null;
  consultor: string;
  _sum: { valor_mensalidade: number };
  _count: { dt_adesao: number };
  situacao: string;
}

export interface MetasProps {
  id_meta: number;
  id_empresa: string;
  id_grupo: number;
  id_conta: string;
  valor: number;
  descricao: string;
  date: Date;
  dateFimMeta: Date;
  descricao_grupo: string;
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

interface ResponseProps {
  grupos: VendasProps[];
  metas: MetasProps[];
  setores: SetorProps[];
  consultores: ConsultoresProps[];
  leads: Array<ConsultorLeads>;
  metaAtual: number;
  startFilter: Date;
  endFilter: Date;
}

export interface ChatProps {
  x: string;
  y: number;
  fill?: string;
}

export function Acompanhamento({
  empresa,
  setores,
  usuario,
  logoUrl,
}: {
  empresa: string;
  setores: SetorProps[];
  usuario: string;
  logoUrl: string;
}) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [filtro, setFiltro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVend, setModalVend] = useState<boolean>(false);
  const [vendedor, setVendedor] = useState<VendasProps>({
    _count: { dt_adesao: 0 },
    _sum: { valor_mensalidade: 0 },
    consultor: "",
    situacao: "",
    id_consultor: null,
  });
  const [reqData, setData] = useState<ResponseProps>({} as ResponseProps);
  const [chartData, setChartData] = useState<Array<ChatProps>>([]);
  const [perido, setPeriodo] = useState<{
    start: string | undefined;
    end: string | undefined;
  }>({ start: "", end: "" });

  function generateChartConfig(data: ChatProps[]): ChartConfig {
    return data?.reduce((config, item, index) => {
      config[item.x] = {
        label: item.x,
      };

      return config;
    }, {} as ChartConfig);
  }
  useEffect(() => {
    ChartReqData();
  }, [reqData.grupos]);

  const ChartReqData = () => {
    const chartTrat = reqData?.grupos?.map((item, index) => {
      return {
        x: item.consultor,
        y: Number(item._sum.valor_mensalidade),
        fill: arrayColors[index],
      };
    });

    setChartData(chartTrat ?? []);
  };

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

  // Função para adicionar uma nova meta

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-white to-gray-50 overflow-y-auto">
      
        <ModalVendedor
          logoUrl={logoUrl}
          usuario={usuario}
          leads={reqData?.leads}
          show={modalVend}
          setModalVend={setModalVend}
          vendedor={vendedor}
          startDate={reqData.startFilter}
          endDate={reqData.endFilter}
        />
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <InfoBlock
          icon={<GoGoal size={20} />}
          title="META"
          value={
            reqData.metaAtual
              ? (
                  reqData?.metaAtual * reqData?.consultores?.length
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : "0,00"
          }
        />
        <InfoBlock
          icon={<FaPercentage size={20} />}
          title="PERCENTUAL"
          value={
            getPercentual(
              reqData?.grupos,
              reqData?.metaAtual,
              reqData?.consultores
            ).value
          }
          statusColor={
            getPercentual(
              reqData?.grupos,
              reqData?.metaAtual,
              reqData?.consultores
            ).color
          }
          progress={parseFloat(
            getPercentual(
              reqData?.grupos,
              reqData?.metaAtual,
              reqData?.consultores
            ).value.replace("%", "")
          )}
        />
        <InfoBlock
          icon={<GiStairsGoal size={20} />}
          title="PRODUZIDO"
          value={`${getProduzido(reqData?.grupos)} (${reqData?.grupos?.reduce(
            (acc, curr) => acc + Number(curr._count.dt_adesao),
            0
          )})`}
        />
      </div>

      <div className="flex ml-auto mr-6 pb-4 gap-3 text-black">
        <Button
          variant="outline"
          onClick={() => setFiltro(true)}
          aria-label="Aplicar filtros"
          aria-busy={loading}
          className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          size="sm"
        >
          <FaFilter className="text-primary" />
          <span>FILTRAR</span>
        </Button>
        <Button
          variant={"outline"}
          className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          size="sm"
        >
          <IoPrint className="text-gray-600" />
          <span>IMPRIMIR</span>
        </Button>
      </div>

      {reqData.grupos?.length > 0 && (
        <div className="flex flex-col md:flex-row px-6 gap-6 pb-10">
          <Card className="md:w-1/2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-lg font-semibold border-b pb-4">
              <h3 className="text-gray-800">Consultores</h3>
            </CardHeader>
            <CardContent className="pt-4">
              <ConsultorList
                dados={reqData?.grupos}
                setModalVend={setModalVend}
                setVendedor={setVendedor}
                meta={reqData?.metaAtual ?? 0}
              />
            </CardContent>
          </Card>
          {chartData?.length > 0 && (
            <BarChartInfo
              chartConfig={generateChartConfig(chartData)}
              chartData={chartData}
              periodo={perido}
            />
          )}
        </div>
      )}

      
        <ModalFiltroMetas
          filtrar={dadosVendas}
          loading={loading}
          arraySetores={setores}
          show={filtro}
          setFiltro={setFiltro}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
    
    </div>
  );
}

const InfoBlock = ({
  icon,
  title,
  value,
  statusColor,
  progress,
  loading,
}: {
  icon: JSX.Element;
  title: string;
  value: string;
  statusColor?: string;
  progress?: number;
  loading?: boolean;
}) => (
  <div className="flex flex-col p-2 px-4 shadow-lg rounded-xl bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="p-2 bg-gray-50 rounded-lg text-gray-600">
          {!loading && icon}
          {loading && (
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          )}
        </span>
        <div className="text-sm font-semibold text-gray-700">{title}</div>
      </div>
      {!loading && progress !== undefined && (
        <div className={`text-sm font-medium ${statusColor}`}>
          {progress > 0 ? "↑" : "↓"} {Math.abs(Number(progress))}%
        </div>
      )}
    </div>

    {!loading && progress !== undefined && (
      <div className="mb-4">
        <div className="w-full bg-gray-200/80 rounded-full h-3 shadow-inner overflow-hidden">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(Number(progress), 100)}%`,
              backgroundColor: statusColor,
              borderRadius: "inherit",
            }}
          />
        </div>
      </div>
    )}

    {progress === undefined && (
      <div className={`text-base font-bold ${statusColor}`}>
        {!loading ? (
          value
        ) : (
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
        )}
      </div>
    )}
  </div>
);

// Funções utilitárias para cálculos
const getPercentual = (
  dados: VendasProps[],
  meta?: number,
  consultores?: ConsultoresProps[]
) => {
  const totalMeta = meta && consultores ? meta * consultores.length : 0;
  const totalProduzido =
    dados?.reduce(
      (acc, curr) => acc + Number(curr._sum.valor_mensalidade),
      0
    ) || 0;
  const percentual = totalMeta ? (totalProduzido / totalMeta) * 100 : 0;

  const getStatus = () => {
    if (percentual >= 100) return { color: "#16a34a", icon: "🎯" }; // Verde-600
    if (percentual >= 75) return { color: "#22c55e", icon: "↑" }; // Verde-500
    if (percentual >= 50) return { color: "#f59e0b", icon: "→" }; // Amarelo-500
    return { color: "#ef4444", icon: "↓" }; // Vermelho-500
  };

  return {
    value: `${percentual.toFixed(1)}%`,
    progress: percentual,
    ...getStatus(),
  };
};

const getProduzido = (dados: VendasProps[]) => {
  const total = dados?.reduce(
    (acc, curr) => acc + Number(curr._sum.valor_mensalidade),
    0
  );
  return total?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};
