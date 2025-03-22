
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios/apiClient';
import { GoGoal } from "react-icons/go";
import { GiStairsGoal } from "react-icons/gi";
import { FaFilter } from "react-icons/fa6";
import "react-datepicker/dist/react-datepicker.css";
import { ModalVendedor } from '@/components/vendas/modalVendedor';
import { ConsultorList } from '@/components/vendas/ConsultorList';
import { IoPrint } from 'react-icons/io5';
import { FaPercentage } from 'react-icons/fa';
import { ModalFiltroMetas } from './modalFiltro';
import { ajustarData } from '@/utils/ajusteData';


import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Button } from '../ui/button';
import { ChartConfig } from '../ui/chart';
import { arrayColors } from '@/utils/arrayColors';
import { BarChartInfo } from '../layouts/charts/bar';

export interface VendasProps {
    id_consultor: number | null;
    consultor: string;
    _sum: { valor_mensalidade: number };
    _count: { dt_adesao: number };
    situacao: string;
}

export interface MetasProps {
    id_meta: number;
    id_empresa: string
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
    status: string,
    _count: {
        id_lead: number
    }
}

interface ResponseProps {
    grupos: VendasProps[];
    metas: MetasProps[];
    setores: SetorProps[];
    consultores: ConsultoresProps[];
    leads: Array<ConsultorLeads>;
    metaAtual: number,
    startFilter: Date,
    endFilter: Date
}


export interface ChatProps {
    x: string,
    y: number,
    fill?: string

}



export function Acompanhamento({ empresa, setores, usuario }: { empresa: string, setores: SetorProps[], usuario: string }) {

    const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [filtro, setFiltro] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVend, setModalVend] = useState<boolean>(false);
    const [vendedor, setVendedor] = useState<VendasProps>({ _count: { dt_adesao: 0 }, _sum: { valor_mensalidade: 0 }, consultor: '', situacao: '', id_consultor: null });
    const [reqData, setData] = useState<ResponseProps>({} as ResponseProps)
    const [chartData, setChartData] = useState<Array<ChatProps>>([])
    const [perido, setPeriodo] = useState<{ start: string | undefined, end: string | undefined }>({ start: '', end: '' })

    function generateChartConfig(data: ChatProps[]): ChartConfig {

        return data.reduce((config, item, index) => {

            config[item.x] = {
                label: item.x,

            };

            return config;
        }, {} as ChartConfig);
    }
    useEffect(() => {
        ChartReqData()
    }, [reqData.grupos])

    const ChartReqData = () => {



        const chartTrat = reqData?.grupos?.map((item, index) => {
            return { x: item.consultor, y: Number(item._sum.valor_mensalidade), fill: arrayColors[index] }
        })

        setChartData(chartTrat ?? [])
    }


    const dadosVendas = async () => {

        const { dataIni, dataFim } = ajustarData(startDate, endDate)
        try {
            setLoading(true);

            const response = await api.post<ResponseProps>('/vendas/filtro', {
                dataInicio: dataIni,
                dataFim: dataFim,
                id_empresa: empresa
            });



            setData(response.data)
            setPeriodo({ start: dataIni, end: dataFim })

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
    }, []);

    // Função para adicionar uma nova meta


    return (

        <div className="flex flex-col w-full h-full bg-white overflow-y-auto">

            {modalVend && <ModalVendedor usuario={usuario} leads={reqData?.leads} show={modalVend} setModalVend={setModalVend} vendedor={vendedor} startDate={reqData.startFilter} endDate={reqData.endFilter} />}

         

                <div className="inline-flex w-full justify-between  py-2 px-6 rounded-lg text-black">
                    <InfoBlock icon={<GoGoal size={20} />} title="META" value={reqData.metaAtual ? (reqData?.metaAtual * reqData?.consultores?.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '0,00'} />
                    <InfoBlock icon={<FaPercentage size={20} />} title="PERCENTUAL" value={getPercentual(reqData?.grupos, reqData?.metaAtual, reqData?.consultores)} />
                    <InfoBlock icon={<GiStairsGoal size={20} />} title="PRODUZIDO" value={`${getProduzido(reqData?.grupos)} (${reqData?.grupos?.reduce((acc, curr) => acc + Number(curr._count.dt_adesao), 0)})`} />
                </div>


                <div className="flex ml-auto mr-4 pb-1 gap-2 text-black">
                    <Button variant={'outline'} onClick={() => setFiltro(true)} type="button" color='light' size='sm'><FaFilter />FILTRAR</Button>
                    <Button variant={'outline'} size='sm'>  <IoPrint /> IMPRIMIR</Button>


                </div>

                {reqData.grupos?.length > 0 &&
                    <div className=' flex flex-col md:flex-row px-2 gap-6 pb-10'>
                        <Card className='md:w-1/2' >
                            <CardHeader className='text-sm font-semibold'/>
                            <CardContent>
                                <ConsultorList dados={reqData?.grupos} setModalVend={setModalVend} setVendedor={setVendedor} meta={reqData?.metaAtual ?? 0} />
                            </CardContent>
                        </Card>
                            {chartData?.length > 0 && <BarChartInfo chartConfig={generateChartConfig(chartData)} chartData={chartData} periodo={perido} />}
                    </div>}

                {filtro && <ModalFiltroMetas filtrar={dadosVendas} loading={loading} arraySetores={setores} show={filtro} setFiltro={setFiltro} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />}
         
                </div>

    );
}


const InfoBlock = ({ icon, title, value }: { icon: JSX.Element, title: string, value: string }) => (
    <div className="flex flex-col p-2 px-4 shadow-md rounded-md">

        <div className='text-[13px] font-semibold'>{title}</div>
        <div className='text-xs '>{value}</div>

    </div>
);

// Funções utilitárias para cálculos
const getPercentual = (dados: VendasProps[], meta?: number, consultores?: ConsultoresProps[]) => {
    const totalMeta = meta && consultores ? meta * consultores?.length : 0;
    const totalProduzido = dados?.reduce((acc, curr) => acc + Number(curr._sum.valor_mensalidade), 0);
    const percentual = totalMeta ? (totalProduzido / totalMeta) * 100 : 0;
    return `${percentual.toFixed(2)}%`;
};

const getProduzido = (dados: VendasProps[]) => {
    const total = dados?.reduce((acc, curr) => acc + Number(curr._sum.valor_mensalidade), 0);
    return total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
