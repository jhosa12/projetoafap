import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/services/apiClient';
import { GoGoal } from "react-icons/go";
import { GiStairsGoal, GiRotaryPhone } from "react-icons/gi";
import { FaHandshake, FaPercentage } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';
import { Button, Modal } from 'flowbite-react';
import { HiFilter } from "react-icons/hi";
import { ModalVendedor } from '@/components/vendas/modalVendedor';
import { ModalFiltro } from '@/components/vendas/modalFiltro';
import { ModalMetas } from '@/components/vendas/modalMetas';
import { ConsultorList } from '@/components/vendas/ConsultorList';

// Definindo tipos para os dados que serão utilizados
export interface VendasProps {
    consultor: string;
    _sum: { valor_mensalidade: number };
    _count: { dt_adesao: number };
    situacao: string;
}

export interface MetasProps {
    id_meta: number;
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

interface ResponseProps {
    grupos: VendasProps[];
    metas: MetasProps[];
    setores: SetorProps[];
    consultores: ConsultoresProps[];
}

export default function Vendas() {
    const { usuario } = useContext(AuthContext);
    const [dados, setDados] = useState<VendasProps[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [somaVendas, setSomaVendas] = useState<number>(0);
    const [aba, setAba] = useState<number>(1);
    const [arrayMetas, setMetas] = useState<MetasProps[]>([]);
    const [arraySetores, setSetores] = useState<SetorProps[]>([]);
    const [modalMetas, setModalMetas] = useState<boolean>(false);
    const [dadosMetas, setDadosMetas] = useState<Partial<MetasProps>>({});
    const [consultores, setConsultores] = useState<ConsultoresProps[]>([]);
    const [filtro, setFiltro] = useState<boolean>(false);
    const [meta, setMeta] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVend, setModalVend] = useState<boolean>(false);
    const [vendedor, setVendedor] = useState<VendasProps>({ _count: { dt_adesao: 0 }, _sum: { valor_mensalidade: 0 }, consultor: '', situacao: '' });

    // Função para atualizar os dados de metas
    const setarDadosMetas = (fields: Partial<MetasProps>) => {
        setDadosMetas(prev => ({ ...prev, ...fields }));
    };

    // Função para buscar dados de vendas
    const dadosVendas =async() => {
        try {
            setLoading(true);
            console.log(startDate)
            console.log(endDate)
            const response = await api.post<ResponseProps>('/vendas/filtro', {
                dataInicio: startDate,
                dataFim: endDate,
            });
         
            const { grupos, metas, setores, consultores } = response.data;
            console.log(response.data)
            // Remove duplicatas de consultores
            const consultoresArray = consultores.reduce<ConsultoresProps[]>((acumulador, item) => {
                if (!acumulador.some(it => it.nome === item.nome)) {
                    acumulador.push(item);
                }
                return acumulador;
            }, []);

            // Calcula a meta atual
         
            const metaAtual = metas.reduce((acumulador, item) => {
             //   const dateInicio = new Date(item.date);
             //   const dateFim = new Date(item.dateFimMeta);
               // if (dateInicio >= startDate && dateFim <= endDate) {
                     acumulador += Number(item.valor);
               // }
                return acumulador;
            }, 0);

            setMeta(metaAtual);
            setConsultores(consultoresArray);
            setDados(grupos);
            setMetas(metas);
            setSetores(setores);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dadosVendas();
    }, []);

    // Função para adicionar uma nova meta
    const novaMeta = async () => {
        try {
         const response =   await toast.promise(
                api.post('/vendas/novaMeta', {
                    id_grupo: dadosMetas.id_grupo,
                    date: dadosMetas.date,
                    dateFimMeta: dadosMetas.dateFimMeta,
                    valor: dadosMetas.valor,
                    descricao: `META SETOR ${dadosMetas.descricao_grupo}`,
                }),
                {
                    error: 'Erro ao salvar dados',
                    pending: 'Salvando Dados....',
                    success: 'Dados Salvos com Sucesso',
                }
            );
            setMetas([...arrayMetas,response.data])
        } catch (error) {
            toast.error('Erro ao salvar nova meta');
        }
    };

    return (
        <>
            <div className="flex flex-col w-full text-white p-2 max-h-[92vh]">
                <div className='inline-flex w-full mb-1 pl-2 justify-between'>
                    <h1 className="font-semibold text-lg">ACOMPANHAMENTO DE VENDAS</h1>
                    <div className='inline-flex gap-2'>
                        <Button className='cursor-pointer' as={'span'} size='sm' onClick={() => setFiltro(true)} color='cyan'>
                            <HiFilter className="mr-2 h-5 w-5" /> Filtro
                        </Button>
                        <Button className='cursor-pointer' as={'span'} size='sm' onClick={() => setModalMetas(true)} color='gray'>
                            Nova Meta
                        </Button>
                    </div>
                </div>

                <div className="inline-flex w-full justify-between bg-gray-100 h-16 px-6 rounded-lg text-black">
                    <InfoBlock icon={<GoGoal color='gray' size={30} />} title="META" value={meta ? (meta * consultores.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '0,00'} />
                    <InfoBlock icon={<FaPercentage size={30} color='gray' />} title="PERCENTUAL" value={getPercentual(dados, meta, consultores)} />
                    <InfoBlock icon={<GiStairsGoal color='gray' size={30} />} title="PRODUZIDO" value={getProduzido(dados)} />
                    <InfoBlock icon={<FaHandshake color='gray' size={30} />} title="PROSPECÇÕES" value="0" />
                    <InfoBlock icon={<GiRotaryPhone color='gray' size={30} />} title="LEADS" value="0" />
                </div>

                <div className="flex w-full mt-1 gap-2">
                    <ConsultorList dados={dados} setModalVend={setModalVend} setVendedor={setVendedor} meta={meta ?? 0} />
                </div>
            </div>

            <ModalMetas show={modalMetas} setModalMetas={setModalMetas} arraySetores={arraySetores} setarDadosMetas={setarDadosMetas} novaMeta={novaMeta} dadosMetas={dadosMetas} arrayMetas={arrayMetas} />
            <ModalFiltro dadosMetas={dadosMetas} show={filtro} setFiltro={setFiltro} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} dadosVendas={dadosVendas} loading={loading} arraySetores={arraySetores} setarDadosMetas={setarDadosMetas} />
            <ModalVendedor show={modalVend} setModalVend={setModalVend} vendedor={vendedor} startDate={startDate} endDate={endDate} />
        </>
    );
}

// Componente para exibir blocos de informações
const InfoBlock = ({ icon, title, value }:{ icon: JSX.Element, title: string, value: string }) => (
    <div className='inline-flex items-center gap-1 text-black'>
        {icon}
        <div className='flex flex-col'>
            <span className='leading-none text-xs'>{title}</span>
            <span className='leading-none'>{value}</span>
        </div>
    </div>
);

// Funções utilitárias para cálculos
const getPercentual = (dados: VendasProps[], meta?: number, consultores?: ConsultoresProps[]) => {
    const totalMeta = meta && consultores ? meta * consultores.length : 0;
    const totalProduzido = dados.reduce((acc, curr) => acc + curr._sum.valor_mensalidade, 0);
    const percentual = totalMeta ? (totalProduzido / totalMeta) * 100 : 0;
    return `${percentual.toFixed(2)}%`;
};

const getProduzido = (dados: VendasProps[]) => {
    const total = dados.reduce((acc, curr) => acc + Number(curr._sum.valor_mensalidade), 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
